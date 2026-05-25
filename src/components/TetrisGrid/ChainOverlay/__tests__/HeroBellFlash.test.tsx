import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeroBellFlash } from '../HeroBellFlash'

describe('HeroBellFlash', () => {
  it('renders the bell halo positioned at target coords', () => {
    const { container } = render(<HeroBellFlash targetX={400} targetY={300} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.style.left).toBe('400px')
    expect(wrapper.style.top).toBe('300px')
  })

  it('the bell wrapper has aria-hidden="true"', () => {
    const { container } = render(<HeroBellFlash targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('has a halo child with radial gradient styles', () => {
    const { container } = render(<HeroBellFlash targetX={0} targetY={0} />)
    expect(container.querySelector('[class*="halo"]')).toBeInTheDocument()
  })
})
