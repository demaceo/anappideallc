import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeroMarbleDrop } from '../HeroMarbleDrop'

describe('HeroMarbleDrop', () => {
  it('renders a marble SVG positioned at the target coords', () => {
    const { container } = render(<HeroMarbleDrop targetX={300} targetY={250} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.style.left).toBe('300px')
    expect(wrapper.style.top).toBe('250px')
    expect(wrapper.querySelector('svg')).toBeInTheDocument()
    expect(wrapper.querySelector('circle')).toBeInTheDocument()
  })

  it('the marble wrapper has aria-hidden="true"', () => {
    const { container } = render(<HeroMarbleDrop targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('uses a radial gradient for the golden orb fill', () => {
    const { container } = render(<HeroMarbleDrop targetX={0} targetY={0} />)
    expect(container.querySelector('radialGradient')).toBeInTheDocument()
  })
})
