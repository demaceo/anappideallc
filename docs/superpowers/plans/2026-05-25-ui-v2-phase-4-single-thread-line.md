# UI v2.0 — Phase 4: Single-Thread Line System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render a single continuous golden thread connecting all 7 blocks of the home grid as a serpentine cubic Bézier path, with ambient shimmer and cursor-proximity highlighting. The thread sits on the velvet stage as a visual spine that Phase 5's Rube Goldberg chain reactions will animate during navigation.

**Architecture:** A new `ThreadLine` SVG component mounts inside `.playfield` (so it inherits the parallax tilt automatically without re-computing on every frame). Path geometry uses Catmull-Rom interpolation through block-center positions (computed via `offsetLeft`/`offsetTop` so they're invariant under transform). A `useBlockCenters` hook tracks layout via `ResizeObserver` and recomputes only when blocks resize/reflow. The 7 segments are individual `<path>` elements (forward-compat for Phase 5's per-segment chain-tightening animation) sharing an outer `<g>` for global stroke styling. Ambient state runs a CSS `@keyframes` shimmer (8s ease-in-out, opacity 0.12↔0.24); cursor-tracked state brightens the two segments adjacent to whichever block the cursor is within 60px of.

**Tech Stack:** Existing — React 19, Motion, CSS Modules, Vitest, happy-dom. No new runtime dependencies. SVG via React's native JSX.

**Spec reference:** `docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md` — §7.1 (Single-thread line system overview) and §8 (deep dive).

---

## File Structure

| File | Type | Responsibility |
|---|---|---|
| `src/components/TetrisGrid/threadPath.ts` | Create | Pure function `computeThreadSegments(centers)` returning `{d, from, to}[]` via Catmull-Rom interpolation through the 7 block centers; closed loop |
| `src/components/TetrisGrid/__tests__/threadPath.test.ts` | Create | Pure unit tests for the path math: returns 7 segments, closed loop, valid SVG path `d` strings |
| `src/components/TetrisGrid/useBlockCenters.ts` | Create | Hook: reads block refs + container ref, computes centers in container-local coords via `offsetLeft`/`offsetTop`, recomputes on `ResizeObserver` |
| `src/components/TetrisGrid/__tests__/useBlockCenters.test.tsx` | Create | Hook tests via `renderHook`: initial computation from mock refs, recompute on observed resize |
| `src/components/TetrisGrid/ThreadLine.module.css` | Create | SVG container layout (absolute, full-coverage, pointer-events:none); `@keyframes thread-shimmer`; cursor-tracked brightening class; reduced-motion guard |
| `src/components/TetrisGrid/__tests__/thread-line-css.test.ts` | Create | Parse-based assertions on shimmer keyframes, opacity range, reduced-motion respect |
| `src/components/TetrisGrid/ThreadLine.tsx` | Create | Component: takes `containerRef` + `blockRefs` props, renders 7 `<path>` segments, handles cursor-proximity via mousemove listener |
| `src/components/TetrisGrid/__tests__/ThreadLine.test.tsx` | Create | Component tests: renders 7 paths, has `aria-hidden`, applies cursor-near class on mousemove proximity |
| `src/components/TetrisGrid/TetrisGrid.tsx` | Modify | Mount `<ThreadLine>` inside `.playfield` as a sibling to the blocks; pass `playfieldRef` and `blockRefs` |
| `docs/ux-critique.md` | Modify | Append Phase 4 status |

**TDD pattern.** Path math is a pure function — easy reliable unit tests. The hook uses mocked `ResizeObserver` + DOM refs with stubbed `offsetLeft`/`offsetTop`. The component asserts structural rendering + event-handler wiring; visual geometry is verified manually. CSS structure uses the parse-based regex pattern from phases 1-3.

---

## Task 1 · Catmull-Rom path math (`threadPath.ts`)

**Files:**
- Create: `src/components/TetrisGrid/threadPath.ts`
- Create: `src/components/TetrisGrid/__tests__/threadPath.test.ts`

Pure function. Given 7 block centers, compute 7 cubic Bézier segments connecting them in a closed loop (last → first). Catmull-Rom interpolation gives smooth tangent continuity at each block — the thread reads as one fluent curve, not a polyline.

- [ ] **Step 1: Write the failing tests**

Create `src/components/TetrisGrid/__tests__/threadPath.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/threadPath.test.ts`
Expected: FAIL — `threadPath` module does not exist.

- [ ] **Step 3: Create the path utility**

Create `src/components/TetrisGrid/threadPath.ts`:

