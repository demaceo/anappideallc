import { render, screen, within, fireEvent, waitFor } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { appRoutes as routes } from './helpers/app-routes'
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
    'offers booking and the message form at the end of %s',
    (path) => {
      const { unmount } = renderRoute(path)
      const section = screen.getByRole('region', { name: /next step/i })
      expect(within(section).getByRole('link', { name: /book a free call/i })).toHaveAttribute(
        'href',
        SITE.booking.consultationUrl,
      )
      expect(within(section).getByRole('link', { name: /send me a message/i })).toHaveAttribute(
        'href',
        '/contact',
      )
      // Two tiers by job: the chartreuse booking band, then the lavender
      // "write to me" strip — never the same box.
      expect(within(section).getByRole('link', { name: /book a free call/i }).closest('.consult-cta')).not.toBeNull()
      expect(within(section).getByRole('link', { name: /send me a message/i }).closest('.message-cta')).not.toBeNull()
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
    expect(screen.queryByRole('link', { name: /send me a message/i })).toBeNull()
  })
})

/**
 * Regression — the mobile contact affordance was an unlabelled paper-plane
 * disc, and Contact was absent from the main navigation.
 */
describe('Contact is labelled and in the main nav', () => {
  it('lists Contact in the main navigation', () => {
    renderRoute('/')
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(within(nav).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })
})

describe('Pricing note', () => {
  it('shows the sliding-scale terms on Services and Contact', () => {
    for (const path of ['/services', '/contact']) {
      const { unmount } = renderRoute(path)
      const note = document.querySelector('.verdict-box.note')
      expect(note).toHaveTextContent(SITE.pricing.range)
      expect(note).toHaveTextContent('$110/hour')
      unmount()
    }
  })
})

describe('Contact form: quick message first, guided questions as the alternative', () => {
  afterEach(() => vi.unstubAllGlobals())

  function stepCount() {
    return document.querySelector('.wizard-step-count')?.textContent
  }

  // The quick form is the default; the guided questions open from the link
  // under the message box.
  function enterGuided() {
    renderRoute('/contact')
    fireEvent.click(screen.getByRole('button', { name: /not sure what to say\? let me guide you/i }))
  }

  function fillQuick({ message = 'An app for dog walkers' } = {}) {
    if (message) fireEvent.change(screen.getByLabelText(/in your words/i), { target: { value: message } })
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sam@example.com' } })
  }

  it('opens on the quick form, with no step counter and a way into the guide', () => {
    renderRoute('/contact')
    expect(stepCount()).toBeUndefined()
    expect(screen.getByLabelText(/in your words/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /not sure what to say/i })).toBeInTheDocument()
    // The wizard's questions are not on screen until asked for.
    expect(screen.queryByText(/what do you need\?/i)).toBeNull()
  })

  // Continue and the last step's button sit in the same slot. When React
  // reused one element and flipped its role mid-click, the browser's default
  // action fired the wrong handler as the last step opened. jsdom doesn't
  // replay that default action, so assert the cause: a fresh element.
  it('swaps in a new element for the last step rather than reusing Continue', () => {
    enterGuided()
    fireEvent.click(screen.getByRole('button', { name: /a website/i }))
    let cont = screen.getByRole('button', { name: /continue/i })
    while (screen.queryByRole('button', { name: /continue/i })) {
      cont = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(cont)
    }
    expect(screen.getByRole('button', { name: /write my first draft/i })).not.toBe(cont)
  })

  it('skips the search-visibility step for an app-only project', () => {
    enterGuided()
    fireEvent.click(screen.getByRole('button', { name: /a mobile app/i }))
    expect(stepCount()).toMatch(/01 \/ 05/)

    const seen: string[] = []
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))
      seen.push(document.querySelector('.wizard-question')?.textContent ?? '')
    }
    expect(seen.join(' | ')).not.toMatch(/how will people find it/i)
    expect(seen.join(' | ')).toMatch(/which app stores/i)
    // Five steps for an app (type, stores, business, audience, budget); the last offers the draft.
    expect(screen.getByRole('button', { name: /write my first draft/i })).toBeInTheDocument()
  })

  it('asks the search-visibility question in plain language for a website', () => {
    enterGuided()
    fireEvent.click(screen.getByRole('button', { name: /a website/i }))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText(/how will people find it/i)).toBeInTheDocument()
    expect(screen.getByText('Showing up on Google')).toBeInTheDocument()
    expect(screen.getByText('Getting recommended by AI assistants')).toBeInTheDocument()
  })

  it('sends a quick message and ends on next steps with a booking link', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, confirmationSent: true }), { status: 200 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    renderRoute('/contact')
    fillQuick()
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    const status = await screen.findByRole('status')
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(sent.description).toBe('An app for dog walkers')
    expect(sent.name).toBe('Sam')
    expect(sent.services).toEqual([])
    expect(sent.usedGuide).toBe(false)
    // Bot-screening fields ride along: an empty honeypot and the time open.
    expect(sent.website).toBe('')
    expect(typeof sent.elapsedMs).toBe('number')
    expect(within(status).getByRole('link', { name: /book your free call now/i })).toHaveAttribute(
      'href',
      SITE.booking.consultationUrl,
    )
    expect(within(status).getAllByRole('listitem')).toHaveLength(3)
    await waitFor(() =>
      expect(within(status).getByText(/confirmation is on its way to sam@example\.com/i)).toBeInTheDocument(),
    )
  })

  it('sends the guided budget inside the message, and flags that the guide was used', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, confirmationSent: true }), { status: 200 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    enterGuided()
    fireEvent.click(screen.getByRole('button', { name: /a mobile app/i }))
    while (screen.queryByLabelText(/budget ballpark/i) === null) {
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    }
    fireEvent.change(screen.getByLabelText(/budget ballpark/i), { target: { value: 'not sure yet' } })
    fireEvent.click(screen.getByRole('button', { name: /write my first draft/i }))

    // Back on the quick form, with the draft in the message box.
    expect(stepCount()).toBeUndefined()
    expect((screen.getByLabelText(/in your words/i) as HTMLTextAreaElement).value).toContain(
      "I'm looking for help building a mobile app.",
    )
    fillQuick({ message: '' })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await screen.findByRole('status')
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    // The budget travels in the message the visitor approved, not as a second
    // copy that would disagree with it after an edit.
    expect(sent.budget).toBeUndefined()
    expect(sent.usedGuide).toBe(true)
    expect(sent.projectType).toBe('app')
    expect(sent.description).toContain('Budget ballpark: not sure yet.')
    expect(sent.services).toEqual(['custom-builds'])
  })

  it('explains a rate-limit response instead of blaming the server', async () => {
    // The Vercel Firewall answers 429 before the function runs, with no JSON.
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Too Many Requests', { status: 429 })))
    renderRoute('/contact')
    fillQuick({ message: 'An idea' })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/give it a minute/i)
    expect(within(alert).getByRole('link', { name: /email me directly/i })).toHaveAttribute(
      'href',
      'mailto:hello@anappidea.llc',
    )
  })

  // Regression: the form was a black panel under the booking band and read as
  // one more section to scroll past. It now leads the page as a titled form.
  it('puts the message form on its own stage, ahead of the booking band', () => {
    renderRoute('/contact')
    const stage = screen.getByRole('region', { name: /send me a message/i })
    expect(within(stage).getByRole('heading', { name: /send me a message/i })).toBeInTheDocument()
    expect(within(stage).getByText(/start your message/i)).toBeInTheDocument()
    const band = document.querySelector('.consult-cta') as HTMLElement
    expect(stage.compareDocumentPosition(band) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('keeps the honeypot out of reach of real visitors', () => {
    renderRoute('/contact')
    const trap = document.getElementById('cf-website') as HTMLInputElement
    expect(trap.tabIndex).toBe(-1)
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
