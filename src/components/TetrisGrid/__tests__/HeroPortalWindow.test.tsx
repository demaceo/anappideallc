import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeroPortalWindow } from '../HeroPortalWindow'

describe('HeroPortalWindow', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeroPortalWindow />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('the portal root has aria-hidden="true"', () => {
    const { container } = render(<HeroPortalWindow />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders two inner layers (aurora and stars)', () => {
    const { container } = render(<HeroPortalWindow />)
    const root = container.firstChild as HTMLElement
    expect(root.children.length).toBe(2)
  })
})
