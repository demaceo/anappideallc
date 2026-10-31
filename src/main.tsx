import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { createAppRouter } from './router'
import { routes } from './routes'
import { resolveLazyRoutes } from './lib/resolveLazyRoutes'
import './styles/globals.css'

async function start() {
  try {
    // Load this page's chunk before the first render (see resolveLazyRoutes).
    await resolveLazyRoutes(routes, window.location.pathname)
  } catch {
    // A failed chunk load shouldn't leave the page without its router; the
    // router retries the lazy route itself on render.
  }
  hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
      <RouterProvider router={createAppRouter()} />
    </StrictMode>,
  )
}

void start()