```typescript
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
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/threadPath.test.ts`
Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/threadPath.ts src/components/TetrisGrid/__tests__/threadPath.test.ts
git commit -m "feat(thread): add Catmull-Rom path math for serpentine thread"
```

---

## Task 2 · `useBlockCenters` hook with ResizeObserver

**Files:**
- Create: `src/components/TetrisGrid/useBlockCenters.ts`
- Create: `src/components/TetrisGrid/__tests__/useBlockCenters.test.tsx`

The hook observes the container (`.playfield`) for layout changes and recomputes block centers using `offsetLeft`/`offsetTop` (which are transform-invariant — they don't change when the playfield tilts via parallax).

- [ ] **Step 1: Write the failing tests**

Create `src/components/TetrisGrid/__tests__/useBlockCenters.test.tsx`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { RefObject } from 'react'
import { useBlockCenters } from '../useBlockCenters'
import type { BlockId } from '../Block'

interface MockAnchor {
  offsetLeft: number
  offsetTop: number
  offsetWidth: number
  offsetHeight: number
}

function makeRef(rect: MockAnchor): RefObject<HTMLAnchorElement | null> {
  return { current: rect as unknown as HTMLAnchorElement }
}

class MockResizeObserver {
  static instances: MockResizeObserver[] = []
  callback: ResizeObserverCallback
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    MockResizeObserver.instances.push(this)
  }
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  fire(entries: ResizeObserverEntry[] = []) {
    this.callback(entries, this as unknown as ResizeObserver)
  }
}

beforeEach(() => {
  MockResizeObserver.instances = []
  ;(globalThis as { ResizeObserver: typeof MockResizeObserver }).ResizeObserver =
    MockResizeObserver
})

describe('useBlockCenters', () => {
  it('returns null when container ref is null', () => {
    const containerRef: RefObject<HTMLDivElement | null> = { current: null }
    const blockRefs: { id: BlockId; ref: RefObject<HTMLAnchorElement | null> }[] = []
    const { result } = renderHook(() => useBlockCenters(containerRef, blockRefs))
    expect(result.current).toBeNull()
  })

  it('computes centers from offsetLeft/offsetTop + offsetWidth/offsetHeight halves', () => {
    const containerRef = {
      current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
    }
    const blockRefs = [
      { id: 'hero' as BlockId, ref: makeRef({ offsetLeft: 100, offsetTop: 200, offsetWidth: 200, offsetHeight: 150 }) },
      { id: 'brand' as BlockId, ref: makeRef({ offsetLeft: 400, offsetTop: 50, offsetWidth: 100, offsetHeight: 100 }) },
    ]
    const { result } = renderHook(() => useBlockCenters(containerRef, blockRefs))
    expect(result.current?.hero).toEqual({ x: 200, y: 275 })   // 100+100, 200+75
    expect(result.current?.brand).toEqual({ x: 450, y: 100 })  // 400+50, 50+50
  })

  it('recomputes when the ResizeObserver fires', () => {
    const containerRef = {
      current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
    }
    const block = { offsetLeft: 100, offsetTop: 200, offsetWidth: 200, offsetHeight: 150 }
    const blockRefs = [{ id: 'hero' as BlockId, ref: makeRef(block) }]

    const { result } = renderHook(() => useBlockCenters(containerRef, blockRefs))
    expect(result.current?.hero).toEqual({ x: 200, y: 275 })

    // Simulate a layout shift: hero block moves
    block.offsetLeft = 150
    block.offsetTop = 100
    act(() => {
      MockResizeObserver.instances[0].fire()
    })
    expect(result.current?.hero).toEqual({ x: 250, y: 175 })
  })

  it('disconnects the observer on unmount', () => {
    const containerRef = {
      current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
    }
    const blockRefs = [{ id: 'hero' as BlockId, ref: makeRef({ offsetLeft: 0, offsetTop: 0, offsetWidth: 100, offsetHeight: 100 }) }]
    const { unmount } = renderHook(() => useBlockCenters(containerRef, blockRefs))
    const observer = MockResizeObserver.instances[0]
    unmount()
    expect(observer.disconnect).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/useBlockCenters.test.tsx`
Expected: FAIL — hook doesn't exist.

- [ ] **Step 3: Create the hook**

Create `src/components/TetrisGrid/useBlockCenters.ts`:

