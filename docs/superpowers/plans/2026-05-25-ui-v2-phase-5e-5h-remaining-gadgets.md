# UI v2.0 — Phases 5e–5h: Remaining Block Gadgets — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the four remaining block chain-reaction gadgets in a single sequential pass: Work (domino cascade), Services (lever), Process (pulley), Contact (spring + letter). With Hero (5b/5c) and About (5d) already shipped, this completes the per-block visual sequences for all 6 navigable blocks of the home grid.

**Architecture:** Each gadget is a new component in `src/components/TetrisGrid/ChainOverlay/`. ChainOverlay's dispatcher gains a new conditional branch per block. Per-block sequence durations bump from the 1200ms placeholder to gadget-appropriate values. Pattern is identical to Phase 5b/5c/5d — `targetX`/`targetY` props, `aria-hidden="true"` wrappers, Motion-driven animations. **No new runtime dependencies** — Rapier2D continues deferred because each gadget's choreography is templatable via Motion timelines.

**Spec reference:** `docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md` §7.2 (per-block chain-reaction table). This plan ships the four rows: Work, Services, Process, Contact.

---

## Visual Design Summary

| Block | Visual | Duration | Reads as |
|---|---|---|---|
| Work (5e) | Small marble rolls in, hits first of 5 staggered dominos, dominos topple in sequence | 1500ms | "Shipped iteration — visible cause + effect" |
| Services (5f) | Horizontal lever pivots at center, raising one end; a small flag unfurls on the raised end | 1300ms | "Operational systems — clear, mechanical" |
| Process (5g) | Pulley wheel rotates, dragging a small weight upward on a string | 1400ms | "Process — orderly, sequential, ratcheted" |
| Contact (5h) | Coiled spring uncoils + small envelope slides out along the spring's release direction | 1200ms | "Contact — the deliverable" |

---

## File Structure

All gadgets share the `ChainOverlay` folder with the existing components:

```
src/components/TetrisGrid/ChainOverlay/
├── ChainOverlay.tsx          (modify: add 4 new dispatch branches)
├── ChainOverlay.module.css
├── HeroMarbleDrop.tsx        (existing — Phase 5b)
├── HeroBellFlash.tsx         (existing — Phase 5c)
├── AboutPendulum.tsx         (existing — Phase 5d)
├── WorkDominoCascade.tsx     (new — Phase 5e)
├── WorkDominoCascade.module.css
├── ServicesLever.tsx         (new — Phase 5f)
├── ServicesLever.module.css
├── ProcessPulley.tsx         (new — Phase 5g)
├── ProcessPulley.module.css
├── ContactSpring.tsx         (new — Phase 5h)
├── ContactSpring.module.css
└── __tests__/                (4 new test files)
```

Also modified:
- `src/lib/chain-context.ts` — 4 new `*_CHAIN_DURATION_MS` constants
- `src/lib/__tests__/chain-context.test.ts` — assertions per block
- `src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx` — 4 new dispatcher tests
- `docs/ux-critique.md` — single combined entry covering 5e-5h

---

## Phase 5e — Work: Domino Cascade

### Task 5e.1 · Bump Work duration to 1500ms

**Files:** `src/lib/chain-context.ts`, `src/lib/__tests__/chain-context.test.ts`

- [ ] **Step 1: Update test assertion**

In chain-context.test.ts, find the "remaining non-hero non-about blocks" test. Replace it with a Work-specific test + a narrower remaining test:

```typescript
  it('work sequence is 1500ms (gives marble + 5-domino cascade time)', () => {
    const workSeq = BLOCK_SEQUENCES.work!
    expect(workSeq).toHaveLength(1)
    expect(workSeq[0]).toEqual({ kind: 'wait', durationMs: 1500 })
  })

  it('remaining blocks (services, process, contact) stay at DEFAULT_CHAIN_DURATION_MS (1200ms placeholder)', () => {
    for (const id of ['services', 'process', 'contact'] as BlockId[]) {
      const seq = BLOCK_SEQUENCES[id]!
      expect(seq).toHaveLength(1)
      expect(seq[0]).toEqual({ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS })
    }
  })
```

- [ ] **Step 2: Run → FAIL**

Run: `pnpm test src/lib/__tests__/chain-context.test.ts`

- [ ] **Step 3: Add `WORK_CHAIN_DURATION_MS` + update BLOCK_SEQUENCES.work**

In `src/lib/chain-context.ts`:

