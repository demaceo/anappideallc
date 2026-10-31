import { createBrowserRouter } from 'react-router'
import { routes } from './routes'

// A factory, not a module-level router: main.tsx resolves the current page's
// lazy route first (resolveLazyRoutes), then creates the router.
export function createAppRouter() {
  return createBrowserRouter(routes)
}
