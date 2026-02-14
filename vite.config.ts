import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const DEFAULT_SYSTEM_PROMPT =
  'You are an assistant for the AI Hackathon Guide. Help users find tools, compare options (e.g. Cursor vs Replit), and get quick tips for building AI apps during hackathons. Be concise and actionable.'
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_TIMEOUT_MS = 25_000
const MAX_OPENAI_ATTEMPTS = 3
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504])

type ChatBody = {
  messages: { role: string; content: string }[]
  mode?: string
  context?: { toolId: string; toolName: string; toolDescription: string }
}

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

function isChatBody(body: unknown): body is ChatBody {
  if (typeof body !== 'object' || body === null || !('messages' in body)) {
    return false
  }
  const candidate = body as { messages?: unknown }
  return (
    Array.isArray(candidate.messages) &&
    candidate.messages.every((message) => {
      if (typeof message !== 'object' || message === null) {
        return false
      }
      const candidateMessage = message as { role?: unknown; content?: unknown }
      return (
        typeof candidateMessage.role === 'string' &&
        typeof candidateMessage.content === 'string'
      )
    })
  )
}

function buildSystemPrompt(opts: {
  mode?: string
  context?: { toolId: string; toolName: string; toolDescription: string }
}): string {
  if (opts.mode === 'suggest-stack') {
    return `You are a hackathon stack advisor. Given the user's idea, suggest 2-3 tools from this guide (dev tools, databases, auth, deployment) and briefly explain why. Be concise.`
  }
  if (opts.context) {
    return `The user is asking about ${opts.context.toolName}. Use this description: ${opts.context.toolDescription}. Answer their question concisely.`
  }
  return DEFAULT_SYSTEM_PROMPT
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

async function handleChatApi(
  body: unknown
): Promise<{ status: number; json: Record<string, unknown> }> {
  if (!isChatBody(body)) {
    return { status: 400, json: { error: 'messages array is required' } }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { status: 500, json: { error: 'OPENAI_API_KEY is not configured' } }
  }

  const systemPrompt = buildSystemPrompt({
    mode: body.mode,
    context: body.context,
  })

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...body.messages.map((message) => ({
      role: message.role as 'user' | 'assistant',
      content: message.content,
    })),
  ]

  try {
    const openaiRes = await requestOpenAI({ apiKey, messages })
    const data = await parseJsonResponse(openaiRes)
    if (!openaiRes.ok) {
      return {
        status: openaiRes.status,
        json: { error: data?.error?.message || 'OpenAI API error' },
      }
    }
    if (!data) {
      return { status: 502, json: { error: 'Received invalid response from OpenAI' } }
    }
    return { status: 200, json: data }
  } catch (error) {
    return {
      status: 503,
      json: {
        error: isAbortError(error)
          ? 'Request to OpenAI timed out. Please try again.'
          : 'Unable to reach OpenAI. Please try again.',
      },
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Explicitly load .env so OPENAI_API_KEY is available to the chat middleware
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      react(),
      {
        name: 'chat-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.method !== 'POST' || !req.url?.startsWith('/api/chat')) {
              return next()
            }

            const sendJson = (status: number, json: Record<string, unknown>) => {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = status
              res.end(JSON.stringify(json))
            }

            try {
              const bodyRaw = await new Promise<string>((resolve, reject) => {
                const chunks: Buffer[] = []
                req.on('data', (chunk: Buffer | string) =>
                  chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
                )
                req.on('end', () =>
                  resolve(Buffer.concat(chunks).toString('utf-8'))
                )
                req.on('error', reject)
              })

              let body: unknown
              try {
                body = bodyRaw ? (JSON.parse(bodyRaw) as unknown) : {}
              } catch {
                sendJson(400, { error: 'Invalid JSON body' })
                return
              }

              const { status, json } = await handleChatApi(body)
              sendJson(status, json)
            } catch {
              sendJson(500, { error: 'Internal server error' })
            }
          })
        },
      },
    ],
  }
})
