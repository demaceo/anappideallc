# UI v2.0 — Phase 2: Velvet Stage + Aurora Portal Hero — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wrap the home grid in a new `VelvetStage` environment, install an `AuroraChamber` environment on `/contact`, and put a glowing aurora window cutout inside the Hero block — all scoped to the `modern-vibrant` theme so other themes (`classic`, `pastel`, `arcade-neon`) remain visually unchanged.

**Architecture:** Three new component pairs (`VelvetStage`, `AuroraChamber`, `HeroPortalWindow`) live alongside existing components. Aurora composition tokens are added to the `[data-theme="modern-vibrant"]` block in `tokens.css`. The home and contact route components wrap their content with the new environment components directly — no App-level route inspection needed. Hero block accepts an optional `portal` ReactNode prop, which `TetrisGrid` passes `<HeroPortalWindow />` to only for the hero entry. Motion's enter animations drive a 600ms crossfade as each environment mounts.

**Tech Stack:** Existing — React 19, React Router 7, Motion, CSS Modules, Vitest, happy-dom. No new runtime dependencies in Phase 2 (R3F is deferred until Phases 4-5 that need pointer-tracked light).

**Spec reference:** `docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md` — §4.3 (Aurora Portal hero), §5.1 (Velvet Stage), §5.2 (Aurora Chamber), §17 (Phase 2 in build phasing).

---

## File Structure

| File | Type | Responsibility |
|---|---|---|
| `src/styles/tokens.css` | Modify | Add aurora composition tokens (`--aurora-cyan`, `--aurora-magenta`, `--aurora-gold`, `--aurora-stars`, `--aurora-deepspace`) inside the existing `[data-theme="modern-vibrant"]` standalone block |
| `src/components/VelvetStage/VelvetStage.tsx` | Create | Wraps children in a velvet-themed environment: floor + spot + vignette as absolute-positioned siblings to children; theme-scoped via CSS so other themes see a transparent passthrough |
| `src/components/VelvetStage/VelvetStage.module.css` | Create | `.stage` container, `.floor` (rotated woven fabric), `.spot` (warm overhead light), `.vignette` (inset shadow). All three decorative layers `display: none` when not on modern-vibrant |
| `src/components/VelvetStage/__tests__/VelvetStage.test.tsx` | Create | Render-and-query tests: children pass through, three aria-hidden decorative layers exist |
| `src/components/AuroraChamber/AuroraChamber.tsx` | Create | Wraps children in a cosmic aurora environment: cyan + magenta + gold radial gradients, stars, vignette; theme-scoped to modern-vibrant |
| `src/components/AuroraChamber/AuroraChamber.module.css` | Create | `.chamber` container, `.aurora-cyan`, `.aurora-magenta`, `.aurora-gold`, `.stars`, `.vignette` |
| `src/components/AuroraChamber/__tests__/AuroraChamber.test.tsx` | Create | Render-and-query tests: children pass through, aurora layers exist, theme scope |
| `src/components/TetrisGrid/HeroPortalWindow.tsx` | Create | Renders the aurora-window cutout inside the Hero block: inset 14px from block edges, border-radius 18px, overflow hidden, deep-space + cyan/magenta radials + stars |
| `src/components/TetrisGrid/HeroPortalWindow.module.css` | Create | `.portal` (positioned absolute inset 14px), `.aurora`, `.stars`. Hidden via `[data-theme]:not([data-theme="modern-vibrant"])` selector |
| `src/components/TetrisGrid/__tests__/HeroPortalWindow.test.tsx` | Create | Render test: aurora and stars layers exist with `aria-hidden` |
| `src/components/TetrisGrid/Block.tsx` | Modify | Add optional `portal?: ReactNode` prop to `BlockProps`; render it as a sibling of `.title` if present |
| `src/components/TetrisGrid/TetrisGrid.tsx` | Modify | When defining the BLOCKS array, pass `portal: <HeroPortalWindow />` to the hero block ONLY |
| `src/pages/Home.tsx` | Modify | Wrap `<TetrisGrid />` with `<VelvetStage>` |
| `src/pages/Contact.tsx` | Modify | Wrap the page content with `<AuroraChamber>` |
| `docs/ux-critique.md` | Modify | Append a Phase 2 implementation status line under v2.0 Implementation Status |

**TDD pattern.** Component renders are testable via `@testing-library/react` + happy-dom (already in project). CSS structure assertions use the same parse-based regex pattern from Phase 1 (read the `.module.css` file as a string). Manual visual verification of the actual gradients/animations remains a separate step at the end of the phase.

---

## Task 1 · Add aurora composition tokens to modern-vibrant

**Files:**
- Modify: `src/styles/tokens.css` (the standalone `[data-theme="modern-vibrant"]` block added in Phase 1, currently containing just the mat-* tokens)
- Create: `src/components/VelvetStage/__tests__/aurora-tokens.test.ts`

- [ ] **Step 1: Create the test file**

Create `src/components/VelvetStage/__tests__/aurora-tokens.test.ts` with:

```typescript
/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const TOKENS_CSS = fs.readFileSync(
  path.resolve(HERE, '../../../styles/tokens.css'),
  'utf8',
)

describe('Aurora composition tokens (modern-vibrant)', () => {
  it('defines --aurora-cyan with the spec rgba value', () => {
    expect(TOKENS_CSS).toMatch(/--aurora-cyan:\s*rgba\(80,\s*200,\s*255,\s*0\.35\)/)
  })
  it('defines --aurora-magenta with the spec rgba value', () => {
    expect(TOKENS_CSS).toMatch(/--aurora-magenta:\s*rgba\(217,\s*3,\s*104,\s*0\.5\)/)
  })
  it('defines --aurora-gold with the spec rgba value', () => {
    expect(TOKENS_CSS).toMatch(/--aurora-gold:\s*rgba\(255,\s*212,\s*0,\s*0\.32\)/)
  })
  it('defines --aurora-deepspace gradient', () => {
    expect(TOKENS_CSS).toMatch(/--aurora-deepspace:\s*linear-gradient\(180deg,\s*#03020a/)
  })
  it('aurora tokens live inside the modern-vibrant standalone block (not :root)', () => {
    // The modern-vibrant standalone block (added in Phase 1) starts with
    // [data-theme="modern-vibrant"] { and contains the mat tokens. Verify
    // aurora tokens are within that block too, not on :root.
    const standaloneBlock = TOKENS_CSS.match(
      /\[data-theme="modern-vibrant"\]\s*\{[^}]*--aurora-cyan/,
    )
    expect(standaloneBlock).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/VelvetStage/__tests__/aurora-tokens.test.ts`
Expected: FAIL — 5 assertions fail (no aurora tokens yet).

- [ ] **Step 3: Add aurora tokens to tokens.css**

