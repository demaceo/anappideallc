import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { routes } from '../routes'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('AppShell — personas-bar routing', () => {
  it('renders exactly one personas-bar on home route "/"', () => {
    renderRoute('/')
    expect(
      screen.getAllByRole('navigation', { name: /main navigation/i }),
    ).toHaveLength(1)
  })

  it('renders personas-bar on /about', () => {
    renderRoute('/about')
    expect(
      screen.getByRole('navigation', { name: /main navigation/i }),
    ).toBeInTheDocument()
  })

  it('renders personas-bar on /work', () => {
    renderRoute('/work')
    expect(
      screen.getByRole('navigation', { name: /main navigation/i }),
    ).toBeInTheDocument()
  })

  it('renders personas-bar on /contact', () => {
    renderRoute('/contact')
    expect(
      screen.getByRole('navigation', { name: /main navigation/i }),
    ).toBeInTheDocument()
  })
})
