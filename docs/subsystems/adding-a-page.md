---
title: Adding a page
type: subsystem
created: 2026-11-11
updated: 2026-11-25
sources:
  - code: src/routes.tsx
  - code: src/lib/seo.ts
  - code: src/components/FooterNav/FooterNav.tsx
  - code: scripts/prerender.mjs
  - code: src/data/case-studies.ts
  - code: src/data/story.ts
  - code: src/motion/scenes/geometry.ts
verified_at: 502f1ba
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

## Adding or removing a case study

A `/work/<slug>` page comes from an entry in `caseStudies`
(`src/data/case-studies.ts`); `ProjectDetail` renders it. The slug is also a key
in several slug-keyed maps that are not derived from that array:
`PRERENDER_PATHS` and `META` (above), `PROJECT_COLORS`
(`src/data/project-colors.ts`), and the logo/label maps in `src/pages/Work.tsx`
and `src/pages/ProjectDetail.tsx`.

> ⚠️ If the slug is one of the mission apps in `STORY_PROOF` (`src/data/story.ts`),
> removing the case study fails `story.test.tsx` ("points every proof app at a
> real case study"). Taking an app out of the proof also changes the count the
> story copy states (the `bridge` line), and the Work thread scene draws one node
> per mission app: `THREAD_NODES` (`src/motion/scenes/geometry.ts`) and the
> glyphs in `src/components/scenes/ThreadScene.tsx` must keep the same length and
> order as `STORY_PROOF`. The last node is the accent tile.
