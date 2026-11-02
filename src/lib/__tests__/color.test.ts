import { describe, it, expect } from 'vitest'
import { readableOn, contrast, fillForSmallText, INK, BONE } from '../color'
import { PROJECT_COLORS } from '../../data/project-colors'

describe('readableOn', () => {
  it('puts ink on light fills and bone on dark ones', () => {
    expect(readableOn('#ffe500')).toBe(INK)
    expect(readableOn('#abff84')).toBe(INK)
    expect(readableOn('#0a0a0a')).toBe(BONE)
    expect(readableOn('#1f6b3b')).toBe(BONE)
  })

  it('handles 3-digit hex', () => {
    expect(readableOn('#fff')).toBe(INK)
  })

  it.each(Object.entries(PROJECT_COLORS))(
    'gives %s tile text at least AA large-text contrast',
    (_slug, fill) => {
      // Tile titles are 18.66px+ bold display type; body text on the bands is
      // checked separately in the browser sweep.
      expect(contrast(fill, readableOn(fill))).toBeGreaterThanOrEqual(3)
    },
  )
})

describe('fillForSmallText', () => {
  it('leaves a colour alone when it already passes', () => {
    expect(fillForSmallText('#1a3a5c').fill).toBe('#1a3a5c')
  })

  it.each(Object.entries(PROJECT_COLORS))('makes %s carry 4.5:1 small text', (_slug, fill) => {
    const out = fillForSmallText(fill)
    expect(contrast(out.fill, out.ink)).toBeGreaterThanOrEqual(4.5)
  })

  it('nudges the two colours that miss with either text colour', () => {
    for (const hex of ['#C44536', '#0E7C86']) {
      expect(Math.max(contrast(hex, INK), contrast(hex, BONE))).toBeLessThan(4.5)
      expect(fillForSmallText(hex).fill).not.toBe(hex.toLowerCase())
    }
  })
})
