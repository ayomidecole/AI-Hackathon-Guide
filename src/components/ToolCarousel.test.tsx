import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ToolCarousel } from './ToolCarousel'
import type { Tool } from '../content/sections'

const EXIT_MS = 180
const ENTER_MS = 240

const mockTools: Tool[] = [
  {
    id: 'tool-1',
    name: 'Tool One',
    tagline: 'First',
    description: 'Desc one',
    bullets: [],
    url: 'https://one.com',
  },
  {
    id: 'tool-2',
    name: 'Tool Two',
    tagline: 'Second',
    description: 'Desc two',
    bullets: [],
    url: 'https://two.com',
  },
]

describe('ToolCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('shows empty state when tools is empty', () => {
    render(<ToolCarousel tools={[]} />)
    expect(screen.getByText(/More tools coming soon/)).toBeInTheDocument()
  })

  it('renders first tool by default', () => {
    render(<ToolCarousel tools={mockTools} />)
    expect(screen.getByText('Tool One')).toBeInTheDocument()
    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('navigates to next tool when next button clicked', () => {
    render(<ToolCarousel tools={mockTools} />)
    expect(screen.getByText('Tool One')).toBeInTheDocument()
    const nextButton = screen.getByRole('button', { name: /Next tool/i })
    act(() => {
      fireEvent.click(nextButton)
    })
    act(() => {
      vi.advanceTimersByTime(EXIT_MS)
    })
    act(() => {
      vi.advanceTimersByTime(ENTER_MS)
    })
    expect(screen.getByText('Tool Two')).toBeInTheDocument()
  })

  it('navigates with arrow key when section is open', () => {
    render(<ToolCarousel tools={mockTools} isSectionOpen={true} />)
    const carousel = screen.getByRole('region', { name: /Tool carousel/i })
    act(() => {
      carousel.focus()
      fireEvent.keyDown(carousel, { key: 'ArrowRight' })
    })
    act(() => {
      vi.advanceTimersByTime(EXIT_MS)
    })
    act(() => {
      vi.advanceTimersByTime(ENTER_MS)
    })
    expect(screen.getByText('Tool Two')).toBeInTheDocument()
  })

  it('navigates to previous tool with ArrowLeft', () => {
    render(<ToolCarousel tools={mockTools} isSectionOpen={true} />)
    const carousel = screen.getByRole('region', { name: /Tool carousel/i })
    act(() => {
      carousel.focus()
      fireEvent.keyDown(carousel, { key: 'ArrowRight' })
    })
    act(() => {
      vi.advanceTimersByTime(EXIT_MS)
    })
    act(() => {
      vi.advanceTimersByTime(ENTER_MS)
    })
    expect(screen.getByText('Tool Two')).toBeInTheDocument()
    act(() => {
      fireEvent.keyDown(carousel, { key: 'ArrowLeft' })
    })
    act(() => {
      vi.advanceTimersByTime(EXIT_MS)
    })
    act(() => {
      vi.advanceTimersByTime(ENTER_MS)
    })
    expect(screen.getByText('Tool One')).toBeInTheDocument()
  })

  it('toggles card expanded with Enter key', () => {
    render(<ToolCarousel tools={mockTools} isSectionOpen={true} />)
    const carousel = screen.getByRole('region', { name: /Tool carousel/i })
    carousel.focus()
    expect(screen.getByRole('button', { name: /Less details/i })).toBeInTheDocument()
    act(() => {
      fireEvent.keyDown(carousel, { key: 'Enter' })
    })
    expect(screen.getByRole('button', { name: /More details/i })).toBeInTheDocument()
  })

  it('navigates to tool when dot is clicked', () => {
    render(<ToolCarousel tools={mockTools} isSectionOpen={true} />)
    expect(screen.getByText('Tool One')).toBeInTheDocument()
    const dots = screen.getAllByRole('button', { name: /Go to tool 2/i })
    act(() => {
      fireEvent.click(dots[0])
    })
    act(() => {
      vi.advanceTimersByTime(EXIT_MS)
    })
    act(() => {
      vi.advanceTimersByTime(ENTER_MS)
    })
    expect(screen.getByText('Tool Two')).toBeInTheDocument()
  })

  it('navigates to previous tool when prev button clicked', () => {
    render(<ToolCarousel tools={mockTools} isSectionOpen={true} />)
    const nextButtons = screen.getAllByRole('button', { name: /Next tool/i })
    act(() => {
      fireEvent.click(nextButtons[0])
    })
    act(() => {
      vi.advanceTimersByTime(EXIT_MS)
    })
    act(() => {
      vi.advanceTimersByTime(ENTER_MS)
    })
    expect(screen.getByText('Tool Two')).toBeInTheDocument()
    const prevButtons = screen.getAllByRole('button', { name: /Previous tool/i })
    act(() => {
      fireEvent.click(prevButtons[0])
    })
    act(() => {
      vi.advanceTimersByTime(EXIT_MS)
    })
    act(() => {
      vi.advanceTimersByTime(ENTER_MS)
    })
    expect(screen.getByText('Tool One')).toBeInTheDocument()
  })
})
