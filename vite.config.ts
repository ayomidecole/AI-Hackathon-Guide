import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleChatRequest, type ChatRequestBody } from './shared/chatPolicy'

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
                req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
                req.on('error', reject)
              })

              const body = JSON.parse(bodyRaw) as ChatRequestBody
              const result = await handleChatRequest(process.env.OPENAI_API_KEY, body)

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = result.status
              res.end(JSON.stringify(result.json))
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
