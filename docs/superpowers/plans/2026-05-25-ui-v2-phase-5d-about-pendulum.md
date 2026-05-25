# UI v2.0 — Phase 5d: About Pendulum — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the About block's chain-reaction gadget: when About is clicked, a gold pendulum swings down from above the block in a graceful arc, sweeps across the block's face, and continues into a return swing — then navigation fires. Reads as a stately "founder presence" gesture, in contrast to Hero's energetic marble drop.

**Architecture:** New `AboutPendulum` component added alongside the existing Hero gadgets in `ChainOverlay/`. The pendulum is a Motion-animated SVG with a pivot at the top (~120px above the About block) and a bob at the bottom (gold circle, similar weight to the Hero marble). The full swing animates a `rotate` around the pivot from ~-50° to ~+50° and back to ~-15° (rest hang) over the sequence duration. ChainOverlay extends its dispatcher with the new `activeBlock === 'about'` branch. About sequence duration bumps from the 1200ms placeholder to 1400ms to give the swing visible breathing room.

**Tech Stack:** Existing — React 19, Motion, CSS Modules, Vitest, happy-dom. **No new runtime dependencies.**

**Spec reference:** `docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md` §7.2 (About row: "Pendulum swings → triggers a label flip revealing portrait"). Phase 5d ships only the pendulum swing portion; the label-flip portrait reveal is deferred to a future phase.

---

## File Structure

| File | Type | Responsibility |
|---|---|---|
| `src/lib/chain-context.ts` | Modify | Add `ABOUT_CHAIN_DURATION_MS = 1400`; update `BLOCK_SEQUENCES.about` to use it |
| `src/lib/__tests__/chain-context.test.ts` | Modify | Update assertion to verify about is 1400ms; other non-hero blocks stay at 1200ms |
| `src/lib/__tests__/chain.test.tsx` | Modify | If any tests call `startChain('about', ...)` with `advanceTimersByTime(1200)`, bump to 1400 |
| `src/components/TetrisGrid/ChainOverlay/AboutPendulum.tsx` | Create | Motion-animated SVG pendulum (rod + bob), positioned at target coords, swings around pivot |
| `src/components/TetrisGrid/ChainOverlay/AboutPendulum.module.css` | Create | Pendulum visual: rod (gold line) + bob (gold radial circle), transform-origin for swing pivot |
| `src/components/TetrisGrid/ChainOverlay/__tests__/AboutPendulum.test.tsx` | Create | 3 tests: renders at target, aria-hidden, has rod + bob |
| `src/components/TetrisGrid/ChainOverlay/ChainOverlay.tsx` | Modify | Add `activeBlock === 'about'` branch dispatching `<AboutPendulum>` |
| `src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx` | Modify | Add test: AboutPendulum renders when about is active |
| `docs/ux-critique.md` | Modify | Append Phase 5d status |

---

## Task 1 · Add `ABOUT_CHAIN_DURATION_MS` + bump About sequence

**Files:**
- Modify: `src/lib/chain-context.ts`
- Modify: `src/lib/__tests__/chain-context.test.ts`
- Modify: `src/lib/__tests__/chain.test.tsx`

- [ ] **Step 1: Update the existing assertion in chain-context.test.ts**

Find the test "other blocks remain at DEFAULT_CHAIN_DURATION_MS (1200ms placeholder)". Update it to exclude `about`:

```typescript
  it('about sequence is 1400ms (gives pendulum swing breathing room)', () => {
    const aboutSeq = BLOCK_SEQUENCES.about!
    expect(aboutSeq).toHaveLength(1)
    expect(aboutSeq[0]).toEqual({ kind: 'wait', durationMs: 1400 })
  })

  it('remaining non-hero non-about blocks stay at DEFAULT_CHAIN_DURATION_MS (1200ms placeholder)', () => {
    for (const id of ['work', 'services', 'process', 'contact'] as BlockId[]) {
      const seq = BLOCK_SEQUENCES[id]!
      expect(seq).toHaveLength(1)
      expect(seq[0]).toEqual({ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS })
    }
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/lib/__tests__/chain-context.test.ts`
Expected: FAIL — about is still 1200ms.

