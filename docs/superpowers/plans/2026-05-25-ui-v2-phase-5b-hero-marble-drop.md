# UI v2.0 — Phase 5b: Hero Marble Drop — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the first visible chain-reaction gadget: when the Hero block is clicked, a golden marble drops from above the viewport, lands on the Hero block with a satisfying squash, and the chain completes. Validates the visual rendering pipeline (a `ChainOverlay` component reads chain state from `useChain` and renders per-block choreography) so subsequent phases can extend with bell-ring + aurora-grow + the other 5 block sequences.

**Architecture:** New `ChainOverlay` component mounts as a sibling of `ThreadLine` inside `.playfield`. It reads `activeBlock` from `useChain()` and `blockRefs` from a prop. When `activeBlock === 'hero'`, it renders a Motion-animated golden marble that travels from above-viewport down to the Hero block's center over ~900ms (accelerating curve), then a 150ms squash on impact. The chain step's total duration is bumped to 1500ms so the visual has time to complete cleanly before navigation fires. No physics engine — purely Motion choreography (no new runtime deps).

**Tech Stack:** Existing — React 19, Motion (`motion/react`), CSS Modules, Vitest, happy-dom. **Zero new runtime dependencies.**

**Spec reference:** `docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md` §7.2 (Hero row: "Marble drops → bell rings → aurora chamber opens"). Phase 5b ships only the marble drop portion; bell + aurora-grow follow in Phase 5c.

---

## File Structure

| File | Type | Responsibility |
|---|---|---|
| `src/lib/chain-context.ts` | Modify | Bump Hero's sequence to 1500ms (gives the marble + squash time to land cleanly) |
| `src/lib/__tests__/chain-context.test.ts` | Modify | Update assertion: hero sequence is now `{ kind: 'wait', durationMs: 1500 }` |
| `src/components/TetrisGrid/ChainOverlay/ChainOverlay.tsx` | Create | Container component. Reads `activeBlock` from `useChain`; for `'hero'`, renders `<HeroMarbleDrop>` positioned over the Hero block center via `blockRefs` |
| `src/components/TetrisGrid/ChainOverlay/ChainOverlay.module.css` | Create | Container layout (absolute, full-coverage, pointer-events:none) |
| `src/components/TetrisGrid/ChainOverlay/HeroMarbleDrop.tsx` | Create | The actual marble visual: a Motion `motion.div` containing an SVG circle (radial gradient gold), animated from above-viewport down to a target Y |
| `src/components/TetrisGrid/ChainOverlay/HeroMarbleDrop.module.css` | Create | Marble visual styles: SVG sizing, drop animation timing variables |
| `src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx` | Create | Renders nothing when activeBlock !== 'hero'; renders marble container when hero is active |
| `src/components/TetrisGrid/ChainOverlay/__tests__/HeroMarbleDrop.test.tsx` | Create | Renders the marble; respects motion config |
| `src/components/TetrisGrid/TetrisGrid.tsx` | Modify | Mount `<ChainOverlay containerRef={playfieldRef} blockRefs={blockRefs} />` next to `<ThreadLine>` inside `.playfield` |
| `docs/ux-critique.md` | Modify | Append Phase 5b status |

---

## Task 1 · Bump Hero sequence duration to 1500ms

**Files:**
- Modify: `src/lib/chain-context.ts`
- Modify: `src/lib/__tests__/chain-context.test.ts`

The marble drop visual takes ~900ms + 150ms squash + 450ms buffer. Total 1500ms gives breathing room for the eye to register the landing before navigation fires.

- [ ] **Step 1: Update the existing assertion**

Open `src/lib/__tests__/chain-context.test.ts`. Find the test "Phase 5a placeholder sequences are single wait steps of DEFAULT_CHAIN_DURATION_MS". Replace it with:

