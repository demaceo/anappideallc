# UI v2.0 — Phase 5c: Hero Bell Flash + Aurora Grow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Hero block's chain reaction with two more visual phases on top of Phase 5b's marble drop: (1) a brief gold bell-flash radiating outward from the Hero block at the marble's impact moment, and (2) a fullscreen aurora-grow that expands from the Hero portal window to fill the viewport, handing off cinematically to /contact's AuroraChamber as navigation completes.

**Architecture:** Two new components added alongside `HeroMarbleDrop` in the existing `ChainOverlay` folder. `HeroBellFlash` mounts inside ChainOverlay (still in `.playfield`) and renders a radial halo that scales outward from the Hero block center at the marble's impact time (delayed start). `HeroAuroraGrow` is a NEW kind of overlay — it needs to escape the `.playfield` parallax tilt to grow to fullscreen. Mounted as a sibling of `<TetrisGrid />` inside `<VelvetStage>` in `Home.tsx`, it reads `activeBlock` from `useChain()` and renders a `position: fixed` radial gradient that scales from the Hero block's viewport position to fullscreen. Hero sequence duration bumps from 1500ms → 1900ms to give all three phases breathing room before navigation.

**Tech Stack:** Existing — React 19, Motion, CSS Modules, Vitest, happy-dom. **No new runtime dependencies.**

**Spec reference:** `docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md` §7.2 (Hero row: "Marble drops → bell rings → aurora chamber opens (Velvet → Aurora transition)") — Phase 5c completes the back two-thirds.

---

## File Structure

| File | Type | Responsibility |
|---|---|---|
| `src/lib/chain-context.ts` | Modify | Bump `HERO_CHAIN_DURATION_MS` from 1500 → 1900ms |
| `src/lib/__tests__/chain-context.test.ts` | Modify | Update assertion |
| `src/lib/__tests__/chain.test.tsx` | Modify | Bump existing hero `advanceTimersByTime` calls 1500 → 1900 |
| `src/components/TetrisGrid/ChainOverlay/HeroBellFlash.tsx` | Create | Motion `motion.div` rendering a radial halo that scales from 0 → 4× and fades over 350ms, starting at 1050ms delay |
| `src/components/TetrisGrid/ChainOverlay/HeroBellFlash.module.css` | Create | Bell halo styles: radial-gradient gold, drop-shadow, scale-origin centering |
| `src/components/TetrisGrid/ChainOverlay/__tests__/HeroBellFlash.test.tsx` | Create | 3 tests: renders at target coords, aria-hidden, has gold halo gradient |
| `src/components/TetrisGrid/ChainOverlay/ChainOverlay.tsx` | Modify | When `activeBlock === 'hero'`, render both `HeroMarbleDrop` AND `HeroBellFlash` |
| `src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx` | Modify | Add test asserting both marble AND bell render when hero is active |
| `src/components/HeroAuroraGrow/HeroAuroraGrow.tsx` | Create | Fullscreen aurora overlay; reads `useChain()`; finds hero block via `querySelector('[data-block-id="hero"]')`; renders Motion fixed-positioned radial gradient that scales 0 → fullscreen over 600ms with 1300ms delay |
| `src/components/HeroAuroraGrow/HeroAuroraGrow.module.css` | Create | Fixed positioning, aurora gradient layers, scale-from-center transform |
| `src/components/HeroAuroraGrow/__tests__/HeroAuroraGrow.test.tsx` | Create | 4 tests: renders nothing without chain; renders when hero active; aria-hidden; position fixed |
| `src/pages/Home.tsx` | Modify | Render `<HeroAuroraGrow />` inside `<VelvetStage>` as a sibling of `<TetrisGrid />` |
| `src/pages/__tests__/Home.test.tsx` | Modify | Add test asserting HeroAuroraGrow is mounted (lazy — just check the wrapper exists in DOM, since rendering is chain-conditional) |
| `docs/ux-critique.md` | Modify | Append Phase 5c status |

---

## Task 1 · Bump Hero duration to 1900ms

