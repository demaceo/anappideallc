import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { routes } from '../routes'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('AppShell — InnerNav routing', () => {
  it('does NOT render InnerNav on home route "/"', () => {
    renderRoute('/')
    expect(
      screen.queryByRole('navigation', { name: /inner pages/i }),
    ).toBeNull()
  })

  it('renders InnerNav on /about', () => {
    renderRoute('/about')
    expect(
      screen.getByRole('navigation', { name: /inner pages/i }),
    ).toBeInTheDocument()
  })

  it('renders InnerNav on /work', () => {
    renderRoute('/work')
    expect(
      screen.getByRole('navigation', { name: /inner pages/i }),
    ).toBeInTheDocument()
  })

  it('renders InnerNav on /contact', () => {
    renderRoute('/contact')
    expect(
      screen.getByRole('navigation', { name: /inner pages/i }),
    ).toBeInTheDocument()
  })
})
