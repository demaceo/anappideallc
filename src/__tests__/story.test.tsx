import { render, screen, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { routes, PRERENDER_PATHS } from '../routes'
import { STORY, STORY_PROOF, STORY_CLOSING } from '../data/story'
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
      ...STORY.flatMap((c) => [c.title, c.heading, ...c.body]),
      ...STORY_PROOF.map((p) => p.line),
      STORY_CLOSING,
    ]
    for (const text of copy) expect(text).not.toMatch(/—/)
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

      const next = STORY[i + 1]
      const nav = screen.queryByRole('navigation', { name: 'Founder story' })
      if (next) {
        expect(nav).not.toBeNull()
        expect(within(nav as HTMLElement).getByRole('link')).toHaveAttribute('href', next.path)
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
