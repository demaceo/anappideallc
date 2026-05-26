import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { VelvetVitrine } from '../VelvetVitrine'

describe('VelvetVitrine', () => {
  it('renders children', () => {
    const { getByText } = render(
      <VelvetVitrine>
        <p>Page content</p>
      </VelvetVitrine>,
    )
    expect(getByText('Page content')).toBeInTheDocument()
  })

  it('has data-env="velvet-vitrine" on the root element', () => {
    const { container } = render(
      <VelvetVitrine>
        <p>x</p>
      </VelvetVitrine>,
    )
    expect(container.firstChild).toHaveAttribute('data-env', 'velvet-vitrine')
  })

  it('renders three aria-hidden atmosphere divs (floor, spot, vignette)', () => {
    const { container } = render(
      <VelvetVitrine>
        <p>x</p>
      </VelvetVitrine>,
    )
    const ariaHiddenDivs = Array.from(
      container.querySelectorAll('[aria-hidden="true"]'),
    )
    expect(ariaHiddenDivs).toHaveLength(3)
  })
})
