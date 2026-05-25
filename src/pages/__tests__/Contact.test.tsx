import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import Contact from '../Contact'

describe('Contact page', () => {
  it('wraps content in an AuroraChamber', () => {
    const { container } = render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    )
    expect(container.querySelector('[data-env="aurora"]')).toBeInTheDocument()
  })

  it('renders the Contact heading inside the chamber', () => {
    const { container } = render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    )
    const chamber = container.querySelector('[data-env="aurora"]')
    expect(chamber?.textContent).toContain('Contact')
  })
})
