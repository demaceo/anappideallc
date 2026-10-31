import { matchRoutes, type RouteObject } from 'react-router'

// Loads the code for every lazy route matching `pathname` and writes it onto
// the route objects (React Router's documented pattern for lazy routes with
// server-rendered HTML). Called before the first client render, so the router
// starts with the current page's component in hand: the prerendered HTML stays
// on screen instead of flashing to an empty fallback while the chunk loads.
// Tests call it too, so a lazy route renders synchronously.
export async function resolveLazyRoutes(routes: RouteObject[], pathname: string): Promise<void> {
  const lazy = (matchRoutes(routes, pathname) ?? []).filter((m) => typeof m.route.lazy === 'function')
  await Promise.all(
    lazy.map(async ({ route }) => {
      const load = route.lazy as () => Promise<Partial<RouteObject>>
      Object.assign(route, { ...(await load()), lazy: undefined })
    }),
  )
}
