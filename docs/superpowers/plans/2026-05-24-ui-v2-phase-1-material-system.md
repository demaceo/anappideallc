# UI v2.0 — Phase 1: Material System Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Block component's visual material from v1's flat gradient + shadow to the v2 Editorial Hardware recipe — multi-stop bloom gradient, brushed micro-grain, diagonal specular highlight, pearl rim, cushioned shadow stack, glass caustic floor spill — applied only to the `modern-vibrant` theme. Other themes remain visually unchanged in this phase.

**Architecture:** All new bloom triples (`--c-{section}-mat-dark/base/bright`) live in `src/styles/tokens.css` scoped to `[data-theme="modern-vibrant"]`. Block.module.css consumes them via per-section selectors and builds the Editorial Hardware layer stack. CSS-module file structure preserved; only the visual treatment changes. Other themes resolve to v1 fallback styling via `var(--bloom, var(--block-bg))` so they're untouched.

**Tech Stack:** Existing — Vite + React 19 + CSS Modules + Vitest + happy-dom. No new runtime deps in Phase 1.

**Spec reference:** `docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md` §4 (Visual System) — specifically §4.1 (Editorial Hardware layer stack) and §4.2 (per-section bloom tokens).

---

## File Structure

| File | Type | Responsibility |
|---|---|---|
| `src/styles/tokens.css` | Modify | Add 21 new `--c-{section}-mat-{dark/base/bright}` tokens to `[data-theme="modern-vibrant"]` only |
| `src/components/TetrisGrid/Block.module.css` | Modify | Bind bloom tokens per section; replace background gradient; refactor `::before` overlay to brushed-grain layer; add `::after` glass caustic floor spill; replace `box-shadow` with Editorial Hardware stack |
| `src/components/TetrisGrid/__tests__/material-tokens.test.ts` | Create | Token-presence assertions (parse-based) for all 21 new tokens across 7 sections |
| `src/components/TetrisGrid/__tests__/block-material.test.ts` | Create | Block.module.css structural assertions (parse-based) for the Editorial Hardware layer stack |
| `docs/superpowers/plans/2026-05-24-ui-v2-phase-1-material-system.md` | This file | The plan |