```typescript
import { useEffect, useState, useRef } from 'react'
import type { RefObject } from 'react'
import type { BlockId } from './Block'
import type { Point } from './threadPath'

export type BlockCenters = Record<BlockId, Point>

export interface BlockRefEntry {
  id: BlockId
  ref: RefObject<HTMLAnchorElement | null>
}

function readCenters(
  blockRefs: readonly BlockRefEntry[],
): Partial<BlockCenters> | null {
  if (blockRefs.length === 0) return null
  const out: Partial<BlockCenters> = {}
  for (const { id, ref } of blockRefs) {
    const el = ref.current
    if (!el) continue
    out[id] = {
      x: el.offsetLeft + el.offsetWidth / 2,
      y: el.offsetTop + el.offsetHeight / 2,
    }
  }
  return out
}

/**
 * Observes the container's layout via ResizeObserver and returns the
 * current center positions of all blocks in container-local coordinates
 * (offsetLeft/Top space). These coordinates are TRANSFORM-INVARIANT —
 * they do not change when `.playfield` tilts via parallax, so the
 * computed thread geometry stays valid across the 3D scene.
 *
 * Returns null until the container ref is mounted, then a partial map
 * of BlockId → Point. Caller should defensively check completeness
 * before passing to `computeThreadSegments`.
 */
export function useBlockCenters(
  containerRef: RefObject<HTMLDivElement | null>,
  blockRefs: readonly BlockRefEntry[],
): Partial<BlockCenters> | null {
  const [centers, setCenters] = useState<Partial<BlockCenters> | null>(() =>
    readCenters(blockRefs),
  )

  // Stable callback ref so the effect doesn't rebind every render
  const blockRefsRef = useRef(blockRefs)
  blockRefsRef.current = blockRefs

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      setCenters(null)
      return
    }

    // Initial read on mount (covers the case where refs land after first render)
    setCenters(readCenters(blockRefsRef.current))

    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      setCenters(readCenters(blockRefsRef.current))
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [containerRef])

  return centers
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/useBlockCenters.test.tsx`
Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/useBlockCenters.ts src/components/TetrisGrid/__tests__/useBlockCenters.test.tsx
git commit -m "feat(thread): add useBlockCenters hook with ResizeObserver"
```

---

## Task 3 · `ThreadLine` CSS module + shimmer keyframes

**Files:**
- Create: `src/components/TetrisGrid/ThreadLine.module.css`
- Create: `src/components/TetrisGrid/__tests__/thread-line-css.test.ts`

CSS module covers: SVG container layout, base segment styling, ambient shimmer animation, cursor-tracked brightening class, reduced-motion guard.

- [ ] **Step 1: Write the failing CSS-structure tests**

Create `src/components/TetrisGrid/__tests__/thread-line-css.test.ts`:

```typescript
/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../ThreadLine.module.css'),
  'utf8',
)

describe('ThreadLine.module.css', () => {
  it('.threadLayer is absolute-positioned, fills container, pointer-events:none', () => {
    expect(CSS).toMatch(/\.threadLayer\s*\{[^}]*position:\s*absolute/)
    expect(CSS).toMatch(/\.threadLayer\s*\{[^}]*inset:\s*0/)
    expect(CSS).toMatch(/\.threadLayer\s*\{[^}]*pointer-events:\s*none/)
  })

  it('.segment has 1.5px golden stroke by default', () => {
    expect(CSS).toMatch(/\.segment\s*\{[^}]*stroke:[^;]*255,\s*212,\s*0/)
    expect(CSS).toMatch(/\.segment\s*\{[^}]*stroke-width:\s*1\.5/)
  })

  it('defines a thread-shimmer keyframe animation', () => {
    expect(CSS).toMatch(/@keyframes\s+thread-shimmer/)
  })

  it('shimmer cycles stroke-opacity between 0.12 and 0.24', () => {
    expect(CSS).toMatch(/@keyframes\s+thread-shimmer[^}]*0%[^}]*0\.12/s)
    expect(CSS).toMatch(/@keyframes\s+thread-shimmer[^}]*50%[^}]*0\.24/s)
  })

  it('.segment runs thread-shimmer over 8s ease-in-out infinite', () => {
    expect(CSS).toMatch(/\.segment\s*\{[^}]*animation:\s*thread-shimmer\s+8s\s+ease-in-out\s+infinite/)
  })

  it('.segmentBright class boosts opacity to 0.55', () => {
    expect(CSS).toMatch(/\.segmentBright\s*\{[^}]*stroke-opacity:\s*0\.55/)
  })

  it('reduced-motion disables the shimmer animation', () => {
    expect(CSS).toMatch(/prefers-reduced-motion:\s*reduce[^}]*\.segment[^}]*animation:\s*none/s)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/thread-line-css.test.ts`
Expected: FAIL — file doesn't exist.

- [ ] **Step 3: Create the CSS module**

Create `src/components/TetrisGrid/ThreadLine.module.css`:

```css
/* ThreadLine — the golden serpentine connecting all 7 grid blocks. The
   SVG layer sits INSIDE `.playfield` as a sibling of the blocks so it
   inherits the parallax tilt automatically (no per-frame recomputation
   needed). Path geometry uses container-local coordinates (offsetLeft/
   Top), which are transform-invariant — the SVG visually follows the
   blocks through the 3D scene without any re-projection math. */

