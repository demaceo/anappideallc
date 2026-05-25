import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ServicesLever } from '../ServicesLever'

describe('ServicesLever', () => {
  it('renders lever wrapper at target coords', () => {
    const { container } = render(<ServicesLever targetX={400} targetY={300} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.left).toBe('400px')
    expect(wrapper.style.top).toBe('300px')
  })

  it('the lever wrapper has aria-hidden="true"', () => {
    const { container } = render(<ServicesLever targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders lever, pivot, and flag elements', () => {
    const { container } = render(<ServicesLever targetX={0} targetY={0} />)
    expect(container.querySelector('[data-lever]')).toBeInTheDocument()
    expect(container.querySelector('[data-pivot]')).toBeInTheDocument()
    expect(container.querySelector('[data-flag]')).toBeInTheDocument()
  })
})
