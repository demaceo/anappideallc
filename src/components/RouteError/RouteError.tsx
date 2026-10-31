import { useEffect } from 'react'
import { isRouteErrorResponse, useLocation, useRouteError } from 'react-router'
import { isChunkLoadError, reloadOnce } from '../../lib/chunkErrors'
import { SITE } from '../../data/site'

// Root error boundary. Most likely cause since pages became separate chunks:
// a tab from an older deployment asking for a chunk that no longer exists, so
// that case loads the requested page fresh, once, from the new deployment. Links are plain <a>
// (full page loads) because the router itself is what failed.
export function RouteError() {
  const error = useRouteError()
  // The location being rendered: for a failed client navigation, that's the
  // page the visitor clicked, which may not be in the address bar yet.
  const { pathname, search, hash } = useLocation()
  const target = `${pathname}${search}${hash}`
  const staleChunk = isChunkLoadError(error)
  const notFound = isRouteErrorResponse(error) && error.status === 404

  useEffect(() => {
    if (staleChunk) reloadOnce(target)
  }, [staleChunk, target])

  return (
    <main className="container route-error" id="main-content" tabIndex={-1}>
      <h1>{notFound ? 'Page not found' : 'This page didn’t load'}</h1>
      <p className="route-error-body">
        {notFound
          ? 'That address doesn’t match a page on this site.'
          : staleChunk
            ? 'The site was just updated, so this page needs a fresh load.'
            : 'Something went wrong on our end. A fresh load usually fixes it.'}
      </p>
      <p className="route-error-actions">
        {!notFound && (
          <button type="button" className="hero-cta" onClick={() => window.location.assign(target)}>
            Reload the page
          </button>
        )}
        <a className="story-next-link" href="/">Back to home</a>
      </p>
      <p className="route-error-body">
        Still stuck? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </main>
  )
}
