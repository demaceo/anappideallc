# Opening Animation Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat gravity drop with a choreographed sequence — small blocks scaffold first, hero crashes in last with a heavy squash/bounce, and each block's content (title → subtitle → CTA) bursts in after it settles. Same treatment on return navigation.

**Architecture:** WAAPI animations in `useGravityDrop` and `useLineClear` are rewritten with new stagger order, squash/bounce keyframes, and a secondary child-reveal pass targeting `[data-reveal]` elements. `Block.tsx` adds those `data-reveal` attributes so the hooks can query children without relying on hashed CSS module class names.

**Tech Stack:** Web Animations API (WAAPI), React hooks, Vitest, @testing-library/react, happy-dom

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/TetrisGrid/Block.tsx` | Modify | Add `data-reveal` attributes to title/subtitle/cta spans |
| `src/components/TetrisGrid/useGravityDrop.ts` | Rewrite | New stagger order, squash keyframes, hero special treatment, content reveal |
| `src/components/TetrisGrid/useLineClear.ts` | Modify | Stagger + squash + content reveal on reverse fly-in; playOutAndNavigate untouched |
| `src/components/TetrisGrid/__tests__/gravity-drop.test.ts` | Create | Unit tests for useGravityDrop stagger, hero treatment, content reveal, guards |
| `src/components/TetrisGrid/__tests__/line-clear-return.test.ts` | Create | Unit tests for return animation stagger, squash, content reveal |
| `vite.config.ts` | Modify | Add Vitest configuration |

---

## Task 1: Install Vitest and configure test environment

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `vite.config.ts`

- [ ] **Step 1.1: Install test dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom happy-dom
```

Expected output: packages added to `devDependencies`.

- [ ] **Step 1.2: Add test config to vite.config.ts**

Replace the full file with:

```typescript
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: [],
  },
})
```

- [ ] **Step 1.3: Add test script to package.json**

In the `scripts` block, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 1.4: Verify Vitest runs**

```bash
npx vitest run --reporter=verbose 2>&1 | head -20
```

Expected: "No test files found" (not an error, just no tests yet).

---

## Task 2: Add `data-reveal` attributes to Block.tsx

**Files:**
- Modify: `src/components/TetrisGrid/Block.tsx`
- Create: `src/components/TetrisGrid/__tests__/block.test.tsx`

- [ ] **Step 2.1: Write the failing test**

Create `src/components/TetrisGrid/__tests__/block.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { Block } from '../Block'
import type { BlockProps } from '../Block'

function renderBlock(props: Partial<BlockProps> = {}) {
  return render(
    <MemoryRouter>
      <Block id="hero" to="/" title="Test Title" {...props} />
    </MemoryRouter>,
  )
}

describe('Block', () => {
  it('adds data-reveal="title" to the title span', () => {
    const { getByText } = renderBlock({ title: 'Hello' })
    expect(getByText('Hello')).toHaveAttribute('data-reveal', 'title')
  })

  it('adds data-reveal="subtitle" to the subtitle span when present', () => {
    const { getByText } = renderBlock({ subtitle: 'Sub text' })
    expect(getByText('Sub text')).toHaveAttribute('data-reveal', 'subtitle')
  })

  it('adds data-reveal="cta" to the cta span when present', () => {
    const { getByText } = renderBlock({ cta: 'Click me' })
    expect(getByText('Click me →')).toHaveAttribute('data-reveal', 'cta')
  })

  it('renders no data-reveal="subtitle" when subtitle is absent', () => {
    const { container } = renderBlock()
    expect(container.querySelector('[data-reveal="subtitle"]')).toBeNull()
  })
})
```

- [ ] **Step 2.2: Run the test to confirm it fails**

```bash
npx vitest run src/components/TetrisGrid/__tests__/block.test.tsx --reporter=verbose
```

Expected: 3 failures — `toHaveAttribute` not satisfied.

Note: `toHaveAttribute` is a jest-dom matcher. If it's unavailable, add this import at the top of the test:
```typescript
import '@testing-library/jest-dom'
```
And install: `npm install -D @testing-library/jest-dom`

- [ ] **Step 2.3: Add `data-reveal` attributes to Block.tsx and export `BlockProps`**

In `src/components/TetrisGrid/Block.tsx`, make two changes:

