import { render, screen, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { routes } from '../routes'

function renderRoute(path: string) {
  return render(
    <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />,
  )
}

/**
 * Regression — 2026-08 audit P2 (navigation and IA gaps).
 *
 * SiteNav used plain Link, so there was no aria-current and no active style
 * anywhere on the site: a visitor could not tell which section they were in,
 * visually or in the accessibility tree. Verified before the fix — zero
 * [aria-current] elements on every route.
 */
describe('SiteNav — current route is exposed (audit P2)', () => {
  it.each([
    ['/about', 'About'],
    ['/work', 'Work'],
    ['/services', 'Services'],
    ['/process', 'Process'],
  ])('marks %s as the current page', (path, label) => {
    renderRoute(path)
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    const current = within(nav).getByRole('link', { current: 'page' })
    expect(current).toHaveTextContent(label)
    expect(current).toHaveClass('persona-tag--active')
  })

  it('marks nothing current on a route outside the main nav', () => {
    renderRoute('/support')
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(within(nav).queryByRole('link', { current: 'page' })).toBeNull()
  })

  it('keeps the decorative arrow out of every link name', () => {
    renderRoute('/work')
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    for (const link of within(nav).getAllByRole('link')) {
      // "↳ About" was the announced name before the glyph moved into an
      // aria-hidden span.
      expect(link).toHaveAccessibleName(/^(About|Work|Services|Process)$/)
    }
  })
})

/**
 * Regression — 2026-08 audit P2 (footer had zero navigation links).
 *
 * The masthead nav carries only four sections, so Contact was reachable only
 * through the floating action button and Support / Why not AI only through
 * prose links mid-page.
 */
describe('FooterNav — full site index (audit P2)', () => {
  const EXPECTED = ['About', 'Work', 'Services', 'Process', 'Why not AI', 'Support', 'Legal', 'Contact']

  it.each(['/', '/about', '/work', '/services', '/process', '/contact', '/support', '/why-not-ai', '/legal'])(
    'renders the full link set on %s',
    (path) => {
      const { unmount } = renderRoute(path)
      const footerNav = screen.getByRole('navigation', { name: /footer navigation/i })
      const names = within(footerNav).getAllByRole('link').map((a) => a.textContent)
      expect(names).toEqual(EXPECTED)
      unmount()
    },
  )

  it('reaches the routes the masthead nav omits', () => {
    renderRoute('/')
    const footerNav = screen.getByRole('navigation', { name: /footer navigation/i })
    for (const [label, href] of [
      ['Contact', '/contact'],
      ['Support', '/support'],
      ['Why not AI', '/why-not-ai'],
    ]) {
      expect(within(footerNav).getByRole('link', { name: label })).toHaveAttribute('href', href)
    }
  })
})

/**
 * Regression — 2026-08 audit P2 (footer email was plain text).
 */
describe('Footer contact details (audit P2)', () => {
  it.each(['/', '/about', '/support', '/contact'])('links the email on %s', (path) => {
    const { unmount } = renderRoute(path)
    const mail = screen.getAllByRole('link', { name: /hello@anappidea\.llc/i })
    expect(mail.length).toBeGreaterThan(0)
    expect(mail.some((a) => a.getAttribute('href') === 'mailto:hello@anappidea.llc')).toBe(true)
    unmount()
  })
})
