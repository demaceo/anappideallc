---
title: Adding a page
type: subsystem
created: 2026-11-11
updated: 2026-11-11
sources:
  - code: src/routes.tsx
  - code: src/lib/seo.ts
  - code: src/components/FooterNav/FooterNav.tsx
  - code: scripts/prerender.mjs
verified_at: 4c938c4
---

# Adding a page

A new route needs four edits, all for the same path:

1. `PAGES` in `src/routes.tsx`: path → page module (lazy-loaded).
2. `PRERENDER_PATHS` in `src/routes.tsx`: the list the build prerenders and puts in the sitemap.
3. `META` in `src/lib/seo.ts`: title and description (`LegalPage` and `RouteHead` read it).
4. A link, usually in `FOOTER_LINKS` (`src/components/FooterNav/FooterNav.tsx`).

> ⚠️ Adding a route to `PAGES` alone is not enough. Unless it is also in
> `PRERENDER_PATHS`, the build silently skips it: there is no static HTML and no
> sitemap entry. `scripts/prerender.mjs` and `scripts/sitemap.mjs` read only that
> list.

> ⚠️ `src/__tests__/site-nav.test.tsx` asserts the exact footer link list.
> Update its `EXPECTED` array when you add a footer link.

> ⚠️ `npm run build` rewrites `public/sitemap.xml`, including today's `lastmod`
> on every URL. That file is committed, so expect it in the diff.
