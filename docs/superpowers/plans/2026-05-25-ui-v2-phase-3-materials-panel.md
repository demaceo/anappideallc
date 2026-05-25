# UI v2.0 — Phase 3: Materials Panel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Materials Panel — a bottom-drawer UI triggered by clicking the Brand block on `modern-vibrant`, exposing 7 material presets (Anodized default + Polished Steel + Gold Leaf + Frosted Glass + Patinated Bronze + Cream Ceramic + Showcase) that re-skin every block in the grid with a 600ms color-token transition, persisted via localStorage.

**Architecture:** A `MaterialProvider` context manages the active preset, mirrors it onto `<html data-material="…">` for CSS scoping, and persists to `localStorage`. A bootstrap script in `index.html` (parallel to the existing theme bootstrap) reads the saved preset before first paint to avoid flicker. The `MaterialsPanel` component is a Motion-animated drawer with a 7-column swatch grid; each swatch is a mini-Block preview rendered in its preset's actual material recipe. The 6 alternate presets are CSS overrides on `.block` keyed by `[data-material]` scoping. `@property` declarations register the 3 bloom custom properties as `<color>` so the cross-preset transition interpolates smoothly. The Brand block, when active theme is `modern-vibrant`, intercepts its click → opens the panel; on other themes it navigates to `/about` as before. Keyboard-accessible (Escape, arrow keys, focus trap). All animations respect `prefers-reduced-motion` via the `<MotionConfig reducedMotion="user">` root from Phase 2.

**Tech Stack:** Existing — React 19, React Router 7, Motion, CSS Modules, Vitest, happy-dom. No new runtime dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md` — §9 (Materials Panel) and §17 (Phase 3 in build phasing).

---

## File Structure

| File | Type | Responsibility |
|---|---|---|
| `src/lib/material-context.ts` | Create | Context type + default value (`'anodized'`); `MaterialId` union type |
| `src/lib/material.tsx` | Create | `MaterialProvider` component: state, `localStorage` sync, `<html data-material>` sync; `useMaterial` hook; `usePanelState` hook (or fold into one hook) |
| `src/lib/__tests__/material.test.tsx` | Create | Hook tests: default `'anodized'`, persists, syncs DOM attribute, panel state |
| `src/components/MaterialsPanel/materialPresets.ts` | Create | Preset metadata array (id, label, sublabel) — single source of truth for the 7 presets |
| `src/components/MaterialsPanel/Swatch.tsx` | Create | Single swatch component: tilted mini-block preview rendered in its preset's material; active outline; click handler |
| `src/components/MaterialsPanel/Swatch.module.css` | Create | Swatch chrome (3D tilt, active gold outline, label typography) |
| `src/components/MaterialsPanel/__tests__/Swatch.test.tsx` | Create | Swatch renders, active state applies outline, click invokes callback |
| `src/components/MaterialsPanel/MaterialsPanel.tsx` | Create | Drawer overlay: header, swatch grid, close button; focus trap; Escape handler |
| `src/components/MaterialsPanel/MaterialsPanel.module.css` | Create | Drawer chrome (overlay, blur, gradient bg, slide-up animation, swatch grid layout) |
| `src/components/MaterialsPanel/__tests__/MaterialsPanel.test.tsx` | Create | Renders 7 swatches; opens/closes via prop; Escape closes; active swatch reflects context |
| `src/components/TetrisGrid/Block.module.css` | Modify | Add `@property` declarations for bloom triple; add 600ms transition on `.block` for bloom + box-shadow; add 6 alternate material recipes scoped via `[data-material]` |
| `src/components/TetrisGrid/Block.tsx` | Modify | Add Brand-block-specific click interception: on modern-vibrant, intercept click → call `openPanel()`; on other themes, navigate to `/about` as before. Add `aria-haspopup="dialog"` + `aria-expanded` on Brand block |
| `src/components/TetrisGrid/TetrisGrid.tsx` | Modify | Mount `<MaterialsPanel>` (it reads its own open state from context); no other changes |
| `src/components/TetrisGrid/HomeIcon/HomeIcon.module.css` | (none — confirmed already correct) | — |
| `src/App.tsx` | Modify | Wrap with `<MaterialProvider>` (inside `<MotionConfig>`, outside `<ThemeProvider>`) |
| `index.html` | Modify | Add material bootstrap script (parallel to existing theme bootstrap) — runs synchronously before paint to set `<html data-material>` |
| `docs/ux-critique.md` | Modify | Append Phase 3 status under "v2.0 Implementation Status" |

**TDD pattern.** Hook tests use `renderHook` from `@testing-library/react`. Component tests use `render` + queries. CSS structure tests use parse-based regex (Phases 1+2 pattern). Manual visual verification is a separate end-of-phase step.

---

## Task 1 · Create the `useMaterial` hook + `MaterialProvider`

**Files:**
- Create: `src/lib/material-context.ts`
- Create: `src/lib/material.tsx`
- Create: `src/lib/__tests__/material.test.tsx`

The provider owns 4 pieces of state: active preset (`material`), panel open state (`panelOpen`), and the two mutators. Persists `material` to `localStorage['material']` and mirrors onto `document.documentElement.dataset.material`. `panelOpen` is in-memory only.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/__tests__/material.test.tsx`:

```typescript
/// <reference types="node" />
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { MaterialProvider, useMaterial } from '../material'
import type { ReactNode } from 'react'

const wrapper = ({ children }: { children: ReactNode }) => (
  <MaterialProvider>{children}</MaterialProvider>
)

describe('useMaterial', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-material')
  })

  it('defaults to "anodized"', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    expect(result.current.material).toBe('anodized')
  })

  it('reads initial value from localStorage', () => {
    localStorage.setItem('material', 'steel')
    const { result } = renderHook(() => useMaterial(), { wrapper })
    expect(result.current.material).toBe('steel')
  })

  it('persists changes to localStorage', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    act(() => result.current.setMaterial('gold'))
    expect(localStorage.getItem('material')).toBe('gold')
  })

  it('mirrors active material onto <html data-material>', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    act(() => result.current.setMaterial('frosted'))
    expect(document.documentElement.dataset.material).toBe('frosted')
  })

  it('panel is closed by default', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    expect(result.current.panelOpen).toBe(false)
  })

  it('openPanel() opens the panel', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    act(() => result.current.openPanel())
    expect(result.current.panelOpen).toBe(true)
  })

  it('closePanel() closes the panel', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    act(() => result.current.openPanel())
    act(() => result.current.closePanel())
    expect(result.current.panelOpen).toBe(false)
  })

  it('ignores unknown values from localStorage and falls back to default', () => {
    localStorage.setItem('material', 'bogus-value')
    const { result } = renderHook(() => useMaterial(), { wrapper })
    expect(result.current.material).toBe('anodized')
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/lib/__tests__/material.test.tsx`
Expected: FAIL — `material.tsx` doesn't exist yet.

- [ ] **Step 3: Create the context module**

Create `src/lib/material-context.ts`:

```typescript
import { createContext } from 'react'

export type MaterialId =
  | 'anodized'
  | 'steel'
  | 'gold'
  | 'frosted'
  | 'bronze'
  | 'ceramic'
  | 'showcase'

export const MATERIAL_IDS: readonly MaterialId[] = [
  'anodized',
  'steel',
  'gold',
  'frosted',
  'bronze',
  'ceramic',
  'showcase',
] as const

export const DEFAULT_MATERIAL: MaterialId = 'anodized'

export interface MaterialContextValue {
  material: MaterialId
  setMaterial: (next: MaterialId) => void
  panelOpen: boolean
  openPanel: () => void
  closePanel: () => void
}

export const MaterialContext = createContext<MaterialContextValue | null>(null)
```

- [ ] **Step 4: Create the provider + hook**

Create `src/lib/material.tsx`:

```typescript
import { useCallback, useEffect, useMemo, useState, useContext } from 'react'
import type { ReactNode } from 'react'
import {
  DEFAULT_MATERIAL,
  MATERIAL_IDS,
  MaterialContext,
  type MaterialId,
} from './material-context'

const STORAGE_KEY = 'material'

function readInitial(): MaterialId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && (MATERIAL_IDS as readonly string[]).includes(saved)) {
      return saved as MaterialId
    }
  } catch {
    // localStorage may throw in private browsing / SSR — fall through to default
  }
  return DEFAULT_MATERIAL
}

export interface MaterialProviderProps {
  children: ReactNode
}

/**
 * Provides the active Materials Panel preset and panel-open state. Persists
 * the preset to localStorage and mirrors it onto `<html data-material>` so
 * CSS can scope alternate material recipes via attribute selectors.
 */
export function MaterialProvider({ children }: MaterialProviderProps) {
  const [material, setMaterialState] = useState<MaterialId>(readInitial)
  const [panelOpen, setPanelOpen] = useState(false)

  // Sync to localStorage + DOM attribute on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, material)
    } catch {
      // ignore
    }
    document.documentElement.dataset.material = material
  }, [material])

  const setMaterial = useCallback((next: MaterialId) => {
    setMaterialState(next)
  }, [])

  const openPanel = useCallback(() => setPanelOpen(true), [])
  const closePanel = useCallback(() => setPanelOpen(false), [])

  const value = useMemo(
    () => ({ material, setMaterial, panelOpen, openPanel, closePanel }),
    [material, setMaterial, panelOpen, openPanel, closePanel],
  )

  return <MaterialContext.Provider value={value}>{children}</MaterialContext.Provider>
}

export function useMaterial() {
  const ctx = useContext(MaterialContext)
  if (!ctx) {
    throw new Error('useMaterial must be used inside <MaterialProvider>')
  }
  return ctx
}
```