Open `src/styles/tokens.css`. Find the existing `[data-theme="modern-vibrant"]` standalone block (added in Phase 1, contains the `--c-{section}-mat-*` tokens). Append the aurora tokens INSIDE that block, after the contact mat-bright declaration and before the closing brace:

```css
  /* Aurora composition — modern-vibrant only. Used by HeroPortalWindow
     (inside the Hero block) and AuroraChamber (full-viewport on /contact).
     Each layer is a separable radial gradient string so individual layers
     can be composed into different parent rules. */
  --aurora-cyan:    rgba(80, 200, 255, 0.35);
  --aurora-magenta: rgba(217, 3, 104, 0.5);
  --aurora-gold:    rgba(255, 212, 0, 0.32);
  --aurora-deepspace: linear-gradient(180deg, #03020a 0%, #0a0418 60%, #050310 100%);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/VelvetStage/__tests__/aurora-tokens.test.ts`
Expected: PASS — 5 assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/components/VelvetStage/__tests__/aurora-tokens.test.ts
git commit -m "feat(tokens): add aurora composition tokens to modern-vibrant"
```

---

## Task 2 · Create the `VelvetStage` CSS module

**Files:**
- Create: `src/components/VelvetStage/VelvetStage.module.css`
- Create: `src/components/VelvetStage/__tests__/velvet-stage-css.test.ts`

- [ ] **Step 1: Write the failing CSS-structure tests**

Create `src/components/VelvetStage/__tests__/velvet-stage-css.test.ts`:

```typescript
/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../VelvetStage.module.css'),
  'utf8',
)

