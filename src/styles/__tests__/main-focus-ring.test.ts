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
 * Regression — 2026-08 audit P0 (hero disappears without scroll-timeline support).
 *
 * The sticky-header collapse drives `*-collapse` keyframes off `scroll(root)`.
 * The `animation` shorthand resets `animation-duration`; browsers WITHOUT
 * scroll-timeline support resolve that to `0s` rather than `auto`, and a 0s
 * animation with `fill-mode: both` completes instantly and pins the element to
 * its END keyframe. Unguarded, that renders the masthead permanently COLLAPSED
 * on iOS <= 18, Firefox ESR and older Chrome/Edge: h1 at ~21px, and the
 * overline / subtitle / dateline at opacity 0. Measured before the fix:
 * h1 68px -> 21.6px, subtitle max-height 160px -> 0.
 *
 * The guard must stay: the base rules are the static fallback, and only
 * supporting browsers may opt into the scroll-scrubbed collapse.
 */
describe('globals.css — scroll-driven collapse is @supports-guarded (audit P0)', () => {
  const SUPPORTS_BLOCK = /@supports\s*\(animation-timeline:\s*scroll\(root\)\)\s*\{/

  it('declares an @supports guard for scroll-driven animation', () => {
    expect(GLOBALS_CSS).toMatch(SUPPORTS_BLOCK)
  })

  it('never sets animation-timeline outside the @supports guard', () => {
    const guardStart = GLOBALS_CSS.search(SUPPORTS_BLOCK)
    expect(guardStart).toBeGreaterThan(-1)

    // Walk the guard to its matching close brace, then assert no other rule in
    // the file sets animation-timeline.
    let depth = 0
    let end = GLOBALS_CSS.indexOf('{', guardStart)
    for (let i = end; i < GLOBALS_CSS.length; i++) {
      if (GLOBALS_CSS[i] === '{') depth++
      else if (GLOBALS_CSS[i] === '}') {
        depth--
        if (depth === 0) {
          end = i
          break
        }
      }
    }

    const outside = GLOBALS_CSS.slice(0, guardStart) + GLOBALS_CSS.slice(end + 1)
    expect(outside).not.toMatch(/animation-timeline:/)
  })

  it('keeps every collapse keyframe reachable from inside the guard', () => {
    for (const name of [
      'masthead-collapse',
      'overline-collapse',
      'h1-collapse',
      'subtitle-collapse',
      'dateline-collapse',
      'back-home-track',
      'personas-slim',
      'persona-tag-slim',
      'personas-collapse',
    ]) {
      expect(GLOBALS_CSS).toMatch(new RegExp(`animation-name:\\s*${name};`))
    }
  })
})

/**
 * Regression — 2026-08 audit P1 (outlined keyword illegible).
 *
 * `.outline-word` used a fixed `-webkit-text-stroke: 3px` while the heading
 * scales with clamp(). At the mobile h2 (~24px) the 3px stroke plus Unbounded
 * 900's negative tracking merged adjacent letterforms into one shape — and the
 * outlined half is the KEYWORD of every section heading. The stroke must stay
 * em-relative so it tracks the type size.
 */
describe('globals.css — .outline-word stroke scales with type (audit P1)', () => {
  it('uses an em-relative stroke, not a fixed pixel width', () => {
    expect(GLOBALS_CSS).toMatch(/-webkit-text-stroke:\s*max\([^)]*em\)/)
    expect(GLOBALS_CSS).not.toMatch(/-webkit-text-stroke:\s*3px\s+currentColor/)
  })

  it('falls back to a solid fill on small screens', () => {
    expect(GLOBALS_CSS).toMatch(
      /\.outline-word\s*\{[^}]*-webkit-text-fill-color:\s*currentColor/,
    )
  })
})

/**
 * Regression — 2026-08 audit P1 (no skip link).
 *
 * The sticky header puts a back-home button and four nav links ahead of the
 * content on every route, and there was no way past them for keyboard users.
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
