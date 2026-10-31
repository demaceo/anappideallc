import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect, vi } from 'vitest'
import type { RouteObject } from 'react-router'
import type { PageHandle } from '../routes'

const root = join(__dirname, '..', '..')

// A fresh, unresolved copy of the route tree (test-setup resolves the shared one).
async function freshRoutes(): Promise<RouteObject[]> {
  vi.resetModules()
  return (await import('../routes')).routes
}

function lazyChildren(routes: RouteObject[]) {
  return (routes[0].children ?? []).filter((r) => typeof r.lazy === 'function')
}

describe('lazy page routes', () => {
  it('loads every page except Home on demand', async () => {
    const routes = await freshRoutes()
    const children = routes[0].children ?? []
    const eager = children.filter((r) => !r.lazy).map((r) => (r.index ? '(index)' : r.path))
    expect(eager).toEqual(['(index)'])
    expect(lazyChildren(routes).length).toBe(children.length - 1)
  })

  // The prerender step preloads a page's chunk by its handle.module, and Vite
  // needs the import() path written out literally, so the two must agree.
  it("points each route's handle.module at the module its lazy() actually loads", async () => {
    const routes = await freshRoutes()
    for (const route of lazyChildren(routes)) {
      const { module } = route.handle as PageHandle
      expect(existsSync(join(root, module)), module).toBe(true)
      const loaded = await (route.lazy as () => Promise<{ Component: unknown }>)()
      const direct = (await import(/* @vite-ignore */ join(root, module))).default
      expect(loaded.Component, module).toBe(direct)
    }
  })

  it('resolveLazyRoutes loads only the matched page, onto the route itself', async () => {
    const routes = await freshRoutes()
    const { resolveLazyRoutes } = await import('../lib/resolveLazyRoutes')
    await resolveLazyRoutes(routes, '/legal/pinpoint/privacy')
    const children = routes[0].children ?? []
    const resolved = children.filter((r) => r.Component && !r.lazy && !r.index).map((r) => r.path)
    expect(resolved).toEqual(['legal/pinpoint/privacy'])
  })
})
