import { render, screen, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { PRERENDER_PATHS } from '../routes'
import { appRoutes as routes } from './helpers/app-routes'
import { STORY, STORY_PROOF, STORY_CLOSING, EVIDENCE } from '../data/story'
import { caseStudies } from '../data/case-studies'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

const pad = (n: number) => String(n).padStart(2, '0')

// The founder story is told one chapter per page. These guard the thread: a
// chapter pointing at a missing route, a broken "next" link, or a proof app
// that no longer exists would silently break the story mid-read.
describe('founder story data', () => {
  it('gives every chapter a unique id and a unique, prerendered page', () => {
    expect(new Set(STORY.map((c) => c.id)).size).toBe(STORY.length)
    expect(new Set(STORY.map((c) => c.path)).size).toBe(STORY.length)
    for (const c of STORY) expect(PRERENDER_PATHS).toContain(c.path)
  })

  it('points every proof app at a real case study', () => {
    const slugs = new Set(caseStudies.map((c) => c.slug))
    for (const p of STORY_PROOF) expect(slugs).toContain(p.slug)
  })

  it('follows the brand voice: no em-dashes in story copy', () => {
    const copy = [
      ...STORY.flatMap((c) => [c.title, c.heading, ...c.body, ...(c.personal ?? []), c.bridge ?? '']),
      ...STORY_PROOF.map((p) => p.line),
      ...Object.values(EVIDENCE).map((e) => e.label),
      STORY_CLOSING,
    ]
    for (const text of copy) expect(text).not.toMatch(/—/)
  })

  it('gives every chapter but the last a bridge into the next', () => {
    STORY.slice(0, -1).forEach((c) => expect(c.bridge?.trim()).toBeTruthy())
    expect(STORY[STORY.length - 1].bridge).toBeUndefined()
  })

  // Fact-based copy is only as good as its citations: every figure must link
  // to a real source and say when it was published.
  it('cites a source URL and date for every piece of evidence', () => {
    for (const e of Object.values(EVIDENCE)) {
      expect(e.url).toMatch(/^https:\/\//)
      expect(e.source.trim()).toBeTruthy()
      expect(e.date).toMatch(/^[A-Z][a-z]{2} \d{4}$/)
      expect(Number.isFinite(e.value)).toBe(true)
    }
    const used = new Set(STORY.flatMap((c) => c.evidence ?? []))
    for (const id of used) expect(EVIDENCE[id]).toBeTruthy()
  })
})

describe('founder story on each page', () => {
  STORY.forEach((chapter, i) => {
    it(`renders chapter ${pad(i + 1)} on ${chapter.path} and links onward`, () => {
      renderRoute(chapter.path)

      const section = screen
        .getByRole('heading', { level: 2, name: chapter.heading })
        .closest('section') as HTMLElement
      expect(section).toBeTruthy()
      expect(
        within(section).getByText(`Chapter ${pad(i + 1)} / ${pad(STORY.length)}`),
      ).toBeInTheDocument()

      // Evidence figures are real numbers in the markup, not blank until JS.
      for (const id of chapter.evidence ?? []) {
        const e = EVIDENCE[id]
        expect(
          within(section).getByText(`${e.value.toFixed(e.decimals ?? 0)}${e.suffix}`),
        ).toBeInTheDocument()
        const sources = within(section).getAllByRole('link', { name: new RegExp(e.date) })
        expect(sources.some((l) => l.getAttribute('href') === e.url)).toBe(true)
      }

      const next = STORY[i + 1]
      const nav = screen.queryByRole('navigation', { name: 'Founder story' })
      if (next) {
        expect(nav).not.toBeNull()
        const link = within(nav as HTMLElement).getByRole('link')
        expect(link).toHaveAttribute('href', next.path)
        expect(link).toHaveTextContent(chapter.bridge as string)
      } else {
        expect(nav).toBeNull()
      }
    })
  })

  it('closes the story on About and Contact', () => {
    for (const path of ['/about', '/contact']) {
      const { unmount } = renderRoute(path)
      expect(screen.getByText(STORY_CLOSING)).toBeInTheDocument()
      unmount()
    }
  })

  it('lists the mission apps first on Work, in proof order', () => {
    const { container } = renderRoute('/work')
    const cards = [...container.querySelectorAll('a.feature-item--linked')]
    const leading = cards.slice(0, STORY_PROOF.length).map((a) => a.getAttribute('href'))
    expect(leading).toEqual(STORY_PROOF.map((p) => `/work/${p.slug}`))
  })
})
