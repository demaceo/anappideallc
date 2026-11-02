import { render, screen, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { appRoutes as routes } from './helpers/app-routes'
import { services } from '../data/services'

function renderRoute(path: string) {
  return render(
    <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />,
  )
}

describe('Service prices', () => {
  it('gives every service a public price', () => {
    for (const s of services) expect(s.price?.label, s.id).toBeTruthy()
  })

  it('shows each price in its Services accordion row', () => {
    renderRoute('/services')
    for (const s of services) {
      const trigger = screen.getByRole('button', { name: new RegExp(s.title.replace(/[&]/g, '\\&')) })
      expect(within(trigger).getByText(s.price!.label)).toBeInTheDocument()
    }
  })

  it('lists the fix-my-existing-site offer with its rush terms on Services and Home', () => {
    const fixes = services.find((s) => s.id === 'site-fixes')!
    expect(fixes.price!.note).toMatch(/2-hour minimum.*\$138\/hour/)
    for (const path of ['/', '/services']) {
      const { unmount } = renderRoute(path)
      expect(screen.getAllByText(fixes.title).length).toBeGreaterThan(0)
      unmount()
    }
  })

  it('mentions the teaching background in the Own It offer', () => {
    const ownIt = services.find((s) => s.id === 'own-it')!
    expect(ownIt.description).toMatch(/several years of experience teaching software engineering/)
  })
})
