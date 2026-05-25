import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ContactSpring } from '../ContactSpring'

describe('ContactSpring', () => {
  it('renders spring wrapper at target coords', () => {
    const { container } = render(<ContactSpring targetX={400} targetY={300} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.left).toBe('400px')
    expect(wrapper.style.top).toBe('300px')
  })

  it('the spring wrapper has aria-hidden="true"', () => {
    const { container } = render(<ContactSpring targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders spring path and envelope elements', () => {
    const { container } = render(<ContactSpring targetX={0} targetY={0} />)
    expect(container.querySelector('[data-spring]')).toBeInTheDocument()
    expect(container.querySelector('[data-envelope]')).toBeInTheDocument()
  })
})
