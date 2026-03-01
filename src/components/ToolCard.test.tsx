import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolCard } from './ToolCard'
import type { Tool } from '../content/sections'

const mockTool: Tool = {
  id: 'test-tool',
  name: 'Test Tool',
  tagline: 'A test tagline',
  description: 'Test description',
  bullets: ['Bullet one'],
  url: 'https://example.com',
}

describe('ToolCard', () => {
  it('renders tool name and tagline', () => {
    render(<ToolCard tool={mockTool} />)
    expect(screen.getByText('Test Tool')).toBeInTheDocument()
    expect(screen.getByText('A test tagline')).toBeInTheDocument()
  })

  it('toggles expand/collapse with More details / Less details', async () => {
    const user = userEvent.setup()
    render(<ToolCard tool={mockTool} />)
    expect(screen.getByRole('button', { name: /Less details/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Less details/i }))
    expect(screen.getByRole('button', { name: /More details/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /More details/i }))
    expect(screen.getByRole('button', { name: /Less details/i })).toBeInTheDocument()
  })

  it('uses controlled expanded when expanded and onExpandToggle provided', async () => {
    const user = userEvent.setup()
    const onExpandToggle = vi.fn()
    render(
      <ToolCard tool={mockTool} expanded={false} onExpandToggle={onExpandToggle} />
    )
    await user.click(screen.getByRole('button', { name: /More details/i }))
    expect(onExpandToggle).toHaveBeenCalledWith(true)
  })
})