.threadLayer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* Below blocks (which use z-index via translateZ in the playfield's
     3D context) but above the playfield's background. Setting an
     explicit 2D z-index here is fine because we're inside a
     transform-style: preserve-3d parent — the value still influences
     paint order among siblings at the same 3D depth. */
  z-index: 0;
  overflow: visible;
}

.segment {
  stroke: rgb(255, 212, 0);
  stroke-width: 1.5;
  stroke-linecap: round;
  fill: none;
  /* Ambient shimmer: opacity gently cycles between 0.12 and 0.24 over 8s,
     producing a slow breathing effect that draws attention without
     becoming UI noise. Per spec §7.1. */
  animation: thread-shimmer 8s ease-in-out infinite;
}

@keyframes thread-shimmer {
  0%   { stroke-opacity: 0.12; }
  50%  { stroke-opacity: 0.24; }
  100% { stroke-opacity: 0.12; }
}

/* Cursor-tracked highlight — applied to the two segments adjacent to
   whichever block the cursor is within 60px of. Brightens the local
   region of the thread so the visitor can sense which connection
   they're "near." */
.segmentBright {
  stroke-opacity: 0.55;
  /* Pause the ambient shimmer on the bright segments — the brightness
     should hold steady while the cursor is nearby, then ease back to
     shimmer once they move away. */
  animation-play-state: paused;
  transition: stroke-opacity 240ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  .segment {
    animation: none;
    stroke-opacity: 0.18;  /* freeze at the shimmer mid-point */
  }
  .segmentBright {
    transition: none;
  }
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/thread-line-css.test.ts`
Expected: PASS — 7 assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/ThreadLine.module.css src/components/TetrisGrid/__tests__/thread-line-css.test.ts
git commit -m "feat(thread): add ThreadLine CSS module with shimmer keyframes"
```

---

## Task 4 · `ThreadLine` component (basic render)

**Files:**
- Create: `src/components/TetrisGrid/ThreadLine.tsx`
- Create: `src/components/TetrisGrid/__tests__/ThreadLine.test.tsx`

First pass: render 7 SVG `<path>` segments computed from block centers. No cursor proximity yet (that's Task 5).

- [ ] **Step 1: Write the failing tests**

Create `src/components/TetrisGrid/__tests__/ThreadLine.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThreadLine } from '../ThreadLine'
import type { BlockId } from '../Block'

class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  constructor(_cb: ResizeObserverCallback) {}
}

beforeEach(() => {
  ;(globalThis as { ResizeObserver: typeof MockResizeObserver }).ResizeObserver =
    MockResizeObserver
})

function setupRefs() {
  const containerRef = {
    current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
  }
  const order: BlockId[] = ['hero', 'brand', 'about', 'work', 'services', 'process', 'contact']
  const blockRefs = order.map((id, i) => ({
    id,
    ref: {
      current: {
        offsetLeft: 100 + i * 80,
        offsetTop: 100 + (i % 3) * 100,
        offsetWidth: 60,
        offsetHeight: 60,
      } as unknown as HTMLAnchorElement,
    },
  }))
  return { containerRef, blockRefs }
}

describe('ThreadLine', () => {
  it('renders an SVG layer with aria-hidden="true"', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={blockRefs} />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders 7 <path> segments', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={blockRefs} />,
    )
    expect(container.querySelectorAll('path').length).toBe(7)
  })

  it('each path has a non-empty d attribute', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={blockRefs} />,
    )
    const paths = container.querySelectorAll('path')
    paths.forEach((p) => {
      const d = p.getAttribute('d')
      expect(d).toBeTruthy()
      expect(d!.length).toBeGreaterThan(10)
    })
  })

  it('renders nothing when block refs are empty', () => {
    const containerRef = {
      current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
    }
    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={[]} />,
    )
    // SVG may still render but with 0 paths
    expect(container.querySelectorAll('path').length).toBe(0)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/ThreadLine.test.tsx`
Expected: FAIL — component doesn't exist.

- [ ] **Step 3: Create the component**

Create `src/components/TetrisGrid/ThreadLine.tsx`:

```typescript
import type { RefObject } from 'react'
import { computeThreadSegments } from './threadPath'
import { useBlockCenters, type BlockRefEntry } from './useBlockCenters'
import styles from './ThreadLine.module.css'

export interface ThreadLineProps {
  containerRef: RefObject<HTMLDivElement | null>
  blockRefs: readonly BlockRefEntry[]
}

/**
 * ThreadLine — renders the golden serpentine thread connecting all 7
 * grid blocks as a closed Catmull-Rom loop. Mounted INSIDE `.playfield`
 * so it inherits the parallax tilt; coordinates are container-local
 * (offsetLeft/Top), which are transform-invariant, so the path stays
 * geometrically valid across the 3D scene.
 *
 * Ambient state: each segment runs an 8s opacity shimmer (CSS-driven).
 * Cursor-proximity brightening lands in a follow-up task.
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function ThreadLine({ containerRef, blockRefs }: ThreadLineProps) {
  const centers = useBlockCenters(containerRef, blockRefs)
  const segments = centers ? computeThreadSegments(centers) : []

  const width = containerRef.current?.offsetWidth ?? 0
  const height = containerRef.current?.offsetHeight ?? 0

  return (
    <svg
      className={styles.threadLayer}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {segments.map((seg) => (
        <path
          key={`${seg.from}-${seg.to}`}
          className={styles.segment}
          d={seg.d}
          data-from={seg.from}
          data-to={seg.to}
        />
      ))}
    </svg>
  )
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/ThreadLine.test.tsx`
Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/ThreadLine.tsx src/components/TetrisGrid/__tests__/ThreadLine.test.tsx
git commit -m "feat(thread): add ThreadLine SVG component (basic render)"
```

---

## Task 5 · Cursor-proximity segment brightening

**Files:**
- Modify: `src/components/TetrisGrid/ThreadLine.tsx`
- Modify: `src/components/TetrisGrid/__tests__/ThreadLine.test.tsx`

When the cursor is within 60px of a block center, the two segments adjacent to that block (incoming + outgoing) get the `.segmentBright` class.

- [ ] **Step 1: Write the failing tests**

Append to `ThreadLine.test.tsx` inside the existing `describe('ThreadLine', ...)` block:

```typescript
  it('applies segmentBright class to segments adjacent to a near block on mousemove', () => {
    const { containerRef, blockRefs } = setupRefs()
    // Stub container.getBoundingClientRect for cursor coordinate translation
    ;(containerRef.current as unknown as { getBoundingClientRect: () => DOMRect }).getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 1000, bottom: 800, width: 1000, height: 800, x: 0, y: 0, toJSON: () => '' } as DOMRect)

    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={blockRefs} />,
    )

    // Hero center is at (130, 130) per setupRefs math (100+30, 100+30).
    // Dispatch a mousemove at (140, 140) — within 60px of hero.
    // The brightening listener is on `containerRef.current`, so dispatch
    // there rather than on the SVG.
    const moveEvent = new MouseEvent('mousemove', { clientX: 140, clientY: 140, bubbles: true })
    ;(containerRef.current as unknown as HTMLDivElement).dispatchEvent?.(moveEvent)

    // After mousemove, segments adjacent to hero (hero→brand and contact→hero)
    // should have the segmentBright class. happy-dom's CSS module class
    // names are hashed; we check via data-from/data-to selectors.
    // Wait one tick for the listener.
    return Promise.resolve().then(() => {
      const heroOutgoing = container.querySelector('path[data-from="hero"]') as SVGPathElement | null
      const heroIncoming = container.querySelector('path[data-to="hero"]') as SVGPathElement | null
      expect(heroOutgoing?.className.baseVal).toMatch(/segmentBright/)
      expect(heroIncoming?.className.baseVal).toMatch(/segmentBright/)
    })
  })

  it('removes segmentBright when cursor moves away from all blocks', () => {
    const { containerRef, blockRefs } = setupRefs()
    ;(containerRef.current as unknown as { getBoundingClientRect: () => DOMRect }).getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 1000, bottom: 800, width: 1000, height: 800, x: 0, y: 0, toJSON: () => '' } as DOMRect)

    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={blockRefs} />,
    )

    // First near hero
    ;(containerRef.current as unknown as HTMLDivElement).dispatchEvent?.(
      new MouseEvent('mousemove', { clientX: 140, clientY: 140, bubbles: true }),
    )
    // Then far away
    ;(containerRef.current as unknown as HTMLDivElement).dispatchEvent?.(
      new MouseEvent('mousemove', { clientX: 900, clientY: 700, bubbles: true }),
    )

    return Promise.resolve().then(() => {
      const paths = container.querySelectorAll('path')
      paths.forEach((p) => {
        expect(p.className.baseVal).not.toMatch(/segmentBright/)
      })
    })
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/ThreadLine.test.tsx`
Expected: FAIL — bright class not applied.

- [ ] **Step 3: Update `ThreadLine.tsx` to add the proximity handler**

Replace `src/components/TetrisGrid/ThreadLine.tsx` with:

```typescript
import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { computeThreadSegments } from './threadPath'
import { useBlockCenters, type BlockRefEntry } from './useBlockCenters'
import type { BlockId } from './Block'
import styles from './ThreadLine.module.css'

