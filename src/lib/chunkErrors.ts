// Pages load as separate chunks with hashed names. After a redeploy, a tab
// opened on the old deployment can ask for a chunk that no longer exists, and
// the import() rejects. The fix is a fresh load of the page, which fetches the
// new deployment's HTML and chunks.

const KEY = 'chunk-reload-at'
const WINDOW_MS = 10_000

// Messages browsers use when a dynamic import (or Vite's preload) fails.
export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '')
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(message)
}

// Loads `href` (default: the current page) fresh, once. Returns false (and
// does nothing) if that was already tried in the last few seconds, so a chunk
// that's genuinely unreachable (offline, blocked) can't cause a reload loop.
export function reloadOnce(href?: string): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY))
    if (last && Date.now() - last < WINDOW_MS) return false
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    // Storage blocked: still reload, but only this once per page load.
    if ((window as { __chunkReloaded?: boolean }).__chunkReloaded) return false
    ;(window as { __chunkReloaded?: boolean }).__chunkReloaded = true
  }
  if (href) window.location.assign(href)
  else window.location.reload()
  return true
}