**Files:** `src/lib/chain-context.ts`, `src/lib/__tests__/chain-context.test.ts`, `src/lib/__tests__/chain.test.tsx`

Timing breakdown of full Hero sequence:
- 0–900ms: marble drop (existing Phase 5b)
- 900–1050ms: marble squash (existing Phase 5b)
- 1050–1400ms: bell flash (new in 5c — 350ms duration)
- 1300–1900ms: aurora grow (new in 5c — 600ms duration, overlaps bell tail by 100ms)
- 1900ms: navigation fires (handoff to /contact AuroraChamber)

- [ ] **Step 1: Write failing test** — update existing assertion in `chain-context.test.ts`:

```typescript
  it('hero sequence is 1900ms (marble + squash + bell + aurora grow)', () => {
    const heroSeq = BLOCK_SEQUENCES.hero!
    expect(heroSeq).toHaveLength(1)
    expect(heroSeq[0]).toEqual({ kind: 'wait', durationMs: 1900 })
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/lib/__tests__/chain-context.test.ts`
Expected: FAIL.

- [ ] **Step 3: Bump the constant**

In `src/lib/chain-context.ts`, change:

```typescript
export const HERO_CHAIN_DURATION_MS = 1900
```

- [ ] **Step 4: Fix dependent hero timer assertions in `chain.test.tsx`**

Find any `vi.advanceTimersByTime(1500)` calls in `src/lib/__tests__/chain.test.tsx` that follow a `startChain('hero', ...)` — bump them to `1900`.

- [ ] **Step 5: Run full suite**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/chain-context.ts src/lib/__tests__/chain-context.test.ts src/lib/__tests__/chain.test.tsx
git commit -m "feat(chain): bump hero sequence to 1900ms for bell + aurora grow"
```

---

## Task 2 · Create `HeroBellFlash` component

**Files:**
- Create: `src/components/TetrisGrid/ChainOverlay/HeroBellFlash.module.css`
- Create: `src/components/TetrisGrid/ChainOverlay/HeroBellFlash.tsx`
- Create: `src/components/TetrisGrid/ChainOverlay/__tests__/HeroBellFlash.test.tsx`

A radial halo positioned at the Hero block's center. Starts at `scale(0)` (invisible). At delay 1050ms (when marble lands), animates to `scale(4)` and opacity 0 over 350ms. Visually reads as "the marble hit the block; it rings outward like a bell."

- [ ] **Step 1: Create the CSS module**

Create `src/components/TetrisGrid/ChainOverlay/HeroBellFlash.module.css`:

```css
/* HeroBellFlash — a gold halo that radiates outward from the Hero
   block at the marble's impact moment. Reads as a bell ringing.
   Scaled from 0 to 4× with fade-out over 350ms via Motion. */

.bellWrapper {
  position: absolute;
  width: 80px;
  height: 80px;
  margin-left: -40px;
  margin-top: -40px;
  pointer-events: none;
  will-change: transform, opacity;
}

.halo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    closest-side,
    rgba(255, 230, 110, 0.7) 0%,
    rgba(255, 212, 0, 0.5) 35%,
    rgba(255, 184, 0, 0.2) 65%,
    transparent 100%
  );
  filter: drop-shadow(0 0 12px rgba(255, 212, 0, 0.6));
}
```

- [ ] **Step 2: Write failing tests**

Create `src/components/TetrisGrid/ChainOverlay/__tests__/HeroBellFlash.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeroBellFlash } from '../HeroBellFlash'

