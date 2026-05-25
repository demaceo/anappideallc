import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WorkDominoCascade } from '../WorkDominoCascade'

describe('WorkDominoCascade', () => {
  it('renders the cascade wrapper at target coords', () => {
    const { container } = render(<WorkDominoCascade targetX={400} targetY={300} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.style.left).toBe('400px')
    expect(wrapper.style.top).toBe('300px')
  })

  it('the cascade wrapper has aria-hidden="true"', () => {
    const { container } = render(<WorkDominoCascade targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders exactly 5 dominos', () => {
    const { container } = render(<WorkDominoCascade targetX={0} targetY={0} />)
    expect(container.querySelectorAll('[data-domino]').length).toBe(5)
  })

  it('renders 1 marble', () => {
    const { container } = render(<WorkDominoCascade targetX={0} targetY={0} />)
    expect(container.querySelectorAll('[data-marble]').length).toBe(1)
  })
})
