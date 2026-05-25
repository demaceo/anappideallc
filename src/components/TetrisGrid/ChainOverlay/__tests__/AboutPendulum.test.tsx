import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AboutPendulum } from '../AboutPendulum'

describe('AboutPendulum', () => {
  it('renders the pendulum wrapper at target coords', () => {
    const { container } = render(<AboutPendulum targetX={400} targetY={300} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.style.left).toBe('400px')
    expect(wrapper.style.top).toBe('300px')
  })

  it('the pendulum wrapper has aria-hidden="true"', () => {
    const { container } = render(<AboutPendulum targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders both a rod (line) and a bob (circle) inside the SVG', () => {
    const { container } = render(<AboutPendulum targetX={0} targetY={0} />)
    expect(container.querySelector('line')).toBeInTheDocument()
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('uses a radial gradient for the bob fill', () => {
    const { container } = render(<AboutPendulum targetX={0} targetY={0} />)
    expect(container.querySelector('radialGradient')).toBeInTheDocument()
  })
})