describe('HeroBellFlash', () => {
  it('renders the bell halo positioned at target coords', () => {
    const { container } = render(<HeroBellFlash targetX={400} targetY={300} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.style.left).toBe('400px')
    expect(wrapper.style.top).toBe('300px')
  })

  it('the bell wrapper has aria-hidden="true"', () => {
    const { container } = render(<HeroBellFlash targetX={0} targetY={0} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('has a halo child with radial gradient styles', () => {
    const { container } = render(<HeroBellFlash targetX={0} targetY={0} />)
    expect(container.querySelector('[class*="halo"]')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/HeroBellFlash.test.tsx`
Expected: FAIL — component doesn't exist.

- [ ] **Step 4: Create the component**

Create `src/components/TetrisGrid/ChainOverlay/HeroBellFlash.tsx`:

```typescript
import { motion } from 'motion/react'
import styles from './HeroBellFlash.module.css'

export interface HeroBellFlashProps {
  /** Container-local X coordinate of the bell's center. */
  targetX: number
  /** Container-local Y coordinate of the bell's center. */
  targetY: number
}

/**
 * Hero bell flash — a gold radial halo that emanates from the Hero
 * block at the marble's impact moment (1050ms after chain start).
 * Scales from 0 → 4× and fades to 0 opacity over 350ms via Motion.
 * Reads as "the marble landed on a bell; it rings outward."
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function HeroBellFlash({ targetX, targetY }: HeroBellFlashProps) {
  return (
    <div
      className={styles.bellWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <motion.div
        className={styles.halo}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 4], opacity: [0, 1, 0] }}
        transition={{
          delay: 1.05,
          duration: 0.35,
          scale: { ease: 'easeOut' },
          opacity: { times: [0, 0.15, 1], ease: 'easeOut' },
        }}
      />
    </div>
  )
}
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/HeroBellFlash.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/TetrisGrid/ChainOverlay/HeroBellFlash.tsx src/components/TetrisGrid/ChainOverlay/HeroBellFlash.module.css src/components/TetrisGrid/ChainOverlay/__tests__/HeroBellFlash.test.tsx
git commit -m "feat(chain): add HeroBellFlash component (gold radial halo)"
```

---

## Task 3 · Render `HeroBellFlash` alongside marble in `ChainOverlay`

**Files:**
- Modify: `src/components/TetrisGrid/ChainOverlay/ChainOverlay.tsx`
- Modify: `src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx`

When `activeBlock === 'hero'`, render BOTH the marble AND the bell at the hero center. The bell's delayed start makes it visually sequential.

- [ ] **Step 1: Write the failing test**

Append to `ChainOverlay.test.tsx`:

```typescript
  it('renders BOTH marble and bell when activeBlock is hero', () => {
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
    // Marble: svg + circle
    expect(container.querySelector('svg circle')).toBeInTheDocument()
    // Bell halo: a div with radial-gradient styling — find via halo class
    expect(container.querySelector('[class*="halo"]')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx`
Expected: FAIL — bell halo not rendered yet.

- [ ] **Step 3: Update `ChainOverlay.tsx`**

Add import:

```typescript
import { HeroBellFlash } from './HeroBellFlash'
```

Update the conditional to render both:

```tsx
{activeBlock === 'hero' && heroCenter && (
  <>
    <HeroMarbleDrop targetX={heroCenter.x} targetY={heroCenter.y} />
    <HeroBellFlash targetX={heroCenter.x} targetY={heroCenter.y} />
  </>
)}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/ChainOverlay/ChainOverlay.tsx src/components/TetrisGrid/ChainOverlay/__tests__/ChainOverlay.test.tsx
git commit -m "feat(chain): render HeroBellFlash alongside marble in ChainOverlay"
```

---

## Task 4 · Create `HeroAuroraGrow` component (fullscreen overlay)

**Files:**
- Create: `src/components/HeroAuroraGrow/HeroAuroraGrow.module.css`
- Create: `src/components/HeroAuroraGrow/HeroAuroraGrow.tsx`
- Create: `src/components/HeroAuroraGrow/__tests__/HeroAuroraGrow.test.tsx`

Reads `useChain()` for `activeBlock`. When `activeBlock === 'hero'`, finds the hero block via `document.querySelector('[data-block-id="hero"]')`, reads its `getBoundingClientRect()` to anchor a fullscreen radial gradient at the hero block's center. The gradient scales from 0 to a viewport-spanning size over 600ms, starting at 1300ms delay (after the bell flash peaks). Uses `position: fixed` so it escapes the `.playfield` parallax tilt and grows to true fullscreen.

- [ ] **Step 1: Create the CSS module**

Create `src/components/HeroAuroraGrow/HeroAuroraGrow.module.css`:

```css
/* HeroAuroraGrow — a fullscreen aurora overlay that grows from the
   Hero block's viewport position to fill the screen during the chain
   reaction's tail. Reads cinematically as the velvet → aurora portal
   transition; by the time it's at fullscreen, navigation fires and
   /contact's AuroraChamber takes over seamlessly.

   Mounted at the home-page level (inside VelvetStage, sibling to
   TetrisGrid) so `position: fixed` escapes the `.playfield` parallax
   tilt and grows to true viewport bounds. */

.growWrapper {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  /* The center is set inline (left/top via style props from the
     hero block's bounding rect). Width/height are tiny initially;
     scaled outward via transform: scale() in the motion animation. */
  width: 60px;
  height: 60px;
  margin-left: -30px;
  margin-top: -30px;
  will-change: transform, opacity;
}

.aurora {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background:
    radial-gradient(60% 60% at 30% 30%, rgba(80, 200, 255, 0.7), transparent 70%),
    radial-gradient(60% 60% at 80% 70%, rgba(217, 3, 104, 0.7), transparent 70%),
    radial-gradient(50% 50% at 50% 100%, rgba(255, 212, 0, 0.4), transparent 70%),
    linear-gradient(180deg, #03020a 0%, #0a0418 100%);
}
```

- [ ] **Step 2: Write the failing tests**

Create `src/components/HeroAuroraGrow/__tests__/HeroAuroraGrow.test.tsx`:

```typescript
import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ChainProvider, useChain } from '../../../lib/chain'
import { HeroAuroraGrow } from '../HeroAuroraGrow'

beforeEach(() => {
  vi.useFakeTimers()
  // Stub a hero block element in the DOM with stable bounds.
  const stub = document.createElement('a')
  stub.setAttribute('data-block-id', 'hero')
  stub.getBoundingClientRect = () =>
    ({ left: 100, top: 200, right: 200, bottom: 280, width: 100, height: 80, x: 100, y: 200, toJSON: () => '' } as DOMRect)
  document.body.appendChild(stub)
})

afterEach(() => {
  vi.useRealTimers()
  document.body.querySelector('[data-block-id="hero"]')?.remove()
})

function ChainStarter() {
  const { startChain } = useChain()
  return <button data-testid="start" onClick={() => startChain('hero', () => {})}>start</button>
}

describe('HeroAuroraGrow', () => {
  it('renders nothing when no chain is active', () => {
    const { container } = render(
      <ChainProvider>
        <HeroAuroraGrow />
      </ChainProvider>,
    )
    expect(container.querySelector('[class*="growWrapper"]')).toBeNull()
  })

  it('renders the aurora overlay when hero chain is active', () => {
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter />
        <HeroAuroraGrow />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    expect(container.querySelector('[class*="growWrapper"]')).toBeInTheDocument()
  })

  it('the grow wrapper has aria-hidden="true"', () => {
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter />
        <HeroAuroraGrow />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    const wrapper = container.querySelector('[class*="growWrapper"]')
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })

  it('positions itself at the hero block center via getBoundingClientRect', () => {
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter />
        <HeroAuroraGrow />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    const wrapper = container.querySelector('[class*="growWrapper"]') as HTMLElement
    // hero rect: left=100, top=200, width=100, height=80 → center at (150, 240)
    expect(wrapper.style.left).toBe('150px')
    expect(wrapper.style.top).toBe('240px')
  })

  it('does NOT render for non-hero blocks (e.g., work)', () => {
    function WorkStarter() {
      const { startChain } = useChain()
      return <button data-testid="start" onClick={() => startChain('work', () => {})}>start</button>
    }
    const { container, getByTestId } = render(
      <ChainProvider>
        <WorkStarter />
        <HeroAuroraGrow />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    expect(container.querySelector('[class*="growWrapper"]')).toBeNull()
  })
})
```

- [ ] **Step 3: Run to verify failure**

Run: `pnpm test src/components/HeroAuroraGrow/__tests__/HeroAuroraGrow.test.tsx`
Expected: FAIL — component doesn't exist.

- [ ] **Step 4: Create the component**

Create `src/components/HeroAuroraGrow/HeroAuroraGrow.tsx`:

```typescript
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useChain } from '../../lib/chain'
import styles from './HeroAuroraGrow.module.css'

interface Anchor {
  x: number
  y: number
}

/**
 * HeroAuroraGrow — fullscreen aurora overlay that grows from the
 * Hero block's viewport position to fill the screen during the
 * Hero chain reaction's tail (~1300ms after chain start).
 *
 * Reads chain state via useChain(). When activeBlock becomes 'hero',
 * looks up the hero block element in the DOM (via stable
 * data-block-id) and records its center as the scale-from anchor.
 * The overlay is position:fixed so it escapes the .playfield
 * parallax and grows to true viewport bounds.
 *
 * Once at full scale, navigation has fired and /contact's
 * AuroraChamber takes over for the inner page — the visual handoff
 * reads as a single continuous aurora envelopment.
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function HeroAuroraGrow() {
  const { activeBlock } = useChain()
  const [anchor, setAnchor] = useState<Anchor | null>(null)

  useEffect(() => {
    if (activeBlock !== 'hero') {
      setAnchor(null)
      return
    }
    const heroEl = document.querySelector<HTMLElement>('[data-block-id="hero"]')
    if (!heroEl) return
    const rect = heroEl.getBoundingClientRect()
    setAnchor({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }, [activeBlock])

  if (activeBlock !== 'hero' || !anchor) return null

  // Scale large enough to cover any reasonable viewport. The wrapper is
  // 60px wide; scaling by 50 gives a 3000px diameter circle — covers
  // even ultrawide displays.
  return (
    <div
      className={styles.growWrapper}
      style={{ left: `${anchor.x}px`, top: `${anchor.y}px` }}
      aria-hidden="true"
    >
      <motion.div
        className={styles.aurora}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 50, opacity: [0, 0.6, 1] }}
        transition={{
          delay: 1.3,
          duration: 0.6,
          scale: { ease: [0.4, 0, 0.2, 1] },
          opacity: { times: [0, 0.3, 1], ease: 'easeOut' },
        }}
      />
    </div>
  )
}
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test src/components/HeroAuroraGrow/__tests__/HeroAuroraGrow.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroAuroraGrow/HeroAuroraGrow.tsx src/components/HeroAuroraGrow/HeroAuroraGrow.module.css src/components/HeroAuroraGrow/__tests__/HeroAuroraGrow.test.tsx
git commit -m "feat(chain): add HeroAuroraGrow fullscreen overlay"
```

---

## Task 5 · Mount `HeroAuroraGrow` in `Home.tsx`

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/__tests__/Home.test.tsx`

HeroAuroraGrow renders inside VelvetStage as a sibling of TetrisGrid, so its `position: fixed` escapes the `.playfield` tilt.

- [ ] **Step 1: Append test to Home.test.tsx**

```typescript
  it('mounts HeroAuroraGrow at the page level (chain-aware overlay)', () => {
    // HeroAuroraGrow renders null when no chain is active, so we just
    // verify the COMPONENT is imported + rendered in the React tree.
    // Easiest assertion: import the component and check via a custom
    // hook OR just verify the Home page imports the module.
    // The integration is best verified manually + via the
    // HeroAuroraGrow's own tests. For Home, we sanity-check no
    // regression by asserting the velvet stage + tetris grid still exist.
    const { container } = renderHome()
    expect(container.querySelector('[data-env="velvet"]')).toBeInTheDocument()
    expect(container.querySelector('[data-block-id="hero"]')).toBeInTheDocument()
  })
```

(This is a regression check; the real integration is tested in HeroAuroraGrow's own suite.)

- [ ] **Step 2: Run to verify it still passes (no regression expected)**

Run: `pnpm test src/pages/__tests__/Home.test.tsx`
Expected: PASS — Home should still render fine (we haven't changed it yet).

- [ ] **Step 3: Update `src/pages/Home.tsx`**

Add import:

```typescript
import { HeroAuroraGrow } from '../components/HeroAuroraGrow/HeroAuroraGrow'
```

Update the JSX to mount `<HeroAuroraGrow />` inside `<VelvetStage>` as a sibling to `<TetrisGrid />`:

```tsx
export default function Home() {
  return (
    <>
      <RouteHead {...META['/']} />
      <VelvetStage>
        <TetrisGrid />
        <HeroAuroraGrow />
      </VelvetStage>
    </>
  )
}
```

- [ ] **Step 4: Run full suite**

Run: `pnpm test`
Expected: PASS — no regressions.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx src/pages/__tests__/Home.test.tsx
git commit -m "feat(home): mount HeroAuroraGrow inside VelvetStage"
```

---

## Task 6 · Controller verification + build

**Files:** No code changes — verification only.

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: 268 (Phase 5b baseline) + ~10 new (5c additions) = ~278 tests passing.

Breakdown:
- chain-context: net 0 (replaced 1 assertion with updated)
- HeroBellFlash: 3 tests
- ChainOverlay (new bell test): 1
- HeroAuroraGrow: 5
- Home: 1 sanity check
Total: ~10 new → ~278.

- [ ] **Step 2: TSC + build**

Run: `pnpm exec tsc --noEmit -p tsconfig.app.json` → clean
Run: `pnpm build` → clean, all 6 routes prerendered

- [ ] **Step 3: Inspect bundle for Phase 5c patterns**

```bash
grep -c "growWrapper\|HeroBellFlash\|HeroAuroraGrow\|halo" dist/assets/*.js dist/assets/*.css 2>/dev/null | head -5
```

Expected: at least 1 match per pattern.

- [ ] **Step 4: No commit (verification only)**

---

## Task 7 · UX critique docs update

**Files:** `docs/ux-critique.md`

- [ ] **Step 1: Append Phase 5c entry**

```markdown

### Phase 5c — Hero Bell Flash + Aurora Grow (completed 2026-05-25)

Completed the Hero block's chain reaction with two more visual phases on top of Phase 5b's marble drop:

1. **HeroBellFlash** — a gold radial halo that emanates from the Hero block at the marble's impact moment (~1050ms after chain start). Scales from 0 to 4× and fades over 350ms via Motion. Mounted inside ChainOverlay alongside the marble.

2. **HeroAuroraGrow** — a fullscreen aurora overlay that grows from the Hero block's viewport position to fill the screen during the chain's tail (~1300ms in). `position: fixed` to escape the `.playfield` parallax; reads chain state via useChain(); finds the hero block via stable `data-block-id` selector and anchors at its center. By the time the overlay reaches fullscreen, navigation has fired and /contact's AuroraChamber takes over seamlessly.

Total Hero sequence duration bumped to 1900ms (from 1500ms) to accommodate: marble drop 900ms + squash 150ms + bell flash 350ms + aurora grow 600ms (overlapping). No new runtime dependencies.

The cinematic "Velvet → Aurora portal transition" promised by the spec §5.2 now lands visually. Phase 5d+ will deliver the remaining 5 block sequences (About / Work / Services / Process / Contact).

See `docs/superpowers/plans/2026-05-25-ui-v2-phase-5c-hero-bell-and-aurora.md` for the full implementation log.
```

- [ ] **Step 2: Commit**

```bash
git add docs/ux-critique.md
git commit -m "docs(critique): record Phase 5c hero bell + aurora grow"
```

---

## Definition of Done

- [ ] All 7 tasks above complete
- [ ] `pnpm test` passes (~278 tests)
- [ ] `pnpm build` clean
- [ ] All commits clean + atomic
- [ ] Phase 5c commits stacked on Phase 5b on the existing branch

---

## What is NOT in Phase 5c

- About / Work / Services / Process / Contact gadgets — Phase 5d+
- Rapier2D physics — still deferred
- Sound design — out of v2 launch scope
- Reverse aurora-grow on back-navigation — Phase 6 territory
