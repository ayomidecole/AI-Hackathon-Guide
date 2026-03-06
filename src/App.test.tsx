import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const storage: Record<string, string> = {}
const mockLocalStorage = {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, value: string) => {
    storage[key] = value
  },
  clear: () => {
    for (const key of Object.keys(storage)) delete storage[key]
  },
}

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: light)' ? false : false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })))
    mockLocalStorage.clear()
    mockLocalStorage.setItem('ai-hackathon-guide-theme', 'dark')
    vi.stubGlobal('localStorage', mockLocalStorage)
  })

  it('renders title and sidebar actions', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /AI Hackathon Guide/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Suggest a stack/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Other resources/i })).toBeInTheDocument()
  })

  it('toggles theme and updates data-theme', async () => {
    const user = userEvent.setup()
    render(<App />)
    const themeButton = screen.getByRole('button', { name: /Switch to light mode/i })
    await user.click(themeButton)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem('ai-hackathon-guide-theme')).toBe('light')
  })

  it('toggles section on click', async () => {
    const user = userEvent.setup()
    render(<App />)
    const sectionButton = screen.getByRole('button', { name: /Development tools/i })
    await user.click(sectionButton)
    expect(sectionButton).toBeInTheDocument()
  })

  it('opens chat with suggest-stack options when Suggest a stack is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Suggest a stack/i }))
    expect(screen.getByRole('dialog', { name: /AI chat/i })).toBeInTheDocument()
  })

  it('closes chat when clicking overlay', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Suggest a stack/i }))
    expect(screen.getByRole('dialog', { name: /AI chat/i })).toBeInTheDocument()
    const overlay = screen.getByRole('dialog', { name: /AI chat/i })
    await user.click(overlay)
    expect(screen.queryByRole('dialog', { name: /AI chat/i })).not.toBeInTheDocument()
  })

  it('uses light theme when matchMedia prefers light and no stored theme', () => {
    mockLocalStorage.clear()
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: light)',
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })))
    render(<App />)
    expect(screen.getByRole('button', { name: /Switch to dark mode/i })).toBeInTheDocument()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('navigates to More resources page and updates pathname', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Other resources/i }))
    expect(screen.getByRole('heading', { name: /More resources/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/more-resources')
  })

  it('handles popstate and returns to home view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Other resources/i }))
    expect(screen.getByRole('heading', { name: /More resources/i })).toBeInTheDocument()

    act(() => {
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(screen.getByRole('heading', { name: /AI Hackathon Guide/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/')
  })

  it('loads More resources view from pathname', () => {
    window.history.pushState({}, '', '/more-resources')
    render(<App />)
    expect(screen.getByRole('heading', { name: /More resources/i })).toBeInTheDocument()
  })

  it('navigates back to home when Guide (back) button is clicked on More resources page', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/more-resources')
    render(<App />)
    expect(screen.getByRole('heading', { name: /More resources/i })).toBeInTheDocument()

    const backButton = screen.getByRole('button', { name: /Back to guide/i })
    await user.click(backButton)

    expect(screen.getByRole('heading', { name: /AI Hackathon Guide/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/')
  })

  it('navigates to next section with Cmd+Down', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /Development tools/i })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'ArrowDown', metaKey: true })

    expect(screen.getByRole('heading', { name: /Supabase/i })).toBeInTheDocument()
  })

  it('navigates to previous section with Cmd+Up', () => {
    render(<App />)
    fireEvent.keyDown(document, { key: 'ArrowDown', metaKey: true })
    expect(screen.getByRole('heading', { name: /Supabase/i })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'ArrowUp', metaKey: true })

    expect(screen.getByRole('heading', { name: /Cursor/i })).toBeInTheDocument()
  })

  it('does not navigate sections with Cmd+Down on More resources page', () => {
    window.history.pushState({}, '', '/more-resources')
    render(<App />)
    expect(screen.getByRole('heading', { name: /More resources/i })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'ArrowDown', metaKey: true })

    expect(screen.getByRole('heading', { name: /More resources/i })).toBeInTheDocument()
  })

  it('does not navigate sections when Cmd+Left is pressed', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Cursor/i })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'ArrowLeft', metaKey: true })
    expect(screen.getByRole('heading', { name: /Cursor/i })).toBeInTheDocument()
  })

  it('does not navigate sections with Cmd+Down when focused on chat input', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Suggest a stack/i }))
    const textarea = screen.getByPlaceholderText(/Type your message/i)
    textarea.focus()

    fireEvent.keyDown(textarea, { key: 'ArrowDown', metaKey: true })

    expect(screen.getByRole('heading', { name: /Cursor/i })).toBeInTheDocument()
  })
})
