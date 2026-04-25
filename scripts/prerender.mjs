// Hand-rolled SSG: pre-renders each app route to a static HTML file in dist/.
// Runs after `vite build`. Uses Vite's programmatic SSR to load TSX entry,
// renders each route via React Router's static handler, injects HTML into
// the dist/index.html template, and writes one file per route.
//
// Also injects Schema.org structured data (JSON-LD) into every page's
// <head> so crawlers see it regardless of which route they land on.

import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

async function main() {
  const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
  })

  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
  const { PRERENDER_PATHS } = await vite.ssrLoadModule('/src/routes.tsx')
  const { buildStructuredData } = await vite.ssrLoadModule('/src/lib/seo.ts')

  const ldScript = `<script type="application/ld+json">${buildStructuredData()}</script>`
  const template = readFileSync(path.join(root, 'dist/index.html'), 'utf-8')
  const withLd = template.replace('</head>', `  ${ldScript}\n  </head>`)

  for (const url of PRERENDER_PATHS) {
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
