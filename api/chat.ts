import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sections } from '../src/content/sections'

const DEFAULT_SYSTEM_PROMPT =
  'You are an assistant for the AI Hackathon Guide. Help users find tools, compare options (e.g. Cursor vs Replit), and get quick tips for building AI apps during hackathons. Be concise and actionable.'

function buildGuideToolsOverview(): string {
  const toolsBySection = sections
    .filter((section) => section.tools.length > 0)
    .map((section) => {
      const toolNames = section.tools.map((tool) => tool.name).join(', ')
      return `- ${section.title}: ${toolNames}`
    })

  if (toolsBySection.length === 0) {
    return '- No tools listed in the guide yet.'
  }

  return toolsBySection.join('\n')
}

const GUIDE_TOOLS_OVERVIEW = buildGuideToolsOverview()

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_TIMEOUT_MS = 25_000
const MAX_OPENAI_ATTEMPTS = 3
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504])

type ChatCompletionResponse = {
  choices?: { message?: { content?: string } }[]
  error?: { message?: string }
  [key: string]: unknown
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name?: string }).name === 'AbortError'
  )
}

async function requestOpenAI(opts: {
  apiKey: string
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
}): Promise<Response> {
  let lastError: unknown
  for (let attempt = 1; attempt <= MAX_OPENAI_ATTEMPTS; attempt += 1) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS)
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${opts.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: opts.messages,
        }),
        signal: controller.signal,
      })

      if (
        RETRYABLE_STATUS_CODES.has(response.status) &&
        attempt < MAX_OPENAI_ATTEMPTS
      ) {
        await sleep(400 * 2 ** (attempt - 1))
        continue
      }
      return response
    } catch (error) {
      lastError = error
      if (attempt < MAX_OPENAI_ATTEMPTS) {
        await sleep(400 * 2 ** (attempt - 1))
        continue
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }
  throw lastError ?? new Error('OpenAI request failed')
}

async function parseJsonResponse(
  response: Response
): Promise<ChatCompletionResponse | null> {
  const raw = await response.text()
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw) as ChatCompletionResponse
  } catch {
    return null
  }
}

function buildSystemPrompt(opts: {
  mode?: string
  context?: { toolId: string; toolName: string; toolDescription: string }
}): string {
  if (opts.mode === 'suggest-stack') {
    return [
      'You are a hackathon stack advisor focused on vibe-coding quality.',
      'Pick the best-fit stack for the user idea first; do not force only-guide recommendations.',
      'Then prioritize tools from this AI Hackathon Guide whenever they are a strong fit.',
      'If a guide tool is not the best fit for a category, recommend a popular vibe-coder alternative.',
      'Optimize for beginner-friendly quality: polished demo outcomes with low complexity.',
      'Prefer tools with great defaults, easy onboarding, and low chance of users getting stuck.',
      '',
      'Guide tools:',
      GUIDE_TOOLS_OVERVIEW,
      '',
      'Popular vibe-coder tools outside the guide you may consider when they are a better fit: Firebase, Neon, Upstash, Resend, Cloudflare Workers/Pages, Render, Bolt.new, v0.',
      '',
      'Response rules:',
      '1) Recommend 3-5 tools for the user idea (covering dev, backend/data, auth, deployment when relevant).',
      '2) For each tool, include: why it is a good fit for a non-expert + setup effort (example: "setup: 5-15 min") + label as [Guide] or [Popular].',
      '3) Mention one simple caveat in plain language when relevant.',
      '4) Keep it concise, actionable, and in bullet points.',
      '5) If the idea is vague, ask one clarifying question and also provide a sensible default stack.',
    ].join('\n')
  }
  if (opts.context) {
    return `The user is asking about ${opts.context.toolName}. Use this description: ${opts.context.toolDescription}. Answer their question concisely.`
  }
  return DEFAULT_SYSTEM_PROMPT
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured' })
    return
  }

  const body = req.body as {
    messages?: { role: string; content: string }[]
    mode?: string
    context?: { toolId: string; toolName: string; toolDescription: string }
  }

  if (!body?.messages || !Array.isArray(body.messages)) {
    res.status(400).json({ error: 'messages array is required' })
    return
  }

  const systemPrompt = buildSystemPrompt({
    mode: body.mode,
    context: body.context,
  })

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...body.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ]

  try {
    const openaiRes = await requestOpenAI({ apiKey, messages })
    const data = await parseJsonResponse(openaiRes)

    if (!openaiRes.ok) {
      res.status(openaiRes.status).json({
        error: data?.error?.message || 'OpenAI API error',
      })
      return
    }
    if (!data) {
      res.status(502).json({ error: 'Received invalid response from OpenAI' })
      return
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(503).json({
      error: isAbortError(error)
        ? 'Request to OpenAI timed out. Please try again.'
        : 'Unable to reach OpenAI. Please try again.',
    })
  }
}