- [ ] **Step 3: Update chain-context.ts**

In `src/lib/chain-context.ts`, add the constant near `HERO_CHAIN_DURATION_MS`:

```typescript
/** About's pendulum swing needs breathing room beyond the placeholder. */
export const ABOUT_CHAIN_DURATION_MS = 1400
```

Update `BLOCK_SEQUENCES`:

```typescript
about: [{ kind: 'wait', durationMs: ABOUT_CHAIN_DURATION_MS }],
```

- [ ] **Step 4: Bump any dependent `advanceTimersByTime(1200)` calls**

Search `src/lib/__tests__/chain.test.tsx` for tests using `startChain('about', ...)` paired with `advanceTimersByTime(1200)`. If found, bump to 1400.

- [ ] **Step 5: Run full suite**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/chain-context.ts src/lib/__tests__/chain-context.test.ts src/lib/__tests__/chain.test.tsx
git commit -m "feat(chain): bump about sequence to 1400ms for pendulum swing"
```

---

## Task 2 · Create `AboutPendulum` component

**Files:**
- Create: `src/components/TetrisGrid/ChainOverlay/AboutPendulum.module.css`
- Create: `src/components/TetrisGrid/ChainOverlay/AboutPendulum.tsx`
- Create: `src/components/TetrisGrid/ChainOverlay/__tests__/AboutPendulum.test.tsx`

The pendulum is anchored 120px above the About block's center (the pivot point). A thin gold rod descends from the pivot to a bob. The whole thing rotates around the pivot using `transformOrigin: 'center top'` on the SVG.

Swing animation (1400ms total chain duration → ~900ms swing window, leaving 500ms for visual hold + handoff):
- 0ms: rest at -50° (entered from upper left)
- 0–500ms: swing to +50° (sweep across the block face)
- 500–900ms: return swing to -15° (settled near rest)
- 900–1400ms: hold (gives the eye time to register the motion before navigation)

- [ ] **Step 1: Create the CSS module**

Create `src/components/TetrisGrid/ChainOverlay/AboutPendulum.module.css`:

```css
/* AboutPendulum — a gold pendulum that swings over the About block at
   chain time. Anchored 120px above the block's center; rotates around
   the anchor via `transformOrigin: 'center top'`. The wrapper holds the
   pivot point; the SVG inside hangs downward and rotates. */

.pendulumWrapper {
  position: absolute;
  /* Pivot is 120px ABOVE the block center; the SVG below this point is
     what visually swings. The wrapper is a 0×0 pivot pin. */
  width: 0;
  height: 0;
  pointer-events: none;
  /* Lift the pivot above the target Y by 120px via margin-top. */
  margin-top: -120px;
  will-change: transform;
}

.pendulum {
  position: absolute;
  /* Center the SVG horizontally on the pivot (the wrapper has 0 width
     so we use margin offsets). The SVG is 16px wide so margin-left
     -8px centers it. The SVG itself is 140px tall, hanging downward
     from the pivot. */
  margin-left: -8px;
  width: 16px;
  height: 140px;
  /* Rotate around the top-center of the SVG (the pivot). */
  transform-origin: 50% 0%;
}

.rod {
  stroke: rgba(255, 212, 0, 0.85);
  stroke-width: 1.5;
  stroke-linecap: round;
}

.bob {
  /* Bob fill is set via the radialGradient defined in the component. */
}
```

- [ ] **Step 2: Write failing tests**

Create `src/components/TetrisGrid/ChainOverlay/__tests__/AboutPendulum.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AboutPendulum } from '../AboutPendulum'

