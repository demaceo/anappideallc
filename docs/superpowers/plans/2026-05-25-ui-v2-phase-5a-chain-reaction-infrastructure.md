# UI v2.0 — Phase 5a: Chain Reaction Infrastructure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the React/state/CSS plumbing for the Rube Goldberg chain-reaction system *without* shipping any actual gadgets yet. Click any non-Brand block → a "skeleton" chain sequence runs (a placeholder 1.2s timed delay during which the thread highlights the relevant segments, the clicked block stays focused, and navigation is deferred) → navigation completes. Validates the entire control flow end-to-end so Phase 5b can drop visual gadgets into the existing scaffold.

**Architecture:** New `ChainProvider` context exposes `{ activeBlock, isPlaying, startChain(blockId, to), cancelChain() }`. The `Block.tsx` click handler, when not in materials-trigger mode, calls `startChain()` instead of immediately calling `onNavigate`. A `useChainPlayback` hook orchestrates: lock the click target, run the configured sequence (initially a single placeholder `wait` step), and on completion fire the deferred `navigate(to)`. `ThreadLine` reads `activeBlock` from `useChain()` and applies a `.segmentChainActive` class to the segment connecting `activeBlock` to the next block in `THREAD_ORDER`. Escape key cancels mid-flight; `prefers-reduced-motion: reduce` skips the sequence entirely and goes straight to navigation.

**Tech Stack:** Existing — React 19, React Router 7, Motion, CSS Modules, Vitest, happy-dom. **No new runtime dependencies in 5a.** Rapier2D is deferred to Phase 5b (when the first physics-driven gadget lands). The skeleton sequence uses `setTimeout` for the timed delay so 5a can ship and be reviewed without any physics commitment.

**Spec reference:** `docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md` §7.2 (per-block chain reaction), §7.3 (implementation specifics), §7.4 (reduced-motion path), §8 (thread chain-active state).

---

## File Structure

| File | Type | Responsibility |
|---|---|---|
| `src/lib/chain-context.ts` | Create | Context type + `ChainSequence` type + `BLOCK_SEQUENCES` placeholder map; `ChainContextValue` interface |
| `src/lib/chain.tsx` | Create | `ChainProvider` component with state (`activeBlock`, `isPlaying`) + `startChain`/`cancelChain` mutators + Escape handler + `useChain` hook |
| `src/lib/__tests__/chain.test.tsx` | Create | Provider tests: default state, startChain transitions, cancelChain resets, Escape cancels, reduced-motion skip, onComplete navigation |
| `src/App.tsx` | Modify | Wrap tree with `<ChainProvider>` (inside MaterialProvider, outside AppShell) |
| `src/components/TetrisGrid/Block.tsx` | Modify | When clicked AND not materials-trigger AND not modifier-pressed: call `useChain().startChain(id, to)` instead of immediately calling `onNavigate`. Pass an `onComplete` callback that fires `onNavigate(id, to)`. |
| `src/components/TetrisGrid/__tests__/block.test.tsx` | Modify | Add tests for the new click-through-chain flow (vs. direct navigation) |
| `src/components/TetrisGrid/ThreadLine.tsx` | Modify | Read `activeBlock` from `useChain()`; apply `.segmentChainActive` class to the segment whose `from` matches `activeBlock` |
| `src/components/TetrisGrid/ThreadLine.module.css` | Modify | Add `.segmentChainActive` class — full opacity (1.0) + slightly thicker stroke (2px) + brighter color OR halo |
| `src/components/TetrisGrid/__tests__/ThreadLine.test.tsx` | Modify | Add test: when chain is active for hero, the segment with `data-from="hero"` carries the segmentChainActive class |
| `docs/ux-critique.md` | Modify | Append Phase 5a status |

**Notes on TDD pattern.** Same as prior phases — pure logic via direct unit tests, hooks via `renderHook`, components via @testing-library/react with mocked navigation. The placeholder chain sequence using `setTimeout` is tested by faking timers (`vi.useFakeTimers()`).

---

## Task 1 · Create `chain-context.ts` (types + sequence definitions)

**Files:**
- Create: `src/lib/chain-context.ts`
- Create: `src/lib/__tests__/chain-context.test.ts`