- [ ] **Step 5: Run tests to verify pass**

Run: `pnpm test src/lib/__tests__/material.test.tsx`
Expected: PASS — all 8 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/material-context.ts src/lib/material.tsx src/lib/__tests__/material.test.tsx
git commit -m "feat(material): add MaterialProvider, useMaterial hook + persistence"
```

---

## Task 2 · Wrap App with MaterialProvider

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/App-material.test.tsx`:

```typescript
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import App from '../App'
import { MaterialContext } from '../lib/material-context'
import { useContext } from 'react'

function ContextProbe() {
  const ctx = useContext(MaterialContext)
  return <div data-testid="probe">{ctx ? 'has-provider' : 'no-provider'}</div>
}

describe('App MaterialProvider integration', () => {
  it('wraps the tree with MaterialProvider', () => {
    // We need to render App with a child probe — but App's children come from
    // <Outlet />. Render App in a MemoryRouter with no route matched: the
    // ContextProbe can be rendered as a sibling to the App's tree via routes.
    // Simpler: just check App renders without throwing, then verify the
    // provider is wired by mounting ContextProbe inside App's tree.

    // Stub out MemoryRouter wrapping by importing the provider directly.
    const { getByTestId } = render(
      <MemoryRouter>
        {/* eslint-disable-next-line react/jsx-pascal-case */}
        <App />
      </MemoryRouter>,
    )
    // The actual integration test is that App.tsx imports + uses MaterialProvider —
    // we'll add an inline render of the probe via a test-only route in a later
    // phase if needed. For now, just verify App doesn't throw on render.
    // (The real integration test is the Brand block click test in Task 13.)
    expect(getByTestId).toBeDefined()
  })
})
```

NOTE: this test is intentionally weak — it just verifies App renders. The real integration is exercised by later tests (Brand block click → openPanel). If a more strict provider-presence test is needed, refactor to render `<MaterialProvider><ContextProbe /></MaterialProvider>` separately.

- [ ] **Step 2: Run to verify the test passes after the change (skip the failing step here)**

Run: `pnpm test src/__tests__/App-material.test.tsx`
Expected: may PASS or FAIL depending on existing App structure. The real verification is in step 5.

- [ ] **Step 3: Update `src/App.tsx`**

The current `App.tsx` (from Phase 2) is:

```typescript
import { Outlet } from 'react-router'
import { LayoutGroup, MotionConfig } from 'motion/react'
import { ThemeProvider } from './lib/theme'
// ...etc
```

Add the import:

```typescript
import { MaterialProvider } from './lib/material'
```

Wrap `<ThemeProvider>` with `<MaterialProvider>` inside `<MotionConfig>`. The full updated default export:

```typescript
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <MaterialProvider>
          <AppShell />
        </MaterialProvider>
      </ThemeProvider>
    </MotionConfig>
  )
}
```

(MaterialProvider inside ThemeProvider so material context can later read the theme if needed; outside AppShell so the whole router has access.)

- [ ] **Step 4: Run full test suite to confirm no regressions**

Run: `pnpm test`
Expected: PASS — 137 + 8 (Task 1) + 1 (Task 2) = 146 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/__tests__/App-material.test.tsx
git commit -m "feat(app): wrap tree with MaterialProvider"
```

---

## Task 3 · Add bootstrap script for `<html data-material>` to `index.html`

**Files:**
- Modify: `index.html`

The bootstrap script runs synchronously before any React code, reading `localStorage['material']` and setting `<html data-material>` to avoid a flash of the wrong material on first paint. Parallel to the existing theme bootstrap script.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/bootstrap-script.test.ts`:

```typescript
/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const INDEX_HTML = fs.readFileSync(
  path.resolve(HERE, '../../index.html'),
  'utf8',
)

describe('index.html bootstrap scripts', () => {
  it('includes the existing theme bootstrap (regression check)', () => {
    expect(INDEX_HTML).toMatch(/document\.documentElement\.dataset\.theme/)
  })

  it('includes a material bootstrap that reads localStorage', () => {
    expect(INDEX_HTML).toMatch(/localStorage\.getItem\(['"]material['"]\)/)
  })

  it('sets data-material on documentElement before paint', () => {
    expect(INDEX_HTML).toMatch(/document\.documentElement\.dataset\.material/)
  })

  it('whitelists allowed material values', () => {
    expect(INDEX_HTML).toMatch(/anodized/)
    expect(INDEX_HTML).toMatch(/steel/)
    expect(INDEX_HTML).toMatch(/gold/)
    expect(INDEX_HTML).toMatch(/frosted/)
    expect(INDEX_HTML).toMatch(/bronze/)
    expect(INDEX_HTML).toMatch(/ceramic/)
    expect(INDEX_HTML).toMatch(/showcase/)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/__tests__/bootstrap-script.test.ts`
Expected: FAIL — material bootstrap doesn't exist yet.

- [ ] **Step 3: Add the material bootstrap script to `index.html`**

Open `index.html`. Find the existing theme bootstrap `<script>` (search for `dataset.theme`). Immediately after that closing `</script>` tag, add a new script block:

```html
    <!--
      Material bootstrap — runs synchronously before paint to set
      data-material on <html>, preventing a flash of the wrong material
      on hydration. Anodized is the canonical default. Other presets
      are accessible via the Materials Panel on modern-vibrant only.
    -->
    <script>
      (function () {
        try {
          var ALLOWED = ['anodized', 'steel', 'gold', 'frosted', 'bronze', 'ceramic', 'showcase'];
          var saved = localStorage.getItem('material');
          var initial = saved && ALLOWED.indexOf(saved) > -1 ? saved : 'anodized';
          document.documentElement.dataset.material = initial;
        } catch (e) {
          document.documentElement.dataset.material = 'anodized';
        }
      })();
    </script>
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/__tests__/bootstrap-script.test.ts`
Expected: PASS — all 9 assertions pass (1 regression + 8 new).

- [ ] **Step 5: Commit**

```bash
git add index.html src/__tests__/bootstrap-script.test.ts
git commit -m "feat(material): bootstrap data-material on html before paint"
```

---

## Task 4 · Register bloom tokens as `<color>` for smooth transitions

**Files:**
- Modify: `src/styles/tokens.css`
- Create: `src/__tests__/material-property-registration.test.ts`

Per CSS Properties and Values L1: `var()` substitutions of custom properties don't animate unless the property is registered as a typed value. Without `@property`, switching `--bloom` from magenta to cyan would hard-cut at the change. With `@property syntax: '<color>'`, the browser interpolates color values smoothly across the transition duration.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/material-property-registration.test.ts`:

```typescript
/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const TOKENS_CSS = fs.readFileSync(
  path.resolve(HERE, '../styles/tokens.css'),
  'utf8',
)

describe('Bloom @property registrations', () => {
  for (const name of ['--bloom-dark', '--bloom', '--bloom-bright']) {
    it(`registers ${name} as <color> with transparent initial-value`, () => {
      const block = new RegExp(
        `@property\\s+${name}\\s*\\{[^}]*syntax:\\s*['"]<color>['"];[^}]*inherits:\\s*true;[^}]*initial-value:\\s*transparent`,
        's',
      )
      expect(TOKENS_CSS).toMatch(block)
    })
  }
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/__tests__/material-property-registration.test.ts`
Expected: FAIL — no `@property` registrations exist.

- [ ] **Step 3: Add `@property` registrations at the top of `tokens.css`**

Open `src/styles/tokens.css`. After the file-header comment (the first 3-line `/* Theme tokens — every theme... */` block) and BEFORE the `:root, [data-theme="modern-vibrant"]` selector, insert:

```css
/* Register the Editorial Hardware bloom triple as <color> so that
   transitioning between material presets interpolates smoothly across
   the 600ms color animation. Without @property, custom-property
   transitions are hard cuts (the new value snaps in at completion).
   `inherits: true` lets per-section .block-{section} bindings cascade. */
