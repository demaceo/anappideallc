import '@testing-library/jest-dom'

// happy-dom doesn't reliably implement these browser APIs. The brutalist
// scroll/cursor effects feature-detect and bail without them, but the full-app
// render tests mount the app shell (useScrollScenes) and CustomCursor, so stub them
// to keep those renders from throwing and keep pointer queries deterministic
// (matches: false → cursor disabled).
//
// Reduced motion is ON by default in tests. With motion allowed, every page
// that mounts an animated SVG scene lazy-loads GSAP, and GSAP's CSSPlugin then
// crashes inside happy-dom (`transform.baseVal.consolidate is not a function`)
// whenever a timer fires after the assertions finish. The count of those
// uncaught errors varied run to run with timing, and vitest fails a run on any.
// A visitor who prefers reduced motion never loads GSAP either, so this is the
// realistic default; tests that exercise motion set their own matchMedia (see
// motion.test.tsx).
const REDUCED_MOTION = /prefers-reduced-motion:\s*reduce/
window.matchMedia = ((query: string) => ({
  matches: REDUCED_MOTION.test(query),
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia

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
