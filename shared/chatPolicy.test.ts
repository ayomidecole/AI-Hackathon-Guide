import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  rankGuideToolsByQuery,
  buildSystemPrompt,
  getModelForMode,
  handleChatRequest,
  type ChatRequestBody,
  type ChatMessage,
} from './chatPolicy'

describe('rankGuideToolsByQuery', () => {
  it('returns fallback order when query is empty', () => {
    const result = rankGuideToolsByQuery('', 5)
    expect(result.length).toBeLessThanOrEqual(5)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((t) => t.name && t.category)).toBe(true)
  })

  it('boosts tools whose normalized name matches the query', () => {
    const result = rankGuideToolsByQuery('cursor', 20)
    expect(result.length).toBeGreaterThan(0)
    const cursorIndex = result.findIndex((t) => t.normalizedName.includes('cursor'))
    expect(cursorIndex).toBe(0)
  })

  it('respects limit', () => {
    const result = rankGuideToolsByQuery('tool', 3)
    expect(result.length).toBeLessThanOrEqual(3)
  })

  it('returns tools with token matches in searchText', () => {
    const result = rankGuideToolsByQuery('database', 10)
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('buildSystemPrompt', () => {
  it('returns default prompt when no context', () => {
    const prompt = buildSystemPrompt({})
    expect(prompt).toContain('AI Hackathon Guide')
    expect(prompt).toContain('concise and actionable')
  })

  it('returns tool-specific prompt when context provided', () => {
    const prompt = buildSystemPrompt({
      context: {
        toolId: 'cursor',
        toolName: 'Cursor',
        toolDescription: 'AI-first code editor',
      },
    })
    expect(prompt).toContain('Cursor')
    expect(prompt).toContain('AI-first code editor')
  })
})

describe('getModelForMode', () => {
  it('returns gpt-5.2', () => {
    expect(getModelForMode()).toBe('gpt-5.2')
  })
})

describe('handleChatRequest', () => {
  const validMessages = [{ role: 'user', content: 'Hello' }]

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [{ message: { content: 'Hi' } }],
            }),
        } as Response)
      )
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns 500 when OPENAI_API_KEY is missing', async () => {
    const result = await handleChatRequest(undefined, { messages: validMessages })
    expect(result.status).toBe(500)
    expect(result.json).toHaveProperty('error', 'OPENAI_API_KEY is not configured')
  })

  it('returns 400 when messages is missing', async () => {
    const result = await handleChatRequest('key', {} as ChatRequestBody)
    expect(result.status).toBe(400)
    expect(result.json).toHaveProperty('error', 'messages array is required')
  })

  it('returns 400 when messages is not an array', async () => {
    const result = await handleChatRequest('key', { messages: 'x' as unknown as ChatMessage[] })
    expect(result.status).toBe(400)
    expect(result.json).toHaveProperty('error', 'messages array is required')
  })

  it('returns 400 when messages are empty after sanitization', async () => {
    const result = await handleChatRequest('key', {
      messages: [{ role: 'user', content: '   ' }],
    })
    expect(result.status).toBe(400)
    expect(result.json).toHaveProperty('error', 'messages array must contain user/assistant messages')
  })

  it('returns 400 when messages only have invalid roles', async () => {
    const result = await handleChatRequest('key', {
      messages: [{ role: 'system', content: 'hello' }],
    })
    expect(result.status).toBe(400)
  })

  it('default mode: returns 200 and response shape when fetch succeeds', async () => {
    const result = await handleChatRequest('sk-test', { messages: validMessages })
    expect(result.status).toBe(200)
    expect(result.json).toHaveProperty('choices')
    expect((result.json.choices as { message?: { content?: string } }[])?.[0]?.message?.content).toBe('Hi')
  })

  it('suggest-stack mode: returns 200 with clarifying question when kind is clarification', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      kind: 'clarification',
                      clarifying_question: 'Do you need user accounts?',
                      stack: null,
                    }),
                  },
                },
              ],
            }),
        } as Response)
      )
    )
    const result = await handleChatRequest('sk-test', {
      messages: validMessages,
      mode: 'suggest-stack',
    })
    expect(result.status).toBe(200)
    const content = (result.json.choices as { message?: { content?: string } }[])?.[0]?.message?.content
    expect(content).toBe('Do you need user accounts?')
  })

  it('suggest-stack mode: returns 200 with formatted markdown when kind is stack', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      kind: 'stack',
                      clarifying_question: null,
                      stack: {
                        summary: 'A minimal stack for a todo app.',
                        dev_tool: 'Cursor',
                        core_tools: [{ name: 'Supabase', category: 'database', reason: 'Easy backend.' }],
                        optional_later: [],
                        setup_note: 'Open Cursor and ask for a plan.',
                      },
                    }),
                  },
                },
              ],
            }),
        } as Response)
      )
    )
    const result = await handleChatRequest('sk-test', {
      messages: validMessages,
      mode: 'suggest-stack',
    })
    expect(result.status).toBe(200)
    const content = (result.json.choices as { message?: { content?: string } }[])?.[0]?.message?.content
    expect(content).toContain('Cursor')
    expect(content).toContain('Supabase')
    expect(content).toContain('To get started')
  })

  it('suggest-stack mode: stack with optional_later includes "Later if needed" in markdown', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      kind: 'stack',
                      clarifying_question: null,
                      stack: {
                        summary: 'Todo app stack.',
                        dev_tool: 'Cursor',
                        core_tools: [{ name: 'Supabase', category: 'database', reason: 'Backend.' }],
                        optional_later: [{ name: 'Vercel', category: 'deployment', reason: 'Hosting later.' }],
                        setup_note: 'Start with Cursor.',
                      },
                    }),
                  },
                },
              ],
            }),
        } as Response)
      )
    )
    const result = await handleChatRequest('sk-test', {
      messages: validMessages,
      mode: 'suggest-stack',
    })
    expect(result.status).toBe(200)
    const content = (result.json.choices as { message?: { content?: string } }[])?.[0]?.message?.content
    expect(content).toContain('Later if needed')
    expect(content).toContain('Vercel')
  })

  it('suggest-stack mode: returns 200 with fallback when parsed kind is neither clarification nor stack', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      kind: 'unknown',
                      clarifying_question: null,
                      stack: null,
                    }),
                  },
                },
              ],
            }),
        } as Response)
      )
    )
    const result = await handleChatRequest('sk-test', {
      messages: validMessages,
      mode: 'suggest-stack',
    })
    expect(result.status).toBe(200)
    const content = (result.json.choices as { message?: { content?: string } }[])?.[0]?.message?.content
    expect(content).toBeTruthy()
  })

  it('suggest-stack mode: returns error status when fetch returns not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 502,
          json: () => Promise.resolve({ error: { message: 'Bad gateway' } }),
        } as Response)
      )
    )
    const result = await handleChatRequest('sk-test', {
      messages: validMessages,
      mode: 'suggest-stack',
    })
    expect(result.status).toBe(502)
    expect(result.json).toHaveProperty('error', 'Bad gateway')
  })

  it('suggest-stack with only assistant message uses last message for fallback', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [{ message: { content: 'not json' } }],
            }),
        } as Response)
      )
    )
    const result = await handleChatRequest('sk-test', {
      messages: [{ role: 'assistant', content: 'What do you want to build?' }],
      mode: 'suggest-stack',
    })
    expect(result.status).toBe(200)
    expect(result.json).toHaveProperty('choices')
  })

  it('suggest-stack mode: returns 200 with fallback when JSON parse fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [{ message: { content: 'not valid json' } }],
            }),
        } as Response)
      )
    )
    const result = await handleChatRequest('sk-test', {
      messages: validMessages,
      mode: 'suggest-stack',
    })
    expect(result.status).toBe(200)
    const content = (result.json.choices as { message?: { content?: string } }[])?.[0]?.message?.content
    expect(content).toBeTruthy()
    expect(typeof content).toBe('string')
  })

  it('returns OpenAI error status and message when fetch returns not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 503,
          json: () => Promise.resolve({ error: { message: 'Service unavailable' } }),
        } as Response)
      )
    )
    const result = await handleChatRequest('sk-test', { messages: validMessages })
    expect(result.status).toBe(503)
    expect(result.json).toHaveProperty('error')
  })

  it('returns 500 when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network'))))
    const result = await handleChatRequest('sk-test', { messages: validMessages })
    expect(result.status).toBe(500)
    expect(result.json).toHaveProperty('error')
  })
})
