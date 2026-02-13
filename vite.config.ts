import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const DEFAULT_SYSTEM_PROMPT =
  'You are an assistant for the AI Hackathon Guide. Help users find tools, compare options (e.g. Cursor vs Replit), and get quick tips for building AI apps during hackathons. Be concise and actionable.'

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

async function handleChatApi(body: {
  messages: { role: string; content: string }[]
  mode?: string
  context?: { toolId: string; toolName: string; toolDescription: string }
}) {
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
    ...body.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
    }),
  })

  const data = (await res.json()) as { error?: { message?: string } }
  if (!res.ok) {
    return { status: res.status, json: { error: data.error?.message || 'OpenAI API error' } }
  }
  return { status: 200, json: data }
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
            const body = JSON.parse(bodyRaw)
            const { status, json } = await handleChatApi(body)
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = status
            res.end(JSON.stringify(json))
          } catch {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Internal server error' }))
          }
        })
      },
    },
  ],
  }
  })
