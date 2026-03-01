import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatPanel } from './ChatPanel'

describe('ChatPanel', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [{ message: { content: 'Assistant reply' } }],
            }),
        } as Response)
      )
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders nothing when closed', () => {
    render(<ChatPanel isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog when open with close button and welcome text', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ChatPanel isOpen={true} onClose={onClose} />)
    expect(screen.getByRole('dialog', { name: /AI chat/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Close chat/i })).toBeInTheDocument()
    expect(screen.getByText(/Ask about tools/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Close chat/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('populates input with initialInput', () => {
    render(
      <ChatPanel
        isOpen={true}
        onClose={vi.fn()}
        initialInput="I want to build a todo app"
      />
    )
    const input = screen.getByPlaceholderText(/Type your message/)
    expect(input).toHaveValue('I want to build a todo app')
  })

  it('sends message and shows assistant reply when fetch succeeds', async () => {
    const user = userEvent.setup()
    render(<ChatPanel isOpen={true} onClose={vi.fn()} />)
    const input = screen.getByPlaceholderText(/Type your message/)
    await user.type(input, 'Hello')
    await user.click(screen.getByRole('button', { name: /Send message/i }))
    expect(fetch).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
          mode: undefined,
          context: undefined,
        }),
      })
    )
    expect(await screen.findByText('Assistant reply')).toBeInTheDocument()
  })

  it('shows error when fetch returns not ok', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'API error' }),
        } as Response)
      )
    )
    render(<ChatPanel isOpen={true} onClose={vi.fn()} />)
    await user.type(screen.getByPlaceholderText(/Type your message/), 'Hi')
    await user.click(screen.getByRole('button', { name: /Send message/i }))
    expect(await screen.findByText('API error')).toBeInTheDocument()
  })

  it('sends context in request body when toolContext is provided', async () => {
    const user = userEvent.setup()
    render(
      <ChatPanel
        isOpen={true}
        onClose={vi.fn()}
        toolContext={{
          toolId: 'cursor',
          toolName: 'Cursor',
          toolDescription: 'AI-first editor',
        }}
      />
    )
    await user.type(screen.getByPlaceholderText(/Type your message/), 'How do I use it?')
    await user.click(screen.getByRole('button', { name: /Send message/i }))
    expect(fetch).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'How do I use it?' }],
          mode: undefined,
          context: {
            toolId: 'cursor',
            toolName: 'Cursor',
            toolDescription: 'AI-first editor',
          },
        }),
      })
    )
  })

  it('shows network error when fetch throws', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Network error'))))
    render(<ChatPanel isOpen={true} onClose={vi.fn()} />)
    await user.type(screen.getByPlaceholderText(/Type your message/), 'Hi')
    await user.click(screen.getByRole('button', { name: /Send message/i }))
    expect(await screen.findByText(/Network error/)).toBeInTheDocument()
  })
})