```typescript
  it('hero sequence is a 1500ms wait (allowing marble drop + squash time)', () => {
    const heroSeq = BLOCK_SEQUENCES.hero!
    expect(heroSeq).toHaveLength(1)
    expect(heroSeq[0]).toEqual({ kind: 'wait', durationMs: 1500 })
  })

  it('other blocks remain at DEFAULT_CHAIN_DURATION_MS (1200ms placeholder)', () => {
    for (const id of ['about', 'work', 'services', 'process', 'contact'] as BlockId[]) {
      const seq = BLOCK_SEQUENCES[id]!
      expect(seq).toHaveLength(1)
      expect(seq[0]).toEqual({ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS })
    }
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/lib/__tests__/chain-context.test.ts`
Expected: FAIL — hero sequence is still 1200ms.

- [ ] **Step 3: Update `chain-context.ts`**

Open `src/lib/chain-context.ts`. Add a constant near `DEFAULT_CHAIN_DURATION_MS`:

```typescript
/** Hero's marble drop + squash needs more time than a generic placeholder. */
export const HERO_CHAIN_DURATION_MS = 1500
```

Update the hero entry in `BLOCK_SEQUENCES`:

```typescript
hero: [{ kind: 'wait', durationMs: HERO_CHAIN_DURATION_MS }],
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/lib/__tests__/chain-context.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/chain-context.ts src/lib/__tests__/chain-context.test.ts
git commit -m "feat(chain): bump hero sequence to 1500ms for marble drop"
```

---

## Task 2 · Create `HeroMarbleDrop` component

**Files:**
- Create: `src/components/TetrisGrid/ChainOverlay/HeroMarbleDrop.module.css`
- Create: `src/components/TetrisGrid/ChainOverlay/HeroMarbleDrop.tsx`
- Create: `src/components/TetrisGrid/ChainOverlay/__tests__/HeroMarbleDrop.test.tsx`

The marble is a positioned `<motion.div>` containing an inline SVG. The SVG has a `<circle>` with a `<radialGradient>` fill (golden orb effect) plus a small white highlight. Sized 28px diameter.

The Motion animation drops the marble from `y: '-110vh'` (just above viewport) down to `y: 0` (the target position is set by the parent via positioning) over 900ms with an accelerating curve (`cubic-bezier(0.55, 0, 0.68, 0.67)` — easeIn quadratic), then squashes (scaleY 0.6 → 1.0 over 150ms) on impact.

The component takes a `targetX` + `targetY` prop (container-local pixel coords of the Hero block center) and positions itself absolutely.

- [ ] **Step 1: Create the CSS module**

Create `src/components/TetrisGrid/ChainOverlay/HeroMarbleDrop.module.css`:

```css
/* Hero marble — a golden orb that drops from above the viewport onto
   the Hero block as part of the chain reaction. Pure CSS positioning;
   the drop + squash animation is Motion-driven in the component. */

.marbleWrapper {
  position: absolute;
  width: 28px;
  height: 28px;
  /* The wrapper sits at the target (Hero block center). The inner
     motion.div uses transform: translateY(...) to start above-viewport
     and animate down. Centering the visual is done via -50% offsets
     so the target coords reference the marble's center. */
  margin-left: -14px;
  margin-top: -14px;
  pointer-events: none;
  will-change: transform;
}

.marble {
  width: 100%;
  height: 100%;
  /* Apply shadow on the wrapper level so the marble's translateY
     during the drop animation carries the shadow with it. */
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

@media (prefers-reduced-motion: reduce) {
  .marble {
    /* In reduced-motion the marble shouldn't visibly drop. ChainOverlay
       skips rendering entirely under reduced-motion (the chain provider
       fast-paths to onComplete) — but as a defensive belt-and-suspenders,
       neutralize visible motion if somehow rendered. */
    transform: none;
  }
}
```

- [ ] **Step 2: Write the failing tests**

Create `src/components/TetrisGrid/ChainOverlay/__tests__/HeroMarbleDrop.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeroMarbleDrop } from '../HeroMarbleDrop'

describe('HeroMarbleDrop', () => {
  it('renders a marble SVG positioned at the target coords', () => {
    const { container } = render(<HeroMarbleDrop targetX={300} targetY={250} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.style.left).toBe('300px')
    expect(wrapper.style.top).toBe('250px')
    expect(wrapper.querySelector('svg')).toBeInTheDocument()
    expect(wrapper.querySelector('circle')).toBeInTheDocument()
  })

  it('the marble wrapper has aria-hidden="true"', () => {
    const { container } = render(<HeroMarbleDrop targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('uses a radial gradient for the golden orb fill', () => {
    const { container } = render(<HeroMarbleDrop targetX={0} targetY={0} />)
    expect(container.querySelector('radialGradient')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/HeroMarbleDrop.test.tsx`