```typescript
export const WORK_CHAIN_DURATION_MS = 1500
```

Update entry:

```typescript
work: [{ kind: 'wait', durationMs: WORK_CHAIN_DURATION_MS }],
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat(chain): bump work sequence to 1500ms for domino cascade"
```

### Task 5e.2 · Create `WorkDominoCascade` component

**Files:**
- Create: `src/components/TetrisGrid/ChainOverlay/WorkDominoCascade.module.css`
- Create: `src/components/TetrisGrid/ChainOverlay/WorkDominoCascade.tsx`
- Create: `src/components/TetrisGrid/ChainOverlay/__tests__/WorkDominoCascade.test.tsx`

Visual: a small dark marble enters from the left, rolls right ~140px, hits the first of 5 vertical dominos staggered horizontally with 20px gaps. Each domino tips clockwise (0° → 90°) with a 90ms cascading delay. Total: marble roll 600ms + cascade 600ms + hold 300ms = 1500ms.

- [ ] **Step 1: Create the CSS module**

`src/components/TetrisGrid/ChainOverlay/WorkDominoCascade.module.css`:

```css
/* WorkDominoCascade — 5 dominos in a row knocked over by an incoming marble.
   Anchored at the Work block center. The wrapper is the centering point;
   the cascade extends to either side. */

.cascadeWrapper {
  position: absolute;
  /* Wrapper is the center of the cascade line. -90px wide × 50px tall;
     centered on target via margin offsets. */
  width: 180px;
  height: 50px;
  margin-left: -90px;
  margin-top: -25px;
  pointer-events: none;
  will-change: contents;
}

.dominosLane {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
}

.domino {
  width: 8px;
  height: 36px;
  background: linear-gradient(135deg, #2a2f38, #6a7585 35%, #c8d2dc 55%, #6a7585 75%, #2a2f38);
  border-radius: 2px;
  transform-origin: 50% 100%;  /* tip from the base */
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.3);
}

.marble {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(35% 30% at 35% 30%, #ffffff 0%, #ffe066 25%, #ffb800 70%, #b07700 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
```

- [ ] **Step 2: Write failing tests**

`src/components/TetrisGrid/ChainOverlay/__tests__/WorkDominoCascade.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WorkDominoCascade } from '../WorkDominoCascade'

describe('WorkDominoCascade', () => {
  it('renders the cascade wrapper at target coords', () => {
    const { container } = render(<WorkDominoCascade targetX={400} targetY={300} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.style.left).toBe('400px')
    expect(wrapper.style.top).toBe('300px')
  })

  it('the cascade wrapper has aria-hidden="true"', () => {
    const { container } = render(<WorkDominoCascade targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders exactly 5 dominos', () => {
    const { container } = render(<WorkDominoCascade targetX={0} targetY={0} />)
    expect(container.querySelectorAll('[data-domino]').length).toBe(5)
  })

  it('renders 1 marble', () => {
    const { container } = render(<WorkDominoCascade targetX={0} targetY={0} />)
    expect(container.querySelectorAll('[data-marble]').length).toBe(1)
  })
})
```

- [ ] **Step 3: Run → FAIL**

- [ ] **Step 4: Create the component**

`src/components/TetrisGrid/ChainOverlay/WorkDominoCascade.tsx`:

```typescript
import { motion } from 'motion/react'
import styles from './WorkDominoCascade.module.css'

export interface WorkDominoCascadeProps {
  targetX: number
  targetY: number
}

const DOMINO_INDICES = [0, 1, 2, 3, 4]

/**
 * WorkDominoCascade — a small gold marble rolls in from the left,
 * hits the first of 5 polished-steel dominos, and triggers a chain
 * cascade. Reads as "shipped iteration — visible cause and effect."
 *
 * Marble: enters from x=0, rolls to x=60 (where the first domino sits)
 * over 600ms.
 * Cascade: each domino tips from 0° to 90° (clockwise) starting at
 * 600ms, with 90ms stagger between dominos. Last domino completes at
 * 600 + 4×90 + 200 ≈ 1160ms. Hold to 1500ms.
 *
 * Decorative — aria-hidden.
 */
export function WorkDominoCascade({ targetX, targetY }: WorkDominoCascadeProps) {
  return (
    <div
      className={styles.cascadeWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <div className={styles.dominosLane}>
        {DOMINO_INDICES.map((i) => (
          <motion.div
            key={i}
            data-domino
            className={styles.domino}
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 0, 90] }}
            transition={{
              duration: 1.5,
              times: [0, (0.6 + i * 0.09) / 1.5, (0.8 + i * 0.09) / 1.5],
              ease: ['linear', 'easeIn'],
            }}
          />
        ))}
      </div>
      <motion.div
        data-marble
        className={styles.marble}
        initial={{ x: 0 }}
        animate={{ x: [0, 60, 60] }}
        transition={{
          duration: 1.5,
          times: [0, 0.4, 1],
          ease: ['easeOut', 'linear'],
        }}
      />
    </div>
  )
}
```

