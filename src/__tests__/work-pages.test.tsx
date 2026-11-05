import { render, screen, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { appRoutes as routes } from './helpers/app-routes'
import { caseStudies } from '../data/case-studies'
import { PROJECT_COLORS } from '../data/project-colors'
import { contrast, fillForSmallText } from '../lib/color'

function renderRoute(path: string) {
  return render(
    <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />,
  )
}

describe('/work — project colour tiles', () => {
  it('renders one tile per case study, each in its own brand colour, readable as small text', () => {
    const { container } = renderRoute('/work')
    const tiles = [...container.querySelectorAll<HTMLAnchorElement>('a.work-tile')]
    expect(tiles).toHaveLength(caseStudies.length)
    for (const tile of tiles) {
      const slug = tile.getAttribute('href')!.replace('/work/', '')
      // The brand colour, nudged only as far as the title needs for 4.5:1.
      const { fill, ink } = fillForSmallText(PROJECT_COLORS[slug])
      expect(tile.style.getPropertyValue('--tile-fill')).toBe(fill)
      expect(tile.style.getPropertyValue('--tile-ink')).toBe(ink)
      expect(contrast(fill, ink)).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps each project title as a heading inside its tile', () => {
    renderRoute('/work')
    for (const c of caseStudies) {
      expect(screen.getByRole('heading', { level: 3, name: c.title })).toBeInTheDocument()
    }
  })
})

describe('case study — section rhythm', () => {
  const withSteps = caseStudies.find((c) => c.steps?.length)!
  const withoutSteps = caseStudies.find((c) => !c.steps?.length)

  it('puts the challenge on an ink band and outcomes on the project colour', () => {
    const { container } = renderRoute(`/work/${withSteps.slug}`)
    const challenge = screen.getByRole('heading', { name: 'The challenge' }).closest('section')!
    expect(challenge).toHaveClass('cs-band--ink')
    const problem = withSteps.sections.find((s) => s.title === 'Problem')!
    expect(within(challenge).getByText(problem.content)).toBeInTheDocument()

    const outcomes = screen.getByRole('heading', { name: 'Outcomes' }).closest('section')!
    expect(outcomes).toHaveClass('cs-band--project')
    expect(within(outcomes).getAllByRole('listitem')).toHaveLength(withSteps.outcomes.length)

    const main = container.querySelector('main')!
    expect(main.style.getPropertyValue('--project-swatch-ink')).toMatch(/^#/)
  })

  it('shows numbered build steps when a study has them', () => {
    renderRoute(`/work/${withSteps.slug}`)
    const section = screen.getByRole('heading', { name: 'How I built it' }).closest('section')!
    const items = within(section).getAllByRole('listitem')
    expect(items.map((li) => li.textContent)).toEqual(
      withSteps.steps!.map((s, i) => `${String(i + 1).padStart(2, '0')}${s}`),
    )
  })

  it('falls back to the paragraph alone when a study has no steps', () => {
    if (!withoutSteps) return
    renderRoute(`/work/${withoutSteps.slug}`)
    const section = screen.getByRole('heading', { name: 'How I built it' }).closest('section')!
    expect(within(section).queryByRole('list')).toBeNull()
    expect(section.querySelector('.project-section-body')).not.toBeNull()
  })

  it('keeps the stack readable to screen readers even though the ticker is decorative', () => {
    renderRoute(`/work/${withSteps.slug}`)
    const section = screen.getByRole('heading', { name: 'Tech stack' }).closest('section')!
    expect(within(section).getAllByRole('listitem').map((li) => li.textContent)).toEqual(withSteps.stack)
  })
})
