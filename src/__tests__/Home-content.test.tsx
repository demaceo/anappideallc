import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { routes } from '../routes'

// Guards the brutalist Home redesign: the restructure into loud <Section>
// blocks + outline-word spans must not drop or alter any business copy, and
// the new GSAP/cursor effects must not throw when the full app mounts under
// happy-dom (see src/test-setup.ts stubs).
function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('Home — brutalist redesign', () => {
  it('mounts without throwing and preserves the core messaging', () => {
    renderRoute('/')

    // Tagline H1 — accessible name stays intact despite the <em> highlight.
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /got an app idea\? let's build it\./i,
      }),
    ).toBeInTheDocument()

    // Positioning subtitle preserved verbatim.
    expect(
      screen.getByText(/privacy built in, shipped end-to-end by one builder/i),
    ).toBeInTheDocument()

    // Section headings survive the outline-word <span> split (text unchanged).
    // Substring matchers: an outline-word <span> adjacent to punctuation makes
    // the accessible name insert a space (e.g. "builder ,"), so match on the
    // punctuation-free portion — the visible text itself is unchanged.
    expect(screen.getByRole('heading', { name: /what ships here/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /what i build/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /why a builder/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /not just a bot/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /start a conversation/i })).toBeInTheDocument()
  })

  it('keeps the booking CTA wired to Calendly with analytics + rel intact', () => {
    renderRoute('/')
    const book = screen.getByRole('link', { name: /book a time/i })
    expect(book).toHaveAttribute('href', 'https://calendly.com/demaceo-milehighinterface/30min')
    expect(book).toHaveAttribute('data-analytics', 'book-consultation')
    expect(book).toHaveAttribute('target', '_blank')
    expect(book).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
