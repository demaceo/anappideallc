import { createBrowserRouter, type RouteObject } from 'react-router'

// main.tsx passes a route tree with the current page's lazy route already
// loaded (resolveLazyRoutes), so the router can hydrate without a fallback.
export function createAppRouter(routes: RouteObject[]) {
  return createBrowserRouter(routes)
}
