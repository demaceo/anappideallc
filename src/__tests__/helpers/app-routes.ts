import { routes } from '../../routes'
import { resolveAllLazyRoutes } from '../../lib/resolveLazyRoutes'

// The app's route tree with every page loaded (each lazy route once), for
// tests that render routes and navigate between pages synchronously. Only
// those test files import this, so other suites don't load the whole app.
// A copy: the module-level `routes` stays lazy (see lazy-routes.test.ts).
export const appRoutes = await resolveAllLazyRoutes(routes)
