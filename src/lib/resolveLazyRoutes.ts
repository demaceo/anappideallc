import { matchRoutes, type RouteObject } from 'react-router'

type Lazy = () => Promise<Partial<RouteObject>>

// Returns a copy of `routes` in which the lazy routes accepted by `select` are
// loaded: their code is merged onto a new route object and `lazy` cleared.
// Nothing shared is mutated, so the module-level `routes` stays lazy for any
// other router built from it (prerender, tests, a second client router).
async function resolve(routes: RouteObject[], select: (route: RouteObject) => boolean): Promise<RouteObject[]> {
  return Promise.all(
    routes.map(async (route) => {
      const children = route.children && (await resolve(route.children, select))
      const loaded = typeof route.lazy === 'function' && select(route) ? await (route.lazy as Lazy)() : null
      if (!loaded && children === route.children) return route
      const next = { ...route, ...(loaded ? { ...loaded, lazy: undefined } : {}) }
      if (children) next.children = children
      return next as RouteObject
    }),
  )
}

// Loads the code for the lazy routes matching `pathname` (React Router's
// documented pattern for lazy routes with server-rendered HTML). main.tsx
// calls it before the first render, so the router starts with the current
// page's component in hand and hydrates the prerendered HTML as-is.
export function resolveLazyRoutes(routes: RouteObject[], pathname: string): Promise<RouteObject[]> {
  const matched = new Set((matchRoutes(routes, pathname) ?? []).map((m) => m.route))
  return resolve(routes, (route) => matched.has(route))
}

// Loads every lazy route once (tests that render and navigate across pages).
export function resolveAllLazyRoutes(routes: RouteObject[]): Promise<RouteObject[]> {
  return resolve(routes, () => true)
}
