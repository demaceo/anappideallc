import { render, fireEvent, waitFor } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { appRoutes as routes } from './helpers/app-routes'
import { SITE } from '../data/site'
import { resetCalendlyLoader } from '../lib/calendly'

function renderRoute(path: string) {
  return render(
    <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />,
  )
}

function fab() {
  return document.querySelector<HTMLAnchorElement>('.booking-fab')
}

const calendlyScripts = () =>
  document.querySelectorAll('script[src*="assets.calendly.com"]')

describe('Floating booking button', () => {
  beforeEach(() => {
    resetCalendlyLoader()
    delete window.Calendly
    document.head.querySelectorAll('[src*="calendly"], [href*="calendly"]').forEach((n) => n.remove())
  })
  afterEach(() => vi.restoreAllMocks())

  it('is a labelled, working link to the booking page', () => {
    renderRoute('/about')
    expect(fab()).toHaveTextContent('Book a free call')
    // A real href, so it still works before hydration or with JS off.
    expect(fab()).toHaveAttribute('href', SITE.booking.consultationUrl)
    expect(fab()).toHaveAttribute('target', '_blank')
    expect(fab()).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('replaces the old floating Contact button', () => {
    renderRoute('/about')
    expect(document.querySelector('.contact-fab')).toBeNull()
  })

  it('is hidden on /contact, where booking and the form are already on screen', () => {
    renderRoute('/contact')
    expect(fab()).toBeNull()
  })

  it('loads no Calendly code until clicked', () => {
    renderRoute('/')
    expect(calendlyScripts()).toHaveLength(0)
  })

  // happy-dom won't load external scripts (it fires its own `error`), so catch
  // the tags the loader injects and decide here whether they load or fail.
  function interceptHead() {
    const injected: HTMLElement[] = []
    vi.spyOn(document.head, 'appendChild').mockImplementation(<T extends Node>(node: T): T => {
      injected.push(node as unknown as HTMLElement)
      return node
    })
    return () => injected.filter((n): n is HTMLScriptElement => n instanceof HTMLScriptElement)
  }

  it('opens the Calendly popup on click, loading Calendly once', async () => {
    renderRoute('/about')
    const scripts = interceptHead()
    const initPopupWidget = vi.fn()
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)

    fireEvent.click(fab()!)
    fireEvent.click(fab()!)
    expect(scripts()).toHaveLength(1)
    expect(scripts()[0].src).toBe('https://assets.calendly.com/assets/external/widget.js')

    window.Calendly = { initPopupWidget }
    scripts()[0].onload?.(new Event('load'))

    await waitFor(() => expect(initPopupWidget).toHaveBeenCalledTimes(2))
    expect(initPopupWidget).toHaveBeenCalledWith({ url: SITE.booking.consultationUrl })
    expect(open).not.toHaveBeenCalled()
  })

  it('falls back to the booking page in a new tab when Calendly cannot load', async () => {
    renderRoute('/about')
    const scripts = interceptHead()
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)

    fireEvent.click(fab()!)
    scripts()[0].onerror?.(new Event('error'))

    await waitFor(() =>
      expect(open).toHaveBeenCalledWith(SITE.booking.consultationUrl, '_blank', 'noopener,noreferrer'),
    )
  })

  it('retries on the next click after a failed load', async () => {
    renderRoute('/about')
    const scripts = interceptHead()
    vi.spyOn(window, 'open').mockImplementation(() => null)

    fireEvent.click(fab()!)
    scripts()[0].onerror?.(new Event('error'))
    await waitFor(() => expect(window.open).toHaveBeenCalled())

    fireEvent.click(fab()!)
    expect(scripts()).toHaveLength(2)
  })

  it('leaves modified clicks (open in new tab) to the browser', () => {
    renderRoute('/about')
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true })
    fab()!.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(calendlyScripts()).toHaveLength(0)
  })
})
