import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AuroraChamber } from '../AuroraChamber'

describe('AuroraChamber', () => {
  it('renders children inside the chamber', () => {
    const { getByText } = render(
      <AuroraChamber>
        <div>contact form</div>
      </AuroraChamber>,
    )
    expect(getByText('contact form')).toBeInTheDocument()
  })

  it('renders five aria-hidden decorative layers (3 aurora + stars + vignette)', () => {
    const { container } = render(<AuroraChamber>x</AuroraChamber>)
    const decorations = container.querySelectorAll('[aria-hidden="true"]')
    expect(decorations.length).toBe(5)
  })

  it('the chamber root has data-env="aurora"', () => {
    const { container } = render(<AuroraChamber>x</AuroraChamber>)
    expect(container.firstChild).toHaveAttribute('data-env', 'aurora')
  })
})
