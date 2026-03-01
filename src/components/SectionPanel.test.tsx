import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SectionPanel } from './SectionPanel'
import type { Section } from '../content/sections'

const mockSection: Section = {
  id: 'test-section',
  title: 'Test Section',
  tools: [
    {
      id: 'tool-1',
      name: 'Tool One',
      tagline: 'First tool',
      description: 'Desc',
      bullets: [],
      url: 'https://example.com',
    },
  ],
}

describe('SectionPanel', () => {
  it('renders section title and item count', () => {
    const onToggle = vi.fn()
    render(
      <SectionPanel section={mockSection} isOpen={false} onToggle={onToggle} />
    )
    expect(screen.getByRole('button', { name: /Test Section/i })).toBeInTheDocument()
    expect(screen.getByText(/1 tool/)).toBeInTheDocument()
  })

  it('calls onToggle when header is clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(
      <SectionPanel section={mockSection} isOpen={false} onToggle={onToggle} />
    )
    await user.click(screen.getByRole('button', { name: /Test Section/i }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows content when isOpen is true', () => {
    const onToggle = vi.fn()
    render(
      <SectionPanel section={mockSection} isOpen={true} onToggle={onToggle}>
        <span>Panel content</span>
      </SectionPanel>
    )
    expect(screen.getByText('Panel content')).toBeInTheDocument()
  })

  it('handles touch pointer events for hover state', () => {
    const onToggle = vi.fn()
    render(
      <SectionPanel section={mockSection} isOpen={false} onToggle={onToggle}>
        <span>Content</span>
      </SectionPanel>
    )
    const header = screen.getByRole('button', { name: /Test Section/i })
    const panel = header.parentElement
    expect(panel).toBeTruthy()
    if (panel) {
      fireEvent.pointerDown(panel, { pointerType: 'touch' })
      fireEvent.pointerUp(panel, { pointerType: 'touch' })
      fireEvent.pointerLeave(panel, { pointerType: 'touch' })
    }
  })
})
