import { render, screen, within, fireEvent, waitFor } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { routes } from '../routes'
import { SITE } from '../data/site'

function renderRoute(path: string) {
  return render(
    <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />,
  )
}

/**
 * Regression — 2026-10 client-journey audit.
 *
 * About, Work, Services, Process and every case study ended with no call to
 * action: a visitor convinced by the last paragraph had to find the floating
 * button or the footer to act.
 */
describe('Every decision page closes with a next step', () => {
  it.each(['/about', '/work', '/services', '/process', '/why-not-ai', '/work/stlmnt-settlement-tracker'])(
    'offers booking and the guided form at the end of %s',
    (path) => {
      const { unmount } = renderRoute(path)
      const section = screen.getByRole('region', { name: /next step/i })
      expect(within(section).getByRole('link', { name: /book a time/i })).toHaveAttribute(
        'href',
        SITE.booking.consultationUrl,
      )
      expect(within(section).getByRole('link', { name: /guided form/i })).toHaveAttribute(
        'href',
        '/contact',
      )
      unmount()
    },
  )

  it('names the project on a case study', () => {
    renderRoute('/work/stlmnt-settlement-tracker')
    expect(
      screen.getByRole('heading', { name: /building something like stlmnt\?/i }),
    ).toBeInTheDocument()
  })

  it('does not offer the form link on the page that is the form', () => {
    renderRoute('/contact')
    expect(screen.queryByRole('link', { name: /guided form/i })).toBeNull()
  })
})

/**
 * Regression — the mobile contact affordance was an unlabelled paper-plane
 * disc, and Contact was absent from the main navigation.
 */
describe('Contact is labelled and in the main nav', () => {
  it('shows a visible "Contact" label on the floating link', () => {
    renderRoute('/about')
    const fab = document.querySelector('.contact-fab')
    expect(fab).toHaveTextContent('Contact')
    expect(fab).toHaveAttribute('href', '/contact')
  })

  it('lists Contact in the main navigation', () => {
    renderRoute('/')
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(within(nav).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })
})

describe('Pricing note', () => {
  it('stays hidden while no range is configured', () => {
    // Guards against shipping an empty "$—" band. Update this test, not the
    // component, once SITE.pricing.range is filled in.
    expect(SITE.pricing.range).toBe('')
    renderRoute('/services')
    expect(document.querySelector('.verdict-box.note')).toBeNull()
  })
})

describe('Contact wizard', () => {
  afterEach(() => vi.unstubAllGlobals())

  function stepCount() {
    return document.querySelector('.wizard-step-count')?.textContent
  }

  it('skips the search-visibility step for an app-only project', () => {
    renderRoute('/contact')
    fireEvent.click(screen.getByRole('button', { name: /a mobile app/i }))
    expect(stepCount()).toMatch(/01 \/ 06/)

    const seen: string[] = []
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))
      seen.push(document.querySelector('.wizard-question')?.textContent ?? '')
    }
    expect(seen.join(' | ')).not.toMatch(/how will people find it/i)
    expect(seen.join(' | ')).toMatch(/which app stores/i)
  })

  it('asks the search-visibility question in plain language for a website', () => {
    renderRoute('/contact')
    fireEvent.click(screen.getByRole('button', { name: /a website/i }))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText(/how will people find it/i)).toBeInTheDocument()
    expect(screen.getByText('Showing up on Google')).toBeInTheDocument()
    expect(screen.getByText('Getting recommended by AI assistants')).toBeInTheDocument()
  })

  it('sends the budget and ends on next steps with a booking link', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, confirmationSent: true }), { status: 200 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    renderRoute('/contact')
    fireEvent.click(screen.getByRole('button', { name: /a mobile app/i }))
    while (screen.queryByLabelText(/your idea/i) === null) {
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    }
    fireEvent.change(screen.getByLabelText(/your idea/i), { target: { value: 'An app for dog walkers' } })
    fireEvent.change(screen.getByLabelText(/budget ballpark/i), { target: { value: 'not sure yet' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sam@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    const status = await screen.findByRole('status')
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(sent.budget).toBe('not sure yet')
    // Bot-screening fields ride along: an empty honeypot and the time open.
    expect(sent.website).toBe('')
    expect(typeof sent.elapsedMs).toBe('number')
    expect(within(status).getByRole('link', { name: /book the call now/i })).toHaveAttribute(
      'href',
      SITE.booking.consultationUrl,
    )
    expect(within(status).getAllByRole('listitem')).toHaveLength(3)
    await waitFor(() =>
      expect(within(status).getByText(/confirmation is on its way to sam@example\.com/i)).toBeInTheDocument(),
    )
  })

  it('explains a rate-limit response instead of blaming the server', async () => {
    // The Vercel Firewall answers 429 before the function runs, with no JSON.
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Too Many Requests', { status: 429 })))
    renderRoute('/contact')
    fireEvent.click(screen.getByRole('button', { name: /a mobile app/i }))
    while (screen.queryByLabelText(/your idea/i) === null) {
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    }
    fireEvent.change(screen.getByLabelText(/your idea/i), { target: { value: 'An idea' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sam@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/give it a minute/i)
    expect(within(alert).getByRole('link', { name: /email me directly/i })).toHaveAttribute(
      'href',
      'mailto:hello@anappidea.llc',
    )
  })

  it('keeps the honeypot out of reach of real visitors', () => {
    renderRoute('/contact')
    const trap = document.getElementById('cf-website') as HTMLInputElement
    expect(trap.tabIndex).toBe(-1)
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