- [ ] **Step 5: Run → PASS**

- [ ] **Step 6: Commit**

```bash
git add src/components/TetrisGrid/ChainOverlay/WorkDominoCascade.*
git commit -m "feat(chain): add WorkDominoCascade component (marble + 5 dominos)"
```

### Task 5e.3 · Dispatch in ChainOverlay

**Files:** `src/components/TetrisGrid/ChainOverlay/ChainOverlay.tsx` + tests

- [ ] **Step 1: Append test**

```typescript
  it('renders WorkDominoCascade when activeBlock is work', () => {
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
    expect(container.querySelectorAll('[data-domino]').length).toBe(5)
  })
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Update ChainOverlay.tsx**

Add import:
```typescript
import { WorkDominoCascade } from './WorkDominoCascade'
```

Add center lookup:
```typescript
const workCenter = snapshot?.centers.work
```

Add dispatch branch:
```tsx
{activeBlock === 'work' && workCenter && (
  <WorkDominoCascade targetX={workCenter.x} targetY={workCenter.y} />
)}
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat(chain): dispatch WorkDominoCascade when activeBlock is work"
```

---

## Phase 5f — Services: Lever

### Task 5f.1 · Bump Services duration to 1300ms

**Files:** `src/lib/chain-context.ts`, `src/lib/__tests__/chain-context.test.ts`

- [ ] **Step 1: Update test**

Split off services from the remaining test:

```typescript
  it('services sequence is 1300ms', () => {
    const seq = BLOCK_SEQUENCES.services!
    expect(seq).toHaveLength(1)
    expect(seq[0]).toEqual({ kind: 'wait', durationMs: 1300 })
  })

  it('remaining blocks (process, contact) stay at DEFAULT_CHAIN_DURATION_MS', () => {
    for (const id of ['process', 'contact'] as BlockId[]) {
      const seq = BLOCK_SEQUENCES[id]!
      expect(seq[0]).toEqual({ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS })
    }
  })
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Add constant + update sequence**

```typescript
export const SERVICES_CHAIN_DURATION_MS = 1300
// ...
services: [{ kind: 'wait', durationMs: SERVICES_CHAIN_DURATION_MS }],
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat(chain): bump services sequence to 1300ms for lever raise"
```

### Task 5f.2 · Create `ServicesLever` component

**Files:**
- Create: `src/components/TetrisGrid/ChainOverlay/ServicesLever.module.css`
- Create: `src/components/TetrisGrid/ChainOverlay/ServicesLever.tsx`
- Create: `src/components/TetrisGrid/ChainOverlay/__tests__/ServicesLever.test.tsx`

Visual: a horizontal lever pivoted at its center rotates from 0° to -25° over 700ms (one end raises). A small flag on the raised end unfolds (scales from 0 to full size) over the trailing 400ms. Total: 1300ms.

- [ ] **Step 1: Create CSS**

```css
/* ServicesLever — horizontal lever that pivots at its center, raising
   one end. A small teal flag unfurls on the raised end. */

.leverWrapper {
  position: absolute;
  width: 160px;
  height: 60px;
  margin-left: -80px;
  margin-top: -30px;
  pointer-events: none;
  will-change: contents;
}

.lever {
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(180deg, #006e68, #00b4aa 35%, #5be3dc 55%, #00b4aa 75%, #006e68);
  border-radius: 3px;
  transform-origin: 50% 50%;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4);
}

.pivot {
  position: absolute;
  top: 30px;
  left: 50%;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  margin-top: -4px;
  border-radius: 50%;
  background: radial-gradient(closest-side, #c8d2dc, #6a7585 75%, #2a2f38);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.flag {
  position: absolute;
  top: -4px;
  left: calc(50% + 60px);
  width: 20px;
  height: 14px;
  background: linear-gradient(135deg, rgba(0, 180, 170, 0.9), rgba(91, 227, 220, 0.7));
  border-radius: 1px;
  transform-origin: 0% 100%;
}
```

