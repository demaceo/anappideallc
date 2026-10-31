import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter, type RouteObject, type NonIndexRouteObject } from 'react-router'
import { routes, type PageHandle } from '../routes'
import { resolveLazyRoutes, resolveAllLazyRoutes } from '../lib/resolveLazyRoutes'
import { isChunkLoadError, reloadOnce } from '../lib/chunkErrors'

const root = join(__dirname, '..', '..')
const children = (tree: RouteObject[]) => tree[0].children ?? []
// The root layout route with its children swapped (it's a non-index route).
const withChildren = (kids: RouteObject[]): RouteObject[] => [{ ...(routes[0] as NonIndexRouteObject), children: kids }]

describe('lazy page routes', () => {
  it('loads every page except Home on demand', () => {
    const eager = children(routes).filter((r) => !r.lazy).map((r) => (r.index ? '(index)' : r.path))
    expect(eager).toEqual(['(index)'])
  })

  // prerender.mjs preloads each page's chunk by handle.module (its key in
  // Vite's manifest), so it must name a real source file.
  it("names each lazy route's real source file in handle.module", () => {
    for (const route of children(routes).filter((r) => r.lazy)) {
      const { module } = route.handle as PageHandle
      expect(existsSync(join(root, module)), module).toBe(true)
    }
  })

  it('resolveLazyRoutes loads only the matched page, into a copy', async () => {
    const resolved = await resolveLazyRoutes(routes, '/legal/pinpoint/privacy')
    const loaded = children(resolved).filter((r) => r.Component && !r.lazy && !r.index).map((r) => r.path)
    expect(loaded).toEqual(['legal/pinpoint/privacy'])
    // The shared tree is untouched, so other routers built from it stay lazy.
    expect(children(routes).find((r) => r.path === 'legal/pinpoint/privacy')?.lazy).toBeTypeOf('function')
  })

  it('resolveAllLazyRoutes loads each lazy route exactly once', async () => {
    const calls = new Map<string, number>()
    const spied = withChildren(
      children(routes).map((r) =>
        r.lazy
          ? { ...r, lazy: async () => (calls.set(r.path!, (calls.get(r.path!) ?? 0) + 1), (r.lazy as () => Promise<object>)()) }
          : r,
      ) as RouteObject[],
    )
    const resolved = await resolveAllLazyRoutes(spied)
    expect([...calls.values()].every((n) => n === 1)).toBe(true)
    expect(calls.size).toBe(children(routes).length - 1)
    expect(children(resolved).every((r) => !r.lazy && r.Component)).toBe(true)
  })
})

describe('root error boundary', () => {
  const realLocation = window.location
  afterEach(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: realLocation })
    sessionStorage.clear()
  })

  it('shows "Page not found" for an unknown URL', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/no-such-page'] })
    render(<RouterProvider router={router} />)
    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })

  it('loads the clicked page fresh, once, when its chunk fails (stale deployment)', async () => {
    const assign = vi.fn()
    Object.defineProperty(window, 'location', { configurable: true, value: { ...realLocation, assign } })
    const failing = withChildren([
      ...children(routes).filter((r) => r.index),
      { path: 'about', lazy: () => Promise.reject(new TypeError('Failed to fetch dynamically imported module: /assets/About-old.js')) },
    ])
    const router = createMemoryRouter(failing, { initialEntries: ['/about'] })
    render(<RouterProvider router={router} />)
    expect(await screen.findByRole('heading', { level: 1, name: /didn.t load/ })).toBeInTheDocument()
    expect(assign).toHaveBeenCalledTimes(1)
    expect(assign).toHaveBeenCalledWith('/about')
  })

  it('never reloads twice in a row (no loop when a chunk is truly unreachable)', () => {
    const reload = vi.fn()
    Object.defineProperty(window, 'location', { configurable: true, value: { ...realLocation, reload } })
    expect(reloadOnce()).toBe(true)
    expect(reloadOnce()).toBe(false)
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('recognizes the browsers’ chunk-load messages, not ordinary fetch errors', () => {
    expect(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: x.js'))).toBe(true) // Chrome
    expect(isChunkLoadError(new TypeError('Importing a module script failed.'))).toBe(true) // Safari
    expect(isChunkLoadError(new TypeError('error loading dynamically imported module'))).toBe(true) // Firefox
    expect(isChunkLoadError(new TypeError('Failed to fetch'))).toBe(false) // e.g. the contact form's API call
  })
})
