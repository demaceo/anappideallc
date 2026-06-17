# An App Idea LLC

The marketing site for **An App Idea LLC** — a Denver dev studio building
AI-native, privacy-first mobile apps and web products. _Got an app idea? Let's
build it._

🔗 **Live:** [www.anappidea.llc](https://www.anappidea.llc)

A React + TypeScript single-page app that is **prerendered to static HTML at
build time** (one file per route) for fast loads and full SEO, with a single
Vercel serverless function backing the contact form.

## Tech stack

- **React 19** + **TypeScript**, with the [React Compiler](https://react.dev/learn/react-compiler) enabled
- **Vite 8** (Rolldown) for dev/build
- **React Router 7** (data router) for client-side routing
- **Vitest** + **happy-dom** + Testing Library for tests
- **ESLint** (typescript-eslint) for linting
- **Resend** for transactional email (contact form), via a **Vercel** serverless function
- **Plausible** for privacy-friendly analytics
- Deployed on **Vercel**; package management with **pnpm**

## Getting started

```bash
pnpm install
pnpm dev        # Vite dev server with HMR
```

Other scripts:

```bash
pnpm build      # tsc -b → vite build → prerender every route → generate sitemap
pnpm preview    # serve the production build locally
pnpm test       # run the Vitest suite once
pnpm test:watch # watch mode
pnpm lint       # eslint .
```

## How the build works

`pnpm build` runs four steps in order:

1. `tsc -b` — typecheck the project references.
2. `vite build` — bundle the SPA (framework code is split into a cached
   `react-vendor` chunk).
3. `node scripts/prerender.mjs` — render **each route in `PRERENDER_PATHS`**
   (`src/routes.tsx`) to its own static `index.html`, with route-specific
   `<title>`, meta description, and JSON-LD baked in.
4. `node scripts/sitemap.mjs` — emit `dist/sitemap.xml` and `dist/robots.txt`.

Because every route is prerendered, adding a page means wiring it up in
`src/routes.tsx` (both the router and `PRERENDER_PATHS`) **and** adding its
metadata in `src/lib/seo.ts`.

## Project structure

```
src/
  pages/            # One component per route
    Home, About, Work, Services, Process, WhyNotAI, Support, Contact,
    ProjectDetail
    legal/          # Per-app Privacy Policy + Terms of Service pages
  components/        # SiteNav, PageHeader, SEO (RouteHead), LegalPage,
                     # ConsultCTA, VoiceNote, icons
  data/              # Content as typed data, single sources of truth:
    site.ts          #   company identifiers, contact, social, JSON-LD `sameAs`
    case-studies.ts  #   portfolio entries (rendered on /work and /work/:slug)
    services.ts, process.ts, testimonials.ts
  lib/seo.ts         # Per-route <title>/description + JSON-LD @graph builder
  routes.tsx         # Route table + PRERENDER_PATHS (the list of static pages)
  styles/            # Global CSS / design tokens
api/
  contact.ts         # Vercel serverless function — emails contact submissions
scripts/
  prerender.mjs      # Static-render each route to dist/<route>/index.html
  sitemap.mjs        # Generate sitemap.xml + robots.txt
```

### SEO & site identity

`src/data/site.ts` is the single source of truth for company-wide identifiers
(name, domain, email, social profiles). It feeds the JSON-LD structured data in
`src/lib/seo.ts` (Organization / WebSite / per-page nodes) and the social meta
tags. `src/components/SEO/RouteHead` emits per-route tags using React 19's
native `<title>`/`<meta>` hoisting.

### Legal pages

Each app the studio has shipped has its own **Privacy Policy** and **Terms of
Service** under `src/pages/legal/`, served at `/legal/<app>/privacy` and
`/legal/<app>/terms`. All of them share the `LegalPage` layout component and the
same numbered-section styling. Apps currently covered: **STLMNT**, **Pinpoint**,
**Payback**, **DrayagePro**, **Yap**, **Zoori**, and **Feng Shui**. The
[`/support`](https://www.anappidea.llc/support) page links to each of these and
doubles as the per-app legal index that App Store review expects.

To add a doc for a new app: create the `.tsx` page(s) in `src/pages/legal/`,
register the route(s) in `src/routes.tsx` (router + `PRERENDER_PATHS`), and add
the `META` entries in `src/lib/seo.ts`.

## Contact form (`api/contact.ts`)

The contact form posts to a Vercel serverless function that sends an email via
Resend. It accepts the structured form fields and an optional short **voice
note** (audio is capped at ~6 MB once decoded). Configure these environment
variables in Vercel:

| Variable | Purpose | Default |
| :-- | :-- | :-- |
| `RESEND_API_KEY` | Resend API key (required to send) | — |
| `TO_EMAIL` | Recipient of contact submissions | `hello@anappidea.llc` |
| `FROM_EMAIL` | Verified sender address | `hello@anappidea.llc` |

## Deployment

Hosted on Vercel (see `vercel.json`): `pnpm build` produces `dist/`, served with
clean URLs and long-lived caching for hashed assets and images. The `api/`
directory is deployed as serverless functions.
