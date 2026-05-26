/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../Page.module.css'),
  'utf8',
)

describe('Page.module.css — Editorial Hardware card upgrade (Phase 6)', () => {
  it('upgrades .card with pearl rim on modern-vibrant theme', () => {
    // The rule must be scoped to modern-vibrant so other themes are unaffected
    expect(CSS).toMatch(
      /\[data-theme="modern-vibrant"\][^{]*\.card[^{]*\{[^}]*inset\s+0\s+1px\s+0/,
    )
  })

  it('.card::before adds brushed micro-grain on modern-vibrant', () => {
    expect(CSS).toMatch(
      /\[data-theme="modern-vibrant"\][^{]*\.card::before/,
    )
  })

  it('base .card style is still present (non-modern-vibrant fallback)', () => {
    // The original .card rule must exist for non-modern-vibrant themes
    expect(CSS).toMatch(/^\.card\s*\{/m)
  })
})
