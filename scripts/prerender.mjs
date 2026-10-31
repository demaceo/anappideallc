// Hand-rolled SSG: pre-renders each app route to a static HTML file in dist/.
// Runs after `vite build`. Uses Vite's programmatic SSR to load TSX entry,
// renders each route via React Router's static handler, injects HTML into
// the dist/index.html template, and writes one file per route.
//
// Also injects:
//   - Per-route Schema.org JSON-LD into <head>
//   - Per-route <title> and <meta name="description"> into the template <head>
//     (React 19's renderToString hoists these inside #root, not <head>)

import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { matchRoutes } from 'react-router'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function main() {
  const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
  })

  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
  const { PRERENDER_PATHS, routes } = await vite.ssrLoadModule('/src/routes.tsx')
  const { buildStructuredData, META } = await vite.ssrLoadModule('/src/lib/seo.ts')
  const { SITE, TWITTER_HANDLE } = await vite.ssrLoadModule('/src/data/site.ts')

  const template = readFileSync(path.join(root, 'dist/index.html'), 'utf-8')

  // Pages load on demand (route `lazy` in src/routes.tsx), so each page's
  // chunk would otherwise only be requested after the main bundle runs.
  // Preload it from the page's own HTML instead: each lazy route names its
  // source file in handle.module, and Vite's manifest maps that to the built
  // chunk and the shared chunks it imports. Files the template already loads
  // (its own <script src> / <link href> URLs, matched exactly) are skipped.
  const manifest = JSON.parse(readFileSync(path.join(root, 'dist/.vite/manifest.json'), 'utf-8'))
  const templateAssets = new Set([...template.matchAll(/\s(?:src|href)="\/([^"]+)"/g)].map((m) => m[1]))
  function chunkFiles(key, seen = new Set()) {
    const entry = manifest[key]
    if (!entry || seen.has(key)) return []
    seen.add(key)
    return [entry.file, ...(entry.imports ?? []).flatMap((k) => chunkFiles(k, seen))]
  }
  function preloadTags(url) {
    const modules = (matchRoutes(routes, url) ?? []).map((m) => m.route.handle?.module).filter(Boolean)
    const files = [...new Set(modules.flatMap((m) => chunkFiles(m)))]
    if (modules.length && !files.length) throw new Error(`No built chunk for ${modules.join(', ')} (${url})`)
    return files
      .filter((file) => !templateAssets.has(file))
      .map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`)
  }

  for (const url of PRERENDER_PATHS) {
    const meta = META[url] ?? META['/']

    // Replace template's generic title with the per-route title.
    // React 19 renderToString places <title> inside #root, not <head>,
    // so we patch the template directly to ensure crawlers see the right value.
    const withTitle = template.replace(
      /<title>[^<]*<\/title>/,
      `<title>${escHtml(meta.title)}</title>`,
    )

    // Replace template's generic meta description with the per-route one.
    const withMeta = withTitle.replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${escHtml(meta.description)}$2`,
    )

    // Inject per-route JSON-LD + OG/Twitter/canonical directly into <head>.
    // Social media crawlers (Twitter, LinkedIn, Facebook) don't execute JS,
    // so these must be in static HTML — not just in the React SSR output
    // inside #root where React 19 places them during renderToString.
    const canonical = `${SITE.url}${url === '/' ? '' : url}`
    const ogImage = `${SITE.url}/og.png`
    const headTags = [
      `<link rel="canonical" href="${canonical}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:url" content="${canonical}" />`,
      `<meta property="og:title" content="${escHtml(meta.title)}" />`,
      `<meta property="og:description" content="${escHtml(meta.description)}" />`,
      `<meta property="og:image" content="${ogImage}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${escHtml(meta.title)}" />`,
      `<meta property="og:site_name" content="${escHtml(SITE.name)}" />`,
      `<meta property="og:locale" content="en_US" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      ...(TWITTER_HANDLE
        ? [`<meta name="twitter:site" content="${escHtml(TWITTER_HANDLE)}" />`]
        : []),
      `<meta name="twitter:title" content="${escHtml(meta.title)}" />`,
      `<meta name="twitter:description" content="${escHtml(meta.description)}" />`,
      `<meta name="twitter:image" content="${ogImage}" />`,
      `<meta name="twitter:image:alt" content="${escHtml(meta.title)}" />`,
      `<script type="application/ld+json">${buildStructuredData(url)}</script>`,
      ...preloadTags(url),
    ].join('\n  ')

    // Clean out any static template canonical/og/json-ld tags so prerendered
    // pages don't end up with duplicate tags.
    const cleaned = withMeta
      .replace(/<link\s+rel="canonical"[^>]*>\s*/g, '')
      .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/g, '')
      .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '')

    const withLd = cleaned.replace('</head>', `  ${headTags}\n  </head>`)

    const html = await render(url)
    const final = withLd.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`,
    )
    const outPath = url === '/' ? 'dist/index.html' : `dist${url}/index.html`
    const absOut = path.join(root, outPath)
    mkdirSync(path.dirname(absOut), { recursive: true })
    writeFileSync(absOut, final)
    console.log(`  prerendered ${url.padEnd(20)} → ${outPath}`)
  }

  await vite.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
