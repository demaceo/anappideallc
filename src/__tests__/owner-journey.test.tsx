import { render, screen, within, fireEvent, waitFor } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { appRoutes as routes } from './helpers/app-routes'
import { SITE } from '../data/site'
import { services } from '../data/services'
import { processSteps } from '../data/process'

function renderRoute(path: string) {
  return render(
    <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />,
  )
}

/**
 * Regression: 2026-11 owner-journey audit (a Black or brown small business
 * owner arriving cold). The site claimed to be built for them, then answered
 * none of the questions a careful owner asks before hiring: what does it cost
 * to keep running, who owns it, how do I pay, how long does a website take.
 */
describe('Services speak to the owner', () => {
  it('leads with four plain offers, then one for bigger builds', () => {
    expect(services.filter((s) => s.group !== 'bigger')).toHaveLength(4)
    expect(services.filter((s) => s.group === 'bigger')).toHaveLength(1)
    const { container } = renderRoute('/services')
    expect(container.querySelectorAll('.svc-item')).toHaveLength(services.length)
    expect(screen.getByText(/four ways to start, plus bigger builds/i)).toBeInTheDocument()
    // The old heading said "Six ways" over a list of seven.
    expect(screen.queryByText(/six ways/i)).toBeNull()
  })

  it('does not name offers in startup or engineering jargon', () => {
    const titles = services.map((s) => s.title).join(' | ')
    expect(titles).not.toMatch(/MVP|UI Engineering|Data Visualization/i)
  })
})

describe('Straight answers about money', () => {
  it('states how to pay, what you own, what it costs to run, and what is free after launch', () => {
    renderRoute('/services')
    const section = screen.getByRole('region', { name: /straight answers about money/i })
    for (const term of Object.values(SITE.terms)) {
      expect(within(section).getByRole('heading', { name: term.title })).toBeInTheDocument()
      expect(within(section).getByText(term.body)).toBeInTheDocument()
    }
  })

  it('commits to the agreed terms in plain numbers', () => {
    expect(SITE.terms.payment.body).toMatch(/50% to start and 50% when it launches/)
    expect(SITE.terms.ownership.body).toMatch(/in your name from day one/)
    expect(SITE.terms.running.body).toMatch(/about \$20 a month/)
    expect(SITE.terms.afterLaunch.body).toMatch(/30 days of free bug fixes/)
  })

  it('shows the sliding-scale numbers on Home, not only on Services and Contact', () => {
    renderRoute('/')
    const note = document.querySelector('.verdict-box.note')
    expect(note).toHaveTextContent(SITE.pricing.range)
  })
})

describe('Process shows how long a website takes', () => {
  it('gives a website timeline next to the app timeline', () => {
    renderRoute('/process')
    expect(screen.getByText('3–5 weeks')).toBeInTheDocument()
    expect(screen.getByText('7–13 weeks')).toBeInTheDocument()
  })

  it('shows both timelines on every step', () => {
    const { container } = renderRoute('/process')
    const cards = [...container.querySelectorAll('.phase-times')]
    expect(cards).toHaveLength(processSteps.length)
    cards.forEach((c) => {
      expect(c).toHaveTextContent(/Website:/)
      expect(c).toHaveTextContent(/App or custom build:/)
    })
  })

  it('uses plain words for the steps, not engineering jargon', () => {
    const text = processSteps
      .flatMap((p) => [p.title, p.description, ...p.substeps, ...p.deliverables])
      .join(' ')
    expect(text).not.toMatch(/stakeholder|E2E|unit, integration|design system|user persona|feasibility/i)
  })
})

describe('A real face and a clear call', () => {
  it.each(['/', '/about'])('shows the founder portrait with a name and alt text on %s', (path) => {
    renderRoute(path)
    const img = screen.getByRole('img', { name: SITE.founder.photo.alt })
    expect(img).toHaveAttribute('src', SITE.founder.photo.src800)
    expect(img).toHaveAttribute('srcset', expect.stringContaining('400w'))
    expect(img).toHaveAttribute('width', '800')
    expect(img).toHaveAttribute('height', '800')
    expect(screen.getByText(SITE.founder.name, { selector: 'figcaption strong' })).toBeInTheDocument()
  })

  it.each(['/', '/contact'])('says what happens on the call, on %s', (path) => {
    renderRoute(path)
    const steps = document.querySelector('.consult-cta-steps') as HTMLElement
    expect(steps).not.toBeNull()
    for (const step of SITE.booking.callSteps) {
      expect(within(steps).getByText(step)).toBeInTheDocument()
    }
    const card = steps.closest('.consult-cta') as HTMLElement
    expect(within(card).getByText(SITE.booking.callNote)).toBeInTheDocument()
  })

  it('keeps the call steps off pages where the band is only a reminder', () => {
    renderRoute('/work')
    expect(document.querySelector('.consult-cta-steps')).toBeNull()
  })
})

describe('Contact form says what happens to what you type', () => {
  it('has a privacy line with a way to ask for deletion', () => {
    renderRoute('/contact')
    const line = document.querySelector('.contact-privacy') as HTMLElement
    expect(line).toHaveTextContent(/I don't sell it/)
    expect(within(line).getByRole('link', { name: SITE.email })).toHaveAttribute(
      'href',
      `mailto:${SITE.email}`,
    )
  })
})

describe('About reads in the owner’s language', () => {
  it('leads with what an owner cares about and drops the engineering terms', () => {
    renderRoute('/about')
    const grid = document.querySelector('.grid-2') as HTMLElement
    const titles = [...grid.querySelectorAll('.feature-title')].map((e) => e.textContent)
    expect(titles[0]).toBe('One person, start to finish')
    const text = document.body.textContent ?? ''
    expect(text).not.toMatch(/AES-256|secret scanning|failover|Groq|Deepgram/i)
  })
})

/**
 * Regression: phone walkthrough, 2026-11. Tapping Send with the name missing
 * showed its message below the Send button, off the phone's screen (984px on an
 * 844px viewport), left focus on the button and marked no field invalid, so the
 * tap appeared to do nothing.
 */
describe('Contact form validation points at the problem', () => {
  const send = () => fireEvent.click(screen.getByRole('button', { name: /send message/i }))

  it('shows the message under the field, marks it invalid, and moves focus to it', async () => {
    renderRoute('/contact')
    // The message comes first: with nothing to go on, that is the problem.
    send()

    const box = screen.getByLabelText(/in your words/i)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/pick a service, add a sentence/i)
    expect(box).toHaveAttribute('aria-invalid', 'true')
    expect(box.getAttribute('aria-describedby')).toContain(alert.id)
    // The message lives in the same field group as the input it is about.
    expect(box.closest('.form-group')).toContainElement(alert)
    await waitFor(() => expect(document.activeElement).toBe(box))
  })

  it('then points at the name once there is a message', async () => {
    renderRoute('/contact')
    fireEvent.change(screen.getByLabelText(/in your words/i), { target: { value: 'An idea' } })
    send()

    const name = screen.getByLabelText('Name')
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/add your name/i)
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveAttribute('aria-describedby', alert.id)
    expect(name.closest('.form-group')).toContainElement(alert)
    await waitFor(() => expect(document.activeElement).toBe(name))
  })

  it('clears the message once the visitor starts fixing it', async () => {
    renderRoute('/contact')
    fireEvent.change(screen.getByLabelText(/in your words/i), { target: { value: 'An idea' } })
    send()
    await screen.findByRole('alert')
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } })
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid')
  })
})