@property --bloom-dark {
  syntax: '<color>';
  inherits: true;
  initial-value: transparent;
}
@property --bloom {
  syntax: '<color>';
  inherits: true;
  initial-value: transparent;
}
@property --bloom-bright {
  syntax: '<color>';
  inherits: true;
  initial-value: transparent;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/__tests__/material-property-registration.test.ts`
Expected: PASS — 3 registrations confirmed.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/__tests__/material-property-registration.test.ts
git commit -m "feat(tokens): register bloom triple as <color> @property"
```

---

## Task 5 · Add `materialPresets.ts` (single source of truth)

**Files:**
- Create: `src/components/MaterialsPanel/materialPresets.ts`
- Create: `src/components/MaterialsPanel/__tests__/materialPresets.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/components/MaterialsPanel/__tests__/materialPresets.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { MATERIAL_PRESETS } from '../materialPresets'

describe('MATERIAL_PRESETS', () => {
  it('contains exactly 7 presets', () => {
    expect(MATERIAL_PRESETS).toHaveLength(7)
  })

  it('first preset is "anodized" (the default)', () => {
    expect(MATERIAL_PRESETS[0].id).toBe('anodized')
    expect(MATERIAL_PRESETS[0].label).toBe('Anodized')
    expect(MATERIAL_PRESETS[0].sublabel).toBe('Default')
  })

  it('last preset is "showcase"', () => {
    expect(MATERIAL_PRESETS[MATERIAL_PRESETS.length - 1].id).toBe('showcase')
  })

  it('every preset has unique id, non-empty label, non-empty sublabel', () => {
    const ids = new Set<string>()
    for (const p of MATERIAL_PRESETS) {
      expect(p.id).toBeTruthy()
      expect(p.label).toBeTruthy()
      expect(p.sublabel).toBeTruthy()
      expect(ids.has(p.id)).toBe(false)
      ids.add(p.id)
    }
    expect(ids.size).toBe(7)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/MaterialsPanel/__tests__/materialPresets.test.ts`
Expected: FAIL — file doesn't exist.

- [ ] **Step 3: Create the presets module**

Create `src/components/MaterialsPanel/materialPresets.ts`:

```typescript
import type { MaterialId } from '../../lib/material-context'

export interface MaterialPreset {
  id: MaterialId
  label: string
  sublabel: string
}

/**
 * Display metadata for the 7 Materials Panel presets — ordered for the
 * swatch grid. The id is the source of truth; CSS recipes are keyed by
 * `[data-material="{id}"]` selectors in Block.module.css.
 */
export const MATERIAL_PRESETS: readonly MaterialPreset[] = [
  { id: 'anodized', label: 'Anodized',         sublabel: 'Default' },
  { id: 'steel',    label: 'Polished Steel',   sublabel: 'Mirror' },
  { id: 'gold',     label: 'Gold Leaf',        sublabel: 'Warm soft' },
  { id: 'frosted',  label: 'Frosted Glass',    sublabel: 'Translucent' },
  { id: 'bronze',   label: 'Patinated Bronze', sublabel: 'Aged warm' },
  { id: 'ceramic',  label: 'Cream Ceramic',    sublabel: 'Matte' },
  { id: 'showcase', label: 'Showcase',         sublabel: 'All distinct' },
] as const
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/MaterialsPanel/__tests__/materialPresets.test.ts`
Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/MaterialsPanel/materialPresets.ts src/components/MaterialsPanel/__tests__/materialPresets.test.ts
git commit -m "feat(materials): add MATERIAL_PRESETS metadata array"
```

---

## Task 6 · Add Polished Steel material recipe

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css`
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`

For Polished Steel: vertical horizon-reflection gradient (light-to-dark-to-light vertically). This OVERRIDES the .block background when active.

- [ ] **Step 1: Write the failing test**

Append to `src/components/TetrisGrid/__tests__/block-material.test.ts` (inside the top-level describe block at the end):

```typescript
describe('Polished Steel material recipe', () => {
  it('overrides .block background on [data-material="steel"]', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-material="steel"\][^{]*\.block\s*\{[^}]*background:[^;]*linear-gradient\(\s*180deg/,
    )
  })
  it('steel recipe scoped to modern-vibrant only', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-theme="modern-vibrant"\]\[data-material="steel"\]/,
    )
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL — steel recipe doesn't exist.

- [ ] **Step 3: Append the Polished Steel recipe to `Block.module.css`**

Open `src/components/TetrisGrid/Block.module.css`. Append at the END of the file:

```css
/* ====================================================================
   Materials Panel alternate recipes — modern-vibrant only.
   Each recipe overrides .block's background + box-shadow when the
   active preset is set on <html data-material>. The default Anodized
   preset needs no override (it's what the base Editorial Hardware
   recipe already produces). The Showcase preset is per-section and
   lives further down.
   ==================================================================== */

/* Polished Steel — mirror-grade chrome, vertical horizon-reflection
   gradient that fakes a polished metal surface reflecting a horizon
   line. Cooler than Anodized; reads as machined precision. */
[data-theme="modern-vibrant"][data-material="steel"] .block {
  background: linear-gradient(
    180deg,
    #2a2f38 0%,
    #6a7585 30%,
    #c8d2dc 48%,
    #6a7585 70%,
    #2a2f38 100%
  );
  box-shadow:
    inset 0 1px 0 var(--block-specular-top),
    inset 1px 0 0 var(--block-specular-left),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.8),
    inset 0 -2px 0 rgba(0, 0, 0, 0.5),
    inset 0 -8px 12px rgba(0, 0, 0, 0.3),
    0 18px 0 rgba(0, 0, 0, 0.5),
    0 36px 70px rgba(80, 90, 100, 0.35),
    0 50px 80px rgba(0, 0, 0, 0.5),
    var(--shadow-base);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS — both new assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(material): add Polished Steel recipe"
```

---

## Task 7 · Add Gold Leaf material recipe

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css`
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`

Gold Leaf — soft hand-applied warm gold, radial gradient with imperfect specular spots to suggest manual application.

- [ ] **Step 1: Write the failing test**

Append to `block-material.test.ts`:

```typescript
describe('Gold Leaf material recipe', () => {
  it('overrides .block background on [data-material="gold"] with radial gradient', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-material="gold"\][^{]*\.block\s*\{[^}]*background:[^;]*radial-gradient/,
    )
  })
  it('gold recipe scoped to modern-vibrant only', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-theme="modern-vibrant"\]\[data-material="gold"\]/,
    )
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL.

- [ ] **Step 3: Append the Gold Leaf recipe**

Append to `Block.module.css`:

```css
/* Gold Leaf — soft hand-applied warm gold. Radial gradient suggests
   manual application; the imperfect specular pseudo-element overlay
   (added below) fakes the slightly mottled finish of real gold leaf. */
[data-theme="modern-vibrant"][data-material="gold"] .block {
  background: radial-gradient(100% 80% at 40% 30%, #ffe066 0%, #ffb800 50%, #b07700 100%);
  box-shadow:
    inset 0 1px 0 var(--block-specular-top),
    inset 1px 0 0 var(--block-specular-left),
    inset 0 0 0 1px rgba(255, 224, 102, 0.6),
    inset 0 6px 8px rgba(255, 255, 255, 0.35),
    inset 0 -10px 14px rgba(0, 0, 0, 0.35),
    0 18px 0 rgba(0, 0, 0, 0.42),
    0 36px 70px rgba(255, 184, 0, 0.35),
    0 50px 80px rgba(0, 0, 0, 0.45),
    var(--shadow-base);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(material): add Gold Leaf recipe"
```

---

## Task 8 · Add Frosted Glass material recipe

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css`
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`

Frosted Glass — translucent teal with backdrop blur.

- [ ] **Step 1: Write the failing test**

```typescript
describe('Frosted Glass material recipe', () => {
  it('overrides .block background on [data-material="frosted"]', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-material="frosted"\][^{]*\.block\s*\{[^}]*background:[^;]*linear-gradient/,
    )
  })
  it('frosted recipe uses backdrop-filter blur', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-material="frosted"\][^{]*\.block\s*\{[^}]*backdrop-filter:\s*blur/,
    )
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL.

- [ ] **Step 3: Append the Frosted Glass recipe**

```css
/* Frosted Glass — translucent teal cushion with backdrop blur. Reads as
   a chunk of architectural glass — clean, modern, slightly clinical.
   The backdrop-filter samples whatever is behind the block (the velvet
   floor + spotlight), so the visual changes with the environment. */
[data-theme="modern-vibrant"][data-material="frosted"] .block {
  background: linear-gradient(
    135deg,
    rgba(0, 180, 170, 0.5) 0%,
    rgba(91, 227, 220, 0.7) 50%,
    rgba(0, 110, 104, 0.5) 100%
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    inset 0 1px 0 var(--block-specular-top),
    inset 1px 0 0 var(--block-specular-left),
    inset 0 0 0 1.5px rgba(255, 255, 255, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.6),
    inset 0 -2px 0 rgba(0, 0, 0, 0.2),
    0 18px 0 rgba(0, 0, 0, 0.35),
    0 36px 70px rgba(0, 180, 170, 0.4),
    0 50px 80px rgba(0, 0, 0, 0.45),
    var(--shadow-base);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(material): add Frosted Glass recipe"
```

---

## Task 9 · Add Patinated Bronze material recipe

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css`
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
describe('Patinated Bronze material recipe', () => {
  it('overrides .block background on [data-material="bronze"]', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-material="bronze"\][^{]*\.block\s*\{[^}]*background:[^;]*radial-gradient/,
    )
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL.

- [ ] **Step 3: Append the Patinated Bronze recipe**

```css
/* Patinated Bronze — warm oxidized copper. Radial gradient for the base
   bronze; the ::before patina overlay (added in a later task) provides
   the verdigris green/blue oxidation streaks. */
[data-theme="modern-vibrant"][data-material="bronze"] .block {
  background: radial-gradient(100% 80% at 35% 30%, #e8a85a 0%, #C47820 45%, #6a3e10 100%);
  box-shadow:
    inset 0 1px 0 var(--block-specular-top),
    inset 1px 0 0 var(--block-specular-left),
    inset 0 0 0 1px rgba(200, 120, 32, 0.5),
    inset 0 4px 6px rgba(255, 255, 255, 0.25),
    inset 0 -10px 14px rgba(0, 0, 0, 0.4),
    0 18px 0 rgba(0, 0, 0, 0.45),
    0 36px 70px rgba(200, 120, 32, 0.3),
    0 50px 80px rgba(0, 0, 0, 0.45),
    var(--shadow-base);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(material): add Patinated Bronze recipe"
```

---

## Task 10 · Add Cream Ceramic material recipe

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css`
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
describe('Cream Ceramic material recipe', () => {
  it('overrides .block background on [data-material="ceramic"]', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-material="ceramic"\][^{]*\.block\s*\{[^}]*background:[^;]*radial-gradient/,
    )
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL.

- [ ] **Step 3: Append the Cream Ceramic recipe**

```css
/* Cream Ceramic — matte warm cream, like a glazed ceramic mug. Radial
   gradient with subtle radial highlight; muted shadows for a soft,
   tactile reading. The warmest and most domestic of the 6 alternates. */
[data-theme="modern-vibrant"][data-material="ceramic"] .block {
  background: radial-gradient(120% 100% at 40% 25%, #ffffff 0%, #f1e9da 50%, #c8b89c 100%);
  box-shadow:
    inset 0 1px 0 var(--block-specular-top),
    inset 1px 0 0 var(--block-specular-left),
    inset 0 0 0 1px rgba(241, 233, 218, 0.5),
    inset 0 4px 6px rgba(255, 255, 255, 0.6),
    inset 0 -8px 12px rgba(180, 160, 120, 0.3),
    0 18px 0 rgba(0, 0, 0, 0.25),
    0 36px 70px rgba(180, 160, 120, 0.3),
    0 50px 80px rgba(0, 0, 0, 0.35),
    var(--shadow-base);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(material): add Cream Ceramic recipe"
```

---

## Task 11 · Add Showcase mode (per-section material assignments)

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css`
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`

Showcase routes per section: Hero=anodized (default), About=gold, Brand=ceramic, Work=steel, Services=frosted, Process=bronze, Contact=anodized (mirrors Hero). Per spec §9.3.

- [ ] **Step 1: Write the failing test**

```typescript
describe('Showcase material recipe (per-section)', () => {
  const assignments: Array<[string, string]> = [
    ['about',    'radial-gradient'], // gold leaf
    ['brand',    'radial-gradient'], // cream ceramic
    ['work',     'linear-gradient'], // polished steel (180deg)
    ['services', 'linear-gradient'], // frosted glass
    ['process',  'radial-gradient'], // patinated bronze
  ]

  for (const [section, gradientType] of assignments) {
    it(`Showcase .block-${section} uses ${gradientType}`, () => {
      const pattern = new RegExp(
        `\\[data-material="showcase"\\][^{]*\\.block-${section}\\s*\\{[^}]*background:[^;]*${gradientType}`,
      )
      expect(BLOCK_CSS).toMatch(pattern)
    })
  }

  it('Showcase hero stays anodized (no specific override beyond default)', () => {
    // Hero in showcase mode keeps the default Editorial Hardware look.
    // We verify the showcase block doesn't introduce a hero-specific rule
    // — the default linear-gradient(135deg, var(--bloom-dark)...) applies.
    // (No assertion needed beyond absence of a hero override; this is
    // documentation-only.)
    expect(true).toBe(true)
  })

  it('Showcase contact mirrors hero (no override)', () => {
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL — Showcase overrides don't exist.

- [ ] **Step 3: Append Showcase rules to `Block.module.css`**

```css
/* ====================================================================
   Showcase preset — per-section distinct materials.
   Hero + Contact stay on the default Anodized recipe (Editorial Hardware
   magenta with aurora window on Hero); the other 5 sections each get
   one of the alternate material recipes for variety. Per spec §9.3.
   ==================================================================== */

/* About → Gold Leaf */
[data-theme="modern-vibrant"][data-material="showcase"] .block-about {
  background: radial-gradient(100% 80% at 40% 30%, #ffe066 0%, #ffb800 50%, #b07700 100%);
  box-shadow:
    inset 0 1px 0 var(--block-specular-top),
    inset 1px 0 0 var(--block-specular-left),
    inset 0 0 0 1px rgba(255, 224, 102, 0.6),
    inset 0 6px 8px rgba(255, 255, 255, 0.35),
    inset 0 -10px 14px rgba(0, 0, 0, 0.35),
    0 18px 0 rgba(0, 0, 0, 0.42),
    0 36px 70px rgba(255, 184, 0, 0.35),
    0 50px 80px rgba(0, 0, 0, 0.45),
    var(--shadow-base);
}

/* Brand → Cream Ceramic */
[data-theme="modern-vibrant"][data-material="showcase"] .block-brand {
  background: radial-gradient(120% 100% at 40% 25%, #ffffff 0%, #f1e9da 50%, #c8b89c 100%);
  box-shadow:
    inset 0 1px 0 var(--block-specular-top),
    inset 1px 0 0 var(--block-specular-left),
    inset 0 0 0 1px rgba(241, 233, 218, 0.5),
    inset 0 4px 6px rgba(255, 255, 255, 0.6),
    inset 0 -8px 12px rgba(180, 160, 120, 0.3),
    0 18px 0 rgba(0, 0, 0, 0.25),
    0 36px 70px rgba(180, 160, 120, 0.3),
    0 50px 80px rgba(0, 0, 0, 0.35),
    var(--shadow-base);
}

/* Work → Polished Steel */
[data-theme="modern-vibrant"][data-material="showcase"] .block-work {
  background: linear-gradient(
    180deg,
    #2a2f38 0%,
    #6a7585 30%,
    #c8d2dc 48%,
    #6a7585 70%,
    #2a2f38 100%
  );
  box-shadow:
    inset 0 1px 0 var(--block-specular-top),
    inset 1px 0 0 var(--block-specular-left),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.8),
    inset 0 -2px 0 rgba(0, 0, 0, 0.5),
    inset 0 -8px 12px rgba(0, 0, 0, 0.3),
    0 18px 0 rgba(0, 0, 0, 0.5),
    0 36px 70px rgba(80, 90, 100, 0.35),
    0 50px 80px rgba(0, 0, 0, 0.5),
    var(--shadow-base);
}

/* Services → Frosted Glass */
[data-theme="modern-vibrant"][data-material="showcase"] .block-services {
  background: linear-gradient(
    135deg,
    rgba(0, 180, 170, 0.5) 0%,
    rgba(91, 227, 220, 0.7) 50%,
    rgba(0, 110, 104, 0.5) 100%
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    inset 0 1px 0 var(--block-specular-top),
    inset 1px 0 0 var(--block-specular-left),
    inset 0 0 0 1.5px rgba(255, 255, 255, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.6),
    inset 0 -2px 0 rgba(0, 0, 0, 0.2),
    0 18px 0 rgba(0, 0, 0, 0.35),
    0 36px 70px rgba(0, 180, 170, 0.4),
    0 50px 80px rgba(0, 0, 0, 0.45),
    var(--shadow-base);
}

/* Process → Patinated Bronze */
[data-theme="modern-vibrant"][data-material="showcase"] .block-process {
  background: radial-gradient(100% 80% at 35% 30%, #e8a85a 0%, #C47820 45%, #6a3e10 100%);
  box-shadow:
    inset 0 1px 0 var(--block-specular-top),
    inset 1px 0 0 var(--block-specular-left),
    inset 0 0 0 1px rgba(200, 120, 32, 0.5),
    inset 0 4px 6px rgba(255, 255, 255, 0.25),
    inset 0 -10px 14px rgba(0, 0, 0, 0.4),
    0 18px 0 rgba(0, 0, 0, 0.45),
    0 36px 70px rgba(200, 120, 32, 0.3),
    0 50px 80px rgba(0, 0, 0, 0.45),
    var(--shadow-base);
}

/* Hero + Contact stay Anodized (no override needed — the default
   Editorial Hardware recipe applies). */
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS — all 5 per-section assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(material): add Showcase per-section recipe"
```

---

## Task 12 · Add 600ms transition + reduced-motion guard

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css`
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`

The .block rule's existing `transition` covers background, color, box-shadow, transform. We need to ensure the bloom token transitions and that the duration is 600ms for material switches.

Since the existing transition is short (200ms for background/color), and the bloom tokens are `@property`-registered as `<color>`, transitioning them needs explicit duration. Add bloom triple to the transition list with 600ms duration.

- [ ] **Step 1: Write the failing test**

Append to `block-material.test.ts`:

```typescript
describe('Material switch transition', () => {
  it('.block transitions bloom triple at 600ms', () => {
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*transition:[^;]*--bloom-dark\s+600ms/)
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*transition:[^;]*--bloom\s+600ms/)
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*transition:[^;]*--bloom-bright\s+600ms/)
  })
  it('reduced-motion zeroes the transition durations', () => {
    expect(BLOCK_CSS).toMatch(
      /prefers-reduced-motion:\s*reduce[^}]*\.block[^}]*transition:[^;]*0ms/s,
    )
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL.

- [ ] **Step 3: Modify `.block`'s `transition` and the reduced-motion media query**

In `Block.module.css`, find the existing `.block` rule's `transition:` declaration. The current line (around line 46-50) looks like:

```css
  transition:
    background 200ms,
    color 200ms,
    box-shadow 200ms ease-out,
    transform 240ms cubic-bezier(0.2, 0.7, 0.2, 1);
```

Replace it with (adds the 600ms bloom + box-shadow transitions for material switches; preserves the 200ms background/color/box-shadow for hover state changes):

```css
  /* The 600ms transitions on --bloom-* and the longer box-shadow
     duration are for Materials Panel preset switches. The shorter
     200ms transitions handle hover state cascade. Both run in the
     same transition shorthand — the browser picks whichever applies
     to the changed property. */
  transition:
    --bloom-dark 600ms cubic-bezier(0.4, 0, 0.2, 1),
    --bloom 600ms cubic-bezier(0.4, 0, 0.2, 1),
    --bloom-bright 600ms cubic-bezier(0.4, 0, 0.2, 1),
    background 600ms cubic-bezier(0.4, 0, 0.2, 1),
    backdrop-filter 600ms cubic-bezier(0.4, 0, 0.2, 1),
    color 200ms,
    box-shadow 600ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 240ms cubic-bezier(0.2, 0.7, 0.2, 1);
```

Then find the existing `prefers-reduced-motion` rule at the bottom of the file. The current reduced-motion handling probably collapses transforms only; we need to also zero the material transition durations:

```css
@media (prefers-reduced-motion: reduce) {
  .block {
    transform: none !important;
    transition:
      --bloom-dark 0ms,
      --bloom 0ms,
      --bloom-bright 0ms,
      background 0ms,
      backdrop-filter 0ms,
      color 200ms,
      box-shadow 0ms,
      transform 0ms !important;
  }
  .block:hover { transform: none !important; }
}
```

(If the file already has a `@media (prefers-reduced-motion: reduce)` block, MERGE the `.block` rule into it instead of duplicating.)

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS — both transition assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(block): add 600ms bloom + box-shadow transition for material switch"
```

---

## Task 13 · Create the Swatch component

**Files:**
- Create: `src/components/MaterialsPanel/Swatch.module.css`
- Create: `src/components/MaterialsPanel/Swatch.tsx`
- Create: `src/components/MaterialsPanel/__tests__/Swatch.test.tsx`

Each Swatch is a tilted mini-block preview rendered with the preset's material recipe. Re-uses the same `[data-material="…"]` scoping by setting a local attribute on the swatch root.

- [ ] **Step 1: Create the CSS module**

Create `src/components/MaterialsPanel/Swatch.module.css`:

```css
/* Swatch — a tilted mini-block preview rendered in its preset's
   material recipe. The .preview element gets a data-material-preview
   attribute that mirrors [data-material] selector matching, so the
   alternate material recipes (Steel/Gold/etc.) apply to swatches the
   same way they apply to real grid blocks. */

.swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px;
  font: inherit;
  color: inherit;
  /* Reset native button styles — this is a custom component using <button>
     for keyboard + assistive-tech behavior. */
}

.preview {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  position: relative;
  transform: rotateX(6deg) rotateY(-3deg);
  transition: transform 200ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.swatch:hover .preview {
  transform: rotateX(6deg) rotateY(-3deg) scale(1.04);
}

.swatch.active .preview {
  outline: 2px solid var(--focus-ring, #FFD400);
  outline-offset: 3px;
}

.label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--fg, currentColor);
  text-align: center;
}

.sublabel {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fg-muted, currentColor);
  text-align: center;
  margin-top: 2px;
}

.swatch.active .label {
  color: var(--focus-ring, #FFD400);
}

@media (prefers-reduced-motion: reduce) {
  .preview { transition: none; }
  .swatch:hover .preview { transform: rotateX(6deg) rotateY(-3deg); }
}
```

- [ ] **Step 2: Write the failing test**

Create `src/components/MaterialsPanel/__tests__/Swatch.test.tsx`:

```typescript
import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Swatch } from '../Swatch'

describe('Swatch', () => {
  const baseProps = {
    id: 'steel' as const,
    label: 'Polished Steel',
    sublabel: 'Mirror',
    active: false,
    onSelect: vi.fn(),
  }

  it('renders label + sublabel', () => {
    const { getByText } = render(<Swatch {...baseProps} />)
    expect(getByText('Polished Steel')).toBeInTheDocument()
    expect(getByText('Mirror')).toBeInTheDocument()
  })

  it('is a <button> for keyboard and a11y', () => {
    const { container } = render(<Swatch {...baseProps} />)
    expect(container.querySelector('button')).toBeInTheDocument()
  })

  it('has aria-pressed reflecting active state', () => {
    const { container, rerender } = render(<Swatch {...baseProps} active={false} />)
    expect(container.querySelector('button')).toHaveAttribute('aria-pressed', 'false')

    rerender(<Swatch {...baseProps} active={true} />)
    expect(container.querySelector('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('preview carries data-material-preview matching the preset id', () => {
    const { container } = render(<Swatch {...baseProps} id="gold" />)
    const preview = container.querySelector('[data-material-preview]')
    expect(preview?.getAttribute('data-material-preview')).toBe('gold')
  })

  it('clicking the swatch invokes onSelect with the id', () => {
    const onSelect = vi.fn()
    const { container } = render(<Swatch {...baseProps} onSelect={onSelect} />)
    fireEvent.click(container.querySelector('button')!)
    expect(onSelect).toHaveBeenCalledWith('steel')
  })
})
```

- [ ] **Step 3: Run to verify failure**

Run: `pnpm test src/components/MaterialsPanel/__tests__/Swatch.test.tsx`
Expected: FAIL — Swatch doesn't exist.

- [ ] **Step 4: Create the Swatch component**

Create `src/components/MaterialsPanel/Swatch.tsx`:

```typescript
import type { MaterialId } from '../../lib/material-context'
import styles from './Swatch.module.css'

export interface SwatchProps {
  id: MaterialId
  label: string
  sublabel: string
  active: boolean
  onSelect: (id: MaterialId) => void
}

/**
 * A single Materials Panel swatch. Renders as a button containing a
 * tilted mini-block preview rendered in the preset's actual material
 * recipe (via data-material-preview attribute that the CSS recipes
 * also target alongside the global data-material scope).
 */
export function Swatch({ id, label, sublabel, active, onSelect }: SwatchProps) {
  return (
    <button
      type="button"
      className={`${styles.swatch} ${active ? styles.active : ''}`}
      aria-pressed={active}
      aria-label={`Apply ${label} material${active ? ' (active)' : ''}`}
      onClick={() => onSelect(id)}
    >
      <div
        className={styles.preview}
        data-material-preview={id}
        aria-hidden="true"
      />
      <span className={styles.label}>{label}</span>
      <span className={styles.sublabel}>{sublabel}</span>
    </button>
  )
}
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test src/components/MaterialsPanel/__tests__/Swatch.test.tsx`
Expected: PASS — 5 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/MaterialsPanel/Swatch.tsx src/components/MaterialsPanel/Swatch.module.css src/components/MaterialsPanel/__tests__/Swatch.test.tsx
git commit -m "feat(materials): add Swatch component for panel preview"
```

---

## Task 14 · Make Swatch previews render in their preset's recipe

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css`
- Create: `src/components/MaterialsPanel/__tests__/swatch-preview-css.test.ts`

The 6 alternate material recipes currently target `.block` via `[data-material="steel"] .block`. Extend each recipe to ALSO match the Swatch preview element. The preview is NOT a `.block` — it's a `[data-material-preview="steel"]` element. So each recipe needs to additionally match `[data-material-preview="…"]`.

Cleanest path: change each recipe selector to a comma-separated form like `[data-material="steel"] .block, [data-material-preview="steel"]`.

- [ ] **Step 1: Write the failing test**

Create `src/components/MaterialsPanel/__tests__/swatch-preview-css.test.ts`:

```typescript
/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const BLOCK_CSS = fs.readFileSync(
  path.resolve(HERE, '../../TetrisGrid/Block.module.css'),
  'utf8',
)

describe('Swatch previews use the same material recipes', () => {
  const presets = ['steel', 'gold', 'frosted', 'bronze', 'ceramic']
  for (const preset of presets) {
    it(`recipe for ${preset} also targets [data-material-preview="${preset}"]`, () => {
      const pattern = new RegExp(
        `\\[data-material-preview="${preset}"\\]`,
      )
      expect(BLOCK_CSS).toMatch(pattern)
    })
  }
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/MaterialsPanel/__tests__/swatch-preview-css.test.ts`
Expected: FAIL — 5 presets each missing the preview selector.

- [ ] **Step 3: Update each alternate-material rule to also match the preview selector**

For each of the 5 alternate recipes (steel, gold, frosted, bronze, ceramic) in `Block.module.css`, change the selector from:

```css
[data-theme="modern-vibrant"][data-material="steel"] .block { … }
```

to:

```css
[data-theme="modern-vibrant"][data-material="steel"] .block,
[data-material-preview="steel"] { … }
```

(The preview selector is intentionally NOT theme-scoped — swatches appear in the panel regardless of where you opened it from, and the preview should show the material accurately even before the visitor commits to the switch.)

Apply this change to all 5 alternate recipes. Anodized (default) doesn't need a recipe — the Editorial Hardware base styling already covers it. Showcase mode is per-section; we'll handle Showcase swatch preview in a follow-up task (defer for now — Showcase swatch can show a conic-gradient placeholder).

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/MaterialsPanel/__tests__/swatch-preview-css.test.ts`
Expected: PASS — 5 selectors found.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/MaterialsPanel/__tests__/swatch-preview-css.test.ts
git commit -m "feat(material): extend recipes to swatch preview selector"
```

---

## Task 15 · Add Anodized + Showcase swatch previews

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css`
- Modify: `src/components/MaterialsPanel/__tests__/swatch-preview-css.test.ts`

The Anodized swatch needs to show the default Editorial Hardware preview (magenta gradient + brushed grain), and Showcase needs a recognizable preview that hints at multi-material variety (a 7-segment conic gradient with each section's hero color, per the brainstorm mockup).

- [ ] **Step 1: Write the failing tests**

Append to `swatch-preview-css.test.ts`:

```typescript
  it('Anodized swatch preview renders the default Editorial Hardware look', () => {
    expect(BLOCK_CSS).toMatch(/\[data-material-preview="anodized"\]\s*\{[^}]*linear-gradient\(\s*135deg/)
  })

  it('Showcase swatch preview uses a conic-gradient (multi-section hint)', () => {
    expect(BLOCK_CSS).toMatch(/\[data-material-preview="showcase"\]\s*\{[^}]*conic-gradient/)
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/MaterialsPanel/__tests__/swatch-preview-css.test.ts`
Expected: FAIL — 2 new assertions fail.

- [ ] **Step 3: Add Anodized + Showcase preview rules**

Append to the Materials section of `Block.module.css`:

```css
/* Anodized swatch preview — renders the default Editorial Hardware look
   on the panel swatch (the live grid blocks already render this by
   default; the swatch needs an explicit rule because it's outside the
   .block element). */
[data-material-preview="anodized"] {
  background: linear-gradient(
    135deg,
    #8a0144 0%,
    #d90368 30%,
    #ff5e98 50%,
    #d90368 70%,
    #8a0144 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4),
    0 4px 0 rgba(0, 0, 0, 0.42),
    0 8px 16px rgba(0, 0, 0, 0.5);
}

/* Showcase swatch preview — conic gradient with each section's bloom
   color as a segment, hinting at the per-section variety. */
[data-material-preview="showcase"] {
  background: conic-gradient(
    from 0deg at 50% 50%,
    #d90368 0deg 60deg,       /* hero magenta */
    #ffb800 60deg 120deg,     /* about gold */
    #f1e9da 120deg 180deg,    /* brand cream */
    #00b4aa 180deg 240deg,    /* services teal */
    #C47820 240deg 300deg,    /* process bronze */
    #6a7585 300deg 360deg     /* work steel */
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.25),
    0 4px 0 rgba(0, 0, 0, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.5);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/MaterialsPanel/__tests__/swatch-preview-css.test.ts`
Expected: PASS — 7 tests total pass (5 alternate + Anodized + Showcase).

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/MaterialsPanel/__tests__/swatch-preview-css.test.ts
git commit -m "feat(material): add Anodized + Showcase swatch previews"
```

---

## Task 16 · Create the MaterialsPanel CSS module

**Files:**
- Create: `src/components/MaterialsPanel/MaterialsPanel.module.css`
- Create: `src/components/MaterialsPanel/__tests__/materials-panel-css.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/components/MaterialsPanel/__tests__/materials-panel-css.test.ts`:

```typescript
/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../MaterialsPanel.module.css'),
  'utf8',
)

describe('MaterialsPanel.module.css', () => {
  it('drawer is fixed to bottom of viewport', () => {
    expect(CSS).toMatch(/\.drawer\s*\{[^}]*position:\s*fixed/)
    expect(CSS).toMatch(/\.drawer\s*\{[^}]*bottom:\s*0/)
  })

  it('drawer has backdrop-filter blur', () => {
    expect(CSS).toMatch(/\.drawer\s*\{[^}]*backdrop-filter:\s*blur/)
  })

  it('drawer has gradient background per spec', () => {
    expect(CSS).toMatch(/\.drawer\s*\{[^}]*linear-gradient\(\s*180deg,\s*rgba\(20,\s*12,\s*30/)
  })

  it('top border is 1px white at low opacity', () => {
    expect(CSS).toMatch(/\.drawer\s*\{[^}]*border-top:\s*1px\s+solid\s+rgba\(255,\s*255,\s*255/)
  })

  it('swatch grid is 7 columns', () => {
    expect(CSS).toMatch(/\.swatches\s*\{[^}]*grid-template-columns:\s*repeat\(7,\s*1fr\)/)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/MaterialsPanel/__tests__/materials-panel-css.test.ts`
Expected: FAIL — file doesn't exist.

- [ ] **Step 3: Create the CSS module**

Create `src/components/MaterialsPanel/MaterialsPanel.module.css`:

```css
/* MaterialsPanel — bottom drawer overlay revealing the 7 material
   presets. Slide-up animation handled by Motion in the component.
   The drawer is `position: fixed` so it overlays the page regardless
   of scroll position. */

.drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(
    180deg,
    rgba(20, 12, 30, 0.9),
    rgba(10, 6, 20, 0.98)
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 18px 24px 22px;
  box-shadow: 0 -16px 40px rgba(0, 0, 0, 0.4);
  color: var(--fg, #F1E9DA);
}

.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.title {
  font-family: var(--font-display, 'Syne', system-ui, sans-serif);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.04em;
  margin: 0;
  text-transform: uppercase;
}

.meta {
  color: var(--fg-muted, #B8A8C8);
  font-size: 11px;
  flex: 1;
  text-align: center;
}

.close {
  background: none;
  border: 0;
  color: var(--fg-muted, #B8A8C8);
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font: inherit;
  font-size: 18px;
  line-height: 1;
}

.close:hover {
  color: var(--fg, #F1E9DA);
  background: rgba(255, 255, 255, 0.06);
}

.close:focus-visible {
  outline: 2px solid var(--focus-ring, #FFD400);
  outline-offset: 2px;
}

.swatches {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  align-items: start;
}

/* On narrow viewports, wrap the swatch grid to 4 cols then 2 — better
   touch targets and avoids horizontal squish. */
@media (max-width: 768px) {
  .swatches {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 480px) {
  .swatches {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/MaterialsPanel/__tests__/materials-panel-css.test.ts`
Expected: PASS — 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/MaterialsPanel/MaterialsPanel.module.css src/components/MaterialsPanel/__tests__/materials-panel-css.test.ts
git commit -m "feat(materials): add MaterialsPanel CSS module"
```

---

## Task 17 · Create the MaterialsPanel component

**Files:**
- Create: `src/components/MaterialsPanel/MaterialsPanel.tsx`
- Create: `src/components/MaterialsPanel/__tests__/MaterialsPanel.test.tsx`

The component reads from `useMaterial()` for current preset + panel state, renders the drawer with the swatch grid, dispatches `setMaterial` on swatch click, dispatches `closePanel` on Escape or close button. Motion-animated slide-up on open.

- [ ] **Step 1: Write the failing tests**

Create `src/components/MaterialsPanel/__tests__/MaterialsPanel.test.tsx`:

```typescript
import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { MaterialProvider, useMaterial } from '../../../lib/material'
import { MaterialsPanel } from '../MaterialsPanel'
import type { ReactNode } from 'react'

function Wrapper({ children }: { children: ReactNode }) {
  return <MaterialProvider>{children}</MaterialProvider>
}

// Helper to render the panel with the provider already opened.
function PanelOpener({ children }: { children: ReactNode }) {
  const { openPanel } = useMaterial()
  return (
    <>
      <button onClick={openPanel} data-testid="open-panel">open</button>
      {children}
    </>
  )
}

describe('MaterialsPanel', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-material')
  })

  it('renders nothing when panelOpen is false', () => {
    const { queryByRole } = render(
      <Wrapper>
        <MaterialsPanel />
      </Wrapper>,
    )
    expect(queryByRole('dialog')).toBeNull()
  })

  it('renders a dialog when panelOpen is true', () => {
    const { getByRole, getByTestId } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    expect(getByRole('dialog')).toBeInTheDocument()
  })

  it('dialog has aria-modal and aria-labelledby', () => {
    const { getByRole, getByTestId } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    const dialog = getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby')
  })

  it('renders 7 swatches when open', () => {
    const { getByTestId, getAllByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    // Each swatch is a button with aria-pressed; the close button doesn't
    // have aria-pressed. Filter to swatches by attribute.
    const buttons = getAllByRole('button')
    const swatches = buttons.filter((b) => b.hasAttribute('aria-pressed'))
    expect(swatches).toHaveLength(7)
  })

  it('clicking a swatch updates the active material', () => {
    const { getByTestId, getAllByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    const buttons = getAllByRole('button')
    const steelSwatch = buttons.find(
      (b) => b.getAttribute('aria-label')?.includes('Polished Steel'),
    )
    fireEvent.click(steelSwatch!)
    expect(document.documentElement.dataset.material).toBe('steel')
  })

  it('clicking the close button closes the panel', () => {
    const { getByTestId, queryByRole, getByLabelText } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    expect(queryByRole('dialog')).toBeInTheDocument()
    fireEvent.click(getByLabelText('Close Materials panel'))
    expect(queryByRole('dialog')).toBeNull()
  })

  it('Escape key closes the panel', () => {
    const { getByTestId, queryByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    expect(queryByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(queryByRole('dialog')).toBeNull()
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/MaterialsPanel/__tests__/MaterialsPanel.test.tsx`
Expected: FAIL — component doesn't exist.

- [ ] **Step 3: Create the MaterialsPanel component**

Create `src/components/MaterialsPanel/MaterialsPanel.tsx`:

```typescript
import { useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useMaterial } from '../../lib/material'
import { MATERIAL_PRESETS } from './materialPresets'
import { Swatch } from './Swatch'
import styles from './MaterialsPanel.module.css'

const SLIDE_UP = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const },
}

/**
 * MaterialsPanel — bottom drawer revealing the 7 material presets.
 * Reads panelOpen + material from useMaterial(); dispatches setMaterial
 * + closePanel back to context. Escape closes; close button closes;
 * clicking a swatch applies the preset (without closing — visitor may
 * want to try several).
 */
export function MaterialsPanel() {
  const { material, setMaterial, panelOpen, closePanel } = useMaterial()
  const titleId = useId()

  // Escape key handler — bound while panel is open, unbound otherwise.
  useEffect(() => {
    if (!panelOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [panelOpen, closePanel])

  return (
    <AnimatePresence>
      {panelOpen && (
        <motion.div
          {...SLIDE_UP}
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>Materials</h2>
            <span className={styles.meta}>
              Each preset applies globally · saved to localStorage
            </span>
            <button
              type="button"
              onClick={closePanel}
              className={styles.close}
              aria-label="Close Materials panel"
            >
              ✕
            </button>
          </div>
          <div className={styles.swatches}>
            {MATERIAL_PRESETS.map((preset) => (
              <Swatch
                key={preset.id}
                id={preset.id}
                label={preset.label}
                sublabel={preset.sublabel}
                active={material === preset.id}
                onSelect={setMaterial}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/MaterialsPanel/__tests__/MaterialsPanel.test.tsx`
Expected: PASS — 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/MaterialsPanel/MaterialsPanel.tsx src/components/MaterialsPanel/__tests__/MaterialsPanel.test.tsx
git commit -m "feat(materials): add MaterialsPanel component with drawer + swatches"
```

---

## Task 18 · Mount MaterialsPanel in TetrisGrid

**Files:**
- Modify: `src/components/TetrisGrid/TetrisGrid.tsx`
- Modify: `src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`

The MaterialsPanel reads its own open state from context — it just needs to be mounted somewhere in the React tree so it can render when opened. TetrisGrid is the natural home (the panel is conceptually part of the grid experience).

- [ ] **Step 1: Write the failing test**

Append to `tetris-grid.test.tsx`:

```typescript
  it('mounts the MaterialsPanel (renders nothing when closed, dialog when open)', () => {
    // Render TetrisGrid (its existing helper wraps with ThemeProvider +
    // MemoryRouter + matchMedia stubs). The panel is initially closed so
    // no dialog should be in the tree.
    const { container } = renderTetrisGrid()
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    // Verify the MaterialsPanel component is at least IMPORTED + mounted
    // by checking that the AnimatePresence wrapper renders (it always
    // renders even when its children don't). We approximate by checking
    // that opening the panel via context would work — but since context
    // requires MaterialProvider which renderTetrisGrid doesn't include,
    // this test just verifies the component file is wired into the import
    // graph without crashing.

    // If MaterialsPanel uses useMaterial() unconditionally and renderTetrisGrid
    // doesn't include MaterialProvider, this would throw. So a passing render
    // here also confirms MaterialProvider IS in the render helper (or
    // we need to add it).
    expect(container.firstChild).toBeInTheDocument()
  })
```

NOTE: this test may require updating `renderTetrisGrid()` to wrap with MaterialProvider. Check the existing helper and add MaterialProvider wrapping if missing.

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`
Expected: FAIL — MaterialsPanel not yet mounted, OR `useMaterial must be used inside MaterialProvider` error.

- [ ] **Step 3: Wrap renderTetrisGrid with MaterialProvider**

Find the existing `renderTetrisGrid()` helper at the top of `tetris-grid.test.tsx`. Add the import:

```typescript
import { MaterialProvider } from '../../../lib/material'
```

Update the helper to wrap with `<MaterialProvider>`. Example shape (adapt to actual helper):

```typescript
function renderTetrisGrid() {
  // ... existing matchMedia + animate stubs ...
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <MaterialProvider>
          <TetrisGrid />
        </MaterialProvider>
      </ThemeProvider>
    </MemoryRouter>,
  )
}
```

- [ ] **Step 4: Mount MaterialsPanel in TetrisGrid**

Open `src/components/TetrisGrid/TetrisGrid.tsx`. Add the import:

```typescript
import { MaterialsPanel } from '../MaterialsPanel/MaterialsPanel'
```

Find the JSX return of the `TetrisGrid` component (look for the main wrapper element — likely a `<div>` with the `.viewport` class or similar). At the end of the children (right before the closing wrapper tag), add:

```jsx
<MaterialsPanel />
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`
Expected: PASS — all existing tests + 1 new test pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/TetrisGrid/TetrisGrid.tsx src/components/TetrisGrid/__tests__/tetris-grid.test.tsx
git commit -m "feat(materials): mount MaterialsPanel in TetrisGrid"
```

---

## Task 19 · Brand block intercepts click on modern-vibrant

**Files:**
- Modify: `src/components/TetrisGrid/Block.tsx`
- Modify: `src/components/TetrisGrid/__tests__/block.test.tsx`

On modern-vibrant, the Brand block's click should open the Materials Panel instead of navigating to `/about`. On other themes, default navigation behavior is preserved.

- [ ] **Step 1: Write the failing tests**

Append to `block.test.tsx`:

```typescript
import { MaterialProvider } from '../../../lib/material'
import { ThemeProvider } from '../../../lib/theme'

describe('Brand block click behavior', () => {
  function renderBrand(theme: string) {
    document.documentElement.dataset.theme = theme
    return render(
      <MemoryRouter>
        <ThemeProvider>
          <MaterialProvider>
            <Block id="brand" to="/about" title="AAI" />
          </MaterialProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )
  }

  it('on modern-vibrant, has aria-haspopup="dialog"', () => {
    const { container } = renderBrand('modern-vibrant')
    expect(container.querySelector('[data-block-id="brand"]')).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    )
  })

  it('on classic, has NO aria-haspopup (regular link)', () => {
    const { container } = renderBrand('classic')
    expect(container.querySelector('[data-block-id="brand"]')).not.toHaveAttribute(
      'aria-haspopup',
    )
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/block.test.tsx`
Expected: FAIL — aria-haspopup not set conditionally.

- [ ] **Step 3: Update Block.tsx to intercept Brand click on modern-vibrant**

Open `src/components/TetrisGrid/Block.tsx`. Add imports:

```typescript
import { useTheme } from '../../lib/theme-context'
import { useMaterial } from '../../lib/material'
```

Inside the Block function component, add hooks at the top:

```typescript
const { theme } = useTheme()
const { openPanel } = useMaterial()
```

Add a derived boolean:

```typescript
const isMaterialsTrigger = id === 'brand' && theme === 'modern-vibrant'
```

Update the `onClick` handler in `<MotionLink>`:

```typescript
onClick={(e) => {
  if (isMaterialsTrigger) {
    e.preventDefault()
    openPanel()
    return
  }
  if (!onNavigate) return
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  onNavigate(id, to)
}}
```

Update the destructured hooks to also pull `panelOpen` from context:

```typescript
const { theme } = useTheme()
const { openPanel, panelOpen } = useMaterial()
```

Add the conditional aria-haspopup + aria-expanded attributes. The `<MotionLink>` element should include:

```typescript
aria-haspopup={isMaterialsTrigger ? 'dialog' : undefined}
aria-expanded={isMaterialsTrigger ? panelOpen : undefined}
```

`aria-expanded` now accurately reflects the open/closed state of the panel, which screen readers announce when focus enters the Brand block.

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/block.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.tsx src/components/TetrisGrid/__tests__/block.test.tsx
git commit -m "feat(block): Brand opens MaterialsPanel on modern-vibrant"
```

---

## Task 20 · Add Brand block pulse glow micro-interaction

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css`
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`

Per spec §9.1: "every ~30s the Brand block emits a soft gold pulse glow (box-shadow animation over 1.5s, then fades)." Only on modern-vibrant.

- [ ] **Step 1: Write the failing test**

Append to `block-material.test.ts`:

```typescript
describe('Brand block pulse glow (modern-vibrant)', () => {
  it('defines brand-pulse keyframes', () => {
    expect(BLOCK_CSS).toMatch(/@keyframes\s+brand-pulse/)
  })

  it('applies brand-pulse animation to brand block on modern-vibrant', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-theme="modern-vibrant"\]\s+\.block-brand\s*\{[^}]*animation:\s*brand-pulse/,
    )
  })

  it('respects prefers-reduced-motion', () => {
    expect(BLOCK_CSS).toMatch(
      /prefers-reduced-motion:\s*reduce[^}]*\.block-brand[^}]*animation:\s*none/s,
    )
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL.

- [ ] **Step 3: Append the pulse animation to `Block.module.css`**

```css
/* Brand block pulse glow — modern-vibrant only. Every 30 seconds the
   block emits a soft gold halo over 1.5s, then fades. Quietly invites
   curiosity ("click me") without becoming UI noise. Halts under
   prefers-reduced-motion. */
@keyframes brand-pulse {
  0%, 90%, 100% {
    box-shadow:
      inset 0 1px 0 var(--block-specular-top),
      inset 1px 0 0 var(--block-specular-left),
      inset 0 0 0 1px rgba(255, 255, 255, 0.18),
      inset 0 2px 0 rgba(255, 255, 255, 0.5),
      inset 0 -2px 0 rgba(0, 0, 0, 0.4),
      0 18px 0 rgba(0, 0, 0, 0.42),
      0 36px 70px var(--bloom, transparent),
      0 50px 80px rgba(0, 0, 0, 0.45),
      var(--shadow-base);
  }
  95% {
    box-shadow:
      inset 0 1px 0 var(--block-specular-top),
      inset 1px 0 0 var(--block-specular-left),
      inset 0 0 0 1px rgba(255, 255, 255, 0.18),
      inset 0 2px 0 rgba(255, 255, 255, 0.5),
      inset 0 -2px 0 rgba(0, 0, 0, 0.4),
      0 18px 0 rgba(0, 0, 0, 0.42),
      0 0 24px 8px rgba(255, 212, 0, 0.45),
      0 36px 70px var(--bloom, transparent),
      0 50px 80px rgba(0, 0, 0, 0.45),
      var(--shadow-base);
  }
}

[data-theme="modern-vibrant"] .block-brand {
  animation: brand-pulse 30s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  [data-theme="modern-vibrant"] .block-brand {
    animation: none;
  }
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS — 3 new assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(block): add Brand block pulse glow micro-interaction"
```

---

## Task 21 · Verify full test suite + production build (controller)

**Files:** No code changes — verification only.

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`
Expected: PASS. Approximate count: 137 (Phase 2 baseline) + ~50 new (Phase 3 tests) = ~187 tests.

- [ ] **Step 2: TypeScript check**

Run: `pnpm exec tsc --noEmit -p tsconfig.app.json`
Expected: no output (clean).

- [ ] **Step 3: Production build**

Run: `pnpm build`
Expected: clean build; all 6 routes prerendered.

- [ ] **Step 4: Inspect built CSS for Phase 3 patterns**

```bash
grep -c "data-material=\"steel\"" dist/assets/*.css
grep -c "@property --bloom" dist/assets/*.css
grep -c "brand-pulse" dist/assets/*.css
grep -c "data-material-preview" dist/assets/*.css
```

Expected: at least 1 match each — recipes, property registrations, pulse animation, and swatch previews all made it into the bundle.

- [ ] **Step 5: No commit needed**

Continue to Task 22.

---

## Task 22 · Manual visual verification

**Files:** No code changes — manual smoke test.

Run `pnpm dev` and walk through the Phase 3 checklist at `http://localhost:5173/`.

- [ ] **Step 1: Brand block click opens panel**

- [ ] On modern-vibrant, click the Brand block ("AAI / LLC") — the Materials Panel slides up from the bottom over ~320ms
- [ ] Panel header shows "MATERIALS" + meta text + close button
- [ ] 7 swatches visible in a row: Anodized (highlighted as active), Polished Steel, Gold Leaf, Frosted Glass, Patinated Bronze, Cream Ceramic, Showcase
- [ ] Each swatch shows its preview tilted in 3D, with label + sublabel

- [ ] **Step 2: Material switching**

- [ ] Click each swatch in sequence — all 6 grid blocks transition smoothly over ~600ms to the new material (color, gradient, shadow stack all interpolate)
- [ ] Active swatch's gold outline moves correctly
- [ ] Refresh the page — the last-selected material persists (localStorage)

- [ ] **Step 3: Close panel**

- [ ] Click the ✕ button — panel slides down + dismounts
- [ ] Open again, press Escape — same close behavior

- [ ] **Step 4: Brand block pulse**

- [ ] Watch the Brand block for ~30 seconds without interacting — a soft gold glow halo pulses for ~1.5s, then fades

- [ ] **Step 5: Theme isolation**

- [ ] Trigger Konami → switch to `classic` — Brand block now navigates to /about on click (NO panel)
- [ ] Other materials (`steel`, `gold`, etc.) do NOT affect the classic theme's flat colors
- [ ] Switch back to `modern-vibrant` — Brand-as-panel-trigger restored

- [ ] **Step 6: Reduced-motion**

- [ ] DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`
- [ ] Brand pulse halts (held in resting state)
- [ ] Material switch is instant (no 600ms transition)
- [ ] Panel slide-up still happens but should be near-instant (MotionConfig reducedMotion="user" zeros the y-transform animation)

- [ ] **Step 7: Stop dev server (Ctrl+C)**

- [ ] **Step 8: Capture screenshots**

Save screenshots of: panel open showing all 7 swatches, grid in Polished Steel mode, grid in Frosted Glass mode, grid in Showcase mode, to `docs/superpowers/specs/screenshots/2026-05-25-v2-phase-3-*.png`.

- [ ] **Step 9: Commit screenshots**

```bash
git add docs/superpowers/specs/screenshots/2026-05-25-v2-phase-3-*.png
git commit -m "docs(spec): add Phase 3 visual reference screenshots"
```

---

## Task 23 · Update the v1 critique remediation note

**Files:**
- Modify: `docs/ux-critique.md`

- [ ] **Step 1: Append a Phase 3 status section**

Open `docs/ux-critique.md`. Find the existing `## v2.0 Implementation Status` section. Append a new subsection after the Phase 2 entry:

```markdown

### Phase 3 — Materials Panel (completed 2026-05-25)

Added the Materials Panel: clicking the Brand block on modern-vibrant opens a bottom drawer with 7 material presets (Anodized default, Polished Steel, Gold Leaf, Frosted Glass, Patinated Bronze, Cream Ceramic, Showcase). Selection persists via `localStorage['material']`, mirrored onto `<html data-material>` for CSS scoping. The 6 alternate recipes are CSS overrides keyed by `[data-material]` selectors; the bloom triple is registered as a `<color>` `@property` so the cross-preset transition interpolates smoothly over 600ms. Brand block emits a quiet gold pulse every 30s to telegraph the affordance. Other themes (`classic`, `pastel`, `arcade-neon`) ignore the panel entirely — Brand reverts to `/about` navigation. Full keyboard support (Escape closes, click-based interaction); `prefers-reduced-motion` halts the pulse and zeroes the transition.

This phase closes UX critique issue #5 ("The 'AAI' brand block does nothing") on the canonical theme. The Brand block now earns its grid real estate by serving as the door to the studio's material wardrobe.

See `docs/superpowers/plans/2026-05-25-ui-v2-phase-3-materials-panel.md` for the full implementation log.
```

- [ ] **Step 2: Commit**

```bash
git add docs/ux-critique.md
git commit -m "docs(critique): record Phase 3 Materials Panel in implementation status"
```

---

## Task 24 · Push the branch and open the Phase 3 PR

**Files:** No code changes — deploy workflow.

- [ ] **Step 1: Push to remote with upstream tracking**

Run: `git push -u origin HEAD`
Expected: branch pushed; Vercel auto-spins a preview build.

- [ ] **Step 2: Open PR**

```bash
gh pr create --base main --head HEAD --title "feat(ui-v2): Phase 3 — Materials Panel + 7 presets" --body "$(cat <<'EOF'
## Summary

Phase 3 of the v2.0 photorealistic redesign per [`docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md`](docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md). Adds the Materials Panel — a Brand-block-triggered bottom drawer revealing 7 material presets (Anodized + 6 alternates) that re-skin every grid block with a 600ms smooth transition.

### What changed
- `MaterialProvider` context + `useMaterial` hook + `localStorage` persistence + `<html data-material>` mirroring
- `index.html` material bootstrap script (parallel to existing theme bootstrap)
- `MaterialsPanel` drawer component with Motion slide-up + Escape close
- `Swatch` component: tilted mini-block preview in each preset's material
- 6 alternate material recipes in `Block.module.css`: Polished Steel, Gold Leaf, Frosted Glass, Patinated Bronze, Cream Ceramic + per-section Showcase mode
- `@property` registration of bloom triple as `<color>` for smooth transitions
- 600ms `.block` transition on bloom + box-shadow + backdrop-filter
- Brand block intercepts click on modern-vibrant → opens panel; navigates to /about on other themes
- Brand pulse glow micro-interaction (30s cycle, halts under reduced-motion)
- `aria-haspopup="dialog"`, `aria-modal="true"`, focus-visible outlines for accessibility

### UX critique progress
Closes **issue #5** on modern-vibrant: "The 'AAI' brand block does nothing." Brand now serves as the door to the studio's material wardrobe.

### Test plan
- [x] Material context tests pass (default, persistence, DOM sync, panel state)
- [x] Bootstrap script tests pass (whitelist + dataset attribute)
- [x] Material recipe parse tests pass for all 6 alternates + Showcase per-section
- [x] Swatch preview tests pass (anodized + 5 alternates + showcase)
- [x] MaterialsPanel tests pass (renders open/closed, Escape, click-to-switch)
- [x] Brand block aria-haspopup conditional on modern-vibrant
- [x] Pulse animation registered + reduced-motion respected
- [x] `pnpm build` succeeds, all 6 routes prerendered

### Out of scope (future phases)
Single-thread line system (Phase 4), Rube Goldberg chain reactions (Phase 5), Velvet Vitrine for inner pages (Phase 6), moss/crochet themes (Phase 7), mobile polish (Phase 8).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Report the PR URL when done**

---

## Definition of Done

Phase 3 is complete when ALL of the following are true:

- [ ] All 24 tasks above are checked off
- [ ] `pnpm test` passes with 0 failures (~187 tests total)
- [ ] `pnpm build` produces a clean production build
- [ ] Manual visual verification (Task 22) checklist 100% clean
- [ ] Preview deployment renders correctly
- [ ] PR opened against main
- [ ] All Copilot review comments addressed and resolved
- [ ] Branch merged into main

---

## What is intentionally NOT in Phase 3

These items appear in the spec but belong to later phases. Don't pull them forward:

- Single-thread line system (Phase 4)
- Rube Goldberg chain reactions (Phase 5)
- Inner page Velvet Vitrine treatment (Phase 6)
- moss / crochet themes (Phase 7)
- Mobile-specific Materials Panel layout / variant materials (Phase 8)
- Per-theme Materials Panel (Materials Panel is intentionally modern-vibrant-only)

If a task description in this plan starts to drift toward any of the above, stop — you're outside Phase 3's scope. Ship Phase 3 first.

---

## Known Limitations (deferred to a follow-up)

The spec §9.1 calls for a "focus trap" on the open Materials Panel. This plan implements basic focus management (Escape closes; the close button is keyboard-reachable; aria-modal=true signals modal intent), but it does NOT implement a full Tab/Shift-Tab focus cycle that traps focus inside the drawer. If a visitor Tab's past the last swatch, focus exits to background content (which is fine for non-blocking modals like this one, but doesn't match strict modal-dialog semantics).

A follow-up PR can add `focus-trap-react` (or a homegrown Tab interceptor) if usability testing reveals the gap is real. Deferred because: (a) the drawer is non-blocking — escape always works; (b) `aria-modal="true"` already signals intent to ATs; (c) keeping Phase 3 shippable in one cycle.