**a) Export `BlockProps`** (needed by the test — `Parameters<typeof Block>` doesn't work cleanly with `forwardRef`):

```tsx
export interface BlockProps {
  id: BlockId
  to: string
  title: string
  subtitle?: string
  cta?: string
  ariaLabel?: string
  onNavigate?: (id: BlockId, to: string) => void
}
```

**b) Add `data-reveal` attributes to the three child spans:**

```tsx
      <span data-reveal="title" className={styles.title}>{title}</span>
      {subtitle ? <span data-reveal="subtitle" className={styles.subtitle}>{subtitle}</span> : null}
      {cta ? <span data-reveal="cta" className={styles.cta}>{cta} →</span> : null}
```

- [ ] **Step 2.4: Run the test to confirm it passes**

```bash
npx vitest run src/components/TetrisGrid/__tests__/block.test.tsx --reporter=verbose
```

Expected: all 4 tests PASS.

- [ ] **Step 2.5: Commit**

```bash
git add src/components/TetrisGrid/Block.tsx src/components/TetrisGrid/__tests__/block.test.tsx vite.config.ts package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat: add data-reveal attrs to Block children, configure Vitest

Stable selectors for WAAPI child-reveal targeting. CSS module class names
are hashed in production builds so querySelector('[class*="title"]')
is unreliable; data-reveal attributes are explicit and stable.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Write failing tests for `useGravityDrop`

**Files:**
- Create: `src/components/TetrisGrid/__tests__/gravity-drop.test.ts`

- [ ] **Step 3.1: Create the test file**

Create `src/components/TetrisGrid/__tests__/gravity-drop.test.ts`:

```typescript
import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useGravityDrop } from '../useGravityDrop'

// WAAPI is not in happy-dom; mock it on the prototype.
function makeMockAnimate() {
  const mockAnim = {
    finished: Promise.resolve(),
    playState: 'finished' as AnimationPlayState,
    cancel: vi.fn(),
  }
  return vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue(
    mockAnim as unknown as Animation,
  )
}

// matchMedia is not in happy-dom either.
function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function makeBlockEl(blockId: string, children: string[] = []): HTMLElement {
  const el = document.createElement('a')
  el.dataset.blockId = blockId
  for (const reveal of children) {
    const span = document.createElement('span')
    span.dataset.reveal = reveal
    el.appendChild(span)
  }
  return el
}