The context value shape, the `ChainSequence` type (a discriminated union for future gadget step types — for 5a, just `{ kind: 'wait', durationMs: number }`), and a placeholder `BLOCK_SEQUENCES` map that gives each block a 1200ms wait step.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/__tests__/chain-context.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { BLOCK_SEQUENCES, DEFAULT_CHAIN_DURATION_MS } from '../chain-context'
import type { BlockId } from '../../components/TetrisGrid/Block'

describe('chain-context', () => {
  it('exports a DEFAULT_CHAIN_DURATION_MS constant of 1200ms', () => {
    expect(DEFAULT_CHAIN_DURATION_MS).toBe(1200)
  })

  it('defines a sequence for each navigable block (excluding brand)', () => {
    const expected: BlockId[] = ['hero', 'about', 'work', 'services', 'process', 'contact']
    for (const id of expected) {
      const seq = BLOCK_SEQUENCES[id]
      expect(seq, `missing sequence for ${id}`).toBeTruthy()
      expect(seq!.length).toBeGreaterThan(0)
    }
  })

  it('Phase 5a placeholder sequences are single wait steps of DEFAULT_CHAIN_DURATION_MS', () => {
    for (const id of ['hero', 'about', 'work', 'services', 'process', 'contact'] as BlockId[]) {
      const seq = BLOCK_SEQUENCES[id]!
      expect(seq).toHaveLength(1)
      expect(seq[0]).toEqual({ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS })
    }
  })

  it('does not define a sequence for brand (it opens the Materials Panel instead)', () => {
    expect(BLOCK_SEQUENCES.brand).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/lib/__tests__/chain-context.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create the context module**

Create `src/lib/chain-context.ts`:

```typescript
import { createContext } from 'react'
import type { BlockId } from '../components/TetrisGrid/Block'

/** Phase 5a placeholder duration. Phase 5b's physics-driven sequences
 *  override this with their own per-step timing. */
export const DEFAULT_CHAIN_DURATION_MS = 1200

/**
 * Discriminated union for chain sequence steps. Phase 5a ships only
 * `wait` — a timed delay used as a placeholder while the infrastructure
 * is exercised end-to-end. Phase 5b adds `gadget` variants for the
 * actual physics-driven steps (marble, lever, domino, pendulum, etc.).
 */
export type ChainStep =
  | { kind: 'wait'; durationMs: number }
  // Future Phase 5b additions go here, e.g.:
  // | { kind: 'gadget'; gadget: 'marble' | 'lever' | …; config: GadgetConfig }

export type ChainSequence = readonly ChainStep[]

/**
 * Per-block chain sequences. Brand is intentionally absent — its click
 * is intercepted by the Materials Panel trigger in Phase 3, not the
 * chain reaction system.
 */
export const BLOCK_SEQUENCES: Partial<Record<BlockId, ChainSequence>> = {
  hero:     [{ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS }],
  about:    [{ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS }],
  work:     [{ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS }],
  services: [{ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS }],
  process:  [{ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS }],
  contact:  [{ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS }],
}

export interface ChainContextValue {
  /** The block whose chain is currently playing, or null at rest. */
  activeBlock: BlockId | null
  /** True while a chain sequence is mid-flight. */
  isPlaying: boolean
  /**
   * Start the chain reaction for `blockId`. The provider plays the
   * sequence and, on completion, invokes `onComplete()` (typically a
   * `navigate(to)` from the calling Block). If a chain is already
   * playing, this is a no-op (chain reactions don't queue).
   *
   * Respects `prefers-reduced-motion: reduce`: when set, the sequence
   * is skipped entirely and `onComplete` is called synchronously.
   */
  startChain: (blockId: BlockId, onComplete: () => void) => void
  /** Cancel the in-flight chain. Calls neither onComplete nor navigation. */
  cancelChain: () => void
}

export const ChainContext = createContext<ChainContextValue | null>(null)
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/lib/__tests__/chain-context.test.ts`
Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/chain-context.ts src/lib/__tests__/chain-context.test.ts
git commit -m "feat(chain): add chain-context types + BLOCK_SEQUENCES placeholder"
```

---

## Task 2 · Create `ChainProvider` + `useChain` hook

**Files:**
- Create: `src/lib/chain.tsx`
- Create: `src/lib/__tests__/chain.test.tsx`

The provider owns chain state. `startChain(blockId, onComplete)` looks up the sequence, walks through each step (currently only `wait`), and calls `onComplete()` when finished. Cancellation works via either `cancelChain()` (programmatic), Escape key (DOM listener), or unmount. `prefers-reduced-motion: reduce` skips the playback entirely.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/__tests__/chain.test.tsx`:

```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ChainProvider, useChain } from '../chain'
import type { ReactNode } from 'react'

const wrapper = ({ children }: { children: ReactNode }) => (
  <ChainProvider>{children}</ChainProvider>
)

describe('useChain', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('defaults to activeBlock null + isPlaying false', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    expect(result.current.activeBlock).toBeNull()
    expect(result.current.isPlaying).toBe(false)
  })

  it('startChain sets activeBlock and isPlaying, then clears + fires onComplete', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    const onComplete = vi.fn()

    act(() => {
      result.current.startChain('hero', onComplete)
    })

    expect(result.current.activeBlock).toBe('hero')
    expect(result.current.isPlaying).toBe(true)
    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    expect(result.current.activeBlock).toBeNull()
    expect(result.current.isPlaying).toBe(false)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('cancelChain clears state without firing onComplete', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    const onComplete = vi.fn()

    act(() => {
      result.current.startChain('work', onComplete)
    })
    expect(result.current.isPlaying).toBe(true)

    act(() => {
      result.current.cancelChain()
    })

    expect(result.current.activeBlock).toBeNull()
    expect(result.current.isPlaying).toBe(false)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('Escape key cancels the in-flight chain', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    const onComplete = vi.fn()

    act(() => {
      result.current.startChain('services', onComplete)
    })
    expect(result.current.isPlaying).toBe(true)

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })

    expect(result.current.isPlaying).toBe(false)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('a second startChain while playing is a no-op (chains do not queue)', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    const firstComplete = vi.fn()
    const secondComplete = vi.fn()

    act(() => {
      result.current.startChain('hero', firstComplete)
    })
    expect(result.current.activeBlock).toBe('hero')

    act(() => {
      result.current.startChain('work', secondComplete)
    })

    // Active block remains hero — second call was ignored
    expect(result.current.activeBlock).toBe('hero')

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    expect(firstComplete).toHaveBeenCalledTimes(1)
    expect(secondComplete).not.toHaveBeenCalled()
  })

  it('blocks with no sequence (e.g., brand) call onComplete immediately', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    const onComplete = vi.fn()

    act(() => {
      result.current.startChain('brand', onComplete)
    })

    // brand has no sequence → onComplete fires synchronously, no animation
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(result.current.isPlaying).toBe(false)
  })

  it('respects prefers-reduced-motion: reduce by skipping the sequence', () => {
    // Mock matchMedia to return reduced-motion
    const originalMatchMedia = window.matchMedia
    ;(window as Window & typeof globalThis).matchMedia = vi.fn((q: string) => ({
      matches: q.includes('reduce'),
      media: q,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useChain(), { wrapper })
    const onComplete = vi.fn()

    act(() => {
      result.current.startChain('hero', onComplete)
    })

    // Reduced-motion → onComplete fires synchronously
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(result.current.isPlaying).toBe(false)

    ;(window as Window & typeof globalThis).matchMedia = originalMatchMedia
  })

  it('throws helpfully when useChain is called outside a provider', () => {
    expect(() => renderHook(() => useChain())).toThrow(/ChainProvider/)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/lib/__tests__/chain.test.tsx`
Expected: FAIL — `chain` module doesn't exist.

- [ ] **Step 3: Create the provider**

Create `src/lib/chain.tsx`:

```typescript
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  BLOCK_SEQUENCES,
  ChainContext,
  type ChainSequence,
  type ChainStep,
} from './chain-context'
import type { BlockId } from '../components/TetrisGrid/Block'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Plays a single ChainStep, returning a promise that resolves when the
 * step is done. Phase 5a only handles 'wait'; Phase 5b will add gadget
 * step types here.
 */
function playStep(step: ChainStep, signal: AbortSignal): Promise<void> {
  if (step.kind === 'wait') {
    return new Promise((resolve, reject) => {
      const id = setTimeout(() => resolve(), step.durationMs)
      signal.addEventListener('abort', () => {
        clearTimeout(id)
        reject(new DOMException('Chain cancelled', 'AbortError'))
      })
    })
  }
  // Exhaustive: TypeScript catches unhandled kinds at compile time
  const _exhaustive: never = step.kind
  return Promise.resolve(_exhaustive)
}

async function playSequence(
  sequence: ChainSequence,
  signal: AbortSignal,
): Promise<void> {
  for (const step of sequence) {
    await playStep(step, signal)
  }
}

export interface ChainProviderProps {
  children: ReactNode
}

/**
 * Provides the Rube Goldberg chain reaction state to descendants.
 * Blocks call `startChain(id, onComplete)` to launch their sequence
 * and defer navigation. The provider plays the configured sequence
 * (placeholder wait in Phase 5a; real gadgets in Phase 5b) then
 * invokes the onComplete callback. Escape key cancels in-flight
 * chains; prefers-reduced-motion skips them entirely.
 */
export function ChainProvider({ children }: ChainProviderProps) {
  const [activeBlock, setActiveBlock] = useState<BlockId | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // AbortController for the in-flight sequence. Cancelling rejects the
  // playSequence promise (without firing onComplete) and clears state.
  const controllerRef = useRef<AbortController | null>(null)

  const clearState = useCallback(() => {
    setActiveBlock(null)
    setIsPlaying(false)
    controllerRef.current = null
  }, [])

  const cancelChain = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort()
    }
    clearState()
  }, [clearState])

  const startChain = useCallback(
    (blockId: BlockId, onComplete: () => void) => {
      // No queuing — second start while playing is a no-op
      if (controllerRef.current) return

      const sequence = BLOCK_SEQUENCES[blockId]

      // No sequence defined OR reduced-motion → synchronous completion
      if (!sequence || sequence.length === 0 || prefersReducedMotion()) {
        onComplete()
        return
      }

      const controller = new AbortController()
      controllerRef.current = controller
      setActiveBlock(blockId)
      setIsPlaying(true)

      playSequence(sequence, controller.signal)
        .then(() => {
          // Only fire onComplete if not aborted in the meantime
          if (!controller.signal.aborted) {
            clearState()
            onComplete()
          }
        })
        .catch((err) => {
          // AbortError is expected when cancelled
          if (err?.name !== 'AbortError') {
            console.error('[chain] sequence failed', err)
          }
        })
    },
    [clearState],
  )

  // Escape key cancels in-flight chain
  useEffect(() => {
    if (!isPlaying) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelChain()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isPlaying, cancelChain])

  // Cancel on unmount to prevent setState-after-unmount
  useEffect(() => {
    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  const value = useMemo(
    () => ({ activeBlock, isPlaying, startChain, cancelChain }),
    [activeBlock, isPlaying, startChain, cancelChain],
  )

  return <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
}

export function useChain() {
  const ctx = useContext(ChainContext)
  if (!ctx) {
    throw new Error('useChain must be used inside <ChainProvider>')
  }
  return ctx
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/lib/__tests__/chain.test.tsx`
Expected: PASS — 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/chain.tsx src/lib/__tests__/chain.test.tsx
git commit -m "feat(chain): add ChainProvider + useChain hook with abort + reduced-motion"
```

---

## Task 3 · Wrap App with `ChainProvider`

**Files:**
- Modify: `src/App.tsx`
- Create: `src/__tests__/App-chain.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/App-chain.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { useContext } from 'react'
import App from '../App'
import { ChainContext } from '../lib/chain-context'

function ChainProbe() {
  const ctx = useContext(ChainContext)
  return <div data-testid="probe">{ctx ? 'has-provider' : 'no-provider'}</div>
}

describe('App ChainProvider integration', () => {
  it('wraps the route tree so child routes can read ChainContext', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          Component: App,
          children: [{ index: true, Component: ChainProbe }],
        },
      ],
      { initialEntries: ['/'] },
    )
    const { getByTestId } = render(<RouterProvider router={router} />)
    expect(getByTestId('probe')).toHaveTextContent('has-provider')
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/__tests__/App-chain.test.tsx`
Expected: FAIL — context is null (no provider in tree).

- [ ] **Step 3: Update `src/App.tsx`**

Open `src/App.tsx`. Add the import:

```typescript
import { ChainProvider } from './lib/chain'
```

Wrap `<AppShell />` with `<ChainProvider>` inside `<MaterialProvider>`. The full updated default export:

```typescript
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <MaterialProvider>
          <ChainProvider>
            <AppShell />
          </ChainProvider>
        </MaterialProvider>
      </ThemeProvider>
    </MotionConfig>
  )
}
```

(ChainProvider is inside MaterialProvider so Block.tsx can read both contexts. ChainProvider is outside AppShell so all routes have access.)

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test`
Expected: 239 + 12 (Task 1: 4 + Task 2: 8 + Task 3: 1) = ~252 tests passing.

Wait — Task 3 adds 1 test, not more. 239 + 4 + 8 + 1 = 252.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/__tests__/App-chain.test.tsx
git commit -m "feat(app): wrap tree with ChainProvider"
```

---

## Task 4 · Update `Block.tsx` to defer navigation through `useChain`

**Files:**
- Modify: `src/components/TetrisGrid/Block.tsx`
- Modify: `src/components/TetrisGrid/__tests__/block.test.tsx`

When a block is clicked AND it's not the materials trigger AND no modifier keys are pressed, instead of calling `onNavigate(id, to)` directly, call `useChain().startChain(id, () => onNavigate?.(id, to))`. This defers navigation until the chain sequence completes.

- [ ] **Step 1: Write the failing tests**

Append to `block.test.tsx`:

```typescript
import { ChainProvider } from '../../../lib/chain'

describe('Block chain integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.documentElement.dataset.theme = 'modern-vibrant'
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('defers navigation until the chain completes for non-Brand blocks', () => {
    const onNavigate = vi.fn()
    render(
      <MemoryRouter>
        <ThemeProvider>
          <MaterialProvider>
            <ChainProvider>
              <Block id="work" to="/work" title="Work" onNavigate={onNavigate} />
            </ChainProvider>
          </MaterialProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )

    const block = document.querySelector('[data-block-id="work"]') as HTMLElement
    act(() => {
      block.click()
    })

    // Click captured by chain — navigation not yet fired
    expect(onNavigate).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    // After the sequence, navigation fires
    expect(onNavigate).toHaveBeenCalledWith('work', '/work')
  })

  it('Brand block on modern-vibrant still opens panel (not chain)', () => {
    const onNavigate = vi.fn()
    render(
      <MemoryRouter>
        <ThemeProvider>
          <MaterialProvider>
            <ChainProvider>
              <Block id="brand" to="/about" title="AAI" onNavigate={onNavigate} />
            </ChainProvider>
          </MaterialProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )

    const block = document.querySelector('[data-block-id="brand"]') as HTMLElement
    act(() => {
      block.click()
    })

    // Brand path: panel opens, navigation never fires
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('modifier-click navigates directly (skip chain) for new-tab behavior', () => {
    const onNavigate = vi.fn()
    render(
      <MemoryRouter>
        <ThemeProvider>
          <MaterialProvider>
            <ChainProvider>
              <Block id="services" to="/services" title="Services" onNavigate={onNavigate} />
            </ChainProvider>
          </MaterialProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )

    const block = document.querySelector('[data-block-id="services"]') as HTMLElement
    act(() => {
      block.dispatchEvent(new MouseEvent('click', { metaKey: true, bubbles: true, cancelable: true }))
    })

    // Modifier-click bypasses chain (browser default tab behavior preserved)
    // No timer advance needed — the chain code returns early
    // onNavigate is also not called because the early return is BEFORE both
    // onNavigate and chain start. This matches v1 behavior.
    expect(onNavigate).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/block.test.tsx`
Expected: FAIL — Block currently calls onNavigate synchronously.

- [ ] **Step 3: Update `Block.tsx`**

Open `src/components/TetrisGrid/Block.tsx`. Add the import:

```typescript
import { useChain } from '../../lib/chain'
```

Inside the Block function body (after the existing `useTheme` and `useMaterial` lines), add:

```typescript
const { startChain } = useChain()
```

Update the `onClick` handler. The full updated handler should be:

```typescript
onClick={(e) => {
  if (isMaterialsTrigger) {
    e.preventDefault()
    openPanel()
    return
  }
  // Modifier-key clicks preserve the browser's native nav (open in new tab etc.)
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  // Same-tab navigation: defer through chain reaction, then call onNavigate
  e.preventDefault()
  if (!onNavigate) return
  startChain(id, () => onNavigate(id, to))
}}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/block.test.tsx`
Expected: PASS — new + existing tests pass.

(There may be pre-existing tests that need updating if they previously assumed synchronous navigation. If `pnpm test` shows other failures, examine each — likely the renderBlock helper needs ChainProvider wrapping too. Adjust the helper to include ChainProvider in the wrapper chain.)

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.tsx src/components/TetrisGrid/__tests__/block.test.tsx
git commit -m "feat(block): defer navigation through chain reaction"
```

---

## Task 5 · Update test helpers for ChainProvider

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`
- Modify: `src/pages/__tests__/Home.test.tsx`

The renderTetrisGrid + renderHome helpers (which already wrap with ThemeProvider + MaterialProvider) need ChainProvider too — otherwise any Block rendered through them will crash on `useChain()`.

- [ ] **Step 1: Run full suite to find collateral failures**

Run: `pnpm test`
Expected: any tests that render Block without ChainProvider will now fail with `useChain must be used inside <ChainProvider>`.

- [ ] **Step 2: Update `renderTetrisGrid` in tetris-grid.test.tsx**

Add the import: `import { ChainProvider } from '../../../lib/chain'`.
Find the existing render helper. Add `<ChainProvider>` to the wrapper chain (innermost or one layer above the component-under-test, matching the App.tsx provider order).

- [ ] **Step 3: Update `renderHome` in Home.test.tsx**

Add the import: `import { ChainProvider } from '../../lib/chain'`.
Add `<ChainProvider>` wrapping in the helper.

- [ ] **Step 4: Run full suite**

Run: `pnpm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/__tests__/tetris-grid.test.tsx src/pages/__tests__/Home.test.tsx
git commit -m "test(chain): wrap render helpers with ChainProvider"
```

---

## Task 6 · Add `.segmentChainActive` CSS class to ThreadLine

**Files:**
- Modify: `src/components/TetrisGrid/ThreadLine.module.css`
- Modify: `src/components/TetrisGrid/__tests__/thread-line-css.test.ts`

The chain-active segment(s) need a distinctive treatment — fully opaque, slightly thicker, and a brighter gold so they read as "the active connection" during a chain reaction.

- [ ] **Step 1: Write the failing tests**

Append to `thread-line-css.test.ts`:

```typescript
  it('.segmentChainActive class is defined with full opacity', () => {
    expect(CSS).toMatch(/\.segmentChainActive\s*\{[^}]*stroke-opacity:\s*1/)
  })

  it('.segmentChainActive has thicker stroke', () => {
    expect(CSS).toMatch(/\.segmentChainActive\s*\{[^}]*stroke-width:\s*2/)
  })

  it('.segmentChainActive pauses the shimmer animation', () => {
    expect(CSS).toMatch(/\.segmentChainActive\s*\{[^}]*animation-play-state:\s*paused/)
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/thread-line-css.test.ts`
Expected: FAIL — class doesn't exist yet.

- [ ] **Step 3: Add the class to ThreadLine.module.css**

Append to `ThreadLine.module.css` (after the existing `.segmentBright` rule):

```css
/* Chain-active highlight — the segment(s) participating in the current
   Rube Goldberg chain reaction. Fully opaque, slightly thicker, and the
   shimmer is paused so the bright state holds while the gadgets fire.
   Higher specificity than .segmentBright so the chain treatment wins
   when both could apply (cursor happens to be near an active block). */
.segmentChainActive {
  stroke-opacity: 1;
  stroke-width: 2;
  animation-play-state: paused;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/thread-line-css.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/ThreadLine.module.css src/components/TetrisGrid/__tests__/thread-line-css.test.ts
git commit -m "feat(thread): add segmentChainActive CSS class"
```

---

## Task 7 · Wire ThreadLine to chain state

**Files:**
- Modify: `src/components/TetrisGrid/ThreadLine.tsx`
- Modify: `src/components/TetrisGrid/__tests__/ThreadLine.test.tsx`

ThreadLine reads `activeBlock` from `useChain()`. When non-null, the segment whose `from` matches `activeBlock` gets the `.segmentChainActive` class. (Phase 5b will refine this — for now we highlight just the outgoing segment.)

- [ ] **Step 1: Write the failing test**

Append to `ThreadLine.test.tsx`:

```typescript
import { ChainProvider } from '../../../lib/chain'

// Helper: render ThreadLine with a startChain trigger button
function ThreadWithStarter({ containerRef, blockRefs, startId }: {
  containerRef: RefObject<HTMLDivElement | null>
  blockRefs: BlockRefEntry[]
  startId: BlockId
}) {
  const { startChain } = useChain()
  return (
    <>
      <button data-testid="start" onClick={() => startChain(startId, () => {})}>start</button>
      <ThreadLine containerRef={containerRef} blockRefs={blockRefs} />
    </>
  )
}

describe('ThreadLine chain integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('applies segmentChainActive to the segment matching activeBlock', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ThreadWithStarter containerRef={containerRef} blockRefs={blockRefs} startId="hero" />
      </ChainProvider>,
    )

    act(() => {
      getByTestId('start').click()
    })

    const heroOutgoing = container.querySelector('path[data-from="hero"]')
    expect(heroOutgoing?.getAttribute('class')).toMatch(/segmentChainActive/)
  })
})
```

(You'll need to add `useChain` to the test imports + `BlockRefEntry`/`BlockId` types if not already imported.)

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/ThreadLine.test.tsx`
Expected: FAIL — the class isn't applied yet.

- [ ] **Step 3: Update ThreadLine.tsx**

Open `src/components/TetrisGrid/ThreadLine.tsx`. Add the import:

```typescript
import { useChain } from '../../lib/chain'
```

Inside the ThreadLine function body, after the snapshot/state hooks, read:

```typescript
const { activeBlock } = useChain()
```

Update the `segments.map` callback to compose three possible class names (base, near-cursor, chain-active):

```typescript
{segments.map((seg) => {
  const adjacent = nearBlock !== null && (seg.from === nearBlock || seg.to === nearBlock)
  const chainActive = activeBlock !== null && seg.from === activeBlock
  const className = [
    styles.segment,
    adjacent && styles.segmentBright,
    chainActive && styles.segmentChainActive,
  ].filter(Boolean).join(' ')
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
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/ThreadLine.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/ThreadLine.tsx src/components/TetrisGrid/__tests__/ThreadLine.test.tsx
git commit -m "feat(thread): highlight active segment during chain reaction"
```

---

## Task 8 · Verify tests + production build (controller)

**Files:** No code changes — verification only.

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: 239 (Phase 4 baseline) + Phase 5a additions = ~258 tests passing.

Breakdown (approximate):
- chain-context: 4
- chain: 8
- App-chain: 1
- block chain integration: 3
- thread-line-css: 3
- ThreadLine chain: 1
Total: 20 new tests → expected ~259.

- [ ] **Step 2: TypeScript check**

Run: `pnpm exec tsc --noEmit -p tsconfig.app.json`
Expected: no output (clean).

- [ ] **Step 3: Production build**

Run: `pnpm build`
Expected: clean build; all 6 routes prerendered.

- [ ] **Step 4: Inspect bundle for Phase 5a patterns**

```bash
grep -c "segmentChainActive" dist/assets/*.css
grep -o "ChainProvider\|useChain" dist/assets/*.js | sort -u | head -5
```

Expected: at least 1 match for `segmentChainActive` and the Chain symbols in the JS bundle.

- [ ] **Step 5: No commit (verification only)**

Continue to Task 9.

---

## Task 9 · Manual visual verification

**Files:** No code changes — manual smoke test.

Run `pnpm dev`. The home grid should behave like this:

- [ ] **Step 1: Click a non-Brand block (e.g., About) on modern-vibrant**

- [ ] The click visibly delays navigation — there's a ~1.2s pause before the route changes
- [ ] During the pause, the thread segment **from About** (about → work) is fully opaque and slightly thicker than the ambient shimmer
- [ ] After ~1.2s, navigation completes (you land on /about)

- [ ] **Step 2: Press Escape mid-flight**

- [ ] Click About again to start the chain
- [ ] Before 1.2s elapses, press Escape
- [ ] The thread snaps back to ambient (no longer highlighted)
- [ ] Navigation does NOT fire (you stay on home)

- [ ] **Step 3: Reduced-motion skips the chain**

- [ ] DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`
- [ ] Click a block — navigation fires INSTANTLY (no 1.2s delay, no thread highlight)
- [ ] This matches the v1 behavior so reduced-motion users don't experience the chain

- [ ] **Step 4: Modifier-click bypasses chain**

- [ ] Cmd+click a block (Ctrl+click on Linux/Windows)
- [ ] Browser opens the route in a new tab (no chain delay)

- [ ] **Step 5: Brand block still opens Materials Panel**

- [ ] Click the Brand block
- [ ] Materials Panel opens (no chain reaction)
- [ ] Close the panel — no navigation occurred

- [ ] **Step 6: Stop dev server**

`Ctrl+C`.

---

## Task 10 · Update UX critique implementation status

**Files:**
- Modify: `docs/ux-critique.md`

- [ ] **Step 1: Append Phase 5a section**

Append after the existing Phase 4 entry:

```markdown

### Phase 5a — Chain Reaction Infrastructure (completed 2026-05-25)

Built the Rube Goldberg chain reaction control flow without shipping any actual gadgets yet. New `ChainProvider` context exposes `{ activeBlock, isPlaying, startChain(blockId, onComplete), cancelChain() }`. Block clicks (on non-Brand blocks, no modifier keys, on modern-vibrant) call `startChain` instead of navigating directly — the provider plays the configured sequence (placeholder 1.2s wait in 5a; real gadget sequences in 5b), then invokes `onComplete()` to trigger the deferred `navigate(to)`. Escape key cancels in-flight chains; `prefers-reduced-motion: reduce` skips the sequence entirely and navigates immediately. The `ThreadLine` reads `activeBlock` from `useChain()` and applies a `.segmentChainActive` class (full opacity, 2px stroke, paused shimmer) to the segment whose `from` matches the active block.

This phase validates the entire control flow end-to-end: click → state transition → thread highlight → timed sequence → navigation. Phase 5b drops actual physics-driven gadgets into the `playStep` switch (currently only handles `'wait'`).

See `docs/superpowers/plans/2026-05-25-ui-v2-phase-5a-chain-reaction-infrastructure.md` for the full implementation log.
```

- [ ] **Step 2: Commit**

```bash
git add docs/ux-critique.md
git commit -m "docs(critique): record Phase 5a chain reaction infrastructure"
```

---

## Definition of Done

Phase 5a is complete when ALL of the following are true:

- [ ] All 10 tasks above are checked off
- [ ] `pnpm test` passes (~259 tests, including 20 new for Phase 5a)
- [ ] `pnpm build` clean, all 6 routes prerendered
- [ ] Manual visual verification (Task 9) checklist 100% clean
- [ ] All commits clean, atomic, conventional-commit format
- [ ] Phase 5a commits stacked on top of Phase 4 on the existing branch (or fresh branch if PR #4 has merged by now)

---

## What is intentionally NOT in Phase 5a

- Actual physics-driven gadget sequences (marble, lever, domino, pendulum, pulley, spring) — those land in **Phase 5b**
- Rapier2D dependency — also Phase 5b
- Per-block visual sequence design — also Phase 5b
- Hero portal "camera push" through to aurora chamber — also Phase 5b
- Mobile-simplified chain variants — Phase 5d
- Reverse chain reaction on back-navigation — Phase 6 (when persistent nav lands)

If a task starts to drift toward any of the above, stop — you're outside Phase 5a's scope.

---

## Forward-Compat Notes for Phase 5b

- **playStep switch is the gadget injection point.** Phase 5b adds new `ChainStep` discriminated-union members (e.g., `{ kind: 'gadget'; gadget: 'marble'; config: { ... } }`) and matching cases in `playStep`. The exhaustive `_exhaustive: never` line at the end of `playStep` will catch any missed cases at compile time.

- **AbortSignal threading is already wired.** Each step receives the signal; Phase 5b's physics-driven steps must listen for `signal.aborted` to stop the Rapier world simulation early on cancel.

- **Sequence shape is ready for parallel + serial steps.** The current `ChainSequence = readonly ChainStep[]` runs steps in serial order. If Phase 5b needs parallel steps (e.g., "marble drop simultaneously with bell chime"), introduce a new step kind `{ kind: 'parallel'; steps: ChainStep[] }` and handle it in `playStep`.

- **`isPlaying` is global, not per-block.** Multiple chains can't run simultaneously (the second `startChain` is a no-op). Phase 5b assumes this.

- **Rapier2D dependency for 5b.** When you `pnpm add @dimforge/rapier2d-compat`, expect ~250KB WASM gzipped. Consider lazy-loading the import inside the first `gadget` step so the home page doesn't pay the cost until a chain fires.