describe('AboutPendulum', () => {
  it('renders the pendulum wrapper at target coords', () => {
    const { container } = render(<AboutPendulum targetX={400} targetY={300} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.style.left).toBe('400px')
    expect(wrapper.style.top).toBe('300px')
  })

  it('the pendulum wrapper has aria-hidden="true"', () => {
    const { container } = render(<AboutPendulum targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders both a rod (line) and a bob (circle) inside the SVG', () => {
    const { container } = render(<AboutPendulum targetX={0} targetY={0} />)
    expect(container.querySelector('line')).toBeInTheDocument()
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('uses a radial gradient for the bob fill', () => {
    const { container } = render(<AboutPendulum targetX={0} targetY={0} />)
    expect(container.querySelector('radialGradient')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/AboutPendulum.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 4: Create the component**

Create `src/components/TetrisGrid/ChainOverlay/AboutPendulum.tsx`:

```typescript
import { motion } from 'motion/react'
import { useId } from 'react'
import styles from './AboutPendulum.module.css'

export interface AboutPendulumProps {
  /** Container-local X coordinate of the pendulum's pivot (above the About block center). */
  targetX: number
  /** Container-local Y coordinate of the About block's center; pivot is 120px above this. */
  targetY: number
}

/**
 * About pendulum — a stately gold pendulum on a string that swings
 * down from above the About block, sweeps across it, and returns
 * partway. Reads as "founder presence" — slower and more deliberate
 * than Hero's energetic marble drop.
 *
 * Pivot is 120px above the About block center; the SVG (16px × 140px)
 * hangs from the pivot and rotates around its top-center. Total
 * sequence (matching ABOUT_CHAIN_DURATION_MS = 1400ms):
 *   - 0–500ms:   swing -50° → +50° (sweep across the block face)
 *   - 500–900ms: return +50° → -15° (settle near rest)
 *   - 900–1400ms: hold (navigation fires at the end)
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function AboutPendulum({ targetX, targetY }: AboutPendulumProps) {
  const gradientId = useId()
  return (
    <div
      className={styles.pendulumWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <motion.svg
        className={styles.pendulum}
        viewBox="0 0 16 140"
        initial={{ rotate: -50 }}
        animate={{ rotate: [-50, 50, -15, -15] }}
        transition={{
          duration: 1.4,
          times: [0, 0.357, 0.643, 1],   // 0 → 500ms → 900ms → 1400ms
          ease: ['easeInOut', 'easeInOut', 'linear'],
        }}
      >
        <defs>
          <radialGradient id={gradientId} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#ffe066" />
            <stop offset="75%" stopColor="#ffb800" />
            <stop offset="100%" stopColor="#b07700" />
          </radialGradient>
        </defs>
        {/* Rod hangs from the pivot (top of SVG, y=0) down to the bob center (y=124). */}
        <line
          className={styles.rod}
          x1="8" y1="0"
          x2="8" y2="124"
        />
        {/* Bob at the bottom of the rod. */}
        <circle
          className={styles.bob}
          cx="8" cy="124" r="12"
          fill={`url(#${gradientId})`}
        />
        {/* Small white specular highlight on the bob. */}
        <circle cx="5" cy="121" r="2.5" fill="rgba(255,255,255,0.7)" />
      </motion.svg>
    </div>
  )
}
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/AboutPendulum.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/TetrisGrid/ChainOverlay/AboutPendulum.tsx src/components/TetrisGrid/ChainOverlay/AboutPendulum.module.css src/components/TetrisGrid/ChainOverlay/__tests__/AboutPendulum.test.tsx
git commit -m "feat(chain): add AboutPendulum component (gold swinging pendulum)"
```

---

## Task 3 · Wire `AboutPendulum` into `ChainOverlay`

**Files:**
- Modify: `src/components/TetrisGrid/ChainOverlay/ChainOverlay.tsx`
- Modify: `src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx`

- [ ] **Step 1: Write the failing test**

Append to ChainOverlay.test.tsx:

```typescript
  it('renders AboutPendulum when activeBlock is about', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="about" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    // Pendulum has both a line (rod) and a circle (bob)
    expect(container.querySelector('line')).toBeInTheDocument()
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('does NOT render AboutPendulum when activeBlock is hero', () => {
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
    // Hero shows marble (circle) but no rod (line) since pendulum isn't dispatched
    expect(container.querySelector('line')).toBeNull()
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx`
Expected: FAIL — pendulum isn't dispatched.

- [ ] **Step 3: Update ChainOverlay.tsx**

Add import:

```typescript
import { AboutPendulum } from './AboutPendulum'
```

Read `aboutCenter` from the snapshot:

```typescript
const aboutCenter = snapshot?.centers.about
```

Add the conditional branch (after the Hero branch):

```tsx
{activeBlock === 'about' && aboutCenter && (
  <AboutPendulum targetX={aboutCenter.x} targetY={aboutCenter.y} />
)}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/ChainOverlay/ChainOverlay.tsx src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx
git commit -m "feat(chain): dispatch AboutPendulum when activeBlock is about"
```

---

## Task 4 · Verify tests + production build (controller)

**Files:** No code changes — verification only.

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: 278 (Phase 5c baseline on main) + ~6 new (5d) = ~284 tests passing.

Breakdown:
- chain-context: net +1 (split assertion into about-specific + others)
- AboutPendulum: 4
- ChainOverlay: +2
Total: ~7 new tests.

- [ ] **Step 2: TSC + build**

Run: `pnpm exec tsc --noEmit -p tsconfig.app.json` → clean
Run: `pnpm build` → clean, all 6 routes prerendered

- [ ] **Step 3: Inspect bundle for Phase 5d patterns**

```bash
grep -o "pendulumWrapper\|AboutPendulum" dist/assets/*.js dist/assets/*.css 2>/dev/null | sort -u
```

Expected: pendulum-related class names visible in bundles.

- [ ] **Step 4: No commit (verification only)**

---

## Task 5 · UX critique docs update

**Files:** `docs/ux-critique.md`

- [ ] **Step 1: Append Phase 5d entry**

```markdown

### Phase 5d — About Pendulum (completed 2026-05-25)

Shipped the second block's chain reaction visual: clicking the About block triggers a gold pendulum that swings down from above the block, sweeps across the block face from one side to the other, then returns partway to a rest position before navigation fires. Reads as "founder presence" — stately and deliberate, in contrast to Hero's energetic marble drop.

`AboutPendulum` is a Motion-animated SVG (16px × 140px) with its `transform-origin` set to top-center, anchored 120px above the About block via wrapper margin offset. The full swing animates `rotate` through -50° → +50° → -15° over 900ms, with a 500ms hold at the rest position before chain completes. ChainOverlay now dispatches the pendulum when `activeBlock === 'about'`. About sequence duration bumped to 1400ms (`ABOUT_CHAIN_DURATION_MS`) to give the swing visible breathing room.

Phase 5e+ will deliver the remaining 4 block sequences (Work domino cascade, Services lever, Process pulley, Contact letter spring).

See `docs/superpowers/plans/2026-05-25-ui-v2-phase-5d-about-pendulum.md` for the full implementation log.
```

- [ ] **Step 2: Commit**

```bash
git add docs/ux-critique.md
git commit -m "docs(critique): record Phase 5d about pendulum"
```

---

## Definition of Done

- [ ] All 5 tasks above complete
- [ ] `pnpm test` passes (~284 tests)
- [ ] `pnpm build` clean
- [ ] All commits clean + atomic
- [ ] Phase 5d ships as a clean PR off `main` (PR #5)

---

## What is NOT in Phase 5d

- Label flip / portrait reveal on the About block (spec §7.2 promises this after the pendulum) — deferred to a future phase
- Work / Services / Process / Contact gadgets — Phase 5e+
- Rapier2D — still deferred
- Sound design — out of v2 launch scope
