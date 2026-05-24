import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { VelvetStage } from '../VelvetStage'

describe('VelvetStage', () => {
  it('renders children inside the stage wrapper', () => {
    const { getByText } = render(
      <VelvetStage>
        <div>grid content</div>
      </VelvetStage>,
    )
    expect(getByText('grid content')).toBeInTheDocument()
  })

  it('renders three aria-hidden decorative layers (floor, spot, vignette)', () => {
    const { container } = render(<VelvetStage>x</VelvetStage>)
    const decorations = container.querySelectorAll('[aria-hidden="true"]')
    expect(decorations.length).toBe(3)
  })

  it('decorative layers are siblings of the children, not wrappers', () => {
    const { container } = render(
      <VelvetStage>
        <div data-testid="child">x</div>
      </VelvetStage>,
    )
    const child = container.querySelector('[data-testid="child"]')
    const decorations = container.querySelectorAll('[aria-hidden="true"]')
    // Each decoration's parent === child's parent (the .stage wrapper)
    decorations.forEach((dec) => {
      expect(dec.parentElement).toBe(child?.parentElement)
    })
  })
})