describe('useGravityDrop', () => {
  let animateSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    sessionStorage.clear()
    mockMatchMedia(false)
    animateSpy = makeMockAnimate()
  })

  afterEach(() => {
    animateSpy.mockRestore()
  })

  it('animates hero block with 600 ms delay', () => {
    const el = makeBlockEl('hero')
    renderHook(() => useGravityDrop([{ current: el }]))
    const heroCalls = animateSpy.mock.calls.filter(([, opts]) => opts.delay === 600)
    expect(heroCalls).toHaveLength(1)
  })

  it('animates brand block with 0 ms delay', () => {
    const el = makeBlockEl('brand')
    renderHook(() => useGravityDrop([{ current: el }]))
    const brandCalls = animateSpy.mock.calls.filter(([, opts]) => opts.delay === 0)
    expect(brandCalls).toHaveLength(1)
  })

  it('animates all seven blocks in the spec stagger order', () => {
    const SPEC_DELAYS: Record<string, number> = {
      brand: 0, about: 110, services: 210, work: 310,
      process: 390, contact: 460, hero: 600,
    }
    const refs = Object.keys(SPEC_DELAYS).map((id) => ({
      current: makeBlockEl(id),
    }))
    renderHook(() => useGravityDrop(refs))

    for (const [id, expectedDelay] of Object.entries(SPEC_DELAYS)) {
      const el = refs.find((r) => r.current.dataset.blockId === id)!.current
      const call = animateSpy.mock.calls.find(
        ([target, opts]) => target === el && opts.delay === expectedDelay,
      )
      expect(call, `${id} should be animated with delay ${expectedDelay}`).toBeDefined()
    }
  })

  it('hero block gets a longer duration than non-hero blocks', () => {
    const heroEl   = makeBlockEl('hero')
    const brandEl  = makeBlockEl('brand')
    renderHook(() => useGravityDrop([{ current: heroEl }, { current: brandEl }]))

    const heroDuration  = animateSpy.mock.calls.find(([t]) => t === heroEl)?.[1].duration as number
    const brandDuration = animateSpy.mock.calls.find(([t]) => t === brandEl)?.[1].duration as number
    expect(heroDuration).toBeGreaterThan(brandDuration)
  })

  it('hero first keyframe starts higher (-140%) than non-hero (-130%)', () => {
    const heroEl  = makeBlockEl('hero')
    const aboutEl = makeBlockEl('about')
    renderHook(() => useGravityDrop([{ current: heroEl }, { current: aboutEl }]))

    const heroFrames  = animateSpy.mock.calls.find(([t]) => t === heroEl)?.[0] as Keyframe[]
    const aboutFrames = animateSpy.mock.calls.find(([t]) => t === aboutEl)?.[0] as Keyframe[]
    expect((heroFrames[0].transform as string)).toContain('-140%')
    expect((aboutFrames[0].transform as string)).toContain('-130%')
  })

  it('hero block squash keyframe uses wider scaleX than non-hero', () => {
    const heroEl  = makeBlockEl('hero')
    const aboutEl = makeBlockEl('about')
    renderHook(() => useGravityDrop([{ current: heroEl }, { current: aboutEl }]))

    const heroFrames  = animateSpy.mock.calls.find(([t]) => t === heroEl)?.[0] as Keyframe[]
    const aboutFrames = animateSpy.mock.calls.find(([t]) => t === aboutEl)?.[0] as Keyframe[]

    const heroSquash  = heroFrames.find((f) => (f.transform as string).includes('scaleX(1.1'))
    const aboutSquash = aboutFrames.find((f) => (f.transform as string).includes('scaleX(1.06'))
    expect(heroSquash).toBeDefined()
    expect(aboutSquash).toBeDefined()
  })

  it('animates [data-reveal] children of each block after settle', () => {
    const el = makeBlockEl('brand', ['title', 'subtitle', 'cta'])
    renderHook(() => useGravityDrop([{ current: el }]))

    const childEls = Array.from(el.querySelectorAll('[data-reveal]'))
    for (const child of childEls) {
      const call = animateSpy.mock.calls.find(([t]) => t === child)
      expect(call, `${(child as HTMLElement).dataset.reveal} should be animated`).toBeDefined()
    }
  })

  it('child reveal delays are staggered 80 ms apart', () => {
    const el = makeBlockEl('brand', ['title', 'subtitle', 'cta'])
    renderHook(() => useGravityDrop([{ current: el }]))

    const children = Array.from(el.querySelectorAll('[data-reveal]'))
    const delays = children.map((child) => {
      const call = animateSpy.mock.calls.find(([t]) => t === child)
      return call?.[1].delay as number
    })
    expect(delays[1] - delays[0]).toBe(80)
    expect(delays[2] - delays[1]).toBe(80)
  })

  it('skips animation when SESSION_KEY is already set', () => {
    sessionStorage.setItem('introPlayed', '1')
    const el = makeBlockEl('brand')
    renderHook(() => useGravityDrop([{ current: el }]))
    expect(animateSpy).not.toHaveBeenCalled()
  })

  it('skips animation when RETURN_FLAG is set (line-clear will handle it)', () => {
    sessionStorage.setItem('app:lastNonRootPath', '/about')
    const el = makeBlockEl('brand')
    renderHook(() => useGravityDrop([{ current: el }]))
    expect(animateSpy).not.toHaveBeenCalled()
  })

  it('skips animation when prefers-reduced-motion is set', () => {
    mockMatchMedia(true) // matches: true → reduced motion
    const el = makeBlockEl('brand')
    renderHook(() => useGravityDrop([{ current: el }]))
    expect(animateSpy).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 3.2: Run to confirm all tests fail**

```bash
npx vitest run src/components/TetrisGrid/__tests__/gravity-drop.test.ts --reporter=verbose
```

Expected: all tests fail (import error or assertion failures — the implementation doesn't match yet).

---

## Task 4: Rewrite `useGravityDrop.ts`

**Files:**
- Modify: `src/components/TetrisGrid/useGravityDrop.ts`

- [ ] **Step 4.1: Replace the full file**

```typescript
import { useEffect } from 'react'
import type { RefObject } from 'react'

const SESSION_KEY = 'introPlayed'
const RETURN_FLAG = 'app:lastNonRootPath'

const GRAVITY_EASING = 'cubic-bezier(0.55, 0.085, 0.68, 0.53)'
const HERO_EASING    = 'cubic-bezier(0.55, 0.02, 0.65, 0.40)'

// Small blocks scaffold the grid; hero lands last for maximum payoff.
const DROP_DELAY: Record<string, number> = {
  brand:    0,
  about:    110,
  services: 210,
  work:     310,
  process:  390,
  contact:  460,
  hero:     600,
}

// Each keyframe string includes ALL transform functions so the browser
// interpolates cleanly without converting to matrix form.
const NON_HERO_FRAMES: Keyframe[] = [
  { offset: 0.00, transform: 'translateY(-130%) scaleX(1) scaleY(1)',    opacity: 0, easing: GRAVITY_EASING },
  { offset: 0.75, transform: 'translateY(0) scaleX(1) scaleY(1)',        opacity: 1 },
  { offset: 0.83, transform: 'translateY(0) scaleX(1.06) scaleY(0.90)', opacity: 1 },
  { offset: 0.90, transform: 'translateY(-6px) scaleX(0.98) scaleY(1.02)', opacity: 1 },
  { offset: 0.96, transform: 'translateY(0) scaleX(1) scaleY(1)',        opacity: 1 },
  { offset: 1.00, transform: 'translateY(0) scaleX(1) scaleY(1)',        opacity: 1 },
]

const HERO_FRAMES: Keyframe[] = [
  { offset: 0.00, transform: 'translateY(-140%) scaleX(0.90) scaleY(1.10)', opacity: 0, easing: HERO_EASING },
  { offset: 0.74, transform: 'translateY(0) scaleX(0.90) scaleY(1.10)',     opacity: 1 },
  { offset: 0.80, transform: 'translateY(0) scaleX(1.10) scaleY(0.87)',     opacity: 1 },
  { offset: 0.88, transform: 'translateY(-13px) scaleX(0.96) scaleY(1.04)', opacity: 1 },
  { offset: 0.94, transform: 'translateY(0) scaleX(1) scaleY(1)',           opacity: 1 },
  { offset: 1.00, transform: 'translateY(0) scaleX(1) scaleY(1)',           opacity: 1 },
]

const CONTENT_FRAMES: Keyframe[] = [
  { opacity: 0, transform: 'translateY(6px)', filter: 'blur(2px)' },
  { opacity: 1, transform: 'translateY(0)',   filter: 'blur(0)'   },
]

function animateReveal(el: HTMLElement, settleMs: number): Animation[] {
  return Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]')).map((child, i) =>
    child.animate(CONTENT_FRAMES, {
      duration: 380,
      delay: settleMs + i * 80,
      fill: 'backwards',
      easing: 'ease-out',
    }),
  )
}

export function useGravityDrop(refs: RefObject<HTMLElement | null>[]) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let alreadyPlayed = false
    try { alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === '1' } catch { /* ignore */ }
    if (alreadyPlayed) return

    let returningFrom: string | null = null
    try { returningFrom = sessionStorage.getItem(RETURN_FLAG) } catch { /* ignore */ }
    if (returningFrom && returningFrom !== '/' && returningFrom !== '') return

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* ignore */ }
      return
    }

    const animations: Animation[] = []

    refs.forEach((ref) => {
      const el = ref.current
      if (!el) return
      const blockId = el.dataset.blockId ?? ''
      const isHero  = blockId === 'hero'
      const delay   = DROP_DELAY[blockId] ?? 0
      const duration = isHero ? 840 + Math.random() * 20 : 780 + Math.random() * 80

      const anim = el.animate(isHero ? HERO_FRAMES : NON_HERO_FRAMES, {
        duration,
        delay,
        fill: 'backwards',
      })
      animations.push(anim)

      const settleMs = delay + duration * (isHero ? 0.94 : 0.96)
      animations.push(...animateReveal(el, settleMs))
    })

    let cancelled = false
    Promise.allSettled(animations.map((a) => a.finished)).then(() => {
      if (cancelled) return
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* ignore */ }
    })

    return () => {
      cancelled = true
      animations.forEach((a) => { if (a.playState !== 'finished') a.cancel() })
    }
  }, [refs])
}
```

- [ ] **Step 4.2: Run the tests to confirm they pass**

```bash
npx vitest run src/components/TetrisGrid/__tests__/gravity-drop.test.ts --reporter=verbose
```

Expected: all tests PASS.

- [ ] **Step 4.3: Commit**

```bash
git add src/components/TetrisGrid/useGravityDrop.ts src/components/TetrisGrid/__tests__/gravity-drop.test.ts
git commit -m "$(cat <<'EOF'
feat: choreograph gravity drop — scaffold → hero finale, squash + content reveal

Small blocks land first (brand:0ms → contact:460ms), hero crashes in at
600ms with heavier easing and bigger squash (scaleX 1.10 vs 1.06).
[data-reveal] children fade in after each block settles (title → subtitle
→ CTA, 80ms stagger, blur-to-clear).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Write failing tests for `useLineClear` return animation

**Files:**
- Create: `src/components/TetrisGrid/__tests__/line-clear-return.test.ts`

- [ ] **Step 5.1: Create the test file**

Create `src/components/TetrisGrid/__tests__/line-clear-return.test.ts`:

```typescript
import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router'
import React from 'react'
import { useLineClearController } from '../useLineClear'
import type { BlockRef } from '../useLineClear'
import type { BlockId } from '../Block'

function makeMockAnimate() {
  const mockAnim = {
    finished: Promise.resolve(),
    playState: 'finished' as AnimationPlayState,
    cancel: vi.fn(),
  }
  return vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue(
    mockAnim as unknown as Animation,
  )
}

function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function makeBlockRefs(ids: BlockId[]): BlockRef[] {
  return ids.map((id) => {
    const el = document.createElement('a')
    el.dataset.blockId = id
    // Add data-reveal children so content-reveal calls are verifiable
    const title = document.createElement('span')
    title.dataset.reveal = 'title'
    el.appendChild(title)
    return { id, ref: { current: el } }
  })
}

const ALL_IDS: BlockId[] = ['brand', 'about', 'services', 'work', 'process', 'contact', 'hero']

describe('useLineClear — return animation', () => {
  let animateSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    sessionStorage.clear()
    mockMatchMedia(false)
    animateSpy = makeMockAnimate()
    // Simulate returning from a non-root path
    sessionStorage.setItem('app:lastNonRootPath', '/about')
  })

  afterEach(() => {
    animateSpy.mockRestore()
  })

  function runReturnHook(ids: BlockId[] = ALL_IDS) {
    const blockRefs = makeBlockRefs(ids)
    renderHook(() => useLineClearController(blockRefs), {
      wrapper: ({ children }) =>
        React.createElement(MemoryRouter, { initialEntries: ['/'] }, children),
    })
    return blockRefs
  }

  it('fires return animation when RETURN_FLAG is set', () => {
    runReturnHook()
    expect(animateSpy).toHaveBeenCalled()
  })

  it('does NOT fire return animation when RETURN_FLAG is absent', () => {
    sessionStorage.removeItem('app:lastNonRootPath')
    runReturnHook()
    // animate may still be called for something else — check no block-element calls
    const blockEls = makeBlockRefs(ALL_IDS).map((r) => r.ref.current)
    const blockCalls = animateSpy.mock.calls.filter(([t]) => blockEls.includes(t as HTMLElement))
    expect(blockCalls).toHaveLength(0)
  })

  it('animates hero with 420 ms delay', () => {
    const refs = runReturnHook()
    const heroEl = refs.find((r) => r.id === 'hero')!.ref.current!
    const heroCalls = animateSpy.mock.calls.filter(
      ([t, opts]) => t === heroEl && opts.delay === 420,
    )
    expect(heroCalls).toHaveLength(1)
  })

  it('animates brand with 0 ms delay', () => {
    const refs = runReturnHook()
    const brandEl = refs.find((r) => r.id === 'brand')!.ref.current!
    const brandCalls = animateSpy.mock.calls.filter(
      ([t, opts]) => t === brandEl && opts.delay === 0,
    )
    expect(brandCalls).toHaveLength(1)
  })

  it('all seven blocks are animated in the spec stagger order', () => {
    const SPEC_DELAYS: Record<BlockId, number> = {
      brand: 0, about: 60, services: 120, work: 180,
      process: 240, contact: 300, hero: 420,
    }
    const refs = runReturnHook()
    for (const [id, expectedDelay] of Object.entries(SPEC_DELAYS)) {
      const el = refs.find((r) => r.id === id)!.ref.current!
      const call = animateSpy.mock.calls.find(
        ([t, opts]) => t === el && opts.delay === expectedDelay,
      )
      expect(call, `${id} should have delay ${expectedDelay}`).toBeDefined()
    }
  })

  it('hero squash keyframe uses scaleX(1.10) scaleY(0.87)', () => {
    const refs = runReturnHook()
    const heroEl = refs.find((r) => r.id === 'hero')!.ref.current!
    const heroMainCall = animateSpy.mock.calls.find(
      ([t, opts]) => t === heroEl && opts.delay === 420,
    )
    const frames = heroMainCall?.[0] as Keyframe[]
    const squashFrame = frames.find((f) => (f.transform as string).includes('scaleX(1.10)'))
    expect(squashFrame).toBeDefined()
    expect(squashFrame!.transform as string).toContain('scaleY(0.87)')
  })

  it('non-hero squash keyframe uses scaleX(1.06) scaleY(0.90)', () => {
    const refs = runReturnHook()
    const brandEl = refs.find((r) => r.id === 'brand')!.ref.current!
    const brandMainCall = animateSpy.mock.calls.find(
      ([t, opts]) => t === brandEl && opts.delay === 0,
    )
    const frames = brandMainCall?.[0] as Keyframe[]
    const squashFrame = frames.find((f) => (f.transform as string).includes('scaleX(1.06)'))
    expect(squashFrame).toBeDefined()
    expect(squashFrame!.transform as string).toContain('scaleY(0.90)')
  })

  it('animates [data-reveal] children after each block settles', () => {
    const refs = runReturnHook()
    const brandEl = refs.find((r) => r.id === 'brand')!.ref.current!
    const titleSpan = brandEl.querySelector('[data-reveal="title"]')!
    const childCall = animateSpy.mock.calls.find(([t]) => t === titleSpan)
    expect(childCall).toBeDefined()
  })

  it('does not fire return animation when prefers-reduced-motion is set', () => {
    mockMatchMedia(true)
    const refs = runReturnHook()
    const blockEls = refs.map((r) => r.ref.current)
    const blockCalls = animateSpy.mock.calls.filter(([t]) => blockEls.includes(t as HTMLElement))
    expect(blockCalls).toHaveLength(0)
  })
})
```

- [ ] **Step 5.2: Run to confirm tests fail**

```bash
npx vitest run src/components/TetrisGrid/__tests__/line-clear-return.test.ts --reporter=verbose
```

Expected: most tests fail — current implementation has no stagger, no squash, no content reveal.

---

## Task 6: Update `useLineClear.ts` return animation

**Files:**
- Modify: `src/components/TetrisGrid/useLineClear.ts`

- [ ] **Step 6.1: Add `RETURN_ORDER` constant and `CONTENT_FRAMES` near the top of the file, after the `FLY` map**

Open `src/components/TetrisGrid/useLineClear.ts`. After the `FLY` map declaration (around line 22), add:

```typescript
// Return stagger: faster than entry (visitor already knows the grid).
const RETURN_ORDER: Record<BlockId, number> = {
  brand:    0,
  about:    60,
  services: 120,
  work:     180,
  process:  240,
  contact:  300,
  hero:     420,
}

const CONTENT_FRAMES: Keyframe[] = [
  { opacity: 0, transform: 'translateY(6px)', filter: 'blur(2px)' },
  { opacity: 1, transform: 'translateY(0)',   filter: 'blur(0)'   },
]
```

- [ ] **Step 6.2: Replace the return `useEffect` body**

In `useLineClear.ts`, find the `useEffect` that handles the reverse fly-in (it starts with `if (reduced()) return` and reads `RETURN_FLAG` from sessionStorage). Replace its entire inner body — from the `const animations: Animation[] = []` line through the end of the `for` loop and cleanup return — with:

```typescript
    const animations: Animation[] = []
    for (const { id, ref } of blockRefs) {
      const el = ref.current
      if (!el) continue
      const v = FLY[id]
      const isHero = id === 'hero'
      const delay    = RETURN_ORDER[id]
      const duration = isHero ? 520 : 480
      const from = `translate(${v.tx}vw, ${v.ty}vh) rotate(${v.rot}deg) scaleX(1) scaleY(1)`

      const keyframes: Keyframe[] = [
        { offset: 0.00, transform: from,                                                           opacity: 0 },
        { offset: 0.05, transform: from,                                                           opacity: 1 },
        { offset: 0.80, transform: 'translate(0, 0) rotate(0deg) scaleX(1) scaleY(1)',            opacity: 1 },
        {
          offset: 0.88,
          transform: isHero
            ? 'translate(0, 0) rotate(0deg) scaleX(1.10) scaleY(0.87)'
            : 'translate(0, 0) rotate(0deg) scaleX(1.06) scaleY(0.90)',
          opacity: 1,
        },
        {
          offset: 0.94,
          transform: isHero
            ? 'translate(0, -10px) rotate(0deg) scaleX(0.96) scaleY(1.04)'
            : 'translate(0, -4px) rotate(0deg) scaleX(0.98) scaleY(1.02)',
          opacity: 1,
        },
        { offset: 1.00, transform: 'translate(0, 0) rotate(0deg) scaleX(1) scaleY(1)',            opacity: 1 },
      ]

      const anim = el.animate(keyframes, {
        duration,
        delay,
        fill: 'backwards',
        easing: 'cubic-bezier(0, 0, 0.2, 1)',
      })
      animations.push(anim)

      // Content reveal fires immediately after block settles (offset 1.00 = end of duration)
      const settleMs = delay + duration
      Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]')).forEach((child, ci) => {
        animations.push(
          child.animate(CONTENT_FRAMES, {
            duration: 380,
            delay: settleMs + ci * 80,
            fill: 'backwards',
            easing: 'ease-out',
          }),
        )
      })
    }

    return () => {
      animations.forEach((a) => { if (a.playState !== 'finished') a.cancel() })
    }