- [ ] **Step 2: Failing tests**

```typescript
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ServicesLever } from '../ServicesLever'

describe('ServicesLever', () => {
  it('renders lever wrapper at target coords', () => {
    const { container } = render(<ServicesLever targetX={400} targetY={300} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.left).toBe('400px')
    expect(wrapper.style.top).toBe('300px')
  })

  it('aria-hidden', () => {
    const { container } = render(<ServicesLever targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders lever, pivot, and flag elements', () => {
    const { container } = render(<ServicesLever targetX={0} targetY={0} />)
    expect(container.querySelector('[data-lever]')).toBeInTheDocument()
    expect(container.querySelector('[data-pivot]')).toBeInTheDocument()
    expect(container.querySelector('[data-flag]')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run → FAIL**

- [ ] **Step 4: Create the component**

```typescript
import { motion } from 'motion/react'
import styles from './ServicesLever.module.css'

export interface ServicesLeverProps {
  targetX: number
  targetY: number
}

/**
 * ServicesLever — a teal horizontal bar pivots at its center,
 * raising the right end by 25°. A small flag unfurls on the raised
 * end. Reads as "operational systems — clear, mechanical."
 *
 * Sequence (1300ms total):
 *   - 0–700ms: lever rotates 0° → -25° (right end lifts)
 *   - 700–1100ms: flag scales 0 → 1 (unfurls)
 *   - 1100–1300ms: hold
 */
export function ServicesLever({ targetX, targetY }: ServicesLeverProps) {
  return (
    <div
      className={styles.leverWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <motion.div
        data-lever
        className={styles.lever}
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -25, -25] }}
        transition={{
          duration: 1.3,
          times: [0, 0.538, 1],
          ease: ['easeOut', 'linear'],
        }}
      />
      <div data-pivot className={styles.pivot} />
      <motion.div
        data-flag
        className={styles.flag}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 0, 1, 1] }}
        transition={{
          duration: 1.3,
          times: [0, 0.538, 0.846, 1],
          ease: ['linear', 'backOut', 'linear'],
        }}
      />
    </div>
  )
}
```

- [ ] **Step 5: Run → PASS**

- [ ] **Step 6: Commit**

```bash
git add src/components/TetrisGrid/ChainOverlay/ServicesLever.*
git commit -m "feat(chain): add ServicesLever component (teal lever + flag)"
```

### Task 5f.3 · Dispatch in ChainOverlay

Same pattern as 5e.3 — add import, `servicesCenter = snapshot?.centers.services`, conditional render. Append a test. Commit: `feat(chain): dispatch ServicesLever when activeBlock is services`.

---

## Phase 5g — Process: Pulley

### Task 5g.1 · Bump Process duration to 1400ms

Same pattern. Add `PROCESS_CHAIN_DURATION_MS = 1400`. Split test assertion. Commit: `feat(chain): bump process sequence to 1400ms for pulley pull`.

### Task 5g.2 · Create `ProcessPulley` component

**Visual:** A bronze pulley wheel (24px circle) at the top, with a string descending to a small bronze weight at the bottom. The wheel rotates 720° (two full spins) over 800ms; the string + weight rise simultaneously over the same duration (translateY from +30 to 0). Hold for 600ms. Total: 1400ms.

`ProcessPulley.module.css`:

```css
.pulleyWrapper {
  position: absolute;
  width: 60px;
  height: 80px;
  margin-left: -30px;
  margin-top: -40px;
  pointer-events: none;
}

