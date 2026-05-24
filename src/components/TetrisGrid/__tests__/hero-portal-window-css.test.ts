/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../HeroPortalWindow.module.css'),
  'utf8',
)

describe('HeroPortalWindow.module.css', () => {
  it('.portal is positioned absolute with inset 14px', () => {
    expect(CSS).toMatch(/\.portal\s*\{[^}]*position:\s*absolute/)
    expect(CSS).toMatch(/\.portal\s*\{[^}]*inset:\s*14px/)
  })
  it('.portal has border-radius 18px and overflow hidden', () => {
    expect(CSS).toMatch(/\.portal\s*\{[^}]*border-radius:\s*18px/)
    expect(CSS).toMatch(/\.portal\s*\{[^}]*overflow:\s*hidden/)
  })
  it('.portal uses the deep-space gradient', () => {
    expect(CSS).toMatch(/\.portal\s*\{[^}]*var\(--aurora-deepspace\)/)
  })
  it('.aurora layer renders cyan + magenta radial gradients', () => {
    expect(CSS).toMatch(/\.aurora\s*\{[^}]*var\(--aurora-cyan\)/)
    expect(CSS).toMatch(/\.aurora\s*\{[^}]*var\(--aurora-magenta\)/)
  })
  it('portal is hidden on non-modern-vibrant themes', () => {
    expect(CSS).toMatch(/:not\(\[data-theme="modern-vibrant"\]\)/)
  })
})
