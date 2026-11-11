import { render, screen, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { appRoutes as routes } from './helpers/app-routes'

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
    ['/contact', 'Contact'],
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
      expect(link).toHaveAccessibleName(/^(About|Work|Services|Process|Contact)$/)
    }
  })
})

/**
 * The site bar (back-home button + nav) sticks to the top of the page once the
 * masthead has scrolled away. `position: sticky` is held by the element's
 * PARENT box, so it only keeps sticking if it is a sibling of the masthead
 * wrapper. Nested inside it, it would scroll off with the masthead and the CSS
 * rule would look right while doing nothing. jsdom has no layout, so this pins
 * the structure.
 */
describe('Site bar — sticks as a sibling of the masthead, not inside it', () => {
  it.each(['/', '/about', '/work', '/services', '/process', '/contact'])(
    'renders the bar, with the nav in it, outside .page-header-wrap on %s',
    (path) => {
      const { container, unmount } = renderRoute(path)
      const bar = container.querySelector('.site-bar')
      const wrap = container.querySelector('.page-header-wrap')
      expect(bar).not.toBeNull()
      expect(wrap).not.toBeNull()
      expect(bar!.closest('.page-header-wrap')).toBeNull()
      expect(bar!.parentElement).toBe(wrap!.parentElement)
      // Still directly after the masthead, so reading and tab order are unchanged.
      expect(wrap!.nextElementSibling).toBe(bar)
      expect(bar!.querySelector('nav.personas-bar')).not.toBeNull()
      unmount()
    },
  )
})

/**
 * The masthead (and the back button that used to live in it) scrolls away, so
 * the way home has to live in the sticky bar. It must not show on Home, where
 * it would link to the page you are on.
 */
describe('Back-home button — pinned in the site bar', () => {
  it.each(['/about', '/work', '/services', '/process', '/contact', '/support'])(
    'is inside the sticky bar, ahead of the nav, on %s',
    (path) => {
      const { container, unmount } = renderRoute(path)
      const bar = container.querySelector('.site-bar')!
      const back = within(bar as HTMLElement).getByRole('link', { name: /back to home/i })
      expect(back).toHaveAttribute('href', '/')
      expect(back).toHaveClass('back-home')
      // An SVG icon, not a "←" text glyph: fonts draw arrows low in the line
      // box, which left the arrow ~4px below the centre of its square.
      expect(back.querySelector('svg')).not.toBeNull()
      expect(back).toHaveTextContent(/^$/)
      expect(bar).toHaveClass('site-bar--has-back')
      // Not in the masthead wrapper, which scrolls away.
      expect(container.querySelector('.page-header-wrap .back-home')).toBeNull()
      // Back button first, then the main navigation, in document order.
      const nav = bar.querySelector('nav.personas-bar')!
      expect(back.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      unmount()
    },
  )

  it('is absent on Home', () => {
    const { container } = renderRoute('/')
    expect(container.querySelector('.back-home')).toBeNull()
    expect(container.querySelector('.site-bar')).not.toHaveClass('site-bar--has-back')
  })

  it('stays out of the main navigation links', () => {
    renderRoute('/work')
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(within(nav).queryByRole('link', { name: /back to home/i })).toBeNull()
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
  const EXPECTED = ['About', 'Work', 'Services', 'Process', 'Why not AI', 'Support', 'Privacy', 'Legal', 'Contact']

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