export interface ThreadLineProps {
  containerRef: RefObject<HTMLDivElement | null>
  blockRefs: readonly BlockRefEntry[]
}

const PROXIMITY_PX = 60

/**
 * ThreadLine — renders the golden serpentine thread connecting all 7
 * grid blocks as a closed Catmull-Rom loop. Mounted INSIDE `.playfield`
 * so it inherits the parallax tilt; coordinates are container-local
 * (offsetLeft/Top), which are transform-invariant, so the path stays
 * geometrically valid across the 3D scene.
 *
 * Ambient state: each segment runs an 8s opacity shimmer (CSS-driven).
 * Cursor proximity: when the pointer is within PROXIMITY_PX of a block's
 * center (container-local coords), the two segments touching that block
 * brighten to 0.55 stroke-opacity. Cursor coords come from mousemove on
 * the container; brightening updates via React state.
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function ThreadLine({ containerRef, blockRefs }: ThreadLineProps) {
  const centers = useBlockCenters(containerRef, blockRefs)
  const segments = centers ? computeThreadSegments(centers) : []

  const [nearBlock, setNearBlock] = useState<BlockId | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !centers) return

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      let closest: { id: BlockId; dist: number } | null = null
      for (const [id, pt] of Object.entries(centers) as [BlockId, { x: number; y: number }][]) {
        const dx = pt.x - x
        const dy = pt.y - y
        const dist = Math.hypot(dx, dy)
        if (!closest || dist < closest.dist) {
          closest = { id, dist }
        }
      }
      const next = closest && closest.dist <= PROXIMITY_PX ? closest.id : null
      // Avoid re-renders unless the near-block actually changes
      setNearBlock((prev) => (prev === next ? prev : next))
    }

    container.addEventListener('mousemove', onMove)
    return () => container.removeEventListener('mousemove', onMove)
  }, [containerRef, centers])

  const width = containerRef.current?.offsetWidth ?? 0
  const height = containerRef.current?.offsetHeight ?? 0

  return (
    <svg
      className={styles.threadLayer}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {segments.map((seg) => {
        const adjacent = nearBlock !== null && (seg.from === nearBlock || seg.to === nearBlock)
        const className = `${styles.segment} ${adjacent ? styles.segmentBright : ''}`
        return (
          <path
            key={`${seg.from}-${seg.to}`}
            className={className}
            d={seg.d}
            data-from={seg.from}
            data-to={seg.to}
          />
        )
      })}
    </svg>
  )
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/ThreadLine.test.tsx`
Expected: PASS — 6 tests pass (4 existing + 2 new).

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/ThreadLine.tsx src/components/TetrisGrid/__tests__/ThreadLine.test.tsx
git commit -m "feat(thread): brighten adjacent segments on cursor proximity"
```

---

## Task 6 · Mount `ThreadLine` inside `TetrisGrid`

**Files:**
- Modify: `src/components/TetrisGrid/TetrisGrid.tsx`
- Modify: `src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`

The ThreadLine sits inside `.playfield` as a sibling to the blocks so it inherits the parallax tilt. Pass `playfieldRef` (the existing parallax ref) and the existing `blockRefs` array.

- [ ] **Step 1: Write the failing test**

Append to `tetris-grid.test.tsx`:

```typescript
  it('mounts a ThreadLine SVG inside the playfield', () => {
    const { container } = renderTetrisGrid()
    // The thread layer is an SVG with aria-hidden="true" that lives
    // inside .playfield. We can find it by querying for an svg child of
    // the playfield container.
    const svg = container.querySelector('svg[aria-hidden="true"]')
    expect(svg).toBeInTheDocument()
    // It should contain 7 path elements (one per inter-block segment)
    expect(svg?.querySelectorAll('path').length).toBe(7)
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`
Expected: FAIL — no ThreadLine mounted yet.

- [ ] **Step 3: Update `TetrisGrid.tsx` to mount the ThreadLine**

Open `src/components/TetrisGrid/TetrisGrid.tsx`. Add the import:

```typescript
import { ThreadLine } from './ThreadLine'
```

Find the JSX where `.playfield` is rendered (the `<div className={styles.playfield}>` element holding the blocks). Add `<ThreadLine>` as the LAST child of that div, AFTER the blocks but before the closing tag:

```jsx
<div ref={playfieldRef} className={styles.playfield} /* ...existing props... */>
  {/* ...existing block rendering... */}
  <ThreadLine containerRef={playfieldRef} blockRefs={blockRefs} />
