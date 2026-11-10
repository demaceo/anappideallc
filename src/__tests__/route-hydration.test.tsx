import { StrictMode, act } from 'react'
import { hydrateRoot, type Root } from 'react-dom/client'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { render as renderOnServer } from '../entry-server'
import { routes } from '../routes'
import { resolveLazyRoutes } from '../lib/resolveLazyRoutes'

// The prerender (scripts/prerender.mjs) renders each page at its canonical URL,
// `/contact`. A browser can load the same file at `/contact/` (any static host
// that serves directories, `vite preview`, a link or crawler that adds the
// slash). Hydration must produce the same tree either way, or React throws
// error #418 and discards the server HTML.
//
// This mirrors src/main.tsx: server HTML from the real entry-server `render`,
// then hydrateRoot + StrictMode over a router whose current page is loaded.

beforeAll(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

// One mounted tree at a time; a test that hydrates twice unmounts in between.
let mounted: { root: Root; container: HTMLElement } | null = null

function unmount() {
  if (!mounted) return
  const { root, container } = mounted
  act(() => root.unmount())
  container.remove()
  mounted = null
}

afterEach(unmount)

// Hydrates the HTML prerendered for `serverUrl` while the browser is at
// `clientUrl`, and returns every error React recovered from (a mismatch is one).
async function hydrateAt(serverUrl: string, clientUrl: string) {
  const container = document.createElement('div')
  container.innerHTML = await renderOnServer(serverUrl)
  document.body.appendChild(container)

  const router = createMemoryRouter(await resolveLazyRoutes(routes, clientUrl), {
    initialEntries: [clientUrl],
  })
  const errors: Error[] = []
  let root!: Root
  await act(async () => {
    root = hydrateRoot(
      container,
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
      { onRecoverableError: (error) => errors.push(error as Error) },
    )
  })
  mounted = { root, container }
  return errors.map((e) => e.message)
}

describe('prerendered HTML hydrates without a mismatch', () => {
  it('/contact at its canonical URL', async () => {
    expect(await hydrateAt('/contact', '/contact')).toEqual([])
  })

  // The shell hides the floating booking button on /contact. It used to compare
  // the pathname with `===`, so `/contact/` rendered the button on the client
  // while the server HTML had none.
  it('/contact when the browser URL has a trailing slash', async () => {
    expect(await hydrateAt('/contact', '/contact/')).toEqual([])
  })

  // Control: a page with no per-route shell logic. If this fails, the harness
  // (not the page) is what's broken.
  it('/about, with and without a trailing slash', async () => {
    expect(await hydrateAt('/about', '/about')).toEqual([])
    unmount()
    expect(await hydrateAt('/about', '/about/')).toEqual([])
  })
})
