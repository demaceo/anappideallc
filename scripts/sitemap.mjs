// Emits dist/sitemap.xml from the prerendered route list. Run after
// prerender.mjs so it sees the same set of routes. Also writes dist/robots.txt
// pointing at the sitemap — keeping both generation steps in one script
// avoids drift between the two.

import { fileURLToPath } from 'node:url'
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

async function main() {
  const { PRERENDER_PATHS } = await import(
    path.join(root, 'src/routes.tsx').replace(/\\/g, '/')
  ).catch(async () => {
    // Running under Node we can't import .tsx directly. Use Vite's SSR loader.
    const { createServer } = await import('vite')
    const vite = await createServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
    })
    const mod = await vite.ssrLoadModule('/src/routes.tsx')
    await vite.close()
    return mod
  })

  const base = 'https://www.anappidea.llc'
  const today = new Date().toISOString().split('T')[0]

  const PRIORITIES = {
    '/': { priority: '1.0', changefreq: 'weekly' },
    '/services': { priority: '0.9', changefreq: 'monthly' },
    '/work': { priority: '0.9', changefreq: 'monthly' },
    '/contact': { priority: '0.8', changefreq: 'monthly' },
    '/about': { priority: '0.8', changefreq: 'monthly' },
    '/why-not-ai': { priority: '0.8', changefreq: 'monthly' },
    '/process': { priority: '0.7', changefreq: 'monthly' },
    '/support': { priority: '0.6', changefreq: 'monthly' },
  }

  const urls = PRERENDER_PATHS.map((p) => {
    const loc = p === '/' ? base : `${base}${p}`
    const { priority, changefreq } = PRIORITIES[p] ?? { priority: '0.7', changefreq: 'monthly' }
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  writeFileSync(path.join(root, 'dist/sitemap.xml'), sitemap)
  console.log(`  emitted dist/sitemap.xml (${PRERENDER_PATHS.length} urls)`)

  const robots = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`
  writeFileSync(path.join(root, 'dist/robots.txt'), robots)
  console.log('  emitted dist/robots.txt')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
