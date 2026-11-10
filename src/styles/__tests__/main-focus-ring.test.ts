/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))

const GLOBALS_CSS = fs.readFileSync(
  path.resolve(HERE, '../globals.css'),
  'utf8',
)

/**
 * Regression — Phase 5 audit Minor finding (inner-page focus outline).
 *
 * RouteFocusReset programmatically focuses <main> after every navigation
 * so screen readers get a position cue. The browser's default focus
 * outline then renders for *every* visitor — not just keyboard users —
 * showing a visible ring around the main content on /about, /contact,
 * etc. <main> is a non-interactive content container, so a visible focus
 * indicator on it is meaningless to keyboard users (they tab to the
 * interactive elements *inside* main, which still get their own
 * focus-visible outlines via the a:focus-visible / button:focus-visible
 * rules above). The fix unconditionally removes the outline on main:focus.
 *
 * Note: an earlier attempt used `main:focus:not(:focus-visible)` but
 * WebKit's :focus-visible heuristic treats programmatic .focus() on a
 * tabindex=-1 element as visible, which defeated the :not() filter.
 * Unconditional `outline: none` works across all browsers.
 */
describe('globals.css — main focus outline (audit fix)', () => {
  it('hides outline on main:focus (non-interactive container)', () => {
    expect(GLOBALS_CSS).toMatch(/main:focus\s*\{[^}]*outline:\s*none/)
  })
})

/**
 * The masthead no longer collapses on scroll; it scrolls away like any other
 * content, and the nav bar below it sticks to the top of the viewport.
 *
 * The old collapse drove `*-collapse` keyframes off `scroll(root)`. It also
 * needed an @supports guard, because browsers without scroll-timeline support
 * resolved the `animation` shorthand's duration to 0s and pinned the masthead
 * to its END keyframe (a permanently collapsed hero on iOS <= 18 and older
 * Chrome). Sticky positioning has no such failure mode, so none of that
 * machinery should come back. Do not reintroduce a scroll-scrubbed header.
 */
describe('globals.css — sticky nav replaces the collapsing masthead', () => {
  /** The declaration block of the first rule whose selector is exactly `selector`. */
  function ruleBody(selector: string): string {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const match = GLOBALS_CSS.match(new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`, 'm'))
    expect(match, `no rule for ${selector}`).not.toBeNull()
    return match![1]
  }

  it('sticks the nav bar to the top of the viewport', () => {
    const nav = ruleBody('.personas-bar')
    expect(nav).toMatch(/position:\s*sticky/)
    expect(nav).toMatch(/top:\s*0\s*;/)
    // Opaque, or page content would show through the stuck bar.
    expect(nav).toMatch(/background:\s*var\(--c-page\)/)
    expect(nav).toMatch(/z-index:\s*\d+/)
  })

  it('lets the masthead scroll away instead of sticking with the nav', () => {
    expect(ruleBody('.page-header-wrap')).not.toMatch(/position:\s*sticky/)
  })

  it('keeps the phone nav to one row so the stuck bar stays slim', () => {
    const mobile = GLOBALS_CSS.match(/@media\s*\(max-width:\s*640px\)\s*\{\s*\/\*[\s\S]*?\.personas-bar\s*\{([^}]*)\}/)
    expect(mobile).not.toBeNull()
    expect(mobile![1]).toMatch(/flex-wrap:\s*nowrap/)
    expect(mobile![1]).toMatch(/overflow-x:\s*auto/)
  })

  it('has no scroll-driven animation left', () => {
    expect(GLOBALS_CSS).not.toMatch(/animation-timeline:/)
    expect(GLOBALS_CSS).not.toMatch(/@keyframes\s+[\w-]*(collapse|slim|track)\b/)
    expect(GLOBALS_CSS).not.toMatch(/--collapse-range/)
  })
})

/**
 * Regression — 2026-08 audit P1 (outlined keyword illegible).
 *
 * The keyword of each Home section heading used to be a hollow outline
 * (`-webkit-text-stroke`), which merged into one shape at phone sizes. The
 * hybrid sets it as a solid accent colour instead; keep it solid, since the
 * keyword is the most important word in the heading.
 */
describe('globals.css — heading keyword is a solid fill (audit P1)', () => {
  it('uses no hollow outline type', () => {
    expect(GLOBALS_CSS).not.toMatch(/-webkit-text-stroke/)
    expect(GLOBALS_CSS).not.toMatch(/-webkit-text-fill-color:\s*transparent/)
  })

  it('colours the keyword with the accent', () => {
    expect(GLOBALS_CSS).toMatch(/\.accent-word\s*\{[^}]*color:\s*var\(--c-accent\)/)
  })
})

/**
 * Regression — 2026-08 audit P1 (no skip link).
 *
 * The header puts a back-home button and the nav links ahead of the content on
 * every route, and there was no way past them for keyboard users.
 */
describe('globals.css — skip link (audit P1)', () => {
  it('keeps the skip link focusable but off-screen until focused', () => {
    expect(GLOBALS_CSS).toMatch(/\.skip-link\s*\{[^}]*position:\s*absolute/)
    expect(GLOBALS_CSS).toMatch(/\.skip-link\s*\{[^}]*transform:\s*translateY\(-/)
    expect(GLOBALS_CSS).toMatch(/\.skip-link:focus[^{]*\{[^}]*transform:\s*translateY\(0\)/)
    // display:none / visibility:hidden would make it unfocusable.
    expect(GLOBALS_CSS).not.toMatch(/\.skip-link\s*\{[^}]*display:\s*none/)
  })
})

/**
 * Regression — 2026-08 audit P1 (horizontal scroll on project pages).
 *
 * Grid items default to `min-width: auto`, so a track can never shrink below
 * its content's min-content width. A long metric value ("KMS-encrypted",
 * "Live status") pushed .project-metrics-row wider than the viewport and
 * scrolled the WHOLE document sideways. Measured before the fix:
 *   320px -> doc 378px (+58) / 401px (+81)
 *   360px -> doc 378px (+18) / 401px (+41)
 *   390px -> doc 401px (+11)   <- iPhone 14/15/16 Pro
 * i.e. every common phone width, not just small legacy devices.
 */
describe('globals.css — project grids can shrink below content (audit P1)', () => {
  it('clears the min-width:auto grid trap on both metric strips', () => {
    expect(GLOBALS_CSS).toMatch(
      /\.project-metric-cell\s*\{[^}]*min-width:\s*0/,
    )
    expect(GLOBALS_CSS).toMatch(
      /\.project-stat-item\s*\{[^}]*min-width:\s*0/,
    )
  })

  it('lets a long metric value wrap instead of spilling out of its cell', () => {
    expect(GLOBALS_CSS).toMatch(
      /\.project-metric-value\s*\{[^}]*overflow-wrap:\s*break-word/,
    )
  })

  it('drops the metrics strip to one column on narrow phones', () => {
    expect(GLOBALS_CSS).toMatch(
      /@media\s*\(max-width:\s*400px\)\s*\{\s*\.project-metrics-row\s*\{[^}]*grid-template-columns:\s*1fr/,
    )
  })
})