Expected: FAIL — `HeroMarbleDrop` doesn't exist.

- [ ] **Step 4: Create the component**

Create `src/components/TetrisGrid/ChainOverlay/HeroMarbleDrop.tsx`:

```typescript
import { motion } from 'motion/react'
import { useId } from 'react'
import styles from './HeroMarbleDrop.module.css'

export interface HeroMarbleDropProps {
  /** Container-local X coordinate of the marble's landing center, in pixels. */
  targetX: number
  /** Container-local Y coordinate of the marble's landing center, in pixels. */
  targetY: number
}

/**
 * Hero marble — the visual gadget for Hero's chain sequence. A golden
 * orb drops from above the viewport onto the Hero block center over
 * 900ms with an accelerating curve (ease-in quadratic — gravity feel),
 * then squashes vertically for 150ms on impact (scaleY 0.6 → 1.0,
 * 50ms compress + 100ms recover).
 *
 * Positioning: the wrapper sits at (targetX, targetY) in container-local
 * coordinates with -50% offsets so the marble's center matches the
 * target. The drop is driven by a translateY animation from the marble
 * starting position (well above the wrapper) down to 0.
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function HeroMarbleDrop({ targetX, targetY }: HeroMarbleDropProps) {
  const gradientId = useId()
  return (
    <div
      className={styles.marbleWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <motion.svg
        className={styles.marble}
        viewBox="0 0 28 28"
        // Drop animation: start above (translateY -800), end at 0.
        // ease-in quadratic curve simulates gravity.
        initial={{ translateY: -800, scaleY: 1 }}
        animate={{
          translateY: [-800, 0, 0],
          scaleY: [1, 0.6, 1],
        }}
        transition={{
          translateY: { duration: 0.9, ease: [0.55, 0, 0.68, 0.67] },
          scaleY: {
            duration: 1.05,
            times: [0, 0.857, 1],   // 0 → 0.9s drop, 0.9-1.05s squash
            ease: 'easeOut',
          },
        }}
      >
        <defs>
          <radialGradient id={gradientId} cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#ffe066" />
            <stop offset="70%" stopColor="#ffb800" />
            <stop offset="100%" stopColor="#b07700" />
          </radialGradient>
        </defs>
        <circle cx="14" cy="14" r="13" fill={`url(#${gradientId})`} />
        <circle cx="10" cy="9" r="2.5" fill="rgba(255,255,255,0.7)" />
      </motion.svg>
    </div>
  )
}
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/HeroMarbleDrop.test.tsx`
Expected: PASS — 3 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/TetrisGrid/ChainOverlay/HeroMarbleDrop.tsx src/components/TetrisGrid/ChainOverlay/HeroMarbleDrop.module.css src/components/TetrisGrid/ChainOverlay/__tests__/HeroMarbleDrop.test.tsx
git commit -m "feat(chain): add HeroMarbleDrop component (golden orb visual)"
```

---

## Task 3 · Create `ChainOverlay` component (dispatcher)

**Files:**
- Create: `src/components/TetrisGrid/ChainOverlay/ChainOverlay.module.css`
- Create: `src/components/TetrisGrid/ChainOverlay/ChainOverlay.tsx`
- Create: `src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx`

The overlay sits inside `.playfield` as a sibling to `.grid` and `ThreadLine`. Reads `activeBlock` from `useChain()`. For each supported block, renders that block's gadget visual positioned over the block's center.

In Phase 5b, only `hero` has a visual (the marble). Other blocks render nothing.

- [ ] **Step 1: Create the CSS module**

Create `src/components/TetrisGrid/ChainOverlay/ChainOverlay.module.css`:

