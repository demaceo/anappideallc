/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

// ESM-native dirname resolution — see material-tokens.test.ts for rationale.
const HERE = path.dirname(fileURLToPath(import.meta.url))

const BLOCK_CSS = fs.readFileSync(
  path.resolve(HERE, '../Block.module.css'),
  'utf8',
)

/**
 * Regression — Phase 5 audit Critical finding.
 *
 * `@property --bloom-dark { initial-value: transparent }` in tokens.css makes
 * `--bloom-dark` always *declared* (per CSS @property semantics) — so the
 * fallback `var(--bloom-dark, var(--block-bg, transparent))` in .block's
 * gradient never engages the `--block-bg` fallback. On non-modern-vibrant
 * themes (classic, pastel, arcade-neon) the result was transparent blocks
 * showing the dark stage backing through them = dark-on-dark unreadable.
 *
 * Fix: bind --bloom-dark / --bloom / --bloom-bright to var(--block-bg) on
 * the unconditional .block-{section} rule. The modern-vibrant override
 * ([data-theme="modern-vibrant"] .block-{section}) keeps higher selector
 * specificity and still wins for the v2 material palette.
 */
describe('Block.module.css — non-modern-vibrant theme fallback (audit fix)', () => {
  const sections = ['hero', 'brand', 'about', 'work', 'services', 'process', 'contact']

  for (const s of sections) {
    // The unconditional .block-{s} rule must set --bloom-dark to var(--block-bg).
    // Anchor on start-of-line (^) with multiline flag so we don't accidentally
    // match `[data-theme="modern-vibrant"] .block-{s}` (which is the v2
    // bloom-tokens override that still binds to --c-{s}-mat-dark).
    it(`unconditional .block-${s} binds --bloom-dark to var(--block-bg)`, () => {
      const rule = new RegExp(
        `^\\.block-${s}\\b[^{]*\\{[^}]*--bloom-dark:\\s*var\\(--block-bg\\)`,
        'm',
      )
      expect(BLOCK_CSS).toMatch(rule)
    })

    it(`unconditional .block-${s} binds --bloom to var(--block-bg)`, () => {
      const rule = new RegExp(
        `^\\.block-${s}\\b[^{]*\\{[^}]*--bloom:\\s*var\\(--block-bg\\)`,
        'm',
      )
      expect(BLOCK_CSS).toMatch(rule)
    })

    it(`unconditional .block-${s} binds --bloom-bright to var(--block-bg)`, () => {
      const rule = new RegExp(
        `^\\.block-${s}\\b[^{]*\\{[^}]*--bloom-bright:\\s*var\\(--block-bg\\)`,
        'm',
      )
      expect(BLOCK_CSS).toMatch(rule)
    })
  }
})

/**
 * Regression — Phase 5 audit Important finding (Cream Ceramic contrast).
 *
 * The ceramic recipe paints a cream radial gradient (white → #f1e9da →
 * #c8b89c). Block titles inherit --block-fg from .block-{section}, which
 * is white on Hero/Work/Contact — so those blocks render as nearly-
 * invisible white-on-cream text under ceramic. Override `color` on the
 * ceramic .block rule to a dark earth-tone so all 7 blocks stay legible
 * regardless of their per-block --block-fg.
 */
describe('Block.module.css — Cream Ceramic legibility (audit fix)', () => {
  it('ceramic .block overrides color to a dark earth-tone for cream-surface legibility', () => {
    // Accept any explicit dark hex in the ceramic rule's color declaration.
    // The exact value isn't important for the contract; the contract is that
    // ceramic always paints text dark on cream. Pattern: #X where X[0] is 0-4
    // (luminance ceiling), e.g. #2a1810.
    expect(BLOCK_CSS).toMatch(
      /\[data-material="ceramic"\]\s+\.block[^}]*\{[^}]*color:\s*#[0-4][0-9a-f]{5}/i,
    )
  })
})

/**
 * Regression — Phase 5 audit Important finding (Frosted Glass identity).
 *
 * The original frosted recipe used hardcoded teal stops (rgba(0,180,170)
 * etc.) for every block, so all 7 blocks collapsed to the same teal tint
 * regardless of section. The 7-block visual hierarchy that the design
 * relies on dissolved.
 *
 * Fix: bind the frosted gradient to --bloom-dark / --bloom-bright so each
 * block tints with its own Editorial Hardware palette under the frosted-
 * glass blur. modern-vibrant scope means --bloom-* are the v2 material
 * colors; the translucency comes from color-mix-with-transparent.
 */
describe('Block.module.css — Frosted Glass identity (audit fix)', () => {
  it('frosted recipe references --bloom-dark for tint (not hardcoded teal)', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-material="frosted"\]\s+\.block[^}]*\{[^}]*background:[^;]*var\(--bloom-dark/,
    )
  })

  it('frosted recipe references --bloom-bright for highlight (not hardcoded teal)', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-material="frosted"\]\s+\.block[^}]*\{[^}]*background:[^;]*var\(--bloom-bright/,
    )
  })

  it('frosted recipe still applies a backdrop-filter blur', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-material="frosted"\]\s+\.block[^}]*\{[^}]*backdrop-filter:\s*blur/,
    )
  })
})