</div>
```

The `playfieldRef` and `blockRefs` already exist in TetrisGrid; we're just consuming them.

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`
Expected: PASS — new ThreadLine test + all existing tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/TetrisGrid.tsx src/components/TetrisGrid/__tests__/tetris-grid.test.tsx
git commit -m "feat(tetris-grid): mount ThreadLine inside playfield"
```

---

## Task 7 · Theme switch — verify color updates

**Files:** No code changes — verification only.

The thread stroke color is hardcoded as `rgb(255, 212, 0)` (gold) in CSS. This is intentional — the gold thread reads consistently across all 4 themes. But if a future cycle wants per-theme thread color, the variable hookup pattern would be `stroke: var(--thread-color, rgb(255, 212, 0))` in the CSS.

- [ ] **Step 1: Verify the gold reads correctly on all 4 themes**

Run `pnpm dev` and:
- [ ] Modern-vibrant: gold thread visible at low opacity over velvet stage
- [ ] Classic (Konami): gold thread visible over black background
- [ ] Pastel (Konami): gold thread visible over cream background (verify contrast acceptable)
- [ ] Arcade-neon (Konami): gold thread visible over deep purple background

If pastel contrast is poor, note it but DO NOT change in this phase — flag for Phase 7 (per-theme worlds) or as a follow-up.

- [ ] **Step 2: No commit (verification only)**

Continue to Task 8.

---

## Task 8 · Verify tests + production build (controller)

**Files:** No code changes — verification only.

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: 217 (post-audit-cleanup baseline) + ~20 new tests (Phase 4) = ~237 tests passing.

Breakdown of new tests:
- threadPath: 4
- useBlockCenters: 4
- thread-line-css: 7
- ThreadLine: 4 (basic) + 2 (proximity) = 6
- tetris-grid: 1 (mount assertion)
Total: 22 new tests → expected ~239 final.

- [ ] **Step 2: TypeScript check**

Run: `pnpm exec tsc --noEmit -p tsconfig.app.json`
Expected: no output (clean).

- [ ] **Step 3: Production build**

Run: `pnpm build`
Expected: clean build; all 6 routes prerendered.

- [ ] **Step 4: Inspect built bundle for Phase 4 patterns**

```bash
grep -c "thread-shimmer" dist/assets/*.css
grep -o "threadLayer\|segmentBright" dist/assets/*.css | sort -u
```

Expected: at least 1 match for `thread-shimmer` (keyframe), and both class names (with their hashed forms) present.

- [ ] **Step 5: No commit (verification only)**

Continue to Task 9.

---

## Task 9 · Manual visual verification

**Files:** No code changes — manual smoke test.

Run `pnpm dev` and verify on `http://localhost:5173/`:

- [ ] **Step 1: Thread renders on home**

- [ ] Open the home page on modern-vibrant
- [ ] A golden thread is visible connecting all 7 blocks in a smooth serpentine curve (hero → brand → about → work → services → process → contact → hero closed loop)
- [ ] The thread is faint (~0.18 opacity at rest) — not visually dominant
- [ ] Watch for 8 seconds: opacity gently breathes between brighter and dimmer (the shimmer)

- [ ] **Step 2: Cursor proximity brightens segments**

- [ ] Hover the cursor near (but not on) a block — within ~60px of its center
- [ ] The two segments adjacent to that block visibly brighten (~0.55 opacity)
- [ ] Move cursor away — segments fade back to ambient over ~240ms
- [ ] Quickly move cursor between blocks — brightening should follow smoothly

- [ ] **Step 3: Parallax follows correctly**

- [ ] Move cursor across the page — the playfield tilts via parallax
- [ ] The thread tilts WITH the blocks, staying visually attached to block centers
- [ ] No drift or "thread lagging behind blocks" effect

- [ ] **Step 4: Material switch leaves thread unchanged**

- [ ] Click the Brand block → Materials Panel opens
- [ ] Switch to Polished Steel, Frosted Glass, Showcase
- [ ] The thread stays gold (no color change) — this is intentional, gold reads across all materials
- [ ] Close panel; thread continues shimmering

- [ ] **Step 5: Reduced-motion**

- [ ] DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`
- [ ] Shimmer animation stops; thread holds at ~0.18 opacity
- [ ] Cursor proximity still brightens (CSS transitions are disabled but the class-driven opacity change is instant)

- [ ] **Step 6: Theme switch (Konami)**

- [ ] Konami code → switch to classic / pastel / arcade-neon
- [ ] Thread is still visible on all themes
- [ ] If any theme has unacceptable contrast (especially pastel), note for follow-up

- [ ] **Step 7: Stop dev server (Ctrl+C)**

- [ ] **Step 8: Capture screenshots**

Save screenshots of the home with the thread visible at ambient state and during cursor proximity to `docs/superpowers/specs/screenshots/2026-05-25-v2-phase-4-*.png`.

- [ ] **Step 9: Commit screenshots**

```bash
git add docs/superpowers/specs/screenshots/2026-05-25-v2-phase-4-*.png
git commit -m "docs(spec): add Phase 4 visual reference screenshots"
```

---

## Task 10 · Update UX critique implementation status

**Files:**
- Modify: `docs/ux-critique.md`

- [ ] **Step 1: Append Phase 4 status section**

Open `docs/ux-critique.md` and append after the existing Phase 3 entry:

```markdown

### Phase 4 — Single-Thread Line System (completed 2026-05-25)

Added the golden serpentine thread connecting all 7 grid blocks as a closed Catmull-Rom Bézier loop. The thread is a `<ThreadLine>` SVG layer mounted inside `.playfield` as a sibling to the blocks, so it inherits the parallax tilt automatically. Path geometry computes from block `offsetLeft`/`offsetTop` (transform-invariant coordinates), recomputed on `ResizeObserver` events — never on every parallax frame. Each segment runs an 8s opacity shimmer at ambient (0.12 ↔ 0.24). When the cursor approaches within 60px of a block's center, the two segments adjacent to that block brighten to 0.55 over 240ms, creating a localized "you're near this connection" cue. Reduced-motion freezes the shimmer at the mid-point and disables transitions.

The 7 path segments are individual `<path>` elements (not a single continuous path) — forward-compat for Phase 5's chain-reaction `pathLength` tightening animation, which needs per-segment control.

See `docs/superpowers/plans/2026-05-25-ui-v2-phase-4-single-thread-line.md` for the full implementation log.
```

- [ ] **Step 2: Commit**

```bash
git add docs/ux-critique.md
git commit -m "docs(critique): record Phase 4 thread-line system in implementation status"
```

---

## Definition of Done

Phase 4 is complete when ALL of the following are true:

- [ ] All 10 tasks above are checked off
- [ ] `pnpm test` passes with 0 failures (~239 tests)
- [ ] `pnpm build` produces a clean production build
- [ ] Manual visual verification (Task 9) checklist 100% clean
- [ ] The thread renders correctly across all 4 themes (or contrast notes filed for follow-up)
- [ ] All commits clean and bisectable
- [ ] PR #4's branch updated with Phase 4 commits stacked on Phase 3 + audit cleanup

---

## What is intentionally NOT in Phase 4

These items are deferred to later phases:

- Chain-reaction `pathLength` animation during navigation (Phase 5)
- Per-block Rube Goldberg gadgets that the thread connects through (Phase 5)
- 3D `TubeGeometry` upgrade for the thread (post-launch optional)
- Per-theme thread color overrides (Phase 7 if needed)
- Mobile-specific thread routing or omission (Phase 8 if needed)

The thread API (segment array exposed via `data-from` / `data-to` attributes, per-segment `<path>` elements with `className` driven by component state) is structured to support Phase 5's per-segment animation directly — no architectural changes needed.

---

## Forward-Compat Notes for Phase 5

- **Per-segment animation:** Each `<path>` already has stable `data-from` / `data-to` attributes. Phase 5 can target a specific segment via `path[data-from="hero"][data-to="brand"]` and animate its `pathLength` via Motion. Add a `chainState` prop to `ThreadLine` that takes `{ active: BlockId | null, progress: number }` and conditionally applies a third CSS class (`.segmentTightening`) that overrides shimmer + brightening.

- **Cursor handler conflict:** When a chain reaction is firing, the cursor-proximity brightening should YIELD to the chain state. Either: (a) pause the mousemove listener while `chainState.active !== null`, or (b) layer chain state's `.segmentTightening` class with higher specificity than `.segmentBright`. Recommend (b) — keeps the handler reactive even during chain animations.

- **Path recomputation during transitions:** If Phase 5 introduces a "block flies out" animation (block leaves its grid slot during navigation), the thread should detach from that block. The simplest path: on chain-active, freeze the path at its current geometry until navigation completes, then recompute fresh. This is a small follow-up — the current ResizeObserver-driven flow will naturally pick up the new layout after Phase 5's animations settle.
