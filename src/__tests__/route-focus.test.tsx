import { render, screen, waitFor } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { routes } from '../routes'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return { router, ...render(<RouterProvider router={router} />) }
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Regression — 2026-08 audit P1 (focus jumped to <main> on first load).
 *
 * RouteFocusReset keys off `pathname`, which fires on MOUNT as well as on
 * navigation. A plain page load therefore moved focus into <main>; because the
 * header markup precedes <main> in the DOM, the first Tab landed past the skip
 * link, the back-home button and the whole nav — all of which were then
 * reachable only by Shift+Tab. Measured on a fresh load of /services:
 * document.activeElement was MAIN.container and the first Tab hit the accordion.
 *
 * A fresh load must leave focus where the browser put it, so Tab starts at the
 * top of the document. Focus should still move on a real route change.
 */
describe('RouteFocusReset — first-load focus (audit P1)', () => {
  it('does not steal focus on initial mount', () => {
    renderRoute('/services')
    const main = document.querySelector('main')
    expect(main).not.toBeNull()
    expect(document.activeElement).not.toBe(main)
    expect(document.activeElement).toBe(document.body)
  })

  it('still moves focus to <main> on a real navigation', async () => {
    const { router } = renderRoute('/services')
    expect(document.activeElement).toBe(document.body)

    await router.navigate('/about')

    await waitFor(() => {
      expect(document.activeElement).toBe(document.querySelector('main'))
    })
  })
})

/**
 * Regression — 2026-08 audit P1 (no skip link anywhere on the site).
 *
 * The sticky header puts a back-home button and four nav links ahead of the
 * content on every route. The skip link must be the FIRST focusable element in
 * document order so keyboard and switch users can get past them, and it must
 * point at a <main> that can actually take focus.
 */
describe('PageHeader — skip link (audit P1)', () => {
  it('renders a skip link targeting the main landmark', () => {
    renderRoute('/')
    expect(
      screen.getByRole('link', { name: /skip to main content/i }),
    ).toHaveAttribute('href', '#main-content')
  })

  it('is the first focusable element in document order', () => {
    const { container } = renderRoute('/work')
    const first = container.querySelector(FOCUSABLE)
    expect(first).toBe(screen.getByRole('link', { name: /skip to main content/i }))
  })

  it('points at a main landmark that can actually receive focus', () => {
    renderRoute('/work')
    const main = document.querySelector('main')
    expect(main).toHaveAttribute('id', 'main-content')
    // Without tabindex the fragment target cannot take programmatic focus.
    expect(main).toHaveAttribute('tabindex', '-1')
  })

  it('renders on every top-level route, ahead of the nav', () => {
    for (const path of ['/', '/about', '/work', '/services', '/process', '/contact']) {
      const { container, unmount } = renderRoute(path)
      const first = container.querySelector(FOCUSABLE)
      expect(first).toHaveAttribute('href', '#main-content')
      unmount()
    }
  })
})
