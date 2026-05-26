/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))

const THREAD_CSS = fs.readFileSync(
  path.resolve(HERE, '../ThreadLine.module.css'),
  'utf8',
)

/**
 * Regression — Phase 5 audit Minor finding (mobile thread line).
 *
 * At narrow viewports (<768px) the grid stacks vertically, and the
 * serpentine thread line connecting all 7 blocks becomes geometrically
 * pointless — a few short curves between stacked blocks rather than the
 * sweeping connection that makes the gold thread expressive at desktop
 * widths. Hide it on mobile so the layout reads cleaner. Consistent with
 * the existing pattern of v2 atmospherics being mobile-optional.
 */
describe('ThreadLine.module.css — mobile breakpoint (audit fix)', () => {
  it('hides .threadLayer below 768px via display: none', () => {
    expect(THREAD_CSS).toMatch(
      /@media\s*\(max-width:\s*767px\)\s*\{[^}]*\.threadLayer\s*\{[^}]*display:\s*none/,
    )
  })
})
