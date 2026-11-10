---
title: Prerender and hydration
type: subsystem
created: 2026-11-10
updated: 2026-11-10
sources:
  - code: scripts/prerender.mjs
  - code: src/entry-server.tsx
  - code: src/main.tsx
  - code: vercel.json
  - code: src/components/BookingFAB/BookingFAB.tsx
  - code: src/__tests__/route-hydration.test.tsx
verified_at: 1b263e1
---

# Prerender and hydration

Every route in `PRERENDER_PATHS` (`src/routes.tsx`) is rendered to static HTML at
build time (`scripts/prerender.mjs`, which calls `render(url)` from
`src/entry-server.tsx`), written to `dist/<route>/index.html`. In the browser,
`src/main.tsx` loads the current page's chunk and calls `hydrateRoot` over that
HTML. If the client's first render differs from the server's, React throws
error #418 ("Hydration failed because the server rendered HTML didn't match the
client") and replaces the server HTML with a client render.

## The URL the server saw is not always the URL the browser has

The prerender renders each page at its canonical URL, `/contact`. Production
(`vercel.json`: `cleanUrls`, `trailingSlash: false`) redirects `/contact/` to
`/contact`, but other hosts, `vite preview` and any link or crawler that adds the
slash serve the same file at `/contact/`. React Router keeps that slash in
`useLocation().pathname`.

> ⚠️ Anything rendered during hydration that branches on `pathname` must give the
> same answer for `/x` and `/x/`. `BookingFAB` used to hide itself with
> `pathname === '/contact'`: the server HTML had no button, a browser at
> `/contact/` rendered one, and `/contact/` threw #418 while `/`, `/about/` and
> `/services/` were clean. Use `matchPath('/contact', pathname)`, which follows
> the router's own matching, not `===` (`src/components/BookingFAB/BookingFAB.tsx:23`).

The mismatch was in the app shell (`src/App.tsx`), not in `src/pages/Contact.tsx`.
When a page throws #418, check what the shell renders for that path before
bisecting the page's own components.

## How to check

- `src/__tests__/route-hydration.test.tsx` renders the real prerender output for a
  URL, then hydrates it (`StrictMode`, a memory router at the browser URL) and
  fails on any recoverable error. Dev React names the offending element in the
  message. Add a case there when a new route gets per-route shell logic.
- In a built site: `pnpm build`, `pnpm exec vite preview`, then load the page
  **with the trailing slash** and listen for `pageerror` in Playwright. Without the
  slash `vite preview` serves the home page's HTML instead of the route's.

> ⚠️ `vite preview` and Vercel disagree about slashes, so a clean `/x/` on
> preview says nothing about `/x` in production and the reverse. Check both:
> to see the production form locally, serve `dist/` with a server that maps `/x` to
> `dist/x/index.html`.
