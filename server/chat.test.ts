import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../shared/chatPolicy', () => ({
  handleChatRequest: vi.fn(),
}))

const { handleChatRequest } = await import('../shared/chatPolicy')
const handler = (await import('./chat')).default

function mockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }
}

describe('server chat handler', () => {
  beforeEach(() => {
    vi.mocked(handleChatRequest).mockReset()
  })

  it('returns 405 for GET', async () => {
    const res = mockRes()
    await handler(
      { method: 'GET' } as import('@vercel/node').VercelRequest,
      res as unknown as import('@vercel/node').VercelResponse
    )
    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' })
    expect(handleChatRequest).not.toHaveBeenCalled()
  })

  it('calls handleChatRequest and returns result for POST', async () => {
    const res = mockRes()
    const body = { messages: [{ role: 'user', content: 'Hi' }] }
    vi.mocked(handleChatRequest).mockResolvedValue({
      status: 200,
      json: { choices: [{ message: { content: 'Hello' } }] },
    })
    await handler(
      { method: 'POST', body } as import('@vercel/node').VercelRequest,
      res as unknown as import('@vercel/node').VercelResponse
    )
    expect(handleChatRequest).toHaveBeenCalledWith(
      process.env.OPENAI_API_KEY,
      body
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      choices: [{ message: { content: 'Hello' } }],
    })
  })
})
