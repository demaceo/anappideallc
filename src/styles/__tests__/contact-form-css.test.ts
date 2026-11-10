/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const GLOBALS_CSS = fs.readFileSync(path.resolve(HERE, '../globals.css'), 'utf8')

/** The declaration block of the first rule whose selector is exactly `selector`. */
function ruleBody(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = GLOBALS_CSS.match(new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`, 'm'))
  expect(match, `no rule for ${selector}`).not.toBeNull()
  return match![1]
}

describe('contact form: service picker styles', () => {
  it('draws a visible focus ring on the native checkbox (the global ring covers links and buttons only)', () => {
    const ring = ruleBody('.service-picker-check:focus-visible')
    expect(ring).toMatch(/outline:\s*var\(--bw-thick\)\s+solid/)
    expect(ring).toMatch(/outline-offset:\s*2px/)
  })

  it.each(['.service-picker-row', '.service-picker-toggle'])('keeps %s a 44px tap target', (selector) => {
    expect(ruleBody(selector)).toMatch(/min-height:\s*44px/)
  })

  it('gives the guide link a 44px tap target', () => {
    expect(ruleBody('.contact-guide-link')).toMatch(/min-height:\s*44px/)
  })

  it('does not set `display` on the closed panel, so the [hidden] attribute hides it', () => {
    // A `display` here would beat the UA's [hidden] and leave the closed panel
    // visible and tabbable.
    expect(ruleBody('.service-picker-fieldset')).toMatch(/display:\s*flex/)
    expect(GLOBALS_CSS).not.toMatch(/\.service-picker-panel\s*\{[^}]*display:/)
  })

  it('hides the quick form while the guide runs, despite its own `display: flex`', () => {
    expect(ruleBody('.contact-quick[hidden]')).toMatch(/display:\s*none/)
  })

  it('tints a ticked service row like the other picked answers', () => {
    expect(GLOBALS_CSS).toMatch(
      /\.contact-form :is\([^)]*\.service-picker-row\.selected[^)]*\)\s*\{[^}]*background:\s*var\(--c-accent-soft\)/,
    )
  })
})