```css
/* ChainOverlay — full-coverage layer for chain-reaction gadget visuals.
   Inside `.playfield` so it inherits the parallax tilt automatically.
   pointer-events:none so it never intercepts clicks; AnimatePresence
   in the component handles mount/unmount via the chain state. */

.overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* Above ThreadLine (z-index:0) so the marble paints on top of the
     thread; below the vignette in VelvetStage (z-index:10). */
  z-index: 5;
  overflow: visible;
}
```

- [ ] **Step 2: Write the failing tests**

Create `src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx`:

```typescript
import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { RefObject } from 'react'
import { ChainProvider, useChain } from '../../../../lib/chain'
import { ChainOverlay } from '../ChainOverlay'
import type { BlockId } from '../../Block'
import type { BlockRefEntry } from '../../useBlockCenters'

function makeBlockRef(rect: { offsetLeft: number; offsetTop: number; offsetWidth: number; offsetHeight: number }) {
  return { current: rect as unknown as HTMLAnchorElement }
}

function setupRefs() {
  const containerRef: RefObject<HTMLDivElement | null> = {
    current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
  }
  const order: BlockId[] = ['hero', 'brand', 'about', 'work', 'services', 'process', 'contact']
  const blockRefs: BlockRefEntry[] = order.map((id, i) => ({
    id,
    ref: makeBlockRef({
      offsetLeft: 100 + i * 80,
      offsetTop: 100 + (i % 3) * 100,
      offsetWidth: 60,
      offsetHeight: 60,
    }),
  }))
  return { containerRef, blockRefs }
}

function ChainStarter({ blockId }: { blockId: BlockId }) {
  const { startChain } = useChain()
  return (
    <button data-testid="start" onClick={() => startChain(blockId, () => {})}>start</button>
  )
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ChainOverlay', () => {
  it('renders nothing in DOM when no chain is active', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container } = render(
      <ChainProvider>
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    // The overlay div may exist but no marble inside it
    expect(container.querySelector('svg')).toBeNull()
  })

  it('renders the marble when activeBlock is hero', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="hero" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('does NOT render a visual when activeBlock is any non-hero block (Phase 5b scope)', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="work" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    // work's gadget visual isn't shipped yet (Phase 5c+)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('overlay container has data-chain-overlay attribute (for inspection / Phase 5c hooks)', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container } = render(
      <ChainProvider>
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    expect(container.querySelector('[data-chain-overlay]')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx`
Expected: FAIL — `ChainOverlay` doesn't exist.

- [ ] **Step 4: Create the dispatcher**

Create `src/components/TetrisGrid/ChainOverlay/ChainOverlay.tsx`:

