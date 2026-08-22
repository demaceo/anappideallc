/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const read = (f: string) => fs.readFileSync(path.resolve(HERE, '..', f), 'utf8')
// Strip CSS comments before matching. These files carry long explanatory
// comments that quote the very values and selectors under test (e.g. "measured
// 3.06:1", "--c-bg-faint"), so a naive regex matches the prose rather than the
// declaration and reports a passing rule as broken.
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '')

const TOKENS = read('tokens.css')
const GLOBALS = stripComments(read('globals.css'))

/** OKLCH → sRGB → relative luminance → WCAG contrast ratio. */
function oklchToRgb(L: number, C: number, H: number): [number, number, number] {
  const h = (H * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3
  const conv = (v: number) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
    return Math.max(0, Math.min(255, c * 255))
  }
  return [
    conv(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    conv(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    conv(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}
const srgb = (c: number) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}
const lum = ([r, g, b]: number[]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
function ratio(fg: number[], bg: number[]) {
  const [a, b] = lum(fg) > lum(bg) ? [lum(fg), lum(bg)] : [lum(bg), lum(fg)]
  return (a + 0.05) / (b + 0.05)
}
const over = (fg: number[], bg: number[], alpha: number) =>
  [0, 1, 2].map((i) => fg[i] * alpha + bg[i] * (1 - alpha))

/** Pull `--name: oklch(L% C H [/ A])` straight out of tokens.css. */
function token(name: string) {
  const m = stripComments(TOKENS).match(
    new RegExp(`--${name}:\\s*oklch\\(\\s*([\\d.]+)%?\\s+([\\d.]+)\\s+([\\d.]+)\\s*(?:/\\s*([\\d.]+)\\s*)?\\)`),
  )
  if (!m) throw new Error(`token --${name} not found in tokens.css`)
  const L = parseFloat(m[1])
  return {
    rgb: oklchToRgb(L > 1 ? L / 100 : L, parseFloat(m[2]), parseFloat(m[3])),
    alpha: m[4] === undefined ? 1 : parseFloat(m[4]),
  }
}

const AA_SMALL = 4.5

/**
 * Regression — 2026-08 audit P2 (four measured contrast failures) plus a fifth
 * the audit's own sweep missed because it never hovered.
 *
 * Measured before the fix, and re-measured in Chromium after:
 *   ::placeholder                       1.60 -> 5.68
 *   .project-stat-label (opacity .4)    2.66 -> 8.60
 *   .overline a breadcrumb (.6 x .75)   3.06 -> 4.98
 *   .stat-num on .positive, 18.4px      3.57 -> 4.59
 *   hover .stat-desc on the fill        2.21 -> 4.59
 *
 * These assert the token math directly, so a future palette tweak that pushes
 * any of them back under AA fails here rather than in someone's browser.
 */
describe('tokens.css — text colours clear WCAG AA (audit P2)', () => {
  const bone = token('c-bg').rgb
  const ink = token('c-fg').rgb

  it('form placeholders are readable on the dark form panel', () => {
    const ph = token('c-bg-placeholder')
    expect(ratio(over(ph.rgb, ink, ph.alpha), ink)).toBeGreaterThanOrEqual(AA_SMALL)
  })

  it('keeps --c-bg-faint separate and non-text (hairlines only)', () => {
    const faint = token('c-bg-faint')
    // If someone "simplifies" by pointing placeholders back at this token, the
    // placeholder test above still catches it — this documents why they differ.
    expect(faint.alpha).toBeLessThan(token('c-bg-placeholder').alpha)
    expect(GLOBALS).not.toMatch(/::placeholder\s*\{[^}]*--c-bg-faint/)
  })

  it.each([['c-swatch-green'], ['c-swatch-gold']])(
    '%s reads as text on bone and as a fill behind bone',
    (name) => {
      const s = token(name).rgb
      // Rest state: tinted numeral on the bone card, 18.4px at mobile.
      expect(ratio(s, bone)).toBeGreaterThanOrEqual(AA_SMALL)
      // Hover state inverts: bone label text on the solid swatch fill.
      expect(ratio(bone, s)).toBeGreaterThanOrEqual(AA_SMALL)
    },
  )

  it('drops the muted opacities on the inverted stat-box hover states', () => {
    // Bone at 0.75/0.6 over the swatch fill measured 2.66:1 and 2.21:1.
    expect(GLOBALS).toMatch(
      /\.stat-box\.positive:hover \.stat-desc[\s\S]{0,120}?opacity:\s*1/,
    )
  })

  it('raises .project-stat-label out of its 0.4 opacity', () => {
    // It sits in the shared selector group that lifts muted mono labels to
    // 0.75 — its sibling .project-metric-label was already there, this one
    // had been missed and was still resolving to 2.66:1.
    expect(GLOBALS).toMatch(
      /\.project-stat-label,[\s\S]{0,400}?\{\s*opacity:\s*0\.75/,
    )
  })

  it('does not compound opacity onto the breadcrumb link', () => {
    const m = GLOBALS.match(/\.overline a \{[^}]*\}/)
    expect(m).not.toBeNull()
    expect(m![0]).not.toMatch(/opacity:\s*0?\.\d/)
  })
})

/**
 * Regression — 2026-08 audit P2 (font-weight: 500 was a silent no-op).
 *
 * Space Mono ships 400 and 700 only. CSS font matching resolves a requested
 * 500 DOWN to 400 whenever 400 is available — it only synthesises above 500 —
 * so eleven rules asked for emphasis and rendered identically to body text.
 * Measured in Chromium: the same string at 400 and 500 both laid out to
 * 190.00px, while 600 and 700 both gave 183.03px.
 */
describe('globals.css — requested weights exist in the family (audit P2)', () => {
  it('never asks for a weight Space Mono does not ship', () => {
    // 500 resolves to 400 and 600 resolves to 700 — both are silent lies about
    // what will render. Only 400 and 700 are honest here.
    expect(GLOBALS).not.toMatch(/font-weight:\s*500/)
    expect(GLOBALS).not.toMatch(/font-weight:\s*600/)
  })

  it('still applies emphasis where those rules intended it', () => {
    for (const sel of [
      '\\.contact-fab-label',
      '\\.source-list li strong',
      '\\.stat-pill strong',
      '\\.project-stat-value',
      '\\.chip\\.selected',
    ]) {
      expect(GLOBALS).toMatch(new RegExp(`${sel}\\s*\\{[^}]*font-weight:\\s*700`))
    }
  })
})

/**
 * Regression — 2026-08 audit P2 (~20 of 62 declared tokens were dead).
 */
describe('tokens.css — no resurrected dead tokens (audit P2)', () => {
  it('keeps the retired compat aliases and unused scale out', () => {
    for (const dead of [
      'ink', 'paper', 'accent', 'gold', 'navy', 'muted', 'rule', 'panel', 'white',
      'c-cta', 'bw-brutal-lg', 'neon-yellow', 'header-progress',
      's-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-7', 's-8', 's-9', 's-10',
    ]) {
      expect(stripComments(TOKENS)).not.toMatch(new RegExp(`^\\s*--${dead}:`, 'm'))
    }
  })

  it('every token it still declares is actually referenced', () => {
    const declared = [...stripComments(TOKENS).matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1])
    expect(declared.length).toBeGreaterThan(0)
    const unused = declared.filter(
      (t) => !GLOBALS.includes(`var(${t})`) && !stripComments(TOKENS).includes(`var(${t})`),
    )
    expect(unused).toEqual([])
  })
})
