import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect } from 'vitest'

const root = join(__dirname, '..', '..')
const read = (p: string) => readFileSync(join(root, p), 'utf8')

// Brand fonts are self-hosted: a third-party font stylesheet blocked first
// paint for ~840ms on every page. Keep it that way, and keep every declared
// face pointing at a file that actually ships.
describe('self-hosted fonts', () => {
  it('loads no Google Fonts stylesheet', () => {
    expect(read('index.html')).not.toMatch(/fonts\.(googleapis|gstatic)\.com/)
  })

  it('ships every font file the CSS declares or index.html preloads', () => {
    const urls = [
      ...read('src/styles/tokens.css').matchAll(/url\('(\/fonts\/[^']+)'\)/g),
      ...read('index.html').matchAll(/href="(\/fonts\/[^"]+)"/g),
    ].map((m) => m[1])
    expect(urls.length).toBeGreaterThan(0)
    for (const url of urls) expect(existsSync(join(root, 'public', url)), url).toBe(true)
  })

  it('declares every brand family the font tokens use', () => {
    const css = read('src/styles/tokens.css')
    for (const family of ['Unbounded', 'Space Mono', 'Bebas Neue']) {
      expect(css).toMatch(new RegExp(`font-family: '${family}';\\s*src: url\\('/fonts/`))
    }
  })
})
