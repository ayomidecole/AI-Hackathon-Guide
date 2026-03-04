const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const SUMMARY_MODEL = 'gpt-4o-mini';
const MAX_PAGE_CHARS = 14_000;
const FETCH_TIMEOUT_MS = 10_000;
const ALLOWED_PROTOCOLS = ['https:', 'http:'];
const SUMMARY_MAX_TOKENS = 50;

const SUMMARY_SYSTEM_PROMPT = `Summarize the web page in 1–2 short sentences only (under 35 words). State the main idea. No bullets, no intro, no filler. Must fit in a small preview box without scrolling.`;

export function validateSummaryUrl(
  url: string,
): { ok: true } | { ok: false; status: number; error: string } {
  if (!url || !url.startsWith('http')) {
    return { ok: false, status: 400, error: 'Missing or invalid url' };
  }
  try {
    const parsed = new URL(url);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return { ok: false, status: 400, error: 'Only http(s) URLs allowed' };
    }
    return { ok: true };
  } catch {
    return { ok: false, status: 400, error: 'Invalid url' };
  }
}

function stripScripts(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/\s on\w+=["'][^"']*["']/gi, '');
}

function extractTextFromHtml(html: string): string {
  const withSpaces = stripScripts(html).replace(/<[^>]+>/g, ' ');
  const collapsed = withSpaces.replace(/\s+/g, ' ').trim();
  return collapsed.length > MAX_PAGE_CHARS ? collapsed.slice(0, MAX_PAGE_CHARS) + '…' : collapsed;
}

export async function getPageText(url: string): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      return { ok: false, error: 'Upstream returned ' + response.status };
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return { ok: false, error: 'URL did not return HTML' };
    }
    const html = await response.text();
    const text = extractTextFromHtml(html);
    if (!text || text.length < 50) {
      return { ok: false, error: 'Page had too little text to summarize' };
    }
    return { ok: true, text };
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === 'AbortError') {
      return { ok: false, error: 'Request timed out' };
    }
    return { ok: false, error: 'Failed to fetch URL' };
  }
}

export async function* streamSummary(
  apiKey: string,
  url: string,
): AsyncGenerator<string, void, undefined> {
  const page = await getPageText(url);
  if (!page.ok) {
    yield `[Unable to summarize: ${page.error}]`;
    return;
  }

  const response = await fetch(OPENAI_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: SUMMARY_MODEL,
      messages: [
        { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
        { role: 'user', content: page.text },
      ],
      stream: true,
      max_completion_tokens: SUMMARY_MAX_TOKENS,
    }),
  });

  if (!response.ok) {
    const err = (await response.json()) as { error?: { message?: string } };
    yield `[Summary failed: ${err.error?.message ?? response.status}]`;
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    yield '[Summary failed: no response body]';
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let yielded = false;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const event = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
          const content = event.choices?.[0]?.delta?.content;
          if (typeof content === 'string' && content) {
            yielded = true;
            yield content;
          }
        } catch {
          // incomplete or invalid JSON chunk
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
  if (!yielded) {
    yield '[No summary generated]';
  }
}
