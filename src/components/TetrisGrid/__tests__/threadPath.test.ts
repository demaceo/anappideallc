import { describe, it, expect } from 'vitest'
import { computeThreadSegments } from '../threadPath'
import type { BlockId } from '../Block'

describe('computeThreadSegments', () => {
  const fakeCenters: Record<BlockId, { x: number; y: number }> = {
    hero:     { x: 100, y: 200 },
    brand:    { x: 400, y: 100 },
    about:    { x: 500, y: 250 },
    work:     { x: 350, y: 400 },
    services: { x: 200, y: 450 },
    process:  { x: 100, y: 350 },
    contact:  { x: 250, y: 150 },
  }

  it('returns 7 segments in BLOCKS order (closed loop)', () => {
    const segs = computeThreadSegments(fakeCenters)
    expect(segs).toHaveLength(7)
    expect(segs[0].from).toBe('hero')
    expect(segs[0].to).toBe('brand')
    expect(segs[6].from).toBe('contact')
    expect(segs[6].to).toBe('hero')  // closed loop
  })

  it('each segment has a valid cubic Bézier SVG path string', () => {
    const segs = computeThreadSegments(fakeCenters)
    for (const seg of segs) {
      // M<x>,<y> C<x>,<y> <x>,<y> <x>,<y>
      expect(seg.d).toMatch(/^M[\d.\-]+,[\d.\-]+\s+C[\d.\-]+,[\d.\-]+\s+[\d.\-]+,[\d.\-]+\s+[\d.\-]+,[\d.\-]+$/)
    }
  })

  it('segment endpoints exactly match block centers (no rounding loss)', () => {
    const segs = computeThreadSegments(fakeCenters)
    // First segment starts at hero (100, 200) and ends at brand (400, 100)
    const firstStart = segs[0].d.match(/^M([\d.\-]+),([\d.\-]+)/)
    expect(parseFloat(firstStart![1])).toBeCloseTo(100, 1)
    expect(parseFloat(firstStart![2])).toBeCloseTo(200, 1)
    const firstEnd = segs[0].d.match(/([\d.\-]+),([\d.\-]+)$/)
    expect(parseFloat(firstEnd![1])).toBeCloseTo(400, 1)
    expect(parseFloat(firstEnd![2])).toBeCloseTo(100, 1)
  })

  it('handles a single-block input by returning empty array', () => {
    expect(computeThreadSegments({} as Record<BlockId, { x: number; y: number }>)).toEqual([])
  })
})