```

- [ ] **Step 6.3: Run the tests to confirm they pass**

```bash
npx vitest run src/components/TetrisGrid/__tests__/line-clear-return.test.ts --reporter=verbose
```

Expected: all tests PASS.

- [ ] **Step 6.4: Run the full test suite to confirm nothing regressed**

```bash
npx vitest run --reporter=verbose
```

Expected: all tests across all three test files PASS.

- [ ] **Step 6.5: Commit**

```bash
git add src/components/TetrisGrid/useLineClear.ts src/components/TetrisGrid/__tests__/line-clear-return.test.ts
git commit -m "$(cat <<'EOF'
feat: add stagger, squash, and content reveal to return fly-in animation

brand→hero stagger (0–420ms), squash on arrival (scaleX 1.06/1.10),
bounce, and [data-reveal] content burst — same choreography as the entry
drop so the return feels like the opening sequence played in reverse.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Visual verification

- [ ] **Step 7.1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 7.2: Open the site and clear session state**

Navigate to `http://localhost:5173`. Open DevTools → Application → Session Storage → clear all keys so the `introPlayed` guard doesn't block the animation.

- [ ] **Step 7.3: Verify entry sequence**

Hard-reload the page. Confirm in order:
1. Brand, about, services, work, process, contact all drop first (left-to-right stagger visible)
2. Hero crashes in last with a noticeably heavier fall
3. Each block squashes on landing (wider/shorter for one frame)
4. Text content fades in after each block settles (title → subtitle → CTA visible stagger)

- [ ] **Step 7.4: Verify return sequence**

Click any block (e.g., About). Watch the line-clear fly-out. Then click the home-grid button (top-left). Confirm:
1. Blocks fly in from scattered positions with stagger (not all simultaneously)
2. Each block squashes on arrival
3. Content reveals after settling

- [ ] **Step 7.5: Verify reduced-motion**

In DevTools → Rendering → Enable "Emulate CSS media feature prefers-reduced-motion". Hard-reload. Confirm no animation plays and grid is immediately fully visible.

---

## Timing Reference

| Sequence | First reveal | Last reveal (hero CTA) |
|---|---|---|
| Entry | ~780 ms (brand title) | ~1.6 s |
| Return | ~480 ms (brand title) | ~1.1 s |
