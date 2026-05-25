import type { BlockId } from './Block'

export interface Point {
  x: number
  y: number
}

export interface ThreadSegment {
  /** SVG cubic Bézier `d` attribute string: "M<x>,<y> C<c1x>,<c1y> <c2x>,<c2y> <ex>,<ey>" */
  d: string
  /** BlockId where this segment starts. */
  from: BlockId
  /** BlockId where this segment ends. */
  to: BlockId
}

/**
 * Block order around the serpentine thread. Defines the closed loop:
 * hero → brand → about → work → services → process → contact → hero.
 */
export const THREAD_ORDER: BlockId[] = [
  'hero',
  'brand',
  'about',
  'work',
  'services',
  'process',
  'contact',
]

/**
 * Catmull-Rom tension. 1/6 produces a smooth curve where the tangent at
 * each control point P_i points in the direction (P_{i+1} - P_{i-1}).
 * Higher values bow the curve outward; lower values flatten toward
 * straight-line segments.
 */
const TENSION = 1 / 6

/**
 * Compute a closed-loop smooth path through the 7 block centers via
 * Catmull-Rom interpolation. Each pair of consecutive centers becomes
 * one cubic Bézier segment whose control points are derived from the
 * neighboring centers — this guarantees C1 (tangent) continuity at
 * every block, so the thread reads as a single flowing curve.
 *
 * Returns 7 segments (closing the loop): hero→brand, brand→about, …,
 * contact→hero. Returns an empty array if any required center is
 * missing (defensive — caller should ensure all 7 are present).
 */
export function computeThreadSegments(
  centers: Partial<Record<BlockId, Point>>,
): ThreadSegment[] {
  // Verify all 7 centers are present
  const points: Point[] = []
  for (const id of THREAD_ORDER) {
    const p = centers[id]
    if (!p) return []
    points.push(p)
  }

  const n = points.length
  const segments: ThreadSegment[] = []

  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n]
    const p1 = points[i]
    const p2 = points[(i + 1) % n]
    const p3 = points[(i + 2) % n]

    // Catmull-Rom → Bézier control point conversion
    const c1: Point = {
      x: p1.x + (p2.x - p0.x) * TENSION,
      y: p1.y + (p2.y - p0.y) * TENSION,
    }
    const c2: Point = {
      x: p2.x - (p3.x - p1.x) * TENSION,
      y: p2.y - (p3.y - p1.y) * TENSION,
    }

    const d = `M${p1.x},${p1.y} C${c1.x.toFixed(2)},${c1.y.toFixed(2)} ${c2.x.toFixed(2)},${c2.y.toFixed(2)} ${p2.x},${p2.y}`

    segments.push({
      d,
      from: THREAD_ORDER[i],
      to: THREAD_ORDER[(i + 1) % n],
    })
  }

  return segments
}