.wheel {
  position: absolute;
  top: 0;
  left: 50%;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  border-radius: 50%;
  background: radial-gradient(closest-side, #e8a85a 0%, #C47820 50%, #6a3e10 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.4);
  /* Add spokes via pseudo-element. */
}
.wheel::before, .wheel::after {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  pointer-events: none;
}

.string {
  position: absolute;
  top: 24px;
  left: 50%;
  width: 1px;
  height: 40px;
  margin-left: 0;
  background: rgba(196, 120, 32, 0.6);
}

.weight {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  border-radius: 2px;
  background: linear-gradient(180deg, #C47820 0%, #6a3e10 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.4);
}
```

`ProcessPulley.tsx`:

```typescript
import { motion } from 'motion/react'
import styles from './ProcessPulley.module.css'

export interface ProcessPulleyProps {
  targetX: number
  targetY: number
}

/**
 * ProcessPulley — a bronze pulley wheel spins, pulling a weight up
 * on a string. Reads as "process — orderly, sequential, ratcheted."
 *
 * Sequence (1400ms):
 *   - 0–800ms: wheel rotates 0° → 720° (two full spins);
 *              weight rises (translateY +30 → 0)
 *   - 800–1400ms: hold
 */
export function ProcessPulley({ targetX, targetY }: ProcessPulleyProps) {
  return (
    <div
      className={styles.pulleyWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <motion.div
        data-wheel
        className={styles.wheel}
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, 720, 720] }}
        transition={{
          duration: 1.4,
          times: [0, 0.571, 1],
          ease: ['easeInOut', 'linear'],
        }}
      />
      <div data-string className={styles.string} />
      <motion.div
        data-weight
        className={styles.weight}
        initial={{ y: 30 }}
        animate={{ y: [30, 0, 0] }}
        transition={{
          duration: 1.4,
          times: [0, 0.571, 1],
          ease: ['easeOut', 'linear'],
        }}
      />
    </div>
  )
}
```

Tests: same pattern as ServicesLever — target coords, aria-hidden, presence of `[data-wheel]`, `[data-string]`, `[data-weight]`.

Commit (component): `feat(chain): add ProcessPulley component (bronze wheel + weight)`.

### Task 5g.3 · Dispatch in ChainOverlay

Same pattern. Commit: `feat(chain): dispatch ProcessPulley when activeBlock is process`.

---

## Phase 5h — Contact: Spring + Letter

### Task 5h.1 · No duration bump needed

Contact stays at `DEFAULT_CHAIN_DURATION_MS = 1200ms` — the spring + letter visual fits comfortably. Update the chain-context test to confirm contact is still at 1200:

```typescript
  it('contact sequence stays at DEFAULT_CHAIN_DURATION_MS (spring + letter fits comfortably)', () => {
    const seq = BLOCK_SEQUENCES.contact!
    expect(seq[0]).toEqual({ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS })
  })
```

(Remove the old "remaining blocks (contact)" assertion if it still exists.)

No source change needed for this task. Commit: not needed — wait until after the component lands.

Actually, since there's no code change here, just verify the test is correct and skip to 5h.2.

### Task 5h.2 · Create `ContactSpring` component

**Visual:** A coiled spring (a `<path>` with squiggly stroke) uncoils, becoming a straight line over 500ms. A small magenta envelope (a `<rect>` with a triangular `<path>` flap) slides along the spring's extension direction (translateX 0 → 80) over 500ms simultaneously. Hold 200ms.

`ContactSpring.module.css`:

```css
.springWrapper {
  position: absolute;
  width: 120px;
  height: 30px;
  margin-left: -60px;
  margin-top: -15px;
  pointer-events: none;
}

.springSvg {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 30px;
}

.springPath {
  stroke: rgba(217, 3, 104, 0.85);
  stroke-width: 1.5;
  fill: none;
  stroke-linecap: round;
}

.envelope {
  position: absolute;
  top: 8px;
  left: 30px;
  width: 18px;
  height: 14px;
  background: linear-gradient(180deg, #ff5e98 0%, #d90368 100%);
  border-radius: 1px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.4);
}

.envelope::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 7px;
  background: linear-gradient(180deg, #ff5e98 0%, #d90368 100%);
  clip-path: polygon(0 0, 50% 100%, 100% 0);
}
```

`ContactSpring.tsx`:

```typescript
import { motion } from 'motion/react'
import styles from './ContactSpring.module.css'

export interface ContactSpringProps {
  targetX: number
  targetY: number
}

/**
 * ContactSpring — a coiled spring uncoils, releasing a small magenta
 * envelope that slides along the spring's extension direction.
 * Reads as "contact — the deliverable."
 *
 * Sequence (1200ms):
 *   - 0–500ms: spring path animates from coiled to extended;
 *              envelope slides translateX 0 → 80
 *   - 500–1000ms: spring + envelope hold
 *   - 1000–1200ms: brief final hold before navigation
 */
