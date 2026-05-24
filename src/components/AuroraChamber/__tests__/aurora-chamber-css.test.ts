/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../AuroraChamber.module.css'),
  'utf8',
)

describe('AuroraChamber.module.css', () => {
  it('.chamber is position: relative with min-height: 100dvh', () => {
    expect(CSS).toMatch(/\.chamber\s*\{[^}]*position:\s*relative/)
    expect(CSS).toMatch(/\.chamber\s*\{[^}]*min-height:\s*100dvh/)
  })
  it('renders three aurora layers (cyan, magenta, gold)', () => {
    expect(CSS).toMatch(/\.auroraCyan\s*\{[^}]*var\(--aurora-cyan\)/)
    expect(CSS).toMatch(/\.auroraMagenta\s*\{[^}]*var\(--aurora-magenta\)/)
    expect(CSS).toMatch(/\.auroraGold\s*\{[^}]*var\(--aurora-gold\)/)
  })
  it('has a stars layer', () => {
    expect(CSS).toMatch(/\.stars\s*\{/)
  })
  it('has an inset vignette', () => {
    expect(CSS).toMatch(/\.vignette\s*\{[^}]*box-shadow:\s*inset/)
  })
  it('decorative layers are hidden on non-modern-vibrant themes', () => {
    expect(CSS).toMatch(/:not\(\[data-theme="modern-vibrant"\]\)/)
  })
})
