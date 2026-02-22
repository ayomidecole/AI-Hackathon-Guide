import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleChatRequest, type ChatRequestBody } from '../shared/chatPolicy'

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
    console.error('[api/chat] OPENAI_API_KEY is not set in this environment')
  }
  const result = await handleChatRequest(apiKey, req.body as ChatRequestBody)

  res.status(result.status).json(result.json)
}
