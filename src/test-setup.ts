import '@testing-library/jest-dom'

// happy-dom doesn't reliably implement these browser APIs. The brutalist
// scroll/cursor effects feature-detect and bail without them, but the full-app
// render tests mount the app shell (useScrollScenes) and CustomCursor, so stub them
// to keep those renders from throwing and keep reduced-motion / pointer queries
// deterministic (matches: false → motion off, cursor disabled).
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.IntersectionObserver ??= NoopObserver as unknown as typeof IntersectionObserver
globalThis.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver

// Pages load on demand in the app (route `lazy` in src/routes.tsx). Load them
// all once up front so route-rendering tests can render and navigate
// synchronously; the lazy behaviour itself is covered in lazy-routes.test.ts.
import { routes, PRERENDER_PATHS } from './routes'
import { resolveLazyRoutes } from './lib/resolveLazyRoutes'
await Promise.all(PRERENDER_PATHS.map((path) => resolveLazyRoutes(routes, path)))