export function ContactSpring({ targetX, targetY }: ContactSpringProps) {
  return (
    <div
      className={styles.springWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <svg className={styles.springSvg} viewBox="0 0 50 30">
        <motion.path
          data-spring
          className={styles.springPath}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{
            duration: 1.2,
            times: [0, 0.417, 1],
            ease: ['easeOut', 'linear'],
          }}
          d="M2,15 Q6,5 10,15 T18,15 T26,15 T34,15 T42,15 L48,15"
        />
      </svg>
      <motion.div
        data-envelope
        className={styles.envelope}
        initial={{ x: -25 }}
        animate={{ x: [-25, 55, 55] }}
        transition={{
          duration: 1.2,
          times: [0, 0.417, 1],
          ease: ['easeOut', 'linear'],
        }}
      />
    </div>
  )
}
```

Tests: target coords, aria-hidden, presence of `[data-spring]` + `[data-envelope]`.

Commit: `feat(chain): add ContactSpring component (uncoiling spring + envelope)`.

### Task 5h.3 · Dispatch in ChainOverlay

Final dispatch branch. Commit: `feat(chain): dispatch ContactSpring when activeBlock is contact`.

---

## Final Verification + Docs

### Task V.1 · Run full suite

Run: `pnpm test`. Expected: 285 (Phase 5d baseline) + ~25 new = ~310 tests passing.

Approximate new test counts per phase: 5e: +5, 5f: +5, 5g: +5, 5h: +5, plus chain-context updates net +3.

### Task V.2 · TSC + build

Run: `pnpm exec tsc --noEmit -p tsconfig.app.json` → clean
Run: `pnpm build` → clean

### Task V.3 · Append combined UX critique entry

```markdown

### Phases 5e–5h — Remaining Block Gadgets (completed 2026-05-25)

Shipped the four remaining block chain-reaction visuals in one pass, completing the per-block visual sequences for all 6 navigable blocks of the home grid:

- **Work (5e)** — A small gold marble rolls in from the left, hits the first of 5 polished-steel dominos staggered horizontally. Each domino tips 0° → 90° clockwise with a 90ms stagger, producing a cascading sequence reading as "shipped iteration." `WORK_CHAIN_DURATION_MS = 1500`.
- **Services (5f)** — A horizontal teal lever pivots at its center, raising its right end by 25° over 700ms. A small flag unfurls on the raised end (scale 0 → 1, backOut) over the trailing 400ms. Reads as "operational systems — clear, mechanical." `SERVICES_CHAIN_DURATION_MS = 1300`.
- **Process (5g)** — A bronze pulley wheel rotates 720° (two full spins) over 800ms, pulling a bronze weight up on a string (translateY +30 → 0 in lockstep). Reads as "process — orderly, sequential, ratcheted." `PROCESS_CHAIN_DURATION_MS = 1400`.
- **Contact (5h)** — A coiled magenta spring uncoils via `pathLength` animation (0 → 1 over 500ms), simultaneously releasing a small magenta envelope that slides along the extension direction (translateX -25 → 55). Reads as "contact — the deliverable." Stays at `DEFAULT_CHAIN_DURATION_MS = 1200ms` — the visual fits comfortably.

ChainOverlay's dispatcher now has 5 conditional branches (Hero, About, Work, Services, Process, Contact); each `<Gadget targetX targetY />` is positioned via `useBlockCenters` snapshot. The architectural pattern proven in Phase 5b/5c/5d scaled cleanly — no architectural changes needed for any of the 4 new sequences. **Still zero new runtime dependencies** — Rapier2D continues deferred because each gadget's choreography is templatable via Motion timelines.

See `docs/superpowers/plans/2026-05-25-ui-v2-phase-5e-5h-remaining-gadgets.md` for the full implementation log.
```

Commit: `docs(critique): record Phases 5e-5h remaining block gadgets`.

---

## Definition of Done

- [ ] All 5e–5h tasks above complete
- [ ] `pnpm test` passes (~310 tests)
- [ ] `pnpm build` clean
- [ ] All commits clean + atomic, conventional-commit format
- [ ] Phase 5e–5h commits stacked on Phase 5d on the existing branch (PR #5 grows OR new PRs as user prefers)

## What is NOT in 5e–5h

- Label flip / portrait reveal on About block (deferred from 5d)
- Per-block visual content reveal AFTER the gadget (spec §7.2 mentions "Work block tilts open", "Process block reveals steps", etc. — those are post-gadget reveals that happen after navigation, not part of the chain reaction)
- Rapier2D physics — still deferred
- Sound design — out of v2 launch scope
- Mobile-simplified gadgets — Phase 8 territory
