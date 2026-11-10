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

describe('contact form: voice note row', () => {
  it('makes the record button a 48px target, above the 44px minimum', () => {
    const action = ruleBody('.voice-note-action')
    expect(action).toMatch(/width:\s*3rem/)
    expect(action).toMatch(/height:\s*3rem/)
  })

  it('draws the button solid ink with a paper icon, so it reads as a button', () => {
    // Inside the form card --c-bg is the ink and --c-fg the paper.
    const action = ruleBody('.voice-note-action')
    expect(action).toMatch(/background:\s*var\(--c-bg\)/)
    expect(action).toMatch(/[^-]color:\s*var\(--c-fg\)/)
  })

  it('keeps the offer and the button on one row, the offer taking the free space', () => {
    expect(ruleBody('.voice-note-row')).toMatch(/justify-content:\s*space-between/)
    expect(ruleBody('.voice-note-text')).toMatch(/flex:\s*1/)
  })

  it('keeps the timer whole when the row wraps', () => {
    expect(ruleBody('.voice-note-timer')).toMatch(/white-space:\s*nowrap/)
  })

  it('no longer styles the old text-button recorder', () => {
    expect(GLOBALS_CSS).not.toMatch(/\.voice-note-btn|\.voice-note-discard|\.voice-note-done/)
  })
})

describe('contact form: accessibility contrast and names (audit)', () => {
  it('colours the "microphone blocked" message like the other errors, not the 2.9:1 orange-red', () => {
    // --c-accent-2 on the paper card is 2.88:1; --form-error is 6.6:1.
    expect(GLOBALS_CSS).toMatch(/\.contact-form \.voice-note-hint\.error\s*\{[^}]*color:\s*var\(--form-error\)/)
  })

  it('gives the recording button an ink edge, so its boundary does not rest on orange-red alone', () => {
    const rec = GLOBALS_CSS.match(/\.voice-note-action\.recording,\s*\.voice-note-action\.recording:hover\s*\{([^}]*)\}/)
    expect(rec).not.toBeNull()
    expect(rec![1]).toMatch(/border-color:\s*var\(--c-bg\)/)
  })

  it('keeps the Send button\'s decorative arrow out of its accessible name', () => {
    expect(GLOBALS_CSS).toMatch(/\.form-submit-btn::after\s*\{\s*content:\s*'→'\s*\/\s*''/)
  })
})

