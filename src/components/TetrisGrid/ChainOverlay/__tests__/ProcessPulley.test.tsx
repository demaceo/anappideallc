import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProcessPulley } from '../ProcessPulley'

describe('ProcessPulley', () => {
  it('renders pulley wrapper at target coords', () => {
    const { container } = render(<ProcessPulley targetX={400} targetY={300} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.left).toBe('400px')
    expect(wrapper.style.top).toBe('300px')
  })

  it('the pulley wrapper has aria-hidden="true"', () => {
    const { container } = render(<ProcessPulley targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders wheel, string, and weight elements', () => {
    const { container } = render(<ProcessPulley targetX={0} targetY={0} />)
    expect(container.querySelector('[data-wheel]')).toBeInTheDocument()
    expect(container.querySelector('[data-string]')).toBeInTheDocument()
    expect(container.querySelector('[data-weight]')).toBeInTheDocument()
  })
})
