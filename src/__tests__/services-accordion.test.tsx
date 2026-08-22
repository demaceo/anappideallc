import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { routes } from '../routes'
import { services } from '../data/services'

function renderServices() {
  return render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/services'] })}
    />,
  )
}

/**
 * Regression — 2026-08 audit P1 (closed accordion panels kept focusable links).
 *
 * `grid-template-rows: 0fr` + `overflow: hidden` collapses a panel VISUALLY
 * only. Measured on /services before the fix: all five `.svc-cta` links
 * reported height 48px, carried neither `hidden` nor `inert`, and all five sat
 * in the tab order — so the real sequence was
 *   trigger 01 -> [invisible] "Start here" -> trigger 02 -> [invisible] ...
 * and keyboard focus disappeared off-screen once per closed service.
 * WCAG 2.4.3 (Focus Order) and 2.4.7 (Focus Visible).
 *
 * `inert` removes closed panels from the tab order and the accessibility tree
 * while their content stays in the DOM for crawlers — which is what the `0fr`
 * approach was reaching for.
 */
describe('Services accordion — closed panels are inert (audit P1)', () => {
  it('marks every closed panel inert and leaves the open one interactive', () => {
    const { container } = renderServices()
    const panels = [...container.querySelectorAll('.svc-panel')]
    expect(panels).toHaveLength(services.length)

    const open = panels.filter((p) => !p.hasAttribute('inert'))
    // First item is open on load so the prerendered page shows real content.
    expect(open).toHaveLength(1)
    expect(panels[0].hasAttribute('inert')).toBe(false)
    panels.slice(1).forEach((p) => expect(p.hasAttribute('inert')).toBe(true))
  })

  it('keeps closed-panel content in the DOM for crawlers', () => {
    renderServices()
    // A deliverable from a CLOSED service must still be present in the markup.
    const lastService = services[services.length - 1]
    expect(screen.getByText(lastService.deliverables[0])).toBeInTheDocument()
  })

  it('exposes accordion state to assistive tech on every trigger', () => {
    const { container } = renderServices()
    const triggers = [...container.querySelectorAll('.svc-trigger')]
    expect(triggers).toHaveLength(services.length)
    triggers.forEach((t, i) => {
      expect(t).toHaveAttribute('aria-expanded', String(i === 0))
      expect(t).toHaveAttribute('aria-controls', `svc-panel-${services[i].id}`)
    })
  })
})