describe('VelvetStage.module.css', () => {
  it('.stage is position: relative with perspective', () => {
    expect(CSS).toMatch(/\.stage\s*\{[^}]*position:\s*relative/)
    expect(CSS).toMatch(/\.stage\s*\{[^}]*perspective:\s*1400px/)
  })
  it('.floor is rotated 48deg with woven fabric texture', () => {
    expect(CSS).toMatch(/\.floor\s*\{[^}]*transform:\s*rotateX\(48deg\)/)
    expect(CSS).toMatch(/\.floor\s*\{[^}]*repeating-linear-gradient/)
  })
  it('.spot has a warm overhead radial gradient', () => {
    expect(CSS).toMatch(/\.spot\s*\{[^}]*radial-gradient/)
  })
  it('.vignette has inset box-shadow', () => {
    expect(CSS).toMatch(/\.vignette\s*\{[^}]*box-shadow:\s*inset/)
  })
  it('decorative layers are hidden on non-modern-vibrant themes', () => {
    expect(CSS).toMatch(/:not\(\[data-theme="modern-vibrant"\]\)/)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/VelvetStage/__tests__/velvet-stage-css.test.ts`
Expected: FAIL — file doesn't exist yet.

- [ ] **Step 3: Create the CSS module**

Create `src/components/VelvetStage/VelvetStage.module.css`:

```css
/* VelvetStage — the v2.0 environment for the home page on modern-vibrant.
   Three decorative layers (floor, spot, vignette) plus a perspective host
   for any 3D children. On non-modern-vibrant themes the decorative layers
   are display:none and the wrapper renders as a transparent passthrough. */

.stage {
  position: relative;
  min-height: 100dvh;
  width: 100%;
  perspective: 1400px;
  perspective-origin: 50% 35%;
  isolation: isolate;
}

/* Velvet floor — woven micro-pattern + warm burgundy radial gradient,
   rotated 48° to recede into the horizon. */
.floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background:
    repeating-linear-gradient(90deg, transparent 0 1px, rgba(255, 255, 255, 0.025) 1px 2px),
    repeating-linear-gradient(0deg, transparent 0 1px, rgba(0, 0, 0, 0.06) 1px 2px),
    radial-gradient(120% 70% at 50% 100%, rgba(80, 15, 40, 0.95), rgba(20, 5, 10, 0.95) 100%);
  transform-origin: top center;
  transform: rotateX(48deg);
  pointer-events: none;
  z-index: 0;
}

/* Warm overhead spotlight — centered, ~70% viewport height. */
.spot {
  position: absolute;
  top: 0;
  left: 25%;
  right: 25%;
  height: 70%;
  background: radial-gradient(50% 60% at 50% 0%, rgba(255, 255, 230, 0.18) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
}

/* Inset vignette — paints the corners darker for cinematic framing.
   Rendered on top of all children (z-index above the grid). */
.vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 140px rgba(0, 0, 0, 0.75);
  z-index: 10;
}

/* Theme scope — Velvet Stage is modern-vibrant exclusive. Other themes
   render the wrapper but with all decorative layers hidden, letting their
   existing v1 environments (cube atmospherics on .viewport in TetrisGrid)
   show through unchanged. */
:global(html:not([data-theme="modern-vibrant"])) .floor,
:global(html:not([data-theme="modern-vibrant"])) .spot,
:global(html:not([data-theme="modern-vibrant"])) .vignette {
  display: none;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/VelvetStage/__tests__/velvet-stage-css.test.ts`
Expected: PASS — all 5 structural assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/VelvetStage/VelvetStage.module.css src/components/VelvetStage/__tests__/velvet-stage-css.test.ts
git commit -m "feat(velvet-stage): add CSS module with floor, spot, vignette"
```

---

## Task 3 · Create the `VelvetStage` React component

**Files:**
- Create: `src/components/VelvetStage/VelvetStage.tsx`
- Create: `src/components/VelvetStage/__tests__/VelvetStage.test.tsx`

- [ ] **Step 1: Write the failing component test**

Create `src/components/VelvetStage/__tests__/VelvetStage.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { VelvetStage } from '../VelvetStage'

describe('VelvetStage', () => {
  it('renders children inside the stage wrapper', () => {
    const { getByText } = render(
      <VelvetStage>
        <div>grid content</div>
      </VelvetStage>,
    )
    expect(getByText('grid content')).toBeInTheDocument()
  })

  it('renders three aria-hidden decorative layers (floor, spot, vignette)', () => {
    const { container } = render(<VelvetStage>x</VelvetStage>)
    const decorations = container.querySelectorAll('[aria-hidden="true"]')
    expect(decorations.length).toBe(3)
  })

  it('decorative layers are siblings of the children, not wrappers', () => {
    const { container } = render(
      <VelvetStage>
        <div data-testid="child">x</div>
      </VelvetStage>,
    )
    const child = container.querySelector('[data-testid="child"]')
    const decorations = container.querySelectorAll('[aria-hidden="true"]')
    // Each decoration's parent === child's parent (the .stage wrapper)
    decorations.forEach((dec) => {
      expect(dec.parentElement).toBe(child?.parentElement)
    })
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/VelvetStage/__tests__/VelvetStage.test.tsx`
Expected: FAIL — `VelvetStage` not found (component doesn't exist yet).

- [ ] **Step 3: Create the component**

Create `src/components/VelvetStage/VelvetStage.tsx`:

```typescript
import type { ReactNode } from 'react'
import styles from './VelvetStage.module.css'

export interface VelvetStageProps {
  children: ReactNode
}

/**
 * VelvetStage — the v2.0 environmental wrapper for the home grid (and
 * later, Velvet Vitrine inner pages in Phase 6). Renders three decorative
 * layers (floor, spot, vignette) as absolutely-positioned siblings to the
 * provided children. On non-modern-vibrant themes, those layers are hidden
 * via CSS theme-scoping so other themes get their v1 environments instead.
 */
export function VelvetStage({ children }: VelvetStageProps) {
  return (
    <div className={styles.stage} data-env="velvet">
      <div className={styles.floor} aria-hidden="true" />
      <div className={styles.spot} aria-hidden="true" />
      {children}
      <div className={styles.vignette} aria-hidden="true" />
    </div>
  )
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/VelvetStage/__tests__/VelvetStage.test.tsx`
Expected: PASS — 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/VelvetStage/VelvetStage.tsx src/components/VelvetStage/__tests__/VelvetStage.test.tsx
git commit -m "feat(velvet-stage): add VelvetStage component"
```

---

## Task 4 · Create the `HeroPortalWindow` CSS module

**Files:**
- Create: `src/components/TetrisGrid/HeroPortalWindow.module.css`
- Create: `src/components/TetrisGrid/__tests__/hero-portal-window-css.test.ts`

- [ ] **Step 1: Write the failing CSS tests**

Create `src/components/TetrisGrid/__tests__/hero-portal-window-css.test.ts`:

```typescript
/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../HeroPortalWindow.module.css'),
  'utf8',
)

describe('HeroPortalWindow.module.css', () => {
  it('.portal is positioned absolute with inset 14px', () => {
    expect(CSS).toMatch(/\.portal\s*\{[^}]*position:\s*absolute/)
    expect(CSS).toMatch(/\.portal\s*\{[^}]*inset:\s*14px/)
  })
  it('.portal has border-radius 18px and overflow hidden', () => {
    expect(CSS).toMatch(/\.portal\s*\{[^}]*border-radius:\s*18px/)
    expect(CSS).toMatch(/\.portal\s*\{[^}]*overflow:\s*hidden/)
  })
  it('.portal uses the deep-space gradient', () => {
    expect(CSS).toMatch(/\.portal\s*\{[^}]*var\(--aurora-deepspace\)/)
  })
  it('.aurora layer renders cyan + magenta radial gradients', () => {
    expect(CSS).toMatch(/\.aurora\s*\{[^}]*var\(--aurora-cyan\)/)
    expect(CSS).toMatch(/\.aurora\s*\{[^}]*var\(--aurora-magenta\)/)
  })
  it('portal is hidden on non-modern-vibrant themes', () => {
    expect(CSS).toMatch(/:not\(\[data-theme="modern-vibrant"\]\)/)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/hero-portal-window-css.test.ts`
Expected: FAIL — file doesn't exist.

- [ ] **Step 3: Create the CSS module**

Create `src/components/TetrisGrid/HeroPortalWindow.module.css`:

```css
/* HeroPortalWindow — the aurora-chamber window cut into the Hero block.
   Positioned 14px inset from the Hero block's edges, with a deep-space
   backing and two soft aurora radial layers + a sparse star field.
   Hidden on non-modern-vibrant themes so other themes see the regular
   Hero block surface without the portal cutout. */

.portal {
  position: absolute;
  inset: 14px;
  border-radius: 18px;
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
  background: var(--aurora-deepspace, transparent);
  box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.18);
}

.aurora {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 60% at 30% 30%, var(--aurora-cyan, transparent), transparent 70%),
    radial-gradient(60% 60% at 80% 70%, var(--aurora-magenta, transparent), transparent 70%);
  pointer-events: none;
}

.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.9), transparent 60%),
    radial-gradient(1px 1px at 70% 40%, rgba(255, 255, 255, 0.7), transparent 60%),
    radial-gradient(0.5px 0.5px at 50% 70%, rgba(255, 255, 255, 0.6), transparent 60%),
    radial-gradient(0.5px 0.5px at 30% 60%, rgba(255, 255, 255, 0.5), transparent 60%),
    radial-gradient(1px 1px at 85% 20%, rgba(255, 255, 255, 0.7), transparent 60%);
}

/* Theme scope — portal renders only on modern-vibrant. Other themes get
   a normal Hero block with no portal cutout. */
:global(html:not([data-theme="modern-vibrant"])) .portal {
  display: none;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/hero-portal-window-css.test.ts`
Expected: PASS — 6 assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/HeroPortalWindow.module.css src/components/TetrisGrid/__tests__/hero-portal-window-css.test.ts
git commit -m "feat(hero-portal): add HeroPortalWindow CSS module"
```

---

## Task 5 · Create the `HeroPortalWindow` React component

**Files:**
- Create: `src/components/TetrisGrid/HeroPortalWindow.tsx`
- Create: `src/components/TetrisGrid/__tests__/HeroPortalWindow.test.tsx`

- [ ] **Step 1: Write the failing component test**

Create `src/components/TetrisGrid/__tests__/HeroPortalWindow.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeroPortalWindow } from '../HeroPortalWindow'

describe('HeroPortalWindow', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeroPortalWindow />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('the portal root has aria-hidden="true"', () => {
    const { container } = render(<HeroPortalWindow />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders two inner layers (aurora and stars)', () => {
    const { container } = render(<HeroPortalWindow />)
    const root = container.firstChild as HTMLElement
    expect(root.children.length).toBe(2)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/HeroPortalWindow.test.tsx`
Expected: FAIL — component not found.

- [ ] **Step 3: Create the component**

Create `src/components/TetrisGrid/HeroPortalWindow.tsx`:

```typescript
import styles from './HeroPortalWindow.module.css'

/**
 * HeroPortalWindow — the aurora cutout inside the Hero block. Mounted as
 * a sibling of the Hero block's title/subtitle/cta, positioned absolutely
 * inset from the block's edges. Renders only on modern-vibrant (other
 * themes hide it via CSS theme-scoping). Decorative — no interactive
 * content; the Hero block itself owns the click target.
 */
export function HeroPortalWindow() {
  return (
    <div className={styles.portal} aria-hidden="true">
      <div className={styles.aurora} />
      <div className={styles.stars} />
    </div>
  )
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/HeroPortalWindow.test.tsx`
Expected: PASS — 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/HeroPortalWindow.tsx src/components/TetrisGrid/__tests__/HeroPortalWindow.test.tsx
git commit -m "feat(hero-portal): add HeroPortalWindow component"
```

---

## Task 6 · Add `portal` slot to `Block.tsx`

**Files:**
- Modify: `src/components/TetrisGrid/Block.tsx`
- Modify: `src/components/TetrisGrid/__tests__/block.test.tsx`

- [ ] **Step 1: Write the failing test**

Append to the existing `describe('Block', ...)` block in `block.test.tsx`:

```typescript
  it('renders the portal slot before the title when provided', () => {
    const { container, getByText } = renderBlock({
      portal: <div data-testid="portal-content">portal here</div>,
      title: 'Hero',
    })
    const portal = container.querySelector('[data-testid="portal-content"]')
    const title = getByText('Hero')
    expect(portal).toBeInTheDocument()
    // Portal precedes title in DOM order
    if (portal && title.parentElement) {
      const children = Array.from(title.parentElement.children)
      expect(children.indexOf(portal)).toBeLessThan(children.indexOf(title))
    }
  })

  it('does not render any portal element when portal prop is absent', () => {
    const { container } = renderBlock()
    expect(container.querySelector('[data-testid="portal-content"]')).toBeNull()
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/block.test.tsx`
Expected: FAIL — `portal` prop not supported on `BlockProps`.

- [ ] **Step 3: Update Block.tsx**

Open `src/components/TetrisGrid/Block.tsx`. Add `portal?: ReactNode` to `BlockProps`, import `ReactNode`, and render `{portal}` immediately before `<span data-reveal="title">`. The full updated file:

```typescript
import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import styles from './Block.module.css'

function applyTilt(e: React.MouseEvent<HTMLAnchorElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
  e.currentTarget.style.setProperty('--hover-rx', `${(-relY * 12).toFixed(1)}deg`)
  e.currentTarget.style.setProperty('--hover-ry', `${(relX * 8).toFixed(1)}deg`)
}

function resetTilt(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.setProperty('--hover-rx', '0deg')
  e.currentTarget.style.setProperty('--hover-ry', '0deg')
}

export type BlockId =
  | 'hero'
  | 'brand'
  | 'about'
  | 'work'
  | 'services'
  | 'process'
  | 'contact'

export interface BlockProps {
  id: BlockId
  to: string
  title: string
  subtitle?: string
  cta?: string
  tags?: string[]
  ariaLabel?: string
  onNavigate?: (id: BlockId, to: string) => void
  /**
   * Optional decorative content rendered as a sibling element BEFORE the
   * block's title. Used by the Hero block to mount the aurora portal
   * window cutout. Should not contain interactive content.
   */
  portal?: ReactNode
}

const MotionLink = motion.create(Link)

export const Block = forwardRef<HTMLAnchorElement, BlockProps>(function Block(
  { id, to, title, subtitle, cta, tags, ariaLabel, onNavigate, portal },
  ref,
) {
  const className = `${styles.block} ${styles[`block-${id}`]}`

  return (
    <MotionLink
      ref={ref}
      to={to}
      layoutId={`block-${id}`}
      data-block-id={id}
      className={className}
      style={{ gridArea: id }}
      aria-label={ariaLabel ?? title}
      onMouseMove={applyTilt}
      onMouseLeave={resetTilt}
      onClick={(e) => {
        if (!onNavigate) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onNavigate(id, to)
      }}
    >
      {portal}
      <span data-reveal="title" className={styles.title}>{title}</span>
      {subtitle ? <span data-reveal="subtitle" className={styles.subtitle}>{subtitle}</span> : null}
      {tags && tags.length > 0
        ? (
          <span data-reveal="tags" className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </span>
        )
        : cta
          ? <span data-reveal="cta" className={styles.cta}>{cta} →</span>
          : null}
    </MotionLink>
  )
})
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/block.test.tsx`
Expected: PASS — all existing 8 tests + 2 new tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.tsx src/components/TetrisGrid/__tests__/block.test.tsx
git commit -m "feat(block): add optional portal slot for decorative content"
```

---

## Task 7 · Mount `HeroPortalWindow` inside the Hero block via `TetrisGrid`

**Files:**
- Modify: `src/components/TetrisGrid/TetrisGrid.tsx` (the BLOCKS array constructor)
- Modify: `src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`

- [ ] **Step 1: Write the failing test**

Append to the existing `tetris-grid.test.tsx` describe block:

```typescript
  it('mounts a HeroPortalWindow inside the hero block', () => {
    // The HeroPortalWindow root element has aria-hidden="true" and is the
    // first child of the hero block's <a> element. We assert that the
    // hero block specifically (data-block-id="hero") contains an
    // aria-hidden child element.
    const { container } = render(
      <MemoryRouter>
        <TetrisGrid />
      </MemoryRouter>,
    )
    const hero = container.querySelector('[data-block-id="hero"]') as HTMLElement | null
    expect(hero).toBeInTheDocument()
    expect(hero?.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('does NOT mount a HeroPortalWindow inside non-hero blocks', () => {
    const { container } = render(
      <MemoryRouter>
        <TetrisGrid />
      </MemoryRouter>,
    )
    const about = container.querySelector('[data-block-id="about"]') as HTMLElement | null
    expect(about).toBeInTheDocument()
    // about block has no aria-hidden descendant (no portal slot used)
    expect(about?.querySelector('[aria-hidden="true"]')).toBeNull()
  })
```

You may need to verify the existing test file imports `render` and `MemoryRouter`. If they aren't imported, add them at the top of the file.

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`
Expected: FAIL — the new tests fail because no HeroPortalWindow is wired up.

- [ ] **Step 3: Update TetrisGrid.tsx**

Open `src/components/TetrisGrid/TetrisGrid.tsx`. Add the import for `HeroPortalWindow` at the top:

```typescript
import { HeroPortalWindow } from './HeroPortalWindow'
```

Find the BLOCKS array constant. Locate the hero entry (the first object with `id: 'hero' as const`). Add a `portal` property to it:

```typescript
  {
    id: 'hero' as const,
    to: '/contact',
    title: SITE.tagline,
    subtitle:
      'I design the interface, build the backend, and ship the operational systems that make ambitious products credible.',
    cta: 'Tell me about it',
    portal: <HeroPortalWindow />,
  },
```

The other 6 entries in BLOCKS stay unchanged (no portal prop = no portal rendered, per Block.tsx's behavior).

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`
Expected: PASS — both new assertions pass; existing tests unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/TetrisGrid.tsx src/components/TetrisGrid/__tests__/tetris-grid.test.tsx
git commit -m "feat(tetris-grid): mount HeroPortalWindow inside the hero block"
```

---

## Task 8 · Wrap home page content with `VelvetStage`

**Files:**
- Modify: `src/pages/Home.tsx`
- Create: `src/pages/__tests__/Home.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/__tests__/Home.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import Home from '../Home'

describe('Home page', () => {
  it('wraps the grid content in a VelvetStage', () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    // VelvetStage has data-env="velvet"
    expect(container.querySelector('[data-env="velvet"]')).toBeInTheDocument()
  })

  it('renders the TetrisGrid inside the VelvetStage', () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    const stage = container.querySelector('[data-env="velvet"]')
    // The hero block is part of TetrisGrid; if it's a descendant of the
    // stage, the wrapping is correct.
    expect(stage?.querySelector('[data-block-id="hero"]')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/pages/__tests__/Home.test.tsx`
Expected: FAIL — no `[data-env="velvet"]` element (Home not yet wrapped).

- [ ] **Step 3: Update Home.tsx**

Open `src/pages/Home.tsx` and replace its content with:

```typescript
import { TetrisGrid } from '../components/TetrisGrid/TetrisGrid'
import { VelvetStage } from '../components/VelvetStage/VelvetStage'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

export default function Home() {
  return (
    <>
      <RouteHead {...META['/']} />
      <VelvetStage>
        <TetrisGrid />
      </VelvetStage>
    </>
  )
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/pages/__tests__/Home.test.tsx`
Expected: PASS — both assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx src/pages/__tests__/Home.test.tsx
git commit -m "feat(home): wrap TetrisGrid with VelvetStage environment"
```

---

## Task 9 · Create the `AuroraChamber` CSS module

**Files:**
- Create: `src/components/AuroraChamber/AuroraChamber.module.css`
- Create: `src/components/AuroraChamber/__tests__/aurora-chamber-css.test.ts`

- [ ] **Step 1: Write the failing CSS tests**

Create `src/components/AuroraChamber/__tests__/aurora-chamber-css.test.ts`:

```typescript
/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../AuroraChamber.module.css'),
  'utf8',
)

describe('AuroraChamber.module.css', () => {
  it('.chamber is position: relative with min-height: 100dvh', () => {
    expect(CSS).toMatch(/\.chamber\s*\{[^}]*position:\s*relative/)
    expect(CSS).toMatch(/\.chamber\s*\{[^}]*min-height:\s*100dvh/)
  })
  it('renders three aurora layers (cyan, magenta, gold)', () => {
    expect(CSS).toMatch(/\.auroraCyan\s*\{[^}]*var\(--aurora-cyan\)/)
    expect(CSS).toMatch(/\.auroraMagenta\s*\{[^}]*var\(--aurora-magenta\)/)
    expect(CSS).toMatch(/\.auroraGold\s*\{[^}]*var\(--aurora-gold\)/)
  })
  it('has a stars layer', () => {
    expect(CSS).toMatch(/\.stars\s*\{/)
  })
  it('has an inset vignette', () => {
    expect(CSS).toMatch(/\.vignette\s*\{[^}]*box-shadow:\s*inset/)
  })
  it('decorative layers are hidden on non-modern-vibrant themes', () => {
    expect(CSS).toMatch(/:not\(\[data-theme="modern-vibrant"\]\)/)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/AuroraChamber/__tests__/aurora-chamber-css.test.ts`
Expected: FAIL — file doesn't exist.

- [ ] **Step 3: Create the CSS module**

Create `src/components/AuroraChamber/AuroraChamber.module.css`:

```css
/* AuroraChamber — the v2.0 environment for /contact on modern-vibrant.
   Full-viewport cosmic space with three aurora radial layers (cyan,
   magenta, gold) drifting against a deep-space backing, plus a sparse
   star field and an inset vignette. Theme-scoped to modern-vibrant so
   other themes see a transparent passthrough wrapper. */

.chamber {
  position: relative;
  min-height: 100dvh;
  width: 100%;
  background: var(--aurora-deepspace, transparent);
  isolation: isolate;
}

.auroraCyan {
  position: absolute;
  top: 5%;
  left: -20%;
  width: 140%;
  height: 60%;
  background: radial-gradient(60% 80% at 30% 50%, var(--aurora-cyan, transparent), transparent 70%);
  filter: blur(30px);
  pointer-events: none;
  z-index: 0;
}

.auroraMagenta {
  position: absolute;
  top: 25%;
  right: -10%;
  width: 120%;
  height: 55%;
  background: radial-gradient(70% 60% at 80% 60%, var(--aurora-magenta, transparent), transparent 70%);
  filter: blur(36px);
  pointer-events: none;
  z-index: 0;
}

.auroraGold {
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 40%;
  background: radial-gradient(60% 60% at 50% 100%, var(--aurora-gold, transparent), transparent 70%);
  filter: blur(34px);
  pointer-events: none;
  z-index: 0;
}

.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background:
    radial-gradient(1px 1px at 8% 14%, rgba(255, 255, 255, 0.9), transparent 60%),
    radial-gradient(1px 1px at 76% 22%, rgba(255, 255, 255, 0.7), transparent 60%),
    radial-gradient(0.5px 0.5px at 42% 6%, rgba(255, 255, 255, 0.8), transparent 60%),
    radial-gradient(1px 1px at 92% 70%, rgba(255, 255, 255, 0.6), transparent 60%),
    radial-gradient(0.5px 0.5px at 16% 78%, rgba(255, 255, 255, 0.5), transparent 60%);
}

.vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.55);
}

/* Theme scope — chamber backdrop and decorative layers render only on
   modern-vibrant. Other themes get a transparent passthrough wrapper. */
:global(html:not([data-theme="modern-vibrant"])) .chamber {
  background: transparent;
}
:global(html:not([data-theme="modern-vibrant"])) .auroraCyan,
:global(html:not([data-theme="modern-vibrant"])) .auroraMagenta,
:global(html:not([data-theme="modern-vibrant"])) .auroraGold,
:global(html:not([data-theme="modern-vibrant"])) .stars,
:global(html:not([data-theme="modern-vibrant"])) .vignette {
  display: none;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/AuroraChamber/__tests__/aurora-chamber-css.test.ts`
Expected: PASS — all 6 assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/AuroraChamber/AuroraChamber.module.css src/components/AuroraChamber/__tests__/aurora-chamber-css.test.ts
git commit -m "feat(aurora-chamber): add CSS module with aurora layers and stars"
```

---

## Task 10 · Create the `AuroraChamber` React component

**Files:**
- Create: `src/components/AuroraChamber/AuroraChamber.tsx`
- Create: `src/components/AuroraChamber/__tests__/AuroraChamber.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/AuroraChamber/__tests__/AuroraChamber.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AuroraChamber } from '../AuroraChamber'

describe('AuroraChamber', () => {
  it('renders children inside the chamber', () => {
    const { getByText } = render(
      <AuroraChamber>
        <div>contact form</div>
      </AuroraChamber>,
    )
    expect(getByText('contact form')).toBeInTheDocument()
  })

  it('renders five aria-hidden decorative layers (3 aurora + stars + vignette)', () => {
    const { container } = render(<AuroraChamber>x</AuroraChamber>)
    const decorations = container.querySelectorAll('[aria-hidden="true"]')
    expect(decorations.length).toBe(5)
  })

  it('the chamber root has data-env="aurora"', () => {
    const { container } = render(<AuroraChamber>x</AuroraChamber>)
    expect(container.firstChild).toHaveAttribute('data-env', 'aurora')
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/AuroraChamber/__tests__/AuroraChamber.test.tsx`
Expected: FAIL — component not found.

- [ ] **Step 3: Create the component**

Create `src/components/AuroraChamber/AuroraChamber.tsx`:

```typescript
import type { ReactNode } from 'react'
import styles from './AuroraChamber.module.css'

export interface AuroraChamberProps {
  children: ReactNode
}

/**
 * AuroraChamber — the v2.0 environment for /contact on modern-vibrant.
 * Wraps the page content with a cosmic aurora composition: cyan, magenta,
 * and gold radial gradients drift against a deep-space backing, with a
 * sparse star field and an inset vignette framing the viewport. On other
 * themes the wrapper is a transparent passthrough.
 */
export function AuroraChamber({ children }: AuroraChamberProps) {
  return (
    <div className={styles.chamber} data-env="aurora">
      <div className={styles.auroraCyan} aria-hidden="true" />
      <div className={styles.auroraMagenta} aria-hidden="true" />
      <div className={styles.auroraGold} aria-hidden="true" />
      <div className={styles.stars} aria-hidden="true" />
      {children}
      <div className={styles.vignette} aria-hidden="true" />
    </div>
  )
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/AuroraChamber/__tests__/AuroraChamber.test.tsx`
Expected: PASS — 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/AuroraChamber/AuroraChamber.tsx src/components/AuroraChamber/__tests__/AuroraChamber.test.tsx
git commit -m "feat(aurora-chamber): add AuroraChamber component"
```

---

## Task 11 · Wrap Contact page content with `AuroraChamber`

**Files:**
- Modify: `src/pages/Contact.tsx`
- Create: `src/pages/__tests__/Contact.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/__tests__/Contact.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import Contact from '../Contact'

describe('Contact page', () => {
  it('wraps content in an AuroraChamber', () => {
    const { container } = render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    )
    expect(container.querySelector('[data-env="aurora"]')).toBeInTheDocument()
  })

  it('renders the Contact heading inside the chamber', () => {
    const { container } = render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    )
    const chamber = container.querySelector('[data-env="aurora"]')
    expect(chamber?.textContent).toContain('Contact')
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/pages/__tests__/Contact.test.tsx`
Expected: FAIL — no `[data-env="aurora"]` element yet.

- [ ] **Step 3: Update Contact.tsx**

Open `src/pages/Contact.tsx`. Add the import at the top:

```typescript
import { AuroraChamber } from '../components/AuroraChamber/AuroraChamber'
```

Wrap the existing `<main>` element with `<AuroraChamber>`. The complete return statement becomes:

```typescript
  return (
    <AuroraChamber>
      <main className={styles.page}>
        <RouteHead {...META['/contact']} />
        <motion.h1
          layoutId="block-contact"
          className={styles.header}
          style={{ ['--block-bg' as string]: 'var(--c-contact)', ['--block-fg' as string]: 'var(--c-contact-fg)' }}
        >
          Contact
        </motion.h1>

        <p className={styles.lede}>
          Got an app or website idea, or a project that needs a co-builder? Send
          a few sentences. I read everything and respond within 1–2 business days.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Email</h2>
          <p>
            <a
              href={`mailto:${SITE.email}?subject=${subject}&body=${body}`}
              style={{ fontWeight: 800, fontSize: '1.25rem' }}
            >
              {SITE.email}
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Where I am</h2>
          <p style={{ color: 'var(--fg-muted)' }}>
            {SITE.founder.location} · Mountain Time (US/Denver)
          </p>
        </section>
      </main>
    </AuroraChamber>
  )
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/pages/__tests__/Contact.test.tsx`
Expected: PASS — both assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Contact.tsx src/pages/__tests__/Contact.test.tsx
git commit -m "feat(contact): wrap page content with AuroraChamber environment"
```

---

## Task 12 · Add Motion-driven enter animation to `VelvetStage`

**Files:**
- Modify: `src/components/VelvetStage/VelvetStage.tsx`

The stage decorative layers should fade in (600ms) on first mount so navigating into /  feels like the velvet stage materializes rather than hard-cutting. Motion is already in the stack.

- [ ] **Step 1: Update `VelvetStage.tsx` to use motion.div for decorative layers**

Replace the file content with:

```typescript
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import styles from './VelvetStage.module.css'

export interface VelvetStageProps {
  children: ReactNode
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6, ease: 'easeOut' as const },
}

/**
 * VelvetStage — the v2.0 environmental wrapper for the home grid (and
 * later, Velvet Vitrine inner pages in Phase 6). Renders three decorative
 * layers (floor, spot, vignette) as absolutely-positioned siblings to the
 * provided children. Layers fade in over 600ms on mount via Motion so the
 * environment feels like it's materializing. On non-modern-vibrant themes,
 * the layers are display:none via CSS theme-scoping so other themes get
 * their v1 environments unchanged.
 */
export function VelvetStage({ children }: VelvetStageProps) {
  return (
    <div className={styles.stage} data-env="velvet">
      <motion.div className={styles.floor} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.spot} aria-hidden="true" {...fadeIn} />
      {children}
      <motion.div className={styles.vignette} aria-hidden="true" {...fadeIn} />
    </div>
  )
}
```

- [ ] **Step 2: Run tests to verify nothing broke**

Run: `pnpm test src/components/VelvetStage/`
Expected: PASS — existing tests still pass (the motion.div renders as a div element, and the aria-hidden + sibling assertions remain true).

- [ ] **Step 3: Commit**

```bash
git add src/components/VelvetStage/VelvetStage.tsx
git commit -m "feat(velvet-stage): fade in decorative layers via Motion"
```

---

## Task 13 · Add Motion-driven enter animation to `AuroraChamber`

**Files:**
- Modify: `src/components/AuroraChamber/AuroraChamber.tsx`

Same fade-in treatment as VelvetStage.

- [ ] **Step 1: Update `AuroraChamber.tsx`**

Replace the file content with:

```typescript
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import styles from './AuroraChamber.module.css'

export interface AuroraChamberProps {
  children: ReactNode
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6, ease: 'easeOut' as const },
}

/**
 * AuroraChamber — the v2.0 environment for /contact on modern-vibrant.
 * Wraps the page content with a cosmic aurora composition: cyan, magenta,
 * and gold radial gradients drift against a deep-space backing, with a
 * sparse star field and an inset vignette framing the viewport. Layers
 * fade in over 600ms on mount via Motion. On other themes the wrapper is
 * a transparent passthrough.
 */
export function AuroraChamber({ children }: AuroraChamberProps) {
  return (
    <div className={styles.chamber} data-env="aurora">
      <motion.div className={styles.auroraCyan} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.auroraMagenta} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.auroraGold} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.stars} aria-hidden="true" {...fadeIn} />
      {children}
      <motion.div className={styles.vignette} aria-hidden="true" {...fadeIn} />
    </div>
  )
}
```

- [ ] **Step 2: Run tests**

Run: `pnpm test src/components/AuroraChamber/`
Expected: PASS — existing tests still pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/AuroraChamber/AuroraChamber.tsx
git commit -m "feat(aurora-chamber): fade in decorative layers via Motion"
```

---

## Task 14 · Add slow drift animation to aurora layers (HeroPortalWindow + AuroraChamber)

**Files:**
- Modify: `src/components/TetrisGrid/HeroPortalWindow.module.css`
- Modify: `src/components/AuroraChamber/AuroraChamber.module.css`

Per spec §4.3: "The aurora's color animation runs continuously at ambient state (slow drift, ~30s cycle)". Implement as CSS `@keyframes` that gently shift the gradient positions over 30s. Respect `prefers-reduced-motion`.

- [ ] **Step 1: Append the drift animation to HeroPortalWindow.module.css**

Open `src/components/TetrisGrid/HeroPortalWindow.module.css`. Append at the bottom:

```css
/* Slow aurora drift — gentle 30s background-position oscillation for the
   ambient state. Respects prefers-reduced-motion by zeroing the duration. */
@keyframes hero-portal-aurora-drift {
  0%   { background-position: 0% 0%, 100% 100%; }
  50%  { background-position: 15% 10%, 85% 90%; }
  100% { background-position: 0% 0%, 100% 100%; }
}

.aurora {
  background-size: 130% 130%, 130% 130%;
  animation: hero-portal-aurora-drift 30s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .aurora {
    animation: none;
  }
}
```

- [ ] **Step 2: Append the drift animation to AuroraChamber.module.css**

Open `src/components/AuroraChamber/AuroraChamber.module.css`. Append at the bottom:

```css
/* Slow aurora drift — same gentle oscillation as HeroPortalWindow but
   tuned for the larger blurred radials. 30s cycle. Respects
   prefers-reduced-motion. */
@keyframes aurora-chamber-drift-1 {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50%      { transform: translate3d(2%, -3%, 0); }
}

@keyframes aurora-chamber-drift-2 {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50%      { transform: translate3d(-2%, 3%, 0); }
}

@keyframes aurora-chamber-drift-3 {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50%      { transform: translate3d(0, -2%, 0); }
}

.auroraCyan    { animation: aurora-chamber-drift-1 30s ease-in-out infinite; }
.auroraMagenta { animation: aurora-chamber-drift-2 34s ease-in-out infinite; }
.auroraGold    { animation: aurora-chamber-drift-3 26s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .auroraCyan,
  .auroraMagenta,
  .auroraGold {
    animation: none;
  }
}
```

(The three layers use different cycle lengths so the composition reads as organic, not synchronized.)

- [ ] **Step 3: Append drift assertions to the existing CSS structure tests**

Update `src/components/TetrisGrid/__tests__/hero-portal-window-css.test.ts` by appending inside the existing describe block:

```typescript
  it('aurora layer has a 30s drift animation', () => {
    expect(CSS).toMatch(/\.aurora\s*\{[^}]*animation:\s*hero-portal-aurora-drift\s+30s/)
  })
  it('respects prefers-reduced-motion by disabling the drift', () => {
    expect(CSS).toMatch(/prefers-reduced-motion:\s*reduce/)
    expect(CSS).toMatch(/animation:\s*none/)
  })
```

Update `src/components/AuroraChamber/__tests__/aurora-chamber-css.test.ts` similarly:

```typescript
  it('aurora layers have drift animations with different durations', () => {
    expect(CSS).toMatch(/\.auroraCyan\s*\{[^}]*animation:\s*aurora-chamber-drift-1\s+30s/)
    expect(CSS).toMatch(/\.auroraMagenta\s*\{[^}]*animation:\s*aurora-chamber-drift-2\s+34s/)
    expect(CSS).toMatch(/\.auroraGold\s*\{[^}]*animation:\s*aurora-chamber-drift-3\s+26s/)
  })
  it('respects prefers-reduced-motion', () => {
    expect(CSS).toMatch(/prefers-reduced-motion:\s*reduce/)
  })
```

- [ ] **Step 4: Run tests**

Run: `pnpm test src/components/TetrisGrid/__tests__/hero-portal-window-css.test.ts src/components/AuroraChamber/__tests__/aurora-chamber-css.test.ts`
Expected: PASS — all assertions pass for both files.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/HeroPortalWindow.module.css src/components/AuroraChamber/AuroraChamber.module.css src/components/TetrisGrid/__tests__/hero-portal-window-css.test.ts src/components/AuroraChamber/__tests__/aurora-chamber-css.test.ts
git commit -m "feat(aurora): add slow drift animation with reduced-motion respect"
```

---

## Task 15 · Verify full test suite + production build

**Files:** No code changes — verification only.

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: PASS — all existing tests + Phase 2 new tests pass. Approximate count: 96 (Phase 1) + 5 (aurora tokens) + 5 (velvet CSS) + 3 (VelvetStage component) + 6 (hero portal CSS) + 3 (HeroPortalWindow) + 2 (Block portal slot) + 2 (TetrisGrid wiring) + 2 (Home wrapping) + 6 (aurora chamber CSS) + 3 (AuroraChamber) + 2 (Contact wrapping) + 2 (drift) = ~137 tests.

- [ ] **Step 2: Run the production build**

Run: `pnpm build`
Expected: Build completes successfully. No CSS errors, no TypeScript errors. Output written to `dist/`. All 6 routes prerendered.

- [ ] **Step 3: Inspect the built CSS for the new tokens and rules**

```bash
grep -c "aurora-cyan" dist/assets/*.css
grep -c "rotateX(48deg)" dist/assets/*.css
grep -c "hero-portal-aurora-drift" dist/assets/*.css
```

Expected: At least 1 match for each pattern — tokens, velvet floor rotation, and drift keyframe all made it into the build.

- [ ] **Step 4: No commit needed**

Continue to Task 16.

---

## Task 16 · Manual visual verification

**Files:** No code changes — manual smoke test.

Run `pnpm dev` and walk the checklist at `http://localhost:5173/`.

- [ ] **Step 1: Start the dev server**

Run: `pnpm dev`

- [ ] **Step 2: Verify VelvetStage on home (modern-vibrant)**

- [ ] Warm overhead spotlight visible at the top of the viewport
- [ ] Burgundy velvet floor rotated into the bottom half (woven micro-pattern visible at close inspection)
- [ ] Inset vignette darkens the corners
- [ ] All 7 blocks from Phase 1 still render correctly inside the stage
- [ ] Stage decorative layers fade in over ~600ms on first load (refresh to confirm)

- [ ] **Step 3: Verify HeroPortalWindow inside the Hero block**

- [ ] Hero block has a visible aurora window cutout inset 14px from its edges
- [ ] Deep-space (near-black) backing with two soft radial blobs — cyan upper-left, magenta lower-right
- [ ] Sparse white star dots visible against the dark backing
- [ ] Aurora colors gently drift over ~30 seconds (watch for movement)

- [ ] **Step 4: Verify AuroraChamber on /contact**

- [ ] Click the Hero block to navigate to /contact
- [ ] Aurora chamber fades in over 600ms (cyan/magenta/gold radial gradients visible against deep space)
- [ ] Stars visible
- [ ] Inset vignette frames the viewport
- [ ] The existing contact heading + lede + email link are readable on top of the aurora backdrop (no contrast regressions)
- [ ] Aurora drifts continuously

- [ ] **Step 5: Verify theme regression (other themes unchanged)**

Trigger the Konami code switcher (↑ ↑ ↓ ↓ ← → ← → b a).

- [ ] Switch to `classic`: home grid renders WITHOUT velvet floor/spot/vignette (the v1 cube atmospherics from TetrisGrid still show through). Hero block has NO aurora window. Contact page renders WITHOUT aurora chamber (just the v1 page styling).
- [ ] Switch to `pastel`: same regression check — v1 visuals only.
- [ ] Switch to `arcade-neon`: same — v1 visuals only.

- [ ] **Step 6: Verify reduced-motion**

DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`.

- [ ] Aurora drift animations stop (gradients hold still)
- [ ] Stage / chamber fade-in still happens on mount (Motion's `transition` is short and not animation-intensive — acceptable)

- [ ] **Step 7: Stop dev server**

`Ctrl+C`.

- [ ] **Step 8: Capture screenshots for Phase 2 record**

Take screenshots of:
- Home page (modern-vibrant) showing Velvet Stage + Hero Portal Window
- Contact page (modern-vibrant) showing Aurora Chamber
- Home page (classic) confirming no v2 environment

Save to `docs/superpowers/specs/screenshots/2026-05-24-v2-phase-2-*.png`.

- [ ] **Step 9: Commit the screenshots**

```bash
git add docs/superpowers/specs/screenshots/2026-05-24-v2-phase-2-*.png
git commit -m "docs(spec): add Phase 2 visual reference screenshots"
```

---

## Task 17 · Update the v1 critique remediation note

**Files:**
- Modify: `docs/ux-critique.md`

- [ ] **Step 1: Append a Phase 2 status section**

Open `docs/ux-critique.md`. Find the existing `## v2.0 Implementation Status` section (added by Phase 1). Append a new subsection under it, after the Phase 1 entry:

```markdown

### Phase 2 — Velvet Stage + Aurora Portal Hero (completed 2026-05-24)

Added the v2.0 environmental layer on modern-vibrant: home grid is wrapped in a `VelvetStage` (warm burgundy fabric floor + overhead spot + inset vignette), `/contact` route is wrapped in an `AuroraChamber` (cyan/magenta/gold radial gradients drifting against deep space with stars and vignette), and the Hero block now has a glowing aurora window cutout (`HeroPortalWindow`) inside its surface. Other themes (`classic`, `pastel`, `arcade-neon`) remain visually unchanged via CSS theme-scoping.

This phase begins addressing issue #3 (inner-page experience cliff) for the `/contact` route specifically — the contact page now carries the same atmospheric language as the home page through the aurora chamber, eliminating the v1 cliff for that one route. Issue #3 will be fully closed in Phase 6 when the Velvet Vitrine treatment is applied to About/Work/Services/Process pages.

See `docs/superpowers/plans/2026-05-24-ui-v2-phase-2-velvet-stage-aurora-portal.md` for the full implementation log.
```

- [ ] **Step 2: Commit**

```bash
git add docs/ux-critique.md
git commit -m "docs(critique): record Phase 2 environmental layer in implementation status"
```

---

## Task 18 · Push the branch and open a preview deploy

**Files:** No code changes — deploy workflow.

- [ ] **Step 1: Verify branch is up-to-date with origin**

Run: `git status`
Expected: "Your branch is ahead of 'origin/<branch>' by N commits."

- [ ] **Step 2: Push to remote**

Run: `git push`
Expected: branch pushed; Vercel webhook triggers a preview build.

- [ ] **Step 3: Wait for the preview URL**

Watch the Vercel dashboard or the GitHub PR check for the preview URL. Typically ~90s.

- [ ] **Step 4: Verify on the preview URL**

Open the preview URL in Chrome and re-run the Task 16 visual checklist against it. Note any environment-specific issues.

- [ ] **Step 5: Either update an existing Phase 1 PR or open a Phase 2 PR**

If the worktree branch already has an open PR (e.g., Phase 1's PR #3 if not yet merged), the new Phase 2 commits land on the same PR. Otherwise, open a fresh Phase 2 PR.

Decision tree:
- **Phase 1 PR still open and not yet merged:** the Phase 2 commits sit on the same branch. Either (a) leave them on Phase 1's PR (becomes a combined "Phases 1+2" PR), or (b) rebase onto main after Phase 1 merges and open a separate PR.
- **Phase 1 PR is merged:** create a new branch off main for Phase 2 commits (cherry-pick or rebase), open a fresh Phase 2 PR.

For the next iteration (Phase 3), the cleanest pattern is: each phase gets its own worktree branched from main once the prior phase is merged. Phase 2 may end up combined with Phase 1 in PR #3 if executed before merge; that's acceptable for now.

---

## Definition of Done

Phase 2 is complete when ALL of the following are true:

- [ ] All 18 tasks above are checked off
- [ ] `pnpm test` passes with 0 failures (~137 tests total)
- [ ] `pnpm build` produces a clean production build
- [ ] Manual visual verification (Task 16) checklist 100% clean
- [ ] Preview deployment renders correctly
- [ ] PR opened (or commits added to existing Phase 1 PR per Task 18 decision tree)
- [ ] Branch merged into main when ready

---

## What is intentionally NOT in Phase 2

These items appear in the spec but belong to later phases:

- Materials Panel and 7 presets (Phase 3)
- Single-thread line system (Phase 4)
- Rube Goldberg chain reactions (Phase 5)
- **Velvet Vitrine for About / Work / Services / Process inner pages (Phase 6)** — these routes are intentionally NOT wrapped in this phase
- The full "camera push" transition through the Hero portal — Phase 2 uses a simple Motion fade-in; the cinematic push happens in Phase 5 (interaction layer)
- moss / crochet themes (Phase 7) — `VelvetStage` and `AuroraChamber` are scoped to `modern-vibrant`; Phase 7 will add per-theme alternates if needed
- Mobile-specific Aurora Portal orientation changes (Phase 8)
- Per-theme environment alternates (Phase 7)

If a task description in this plan starts to drift toward any of the above, stop — you're outside Phase 2's scope. Cut what you have and ship Phase 2 first.