**TDD pattern for CSS work.** Computed-style assertions are unreliable in happy-dom (custom property resolution from CSS modules doesn't fully work). Instead, we read the source CSS files as strings and assert structure via regex — this proves the right tokens and rules are written, which is the actual unit-of-work for CSS refactoring. Visual verification is a separate manual step at the end of the phase (`npm run dev` + checklist).

---

## Task 1 · Set up the token-presence test scaffold

**Files:**
- Create: `src/components/TetrisGrid/__tests__/material-tokens.test.ts`

- [ ] **Step 1: Write the failing test (file read + first assertion)**

```typescript
// src/components/TetrisGrid/__tests__/material-tokens.test.ts
import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'

const TOKENS_CSS = fs.readFileSync(
  path.resolve(__dirname, '../../../styles/tokens.css'),
  'utf8',
)

describe('Editorial Hardware bloom tokens (modern-vibrant)', () => {
  it('reads tokens.css successfully', () => {
    expect(TOKENS_CSS.length).toBeGreaterThan(100)
    expect(TOKENS_CSS).toContain('[data-theme="modern-vibrant"]')
  })
})
```

- [ ] **Step 2: Run the test to verify it passes (scaffold sanity check)**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: PASS (tokens.css exists; the modern-vibrant block selector exists from v1).

- [ ] **Step 3: Commit**

```bash
git add src/components/TetrisGrid/__tests__/material-tokens.test.ts
git commit -m "test(material-tokens): scaffold token-presence test file"
```

---

## Task 2 · Add hero bloom tokens

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/material-tokens.test.ts`
- Modify: `src/styles/tokens.css:6-74` (the `[data-theme="modern-vibrant"]` block)

- [ ] **Step 1: Write the failing test (assertions for hero's three tokens)**

Add to the existing `describe` block in `material-tokens.test.ts`:

```typescript
  it('defines --c-hero-mat-dark with #8a0144', () => {
    expect(TOKENS_CSS).toMatch(/--c-hero-mat-dark:\s*#8a0144/i)
  })
  it('defines --c-hero-mat-base with #d90368', () => {
    expect(TOKENS_CSS).toMatch(/--c-hero-mat-base:\s*#d90368/i)
  })
  it('defines --c-hero-mat-bright with #ff5e98', () => {
    expect(TOKENS_CSS).toMatch(/--c-hero-mat-bright:\s*#ff5e98/i)
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: FAIL — three assertions fail with "no match" because tokens don't exist yet.

- [ ] **Step 3: Add the hero bloom tokens to tokens.css**

Open `src/styles/tokens.css`. Find the `[data-theme="modern-vibrant"]` block (line 6). After the existing `--cube-back-wall:` declaration (line 50-55) and before the `--shadow-base:` declaration (line 61), insert:

```css
  /* Editorial Hardware material — v2.0 per-section bloom triples.
     Each section gets three tokens: dark (outer-edge body), base (middle
     of the diagonal gradient), bright (highlight stop). The Block
     component reads these to render the Editorial Hardware multi-stop
     gradient + caustic floor spill. */
  --c-hero-mat-dark:   #8a0144;
  --c-hero-mat-base:   #d90368;
  --c-hero-mat-bright: #ff5e98;
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: PASS — all 4 assertions pass (scaffold + 3 hero tokens).

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/components/TetrisGrid/__tests__/material-tokens.test.ts
git commit -m "feat(tokens): add Editorial Hardware bloom triple for hero section"
```

---

## Task 3 · Add brand bloom tokens

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/material-tokens.test.ts`
- Modify: `src/styles/tokens.css` (modern-vibrant block)

- [ ] **Step 1: Write the failing test**

Append to the `describe` block in `material-tokens.test.ts`:

```typescript
  it('defines --c-brand-mat-dark with #a89a82', () => {
    expect(TOKENS_CSS).toMatch(/--c-brand-mat-dark:\s*#a89a82/i)
  })
  it('defines --c-brand-mat-base with #f1e9da', () => {
    expect(TOKENS_CSS).toMatch(/--c-brand-mat-base:\s*#f1e9da/i)
  })
  it('defines --c-brand-mat-bright with #ffffff', () => {
    expect(TOKENS_CSS).toMatch(/--c-brand-mat-bright:\s*#ffffff/i)
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: FAIL — 3 new assertions fail.

- [ ] **Step 3: Add brand bloom tokens to tokens.css**

Append directly after the hero bloom triple inserted in Task 2:

```css
  --c-brand-mat-dark:   #a89a82;
  --c-brand-mat-base:   #f1e9da;
  --c-brand-mat-bright: #ffffff;
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: PASS — all 7 assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/components/TetrisGrid/__tests__/material-tokens.test.ts
git commit -m "feat(tokens): add Editorial Hardware bloom triple for brand section"
```

---

## Task 4 · Add about bloom tokens

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/material-tokens.test.ts`
- Modify: `src/styles/tokens.css` (modern-vibrant block)

- [ ] **Step 1: Write the failing test**

Append to the `describe` block:

```typescript
  it('defines --c-about-mat-dark with #b07700', () => {
    expect(TOKENS_CSS).toMatch(/--c-about-mat-dark:\s*#b07700/i)
  })
  it('defines --c-about-mat-base with #ffb800', () => {
    expect(TOKENS_CSS).toMatch(/--c-about-mat-base:\s*#ffb800/i)
  })
  it('defines --c-about-mat-bright with #ffe066', () => {
    expect(TOKENS_CSS).toMatch(/--c-about-mat-bright:\s*#ffe066/i)
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: FAIL — 3 new assertions fail.

- [ ] **Step 3: Add about bloom tokens**

Append after the brand bloom triple:

```css
  --c-about-mat-dark:   #b07700;
  --c-about-mat-base:   #ffb800;
  --c-about-mat-bright: #ffe066;
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/components/TetrisGrid/__tests__/material-tokens.test.ts
git commit -m "feat(tokens): add Editorial Hardware bloom triple for about section"
```

---

## Task 5 · Add work bloom tokens

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/material-tokens.test.ts`
- Modify: `src/styles/tokens.css` (modern-vibrant block)

- [ ] **Step 1: Write the failing test**

```typescript
  it('defines --c-work-mat-dark with #0d3d2b', () => {
    expect(TOKENS_CSS).toMatch(/--c-work-mat-dark:\s*#0d3d2b/i)
  })
  it('defines --c-work-mat-base with #1f6f50', () => {
    expect(TOKENS_CSS).toMatch(/--c-work-mat-base:\s*#1f6f50/i)
  })
  it('defines --c-work-mat-bright with #4cb589', () => {
    expect(TOKENS_CSS).toMatch(/--c-work-mat-bright:\s*#4cb589/i)
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: FAIL.

- [ ] **Step 3: Add work bloom tokens**

```css
  --c-work-mat-dark:    #0d3d2b;
  --c-work-mat-base:    #1f6f50;
  --c-work-mat-bright:  #4cb589;
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/components/TetrisGrid/__tests__/material-tokens.test.ts
git commit -m "feat(tokens): add Editorial Hardware bloom triple for work section"
```

---

## Task 6 · Add services bloom tokens

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/material-tokens.test.ts`
- Modify: `src/styles/tokens.css` (modern-vibrant block)

- [ ] **Step 1: Write the failing test**

```typescript
  it('defines --c-services-mat-dark with #006e68', () => {
    expect(TOKENS_CSS).toMatch(/--c-services-mat-dark:\s*#006e68/i)
  })
  it('defines --c-services-mat-base with #00b4aa', () => {
    expect(TOKENS_CSS).toMatch(/--c-services-mat-base:\s*#00b4aa/i)
  })
  it('defines --c-services-mat-bright with #5be3dc', () => {
    expect(TOKENS_CSS).toMatch(/--c-services-mat-bright:\s*#5be3dc/i)
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: FAIL.

- [ ] **Step 3: Add services bloom tokens**

```css
  --c-services-mat-dark:   #006e68;
  --c-services-mat-base:   #00b4aa;
  --c-services-mat-bright: #5be3dc;
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/components/TetrisGrid/__tests__/material-tokens.test.ts
git commit -m "feat(tokens): add Editorial Hardware bloom triple for services section"
```

---

## Task 7 · Add process bloom tokens

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/material-tokens.test.ts`
- Modify: `src/styles/tokens.css` (modern-vibrant block)

- [ ] **Step 1: Write the failing test**

```typescript
  it('defines --c-process-mat-dark with #5a3618', () => {
    expect(TOKENS_CSS).toMatch(/--c-process-mat-dark:\s*#5a3618/i)
  })
  it('defines --c-process-mat-base with #C47820', () => {
    expect(TOKENS_CSS).toMatch(/--c-process-mat-base:\s*#C47820/i)
  })
  it('defines --c-process-mat-bright with #e8a85a', () => {
    expect(TOKENS_CSS).toMatch(/--c-process-mat-bright:\s*#e8a85a/i)
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: FAIL.

- [ ] **Step 3: Add process bloom tokens**

```css
  --c-process-mat-dark:    #5a3618;
  --c-process-mat-base:    #C47820;
  --c-process-mat-bright:  #e8a85a;
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/components/TetrisGrid/__tests__/material-tokens.test.ts
git commit -m "feat(tokens): add Editorial Hardware bloom triple for process section"
```

---

## Task 8 · Add contact bloom tokens

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/material-tokens.test.ts`
- Modify: `src/styles/tokens.css` (modern-vibrant block)

Contact uses the same triple as Hero (per spec §4.2 — color-identity consistency).

- [ ] **Step 1: Write the failing test**

```typescript
  it('defines --c-contact-mat-dark with #8a0144', () => {
    expect(TOKENS_CSS).toMatch(/--c-contact-mat-dark:\s*#8a0144/i)
  })
  it('defines --c-contact-mat-base with #d90368', () => {
    expect(TOKENS_CSS).toMatch(/--c-contact-mat-base:\s*#d90368/i)
  })
  it('defines --c-contact-mat-bright with #ff5e98', () => {
    expect(TOKENS_CSS).toMatch(/--c-contact-mat-bright:\s*#ff5e98/i)
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: FAIL.

- [ ] **Step 3: Add contact bloom tokens**

```css
  --c-contact-mat-dark:    #8a0144;
  --c-contact-mat-base:    #d90368;
  --c-contact-mat-bright:  #ff5e98;
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/material-tokens.test.ts`
Expected: PASS — all 21 token assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/components/TetrisGrid/__tests__/material-tokens.test.ts
git commit -m "feat(tokens): add Editorial Hardware bloom triple for contact section"
```

---

## Task 9 · Bind bloom tokens onto Block.module.css per-section selectors

**Files:**
- Create: `src/components/TetrisGrid/__tests__/block-material.test.ts`
- Modify: `src/components/TetrisGrid/Block.module.css:131-137` (the per-block color-binding lines)

- [ ] **Step 1: Write the failing test (new file)**

Create `src/components/TetrisGrid/__tests__/block-material.test.ts`:

```typescript
import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'

const BLOCK_CSS = fs.readFileSync(
  path.resolve(__dirname, '../Block.module.css'),
  'utf8',
)

describe('Block.module.css — bloom token bindings', () => {
  const sections = ['hero', 'brand', 'about', 'work', 'services', 'process', 'contact']

  for (const s of sections) {
    it(`block-${s} binds --bloom-dark to --c-${s}-mat-dark`, () => {
      const rule = new RegExp(
        `\\.block-${s}\\s*\\{[^}]*--bloom-dark:\\s*var\\(--c-${s}-mat-dark\\)`,
      )
      expect(BLOCK_CSS).toMatch(rule)
    })
    it(`block-${s} binds --bloom to --c-${s}-mat-base`, () => {
      const rule = new RegExp(
        `\\.block-${s}\\s*\\{[^}]*--bloom:\\s*var\\(--c-${s}-mat-base\\)`,
      )
      expect(BLOCK_CSS).toMatch(rule)
    })
    it(`block-${s} binds --bloom-bright to --c-${s}-mat-bright`, () => {
      const rule = new RegExp(
        `\\.block-${s}\\s*\\{[^}]*--bloom-bright:\\s*var\\(--c-${s}-mat-bright\\)`,
      )
      expect(BLOCK_CSS).toMatch(rule)
    })
  }
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL — 21 assertions fail (no --bloom* properties in the per-section selectors yet).

- [ ] **Step 3: Update each `.block-{section}` selector to bind the bloom tokens**

Open `src/components/TetrisGrid/Block.module.css`. Replace lines 131-137 with:

```css
/* Per-block color + bloom binding via CSS custom properties + per-block
   translateZ so blocks float at staggered depths in the 3D scene. The
   --bloom-* triple drives the Editorial Hardware material gradient; the
   --block-bg fallback covers themes without bloom tokens (classic, etc.). */
.block-hero {
  --block-bg: var(--c-hero); --block-fg: var(--c-hero-fg); --block-z: 60px;
  --bloom-dark: var(--c-hero-mat-dark);
  --bloom: var(--c-hero-mat-base);
  --bloom-bright: var(--c-hero-mat-bright);
}
.block-brand {
  --block-bg: var(--c-brand); --block-fg: var(--c-brand-fg); --block-z: 15px;
  --bloom-dark: var(--c-brand-mat-dark);
  --bloom: var(--c-brand-mat-base);
  --bloom-bright: var(--c-brand-mat-bright);
}
.block-about {
  --block-bg: var(--c-about); --block-fg: var(--c-about-fg); --block-z: 40px;
  --bloom-dark: var(--c-about-mat-dark);
  --bloom: var(--c-about-mat-base);
  --bloom-bright: var(--c-about-mat-bright);
}
.block-work {
  --block-bg: var(--c-work); --block-fg: var(--c-work-fg); --block-z: 30px;
  --bloom-dark: var(--c-work-mat-dark);
  --bloom: var(--c-work-mat-base);
  --bloom-bright: var(--c-work-mat-bright);
}
.block-services {
  --block-bg: var(--c-services); --block-fg: var(--c-services-fg); --block-z: 35px;
  --bloom-dark: var(--c-services-mat-dark);
  --bloom: var(--c-services-mat-base);
  --bloom-bright: var(--c-services-mat-bright);
}
.block-process {
  --block-bg: var(--c-process); --block-fg: var(--c-process-fg); --block-z: 25px;
  --bloom-dark: var(--c-process-mat-dark);
  --bloom: var(--c-process-mat-base);
  --bloom-bright: var(--c-process-mat-bright);
}
.block-contact {
  --block-bg: var(--c-contact); --block-fg: var(--c-contact-fg); --block-z: 45px;
  --bloom-dark: var(--c-contact-mat-dark);
  --bloom: var(--c-contact-mat-base);
  --bloom-bright: var(--c-contact-mat-bright);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS — 21 binding assertions pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(block): bind Editorial Hardware bloom triples per section"
```

---

## Task 10 · Replace the body background with Editorial Hardware multi-stop gradient

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`
- Modify: `src/components/TetrisGrid/Block.module.css:1-41` (the `.block` rule)

- [ ] **Step 1: Write the failing test**

Append to `block-material.test.ts` — these are structural assertions (not exact-string matches) because the production CSS uses nested `var()` fallback chains that defeat strict regex:

```typescript
describe('Block.module.css — Editorial Hardware material', () => {
  it('.block background is a 135deg linear-gradient', () => {
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*background:[^;]*linear-gradient\(\s*135deg/)
  })

  it('.block gradient references --bloom-dark at 0% and 100%', () => {
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*--bloom-dark[^;]*?0%/)
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*--bloom-dark[^;]*?100%/)
  })

  it('.block gradient references --bloom-bright at 50%', () => {
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*--bloom-bright[^;]*?50%/)
  })

  it('.block gradient falls back through --block-bg for non-bloom themes', () => {
    expect(BLOCK_CSS).toMatch(/var\(--bloom-dark,\s*var\(--block-bg/)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL — 2 new assertions fail (current `.block` uses `var(--block-bg, transparent)`).

- [ ] **Step 3: Replace the `.block` rule's background**

Open `src/components/TetrisGrid/Block.module.css`. Replace line 12:

```css
  background: var(--block-bg, transparent);
```

with the Editorial Hardware multi-stop gradient (using nested fallbacks so non-bloom themes degrade to v1 flat color):

```css
  /* Editorial Hardware multi-stop diagonal gradient. Themes without bloom
     tokens (classic, etc.) fall back through the chain to --block-bg, which
     reproduces v1's flat-color treatment. */
  background: linear-gradient(
    135deg,
    var(--bloom-dark, var(--block-bg, transparent)) 0%,
    var(--bloom, var(--block-bg, transparent)) 30%,
    var(--bloom-bright, var(--block-bg, transparent)) 50%,
    var(--bloom, var(--block-bg, transparent)) 70%,
    var(--bloom-dark, var(--block-bg, transparent)) 100%
  );
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(block): replace flat background with Editorial Hardware multi-stop gradient"
```

---

## Task 11 · Replace `.block::before` gloss overlay with brushed micro-grain + diagonal specular

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`
- Modify: `src/components/TetrisGrid/Block.module.css:139-154` (the existing `.block::before` rule)

- [ ] **Step 1: Write the failing test**

Append to `block-material.test.ts`:

```typescript
  it('.block::before has brushed micro-grain via 118deg repeating-linear-gradient', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block::before\s*\{[^}]*repeating-linear-gradient\(\s*118deg,\s*transparent\s*0\s*2px,\s*rgba\(255,\s*255,\s*255,\s*0\.045\)\s*2px\s*3px\)/,
    )
  })

  it('.block::before has diagonal specular highlight 135deg', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block::before\s*\{[^}]*linear-gradient\(\s*135deg,\s*rgba\(255,\s*255,\s*255,\s*0\.45\)\s*0%,\s*transparent\s*30%,\s*transparent\s*70%,\s*rgba\(0,\s*0,\s*0,\s*0\.25\)\s*100%\)/,
    )
  })

  it('.block::before uses mix-blend-mode: screen', () => {
    expect(BLOCK_CSS).toMatch(/\.block::before\s*\{[^}]*mix-blend-mode:\s*screen/)
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL — 3 new assertions fail.

- [ ] **Step 3: Replace the `.block::before` rule**

In `Block.module.css`, replace lines 139-154 (the existing `.block::before` rule and its arcade-neon override) with:

```css
/* Editorial Hardware surface overlay — brushed micro-grain at 118° + diagonal
   specular highlight at 135°. Stacked via comma-separated backgrounds so
   they composite together. mix-blend-mode: screen lets the bloom underneath
   show through where the highlight is most intense. */
.block::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    repeating-linear-gradient(118deg, transparent 0 2px, rgba(255, 255, 255, 0.045) 2px 3px),
    linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.25) 100%);
  mix-blend-mode: screen;
  pointer-events: none;
}

/* Neon theme retains its v1 behavior — Editorial Hardware overlay disabled
   (the theme uses glow rings instead of surface highlights). */
[data-theme="arcade-neon"] .block::before {
  display: none;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(block): replace gloss overlay with brushed grain + specular highlight"
```

---

## Task 12 · Add `.block::after` glass caustic floor spill

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`
- Modify: `src/components/TetrisGrid/Block.module.css` (add `::after` rule after `::before`)

- [ ] **Step 1: Write the failing test**

Append to `block-material.test.ts`:

```typescript
  it('.block::after renders the glass caustic floor spill', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block::after\s*\{[^}]*radial-gradient\(\s*closest-side,\s*var\(--bloom-bright[^)]*\),\s*transparent\s*70%\)/,
    )
  })

  it('.block::after applies a 10px blur', () => {
    expect(BLOCK_CSS).toMatch(/\.block::after\s*\{[^}]*filter:\s*blur\(10px\)/)
  })

  it('.block::after positions below the block (bottom: -8%)', () => {
    expect(BLOCK_CSS).toMatch(/\.block::after\s*\{[^}]*bottom:\s*-8%/)
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL — 3 new assertions fail (no `::after` rule yet).

- [ ] **Step 3: Add the `.block::after` rule**

In `Block.module.css`, directly after the `.block::before` rule and its `[data-theme="arcade-neon"]` override, insert:

```css
/* Editorial Hardware caustic floor spill — soft colored glow under the
   block, suggesting refracted light passing through a glass cushion onto
   the surface below. Hidden on themes without --bloom-bright (degrades to
   transparent gracefully via the fallback). */
.block::after {
  content: '';
  position: absolute;
  bottom: -8%;
  left: 10%;
  right: 10%;
  height: 16%;
  border-radius: 50%;
  background: radial-gradient(
    closest-side,
    var(--bloom-bright, transparent),
    transparent 70%
  );
  filter: blur(10px);
  opacity: 0.7;
  pointer-events: none;
  z-index: -1;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(block): add glass caustic floor spill via ::after pseudo-element"
```

---

## Task 13 · Replace `.block` box-shadow with the Editorial Hardware shadow stack

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`
- Modify: `src/components/TetrisGrid/Block.module.css:28-31` (the existing `.block` box-shadow rule)

The Editorial Hardware shadow stack (spec §4.1) layers: pearl rim + cushioned offset shadow + bloom halo + atmospheric shadow.

- [ ] **Step 1: Write the failing test**

Append to `block-material.test.ts`:

```typescript
  it('.block has Editorial Hardware shadow stack — pearl rim inset', () => {
    // Pearl rim: inset 0 0 0 1px rgba(255,255,255,0.18)
    expect(BLOCK_CSS).toMatch(
      /\.block\s*\{[^}]*box-shadow:[^;]*inset\s+0\s+0\s+0\s+1px\s+rgba\(255,\s*255,\s*255,\s*0\.18\)/,
    )
  })

  it('.block has Editorial Hardware shadow stack — cushion offset', () => {
    // Cushion: 0 18px 0 rgba(0,0,0,0.42)
    expect(BLOCK_CSS).toMatch(
      /\.block\s*\{[^}]*box-shadow:[^;]*0\s+18px\s+0\s+rgba\(0,\s*0,\s*0,\s*0\.42\)/,
    )
  })

  it('.block has Editorial Hardware shadow stack — bloom halo', () => {
    // Bloom halo: 0 36px 70px var(--bloom, transparent)
    // Strict pattern to ensure we match --bloom, not --bloom-dark/-bright
    expect(BLOCK_CSS).toMatch(
      /\.block\s*\{[^}]*box-shadow:[^;]*0\s+36px\s+70px\s+var\(--bloom,\s*transparent\)/,
    )
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL — 3 new assertions fail.

- [ ] **Step 3: Replace the `.block` box-shadow**

In `Block.module.css`, replace lines 28-31 (the current `box-shadow:` declaration in `.block`) with:

```css
  /* Editorial Hardware shadow stack — pearl rim (inset) + top/left specular
     edges (preserved from v1 for keyboard-focus consistency) + cushioned
     offset shadow (gives the chunky 3D form) + colored bloom halo (smells
     of refraction) + atmospheric shadow. The --bloom token falls back to
     transparent on themes without bloom tokens, so non-modern-vibrant
     themes retain v1's simpler --shadow-base stack underneath. */
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
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(block): replace box-shadow with Editorial Hardware stack"
```

---

## Task 14 · Update hover state to intensify the Editorial Hardware shadow stack

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`
- Modify: `src/components/TetrisGrid/Block.module.css:163-191` (existing `.block:hover` rule)

- [ ] **Step 1: Write the failing test**

Append to `block-material.test.ts`:

```typescript
  it('.block:hover intensifies the cushion shadow', () => {
    // Hover cushion grows from 18px to ~28px
    expect(BLOCK_CSS).toMatch(
      /\.block:hover\s*\{[^}]*box-shadow:[^;]*0\s+28px\s+0\s+rgba\(0,\s*0,\s*0/,
    )
  })

  it('.block:hover intensifies the bloom halo', () => {
    // Hover bloom is bigger: 0 60px 100px var(--bloom, transparent)
    expect(BLOCK_CSS).toMatch(
      /\.block:hover\s*\{[^}]*box-shadow:[^;]*0\s+60px\s+100px\s+var\(--bloom,\s*transparent\)/,
    )
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL.

- [ ] **Step 3: Update the `.block:hover` box-shadow**

In `Block.module.css`, find the `@media (hover: hover)` block and replace the `box-shadow:` declaration inside `.block:hover` (currently lines 175-179) with:

```css
    /* Editorial Hardware hover — intensified cushion + bloom halo for lift
       feedback. Maintains the stacking order from the base .block rule so
       the cascade replaces shadows cleanly. */
    box-shadow:
      inset 0 1px 0 var(--block-specular-top),
      inset 1px 0 0 var(--block-specular-left),
      inset 0 0 0 1px rgba(255, 255, 255, 0.28),
      inset 0 2px 0 rgba(255, 255, 255, 0.55),
      inset 0 -2px 0 rgba(0, 0, 0, 0.4),
      0 28px 0 rgba(0, 0, 0, 0.48),
      0 60px 100px var(--bloom, transparent),
      0 70px 120px rgba(0, 0, 0, 0.5),
      var(--shadow-hover);
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(block): intensify hover shadow stack for Editorial Hardware lift"
```

---

## Task 15 · Update focus-visible state to match the hover Editorial Hardware shadow

**Files:**
- Modify: `src/components/TetrisGrid/__tests__/block-material.test.ts`
- Modify: `src/components/TetrisGrid/Block.module.css:194-207` (`.block:focus-visible` rule)

Keyboard focus should be visually equivalent to mouse hover so pointer + keyboard UX stay parallel (v1's convention, preserved here).

- [ ] **Step 1: Write the failing test**

Append to `block-material.test.ts`:

```typescript
  it('.block:focus-visible matches the hover Editorial Hardware shadow stack', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block:focus-visible\s*\{[^}]*box-shadow:[^;]*0\s+28px\s+0\s+rgba\(0,\s*0,\s*0/,
    )
    expect(BLOCK_CSS).toMatch(
      /\.block:focus-visible\s*\{[^}]*box-shadow:[^;]*0\s+60px\s+100px\s+var\(--bloom,\s*transparent\)/,
    )
  })
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: FAIL.

- [ ] **Step 3: Update the `.block:focus-visible` box-shadow**

In `Block.module.css`, replace the `.block:focus-visible` `box-shadow:` (currently lines 203-206) with the same stack as `.block:hover`:

```css
  box-shadow:
    inset 0 1px 0 var(--block-specular-top),
    inset 1px 0 0 var(--block-specular-left),
    inset 0 0 0 1px rgba(255, 255, 255, 0.28),
    inset 0 2px 0 rgba(255, 255, 255, 0.55),
    inset 0 -2px 0 rgba(0, 0, 0, 0.4),
    0 28px 0 rgba(0, 0, 0, 0.48),
    0 60px 100px var(--bloom, transparent),
    0 70px 120px rgba(0, 0, 0, 0.5),
    var(--shadow-hover);
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test src/components/TetrisGrid/__tests__/block-material.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/__tests__/block-material.test.ts
git commit -m "feat(block): mirror Editorial Hardware shadow on focus-visible state"
```

---

## Task 16 · Verify all existing Block tests still pass (regression check)

**Files:**
- No code changes — run the existing v1 block test suite to confirm we haven't broken anything.

- [ ] **Step 1: Run the full Block test suite**

Run: `pnpm test src/components/TetrisGrid/__tests__/block.test.tsx`
Expected: PASS — all 8 existing tests still pass (Block component renders title, subtitle, cta, tags correctly).

- [ ] **Step 2: Run the full TetrisGrid test suite**

Run: `pnpm test src/components/TetrisGrid/__tests__/`
Expected: PASS — block.test.tsx, tetris-grid.test.tsx, gravity-drop.test.ts, line-clear-return.test.ts, gyro-parallax.test.ts, material-tokens.test.ts, block-material.test.ts all pass.

- [ ] **Step 3: Run the full project test suite**

Run: `pnpm test`
Expected: PASS — no regressions anywhere.

If any failures appear: stop, diagnose, fix the regression, re-run. Do not proceed to manual verification with red tests.

- [ ] **Step 4: No commit needed (verification-only task)**

Continue to Task 17.

---

## Task 17 · Build the project to verify CSS compiles correctly

**Files:**
- No code changes — build-level verification.

- [ ] **Step 1: Run the production build**

Run: `pnpm build`
Expected: Build completes successfully. No CSS errors, no TypeScript errors. Output is written to `dist/`.

- [ ] **Step 2: Inspect the built CSS for the Editorial Hardware tokens**

Run: `grep -c "c-hero-mat-base" dist/assets/*.css`
Expected: At least 1 match — the token is preserved in the built CSS.

Run: `grep -c "repeating-linear-gradient(118deg" dist/assets/*.css`
Expected: At least 1 match — the brushed grain rule made it into the build.

- [ ] **Step 3: No commit needed (verification-only task)**

Continue to Task 18.

---

## Task 18 · Manual visual verification (Editorial Hardware on `modern-vibrant`)

**Files:**
- No code changes — manual smoke test.

This is the qualitative "does it look right" gate. Bring up the dev server, walk through the home grid, and confirm the new material renders correctly. Mark each checklist item as you go.

- [ ] **Step 1: Start the dev server**

Run: `pnpm dev`
Open `http://localhost:5173/` in Chrome (the canonical test browser for this project).

- [ ] **Step 2: Verify the modern-vibrant home grid (default theme)**

Walk through this checklist with the page open:

- [ ] All 7 blocks render with the new multi-stop bloom gradient — diagonal, with a visible bright highlight band running 135° across each block
- [ ] Brushed micro-grain texture is visible on each block at close inspection (faint diagonal lines)
- [ ] Pearl rim (1px white) visible around each block's edge
- [ ] Cushioned offset shadow (the chunky "block sitting up off the floor" effect) visible below each block
- [ ] Each block has a colored bloom halo extending below it in the section's color (magenta under Hero, gold under About, etc.)
- [ ] Hover on a block lifts it AND intensifies the bloom halo
- [ ] Keyboard Tab navigation moves through blocks; each focused block shows the same intensified hover state
- [ ] Gravity-drop intro animation still plays on first load (regression check)
- [ ] No visual artifacts: no clipping at block edges, no z-index issues with the caustic floor spill

- [ ] **Step 3: Verify the `classic` theme is unchanged (fallback regression check)**

Trigger the theme switcher (Konami code: ↑ ↑ ↓ ↓ ← → ← → b a). Switch to `classic`.

- [ ] Classic blocks render as flat colors (no multi-stop gradient — `--bloom` is undefined, falls back to `--block-bg`)
- [ ] Classic blocks retain v1's shadow stack (`--shadow-base` still applies)
- [ ] No console errors related to missing CSS custom properties

Switch back to `modern-vibrant` and continue.

- [ ] **Step 4: Verify mobile fallback (no 3D, no horror)**

Open Chrome DevTools → Device Toolbar (Cmd+Shift+M) → iPhone 14 Pro Max.

- [ ] Blocks render with the new gradient and bloom halo (the 2D treatment survives mobile)
- [ ] No 3D transforms on touch (already handled by v1's `@media (max-width: 1023px)` block)
- [ ] No visual overflow or scrollbars
- [ ] Tapping a block does the v1 `:active` press-down behavior

- [ ] **Step 5: Verify `prefers-reduced-motion` collapses correctly**

DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`.

- [ ] Blocks render statically (no parallax tilt)
- [ ] Editorial Hardware material is still applied (the material is depth, not motion — it should survive reduced-motion)
- [ ] Hover still works but without the transform lift

- [ ] **Step 6: Stop the dev server**

`Ctrl+C` in the terminal running `pnpm dev`.

- [ ] **Step 7: Capture a screenshot for the spec record**

Take a full-page screenshot of the home grid at 1440×900 and save it to `docs/superpowers/specs/screenshots/2026-05-24-v2-phase-1-home.png` (creating the `screenshots/` directory if needed).

Run:
```bash
mkdir -p docs/superpowers/specs/screenshots
# Take screenshot manually with Cmd+Shift+4 → drag region, save to the path above
```

- [ ] **Step 8: Commit the screenshot**

```bash
git add docs/superpowers/specs/screenshots/2026-05-24-v2-phase-1-home.png
git commit -m "docs(spec): add Phase 1 visual reference screenshot"
```

---

## Task 19 · Update the v1 critique remediation note

**Files:**
- Modify: `docs/ux-critique.md` (append a Phase 1 status line)

The existing UX critique tracks open issues. Phase 1 doesn't close any issues outright (it's the visual foundation for later phases), but we should record what's been done.

- [ ] **Step 1: Append a Phase 1 status section to `docs/ux-critique.md`**

Open `docs/ux-critique.md` and append at the bottom (after the existing "Strategic North Star" section):

```markdown
---

## v2.0 Implementation Status

### Phase 1 — Material System Refactor (completed 2026-05-24)

Editorial Hardware material recipe applied to `modern-vibrant` theme. Per-section bloom triples (`--c-{section}-mat-{dark|base|bright}`) drive a 135° multi-stop diagonal gradient, brushed micro-grain at 118°, diagonal specular highlight, pearl rim, cushioned offset shadow, bloom halo, atmospheric shadow, and glass caustic floor spill. Other themes (`classic`, `pastel`, `arcade-neon`) remain visually unchanged via fallback chain to v1's `--block-bg` + `--shadow-base`. See `docs/superpowers/plans/2026-05-24-ui-v2-phase-1-material-system.md` for the full implementation log.

No critiqued issues closed by this phase — material polish is the visual foundation for later phases that solve issues #3 (inner-page experience cliff), #4 (no persistent nav), #5 (Brand block does nothing), and #8 (mobile loses magic).
```

- [ ] **Step 2: Commit**

```bash
git add docs/ux-critique.md
git commit -m "docs(critique): record Phase 1 material refactor in implementation status"
```

---

## Task 20 · Push the branch and open a preview deploy

**Files:**
- No code changes — deploy workflow.

The repo uses Vercel for preview deploys (per `vercel.json`). Pushing the branch should automatically create a preview URL.

- [ ] **Step 1: Verify we're on a feature branch (not main)**

Run: `git rev-parse --abbrev-ref HEAD`
Expected: a feature branch name like `ui-v2-phase-1-material-system` (NOT `main`).

If the branch is `main`, stop and create a feature branch BEFORE pushing:

```bash
git checkout -b ui-v2-phase-1-material-system
```

- [ ] **Step 2: Push to remote with upstream tracking**

Run: `git push -u origin HEAD`
Expected: branch pushed; Vercel webhook triggers a preview build.

- [ ] **Step 3: Wait for the preview URL**

Watch the Vercel dashboard or the GitHub PR check (if a PR was created) for the preview URL. Typically ~90s for this project size.

- [ ] **Step 4: Verify the preview URL renders correctly**

Open the preview URL in Chrome and re-run the Task 18 visual checklist against it. Note any environment-specific issues (different browser fingerprint, real network conditions) that didn't appear locally.

- [ ] **Step 5: Open a PR for Phase 1**

Use the project's PR template (or follow the v1 commit pattern):

```bash
gh pr create --title "feat(ui-v2): Phase 1 — Editorial Hardware material system" --body "$(cat <<'EOF'
## Summary

Phase 1 of the v2.0 photorealistic redesign per `docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md`. Refactors the Block component's visual material from v1's flat gradient + shadow to the Editorial Hardware recipe (multi-stop bloom gradient + brushed micro-grain + diagonal specular + pearl rim + cushioned shadow stack + glass caustic floor spill) — applied only to the `modern-vibrant` theme.

- Per-section bloom triples added: `--c-{section}-mat-{dark|base|bright}` for all 7 sections
- Block.module.css refactored with the Editorial Hardware layer stack
- Themes other than `modern-vibrant` resolve to v1 fallback styling (no visual change)
- 21 new token-presence tests + 12 CSS-structure tests
- All existing v1 tests still pass (no regressions)

Spec: docs/superpowers/specs/2026-05-24-ui-v2-photorealistic-design.md
Plan: docs/superpowers/plans/2026-05-24-ui-v2-phase-1-material-system.md

## Test plan

- [x] Token-presence tests pass for all 7 sections × 3 tokens (21 assertions)
- [x] Block.module.css structural assertions pass (12 assertions)
- [x] All existing v1 tests still green
- [x] Production build succeeds
- [x] Manual visual verification on Chrome desktop + mobile emulation + reduced-motion (see screenshot in `docs/superpowers/specs/screenshots/`)
- [x] Classic theme verified unchanged (fallback chain works)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6: Phase 1 complete**

Once the PR is merged, Phase 1 is shipped. Move to Phase 2 (Velvet Stage + Aurora Portal Hero) — a separate plan document.

---

## Definition of Done

Phase 1 is complete when ALL of the following are true:

- [ ] All 20 tasks above are checked off
- [ ] `pnpm test` passes with 0 failures (existing + 21 new token assertions + 12 new CSS structure assertions)
- [ ] `pnpm build` produces a clean production build
- [ ] Manual visual verification (Task 18) checklist 100% clean
- [ ] Preview deployment renders identically to local
- [ ] PR opened and approved
- [ ] Branch merged into main

---

## What is intentionally NOT in Phase 1

These items appear in the spec but belong to later phases. Don't accidentally pull them forward:

- Velvet Stage environment (Phase 2)
- Aurora Portal Hero window (Phase 2)
- Materials Panel and 7 presets (Phase 3)
- Single-thread line system (Phase 4)
- Rube Goldberg chain reactions (Phase 5)
- Inner page Velvet Vitrine treatment (Phase 6)
- moss / crochet themes (Phase 7)
- Classic theme bloom token migration (Phase 7)
- Mobile-specific chain reaction variants (Phase 8)

If a task description in this plan starts to drift toward any of the above, stop — you're outside Phase 1's scope. Cut what you have and ship Phase 1 first.
