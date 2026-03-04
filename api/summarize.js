// shared/summarizePolicy.ts
var OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
var SUMMARY_MODEL = "gpt-4o-mini";
var MAX_PAGE_CHARS = 14e3;
var FETCH_TIMEOUT_MS = 1e4;
var ALLOWED_PROTOCOLS = ["https:", "http:"];
var SUMMARY_SYSTEM_PROMPT = `You are a concise summarizer for developers. Summarize the following web page content in 2-4 short paragraphs. Focus on the main idea, key points, and why it matters to a developer. Use clear, scannable prose. Do not use bullet points unless the content is a list.`;
function validateSummaryUrl(url) {
  if (!url || !url.startsWith("http")) {
    return { ok: false, status: 400, error: "Missing or invalid url" };
  }
  try {
    const parsed = new URL(url);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return { ok: false, status: 400, error: "Only http(s) URLs allowed" };
    }
    return { ok: true };
  } catch {
    return { ok: false, status: 400, error: "Invalid url" };
  }
}
function stripScripts(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/\s on\w+=["'][^"']*["']/gi, "");
}
function extractTextFromHtml(html) {
  const withSpaces = stripScripts(html).replace(/<[^>]+>/g, " ");
  const collapsed = withSpaces.replace(/\s+/g, " ").trim();
  return collapsed.length > MAX_PAGE_CHARS ? collapsed.slice(0, MAX_PAGE_CHARS) + "\u2026" : collapsed;
}
async function getPageText(url) {
  const validation = validateSummaryUrl(url);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      redirect: "follow"
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      return { ok: false, error: "Upstream returned " + response.status };
    }
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return { ok: false, error: "URL did not return HTML" };
    }
    const html = await response.text();
    const text = extractTextFromHtml(html);
    if (!text || text.length < 50) {
      return { ok: false, error: "Page had too little text to summarize" };
    }
    return { ok: true, text };
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === "AbortError") {
      return { ok: false, error: "Request timed out" };
    }
    return { ok: false, error: "Failed to fetch URL" };
  }
}
async function* streamSummary(apiKey, url) {
  const page = await getPageText(url);
  if (!page.ok) {
    yield `[Unable to summarize: ${page.error}]`;
    return;
  }
  const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: SUMMARY_MODEL,
      messages: [
        { role: "system", content: SUMMARY_SYSTEM_PROMPT },
        { role: "user", content: page.text }
      ],
      stream: true
    })
  });
  if (!response.ok) {
    const err = await response.json();
    yield `[Summary failed: ${err.error?.message ?? response.status}]`;
    return;
  }
  const reader = response.body?.getReader();
  if (!reader) {
    yield "[Summary failed: no response body]";
    return;
  }
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (typeof content === "string" && content) yield content;
          } catch {
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// server/summarize.ts
var config = { runtime: "nodejs" };
async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).setHeader("Allow", "GET").end();
    return;
  }
  const raw = req.query.url;
  const url = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : void 0;
  const validation = url ? validateSummaryUrl(url) : { ok: false, status: 400, error: "Missing or invalid url" };
  if (!validation.ok) {
    res.status(validation.status).json({ error: validation.error });
    return;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "OpenAI API key not configured" });
    return;
  }
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200);
  try {
    for await (const chunk of streamSummary(apiKey, url)) {
      res.write(chunk);
    }
  } catch (err) {
    console.error("[summarize]", err);
    res.write("[Summary failed]");
  } finally {
    res.end();
  }
}
export {
  config,
  handler as default
};
