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
