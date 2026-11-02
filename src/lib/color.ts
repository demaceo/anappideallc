// Picks the text colour that reads best on a solid fill, by WCAG contrast.
// The Work tiles and case-study outcome bands are filled with each project's
// brand colour; all twelve today are dark, but a future light one (a pale
// yellow, say) must not end up with bone text on it.

export const INK = '#0a0a0a'
export const BONE = '#f5f4ef'

function luminance(hex: string): number {
  const v = hex.replace('#', '')
  const full = v.length === 3 ? [...v].map((c) => c + c).join('') : v
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export function readableOn(fill: string): string {
  return contrast(fill, INK) >= contrast(fill, BONE) ? INK : BONE
}

const toHex = (rgb: number[]) =>
  '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')
const toRgb = (hex: string) => {
  const v = hex.replace('#', '')
  const full = v.length === 3 ? [...v].map((c) => c + c).join('') : v
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}

// A fill for SMALL text: the brand colour itself when its readable text
// already clears `min`, otherwise nudged toward black (under bone text) or
// white (under ink text) in small steps until it does. Two brand colours
// (#C44536, #0E7C86) top out at 4.49:1 with either text colour, so the
// cover chip needs this; bands and tiles carry only large text and keep the
// exact brand colour.
export function fillForSmallText(fill: string, min = 4.5): { fill: string; ink: string } {
  const ink = readableOn(fill)
  const target = ink === INK ? 255 : 0
  let rgb = toRgb(fill)
  for (let i = 0; i < 40 && contrast(toHex(rgb), ink) < min; i++) {
    rgb = rgb.map((c) => c + (target - c) * 0.04)
  }
  return { fill: toHex(rgb), ink }
}
