import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act } from 'react'
import { render, screen } from '@testing-library/react'
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
})
