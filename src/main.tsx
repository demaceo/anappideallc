import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { createAppRouter } from './router'
import { routes } from './routes'
import { resolveLazyRoutes } from './lib/resolveLazyRoutes'
import { reloadOnce } from './lib/chunkErrors'
import './styles/globals.css'

// A page chunk that fails during client navigation is handled by the root
// error boundary (RouteError), which knows the URL being navigated to and
// loads it fresh. Vite's own 'vite:preloadError' is deliberately left alone:
// it fires before the router has moved, so reloading there would drop the
// click and reload the page the visitor was leaving.

async function start() {
  let pageRoutes
  try {
    // Load this page's chunk first, so hydration matches the prerendered HTML.
    pageRoutes = await resolveLazyRoutes(routes, window.location.pathname)
  } catch {
    // The page's chunk didn't load (stale deployment, offline, blocked).
    // Reload once to get the current deployment; if that was already tried,
    // leave the prerendered page as it is: it's complete and readable, and
    // its links work as ordinary page loads. Hydrating without the page's
    // component would replace that HTML with an empty or error screen.
    reloadOnce()
    return
  }
  hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
      <RouterProvider router={createAppRouter(pageRoutes)} />
    </StrictMode>,
  )
}

void start()