```typescript
import type { RefObject } from 'react'
import { useChain } from '../../../lib/chain'
import { useBlockCenters, type BlockRefEntry } from '../useBlockCenters'
import { HeroMarbleDrop } from './HeroMarbleDrop'
import styles from './ChainOverlay.module.css'

export interface ChainOverlayProps {
  containerRef: RefObject<HTMLDivElement | null>
  blockRefs: readonly BlockRefEntry[]
}

/**
 * ChainOverlay — full-coverage layer that renders the active chain
 * reaction's gadget visuals. Sits inside `.playfield` as a sibling
 * to `.grid` and `ThreadLine`. Reads `activeBlock` from `useChain()`
 * and dispatches to per-block gadget components positioned over each
 * block's center (looked up via `blockRefs` + `useBlockCenters`).
 *
 * Phase 5b ships only the Hero marble drop. Other blocks' visuals
 * land in Phase 5c+ — `activeBlock` matching `about` / `work` / etc.
 * currently renders nothing.
 *
 * Decorative — pointer-events:none, no interactive content.
 */
export function ChainOverlay({ containerRef, blockRefs }: ChainOverlayProps) {
  const { activeBlock } = useChain()
  const snapshot = useBlockCenters(containerRef, blockRefs)
  const heroCenter = snapshot?.centers.hero

  return (
    <div className={styles.overlay} data-chain-overlay>
      {activeBlock === 'hero' && heroCenter && (
        <HeroMarbleDrop targetX={heroCenter.x} targetY={heroCenter.y} />
      )}
    </div>
  )
}
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx`
Expected: PASS — 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/TetrisGrid/ChainOverlay/ChainOverlay.tsx src/components/TetrisGrid/ChainOverlay/ChainOverlay.module.css src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx
git commit -m "feat(chain): add ChainOverlay dispatcher with hero marble support"
```

---

## Task 4 · Mount `ChainOverlay` in `TetrisGrid`

**Files:**
- Modify: `src/components/TetrisGrid/TetrisGrid.tsx`
- Modify: `src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`

The overlay sits inside `.playfield` next to `ThreadLine`. It needs `playfieldRef` and `blockRefs` — already available locally.

- [ ] **Step 1: Append test to tetris-grid.test.tsx**

```typescript
  it('mounts a ChainOverlay inside the playfield', () => {
    const { container } = renderTetrisGrid()
    expect(container.querySelector('[data-chain-overlay]')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`
Expected: FAIL — overlay not mounted yet.

- [ ] **Step 3: Update `TetrisGrid.tsx`**

Add import:

```typescript
import { ChainOverlay } from './ChainOverlay/ChainOverlay'
```

Find the existing `<ThreadLine containerRef={playfieldRef} blockRefs={blockRefs} />` mount inside `.playfield`. Add `<ChainOverlay>` IMMEDIATELY AFTER it (so it renders on top of the thread in DOM order):

```jsx
<ThreadLine containerRef={playfieldRef} blockRefs={blockRefs} />
<ChainOverlay containerRef={playfieldRef} blockRefs={blockRefs} />
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/TetrisGrid.tsx src/components/TetrisGrid/__tests__/tetris-grid.test.tsx
git commit -m "feat(tetris-grid): mount ChainOverlay inside playfield"
```

---

## Task 5 · Verify tests + production build (controller)

**Files:** No code changes — verification only.

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`
Expected: 259 (Phase 5a baseline) + ~10 new (5b additions) = ~269 tests passing.

Breakdown:
- chain-context updated: net 0 (replaced 1 test with 2)
- HeroMarbleDrop: 3
- ChainOverlay: 4
- tetris-grid mount: 1
Total: ~8 new → expected ~267.

- [ ] **Step 2: TypeScript check**

Run: `pnpm exec tsc --noEmit -p tsconfig.app.json`
Expected: no output.

- [ ] **Step 3: Production build**

Run: `pnpm build`
Expected: clean build.

- [ ] **Step 4: Inspect bundle for Phase 5b patterns**

```bash
grep -c "HeroMarbleDrop\|marbleWrapper\|chain-overlay" dist/assets/*.js dist/assets/*.css 2>/dev/null
```

Expected: at least 1 match per pattern in either CSS or JS.

- [ ] **Step 5: No commit (verification only)**

Continue to Task 6.

---

## Task 6 · Manual visual verification

**Files:** No code changes — manual smoke test.

Run `pnpm dev`. On the modern-vibrant home grid:

- [ ] **Step 1: Click the Hero block**

- [ ] A golden marble drops from above the viewport
- [ ] The marble lands on the Hero block's center over ~900ms
- [ ] On impact, the marble visibly squashes vertically for ~150ms
- [ ] After 1.5s total, navigation completes (you land on /contact)
- [ ] The thread segment **from hero** is highlighted (fully opaque, 2px) during the drop
- [ ] During the drop, the marble visually moves with the parallax tilt of the playfield (it's inside `.playfield`)

- [ ] **Step 2: Press Escape mid-drop**

- [ ] Click Hero again, then press Escape before 1.5s elapses
- [ ] The marble disappears (chain cancelled)
- [ ] Navigation does NOT fire (stay on home)

- [ ] **Step 3: Reduced-motion**

- [ ] DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`
- [ ] Click Hero — navigation fires instantly, no marble visible

- [ ] **Step 4: Click About (no gadget shipped yet)**

- [ ] Thread segment from About is highlighted
- [ ] No marble or other visual appears
- [ ] After 1.2s, navigation completes
- [ ] (This validates that Phase 5a's placeholder still works for non-Hero blocks)

- [ ] **Step 5: Stop dev server**

`Ctrl+C`.

---

## Task 7 · Update UX critique implementation status

**Files:**
- Modify: `docs/ux-critique.md`

- [ ] **Step 1: Append Phase 5b section**

Append after the Phase 5a entry:

```markdown

### Phase 5b — Hero Marble Drop (completed 2026-05-25)

Shipped the first visible chain-reaction gadget: clicking the Hero block triggers a golden marble that drops from above the viewport onto the Hero block center over ~900ms with an accelerating gravity curve, then squashes vertically for 150ms on impact. The marble is a `motion.svg` (golden radial-gradient orb with a small white specular highlight) inside a new `ChainOverlay` component that sits as a sibling to ThreadLine inside `.playfield` — so it inherits the parallax tilt and reads block positions from the same `useBlockCenters` snapshot. Total Hero sequence duration bumped to 1500ms (from 1200ms placeholder) to give the visual time to land cleanly before navigation fires.

`ChainOverlay` is a dispatcher — it reads `activeBlock` from `useChain()` and renders the matching per-block gadget. Phase 5b only ships the Hero marble; remaining 5 sequences (About pendulum, Work domino cascade, Services lever, Process pulley, Contact letter spring) follow in Phase 5c+. No new runtime dependencies — pure Motion choreography.

See `docs/superpowers/plans/2026-05-25-ui-v2-phase-5b-hero-marble-drop.md` for the full implementation log.
```

- [ ] **Step 2: Commit**

```bash
git add docs/ux-critique.md
git commit -m "docs(critique): record Phase 5b hero marble drop"
```

---

## Definition of Done

Phase 5b is complete when ALL of the following are true:

- [ ] All 7 tasks above are checked off
- [ ] `pnpm test` passes (~267 tests, including ~8 new for Phase 5b)
- [ ] `pnpm build` clean
- [ ] Manual visual verification (Task 6) checklist 100% clean
- [ ] All commits clean, atomic, conventional-commit format
- [ ] Phase 5b commits stacked on top of Phase 5a on the existing branch

---

## What is intentionally NOT in Phase 5b

- Bell flash effect after marble lands — Phase 5c
- Aurora chamber pre-emptive grow during chain — Phase 5c
- About / Work / Services / Process / Contact gadgets — Phase 5d+
- Rapier2D physics — deferred until a sequence genuinely benefits (e.g., Work's domino cascade)
- Sound design — out of v2 launch scope (noted in spec §18 open questions)

---

## Forward-Compat Notes for Phase 5c+

- **ChainOverlay's dispatch pattern scales to 6 blocks.** Each new gadget gets a component (e.g., `AboutPendulum.tsx`) and a new conditional in `ChainOverlay.tsx`:
  ```tsx
  {activeBlock === 'about' && aboutCenter && <AboutPendulum targetX={aboutCenter.x} targetY={aboutCenter.y} />}
  ```
- **Per-step visuals (within a single block's sequence) need a step-index hook.** Phase 5c's "marble → bell → aurora-grow" sequence requires the overlay to know which step is currently playing, not just which block is active. Extend `ChainContextValue` with `currentStepIndex: number` and have the provider increment it as it walks the sequence. The overlay can then switch on `(activeBlock, currentStepIndex)`.
- **Aurora pre-emptive grow** (Phase 5c) needs a fullscreen overlay that grows from Hero's portal window outward. Likely a new sibling of `VelvetStage` at the App level, OR a positioned absolute element inside the home route that takes over for the transition. Decide architectural placement when Phase 5c is planned.
- **HeroMarbleDrop is intentionally dumb about timing.** It animates on mount with a hard-coded duration. Phase 5c's sequence may need to ABORT the marble animation if Escape is pressed mid-drop. Motion exposes `useAnimationControls` for imperative control — if abort behavior needs to be visually precise (marble freezes in place), use that pattern. For now, when chain aborts, the marble's parent unmounts and the animation stops (via AnimatePresence absence — but we're not using AnimatePresence yet, so it just disappears).
