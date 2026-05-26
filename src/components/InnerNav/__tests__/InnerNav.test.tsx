import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { InnerNav } from '../InnerNav'

function renderNav(path = '/about') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <InnerNav />
    </MemoryRouter>,
  )
}

describe('InnerNav', () => {
  it('has role="navigation" with aria-label "Inner pages"', () => {
    renderNav()
    expect(screen.getByRole('navigation', { name: /inner pages/i })).toBeInTheDocument()
  })

  it('renders a studio-mark link to home', () => {
    renderNav()
    const home = screen.getByRole('link', { name: /home/i })
    expect(home).toHaveAttribute('href', '/')
    expect(home).toHaveTextContent('AAI')
  })

  it('renders all 5 inner-page nav links', () => {
    renderNav()
    expect(screen.getByRole('link', { name: /^about$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^work$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^services$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^process$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^contact$/i })).toBeInTheDocument()
  })

  it('/about link points to the correct href', () => {
    renderNav()
    expect(screen.getByRole('link', { name: /^about$/i })).toHaveAttribute('href', '/about')
  })
})
