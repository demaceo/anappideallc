# Glass Cube Illusion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the visible `.playfield` container chrome on the TetrisGrid home page with an "implied glass cube" atmosphere — the blocks free-fall into a 3D space the viewer is looking inside of, with environmental cues (radial-gradient atmospherics on the viewport) and a 3D-tilted glass floor that catches a soft color bloom from each block.

**Architecture:** Pure CSS + one tiny JSX addition. Strip `.playfield`'s background/border/shadows/border-radius/padding while keeping its 3D transform behavior intact. Add a real `<div className={styles.floor}>` as a sibling of `.grid` inside `.playfield` — it inherits the playfield's `transform-style: preserve-3d` and is `rotateX(90deg)`'d to lay flat as the cube floor. The floor's background is seven layered radial gradients, each colored by the active theme's per-block color via new `--c-*-bloom` CSS tokens. Viewport gets a four-layer radial-gradient background (ceiling light, floor glow, corner caustic, vignette) controlled by new `--cube-*` tokens.

**Tech Stack:** React 19, TypeScript, CSS Modules, Vitest + Testing Library + happy-dom (existing).

**Spec:** [docs/superpowers/specs/2026-04-24-glass-cube-illusion-design.md](../specs/2026-04-24-glass-cube-illusion-design.md)

---

## File Map

| File | Change | Why |
|---|---|---|
| `src/styles/tokens.css` | Modify — add 7 `--c-*-bloom` tokens and 4 `--cube-*` tokens per theme block (4 themes × 11 = 44 new tokens) | Themes must drive the floor bloom colors and viewport atmospheric tints |
| `src/components/TetrisGrid/TetrisGrid.tsx` | Modify — insert `<div className={styles.floor} aria-hidden="true" />` as the first child of `.playfield`, before `.grid` | Floor must be a sibling of `.grid` so both inherit `.playfield`'s `preserve-3d` |
| `src/components/TetrisGrid/__tests__/tetris-grid.test.tsx` | Create | Verify floor element exists in DOM and is marked decorative (aria-hidden) |
| `src/components/TetrisGrid/TetrisGrid.module.css` | Modify — strip `.playfield` chrome, add viewport atmospherics, add `.floor` rules + responsive/reduced-motion hides | The actual cube illusion |

---

## Task 1: Add `--c-*-bloom` and `--cube-*` Theme Tokens

**Files:**
- Modify: `src/styles/tokens.css`

This task only adds CSS variables. There is no visual change yet — the variables are defined but not consumed. This isolates the theme palette extension into a single reviewable commit.

- [ ] **Step 1: Open the tokens file and locate each theme block**

Run: `grep -n '\[data-theme=' src/styles/tokens.css`

Expected output: four matches for `data-theme="modern-vibrant"`, `data-theme="classic"`, `data-theme="pastel"`, `data-theme="arcade-neon"`.

- [ ] **Step 2: Add bloom + cube tokens to `modern-vibrant` theme**

In `[data-theme="modern-vibrant"]`, after the existing `--c-contact-fg: #fff;` line, add:

```css
  /* Glass cube — per-block solid colors used by the floor bloom.
     Hero is a gradient, so the bloom uses the dominant warm-pink stop. */
  --c-hero-bloom:     #ff3d7f;
  --c-brand-bloom:    #ffffff;
  --c-about-bloom:    #4ad4ff;
  --c-work-bloom:     #ffd93d;
  --c-services-bloom: #7ef078;
  --c-process-bloom:  #c678ff;
  --c-contact-bloom:  #ff6b6b;

  /* Glass cube — viewport atmospheric tints. */
  --cube-ceiling:    rgba(168, 168, 192, 0.18);
  --cube-floor-glow: rgba(255, 157, 74, 0.10);
  --cube-caustic:    rgba(74, 212, 255, 0.22);
  --cube-vignette:   rgba(0, 0, 0, 0.45);
```

- [ ] **Step 3: Add bloom + cube tokens to `classic` theme**

In `[data-theme="classic"]`, after the existing `--c-contact-fg: #fff;` line, add:

```css
  /* Glass cube — per-block solid colors used by the floor bloom. */
  --c-hero-bloom:     #00f0f0;
  --c-brand-bloom:    #ffffff;
  --c-about-bloom:    #f0f000;
  --c-work-bloom:     #a000f0;
  --c-services-bloom: #00f000;
  --c-process-bloom:  #f0a000;
  --c-contact-bloom:  #f00000;

  /* Glass cube — viewport atmospheric tints. */
  --cube-ceiling:    rgba(136, 136, 136, 0.14);
  --cube-floor-glow: rgba(0, 240, 240, 0.08);
  --cube-caustic:    rgba(0, 240, 240, 0.20);
  --cube-vignette:   rgba(0, 0, 0, 0.45);
```

- [ ] **Step 4: Add bloom + cube tokens to `pastel` theme**

In `[data-theme="pastel"]`, after the existing `--c-contact-fg: #2a2a2a;` line, add:

```css
  /* Glass cube — per-block solid colors used by the floor bloom.
     Hero is a gradient, so the bloom uses the dominant peach stop. */
  --c-hero-bloom:     #ffb5a7;
  --c-brand-bloom:    #f8edeb;
  --c-about-bloom:    #a7d8ff;
  --c-work-bloom:     #ffe5a1;
  --c-services-bloom: #b8e8b8;
  --c-process-bloom:  #d8b9ff;
  --c-contact-bloom:  #ffc9c9;

  /* Glass cube — viewport atmospheric tints. Pastel uses gentler vignette
     since the bg is cream and aggressive darkening would muddy the palette. */
  --cube-ceiling:    rgba(255, 255, 255, 0.30);
  --cube-floor-glow: rgba(255, 181, 167, 0.14);
  --cube-caustic:    rgba(255, 181, 167, 0.18);
  --cube-vignette:   rgba(42, 42, 42, 0.20);
```

- [ ] **Step 5: Add bloom + cube tokens to `arcade-neon` theme**

In `[data-theme="arcade-neon"]`, after the existing `--c-contact-fg: #ff0066;` line, add:

```css
  /* Glass cube — neon theme blocks have bg = page color and the visible
     glow color is on --c-*-fg. The bloom uses the glow color, not the bg. */
  --c-hero-bloom:     #ff00ff;
  --c-brand-bloom:    #00ffff;
  --c-about-bloom:    #00ff88;
  --c-work-bloom:     #ffff00;
  --c-services-bloom: #ff8800;
  --c-process-bloom:  #ff00ff;
  --c-contact-bloom:  #ff0066;

  /* Glass cube — viewport atmospheric tints. */
  --cube-ceiling:    rgba(255, 0, 255, 0.16);
  --cube-floor-glow: rgba(255, 0, 255, 0.12);
  --cube-caustic:    rgba(0, 255, 255, 0.26);
  --cube-vignette:   rgba(0, 0, 0, 0.50);
```

- [ ] **Step 6: Verify all four theme blocks now reference the new tokens**

Run: `grep -c '\-\-c-hero-bloom' src/styles/tokens.css`

Expected output: `4` (one per theme).

Run: `grep -c '\-\-cube-ceiling' src/styles/tokens.css`

Expected output: `4`.

- [ ] **Step 7: Run the test suite to verify nothing broke**

Run: `npm test`

Expected: all existing tests pass. CSS variable additions cannot affect tests, but this is a sanity check.

- [ ] **Step 8: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(themes): add --c-*-bloom and --cube-* tokens for glass cube illusion"
```

---

## Task 2: Add Floor Element to TetrisGrid (TDD)

**Files:**
- Modify: `src/components/TetrisGrid/TetrisGrid.tsx`
- Create: `src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`

This task adds the `<div className={styles.floor}>` element. The existing styles do not yet target this class, so the element is a no-op visually until Task 3. We test the DOM contract first.

- [ ] **Step 1: Write the failing test**

Create `src/components/TetrisGrid/__tests__/tetris-grid.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { ThemeProvider } from '../../../lib/theme'
import { TetrisGrid } from '../TetrisGrid'

function renderTetrisGrid() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <TetrisGrid />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('TetrisGrid', () => {
  it('renders a decorative floor element inside the playfield', () => {
    const { container } = renderTetrisGrid()
    const floor = container.querySelector('[data-floor]')
    expect(floor).not.toBeNull()
    expect(floor).toHaveAttribute('aria-hidden', 'true')
  })

  it('places the floor as a sibling of the grid (both children of playfield)', () => {
    const { container } = renderTetrisGrid()
    const floor = container.querySelector('[data-floor]')
    const grid = container.querySelector('[data-grid]')
    expect(floor).not.toBeNull()
    expect(grid).not.toBeNull()
    expect(floor!.parentElement).toBe(grid!.parentElement)
  })
})
```

We use `data-floor` and `data-grid` attribute selectors instead of CSS Module class names because hashed class names from CSS Modules are unstable in tests.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tetris-grid`

Expected: both tests FAIL — the `data-floor` attribute does not exist yet, and `data-grid` does not exist either.

- [ ] **Step 3: Add the floor element and data attributes to TetrisGrid.tsx**

In `src/components/TetrisGrid/TetrisGrid.tsx`, replace this block:

```tsx
    <div className={styles.viewport}>
      <div ref={playfieldRef} className={styles.playfield}>
        <div className={styles.grid}>
          {BLOCKS.map((b, i) => (
```

With:

```tsx
    <div className={styles.viewport}>
      <div ref={playfieldRef} className={styles.playfield}>
        <div className={styles.floor} data-floor aria-hidden="true" />
        <div className={styles.grid} data-grid>
          {BLOCKS.map((b, i) => (
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tetris-grid`

Expected: both tests PASS.

- [ ] **Step 5: Run the full test suite to verify no regression**

Run: `npm test`

Expected: all tests pass (existing block.test.tsx, gravity-drop.test.ts, line-clear-return.test.ts, plus the new tetris-grid.test.tsx).

- [ ] **Step 6: Commit**

```bash
git add src/components/TetrisGrid/TetrisGrid.tsx src/components/TetrisGrid/__tests__/tetris-grid.test.tsx
git commit -m "feat(tetris-grid): add decorative floor element for glass cube illusion"
```

---

## Task 3: Strip Playfield Chrome and Add Cube CSS

**Files:**
- Modify: `src/components/TetrisGrid/TetrisGrid.module.css`

This task is the visual transition. Before the commit, the page shows the existing chrome'd playfield with an invisible floor div. After the commit, the page shows the implied glass cube.

There are no automated tests in this task — the change is purely visual and CSS Module class hashes make CSS-in-DOM assertions brittle. Visual verification happens in Task 4.

- [ ] **Step 1: Replace the entire `TetrisGrid.module.css` file**

Replace the file contents with:

```css
.viewport {
  min-height: 100dvh;
  width: 100%;
  padding: clamp(1rem, 3vw, 2.5rem);
  display: grid;
  place-items: center;
  perspective: 1400px;
  perspective-origin: 50% 35%;
  position: relative;
  overflow: hidden;

  /* The viewport is "the room you're standing in." Layered radial gradients
     paint the cube atmospherics flat-to-camera (they don't tilt with the
     playfield). Order: caustic on top, then ceiling light, then floor glow,
     then vignette underneath. */
  background:
    radial-gradient(ellipse 30% 30% at 100% 0%,
      var(--cube-caustic) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 50% 0%,
      var(--cube-ceiling) 0%, transparent 70%),
    radial-gradient(ellipse 80% 30% at 50% 100%,
      var(--cube-floor-glow) 0%, transparent 75%),
    radial-gradient(closest-side at 50% 50%,
      transparent 50%, var(--cube-vignette) 100%),
    var(--bg);
}

/* The playfield is the invisible 3D transform host. Its chrome (background,
   border, shadows, padding) was removed so the blocks read as suspended
   inside the cube rather than sitting in a tray.

   IMPORTANT: nothing here may create a stacking context (no backdrop-filter,
   no mix-blend-mode, no filter). Those properties prevent
   transform-style: preserve-3d from applying, which flattens the blocks
   inside the playfield and kills the per-block hover lift. */
.playfield {
  position: relative;
  width: 100%;
  max-width: 1280px;
  transform-style: preserve-3d;
  transition: transform 200ms ease-out;
  /* Defaults if useGridParallax hasn't set these (e.g. SSR, reduced motion). */
  --parallax-x: 0deg;
  --parallax-y: 0deg;
}

/* The glass floor — a child of .playfield (preserve-3d), rotated 90deg to
   lay flat. Carries seven radial-gradient blooms calibrated to the desktop
   grid layout: each bloom is positioned where its block sits, painted in
   that block's color via the --c-*-bloom token. After rotateX(90deg), the
   plane's original Y axis maps to depth — blocks higher in the grid project
   blooms further into the cube. Hidden below desktop and under reduced
   motion (the floor's effect comes from the parallax tilt). */
.floor {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60%;
  pointer-events: none;
  opacity: 0.35;
  display: none; /* Default hidden — only desktop turns it on. */
  transform: rotateX(90deg) translateZ(-1px);
  transform-origin: bottom center;
  background:
    radial-gradient(ellipse 35% 25% at 25% 35%,
      color-mix(in srgb, var(--c-hero-bloom) 60%, transparent) 0%,
      transparent 70%),
    radial-gradient(ellipse 30% 20% at 58% 12%,
      color-mix(in srgb, var(--c-brand-bloom) 60%, transparent) 0%,
      transparent 70%),
    radial-gradient(ellipse 30% 22% at 83% 30%,
      color-mix(in srgb, var(--c-about-bloom) 60%, transparent) 0%,
      transparent 70%),
    radial-gradient(ellipse 28% 22% at 58% 55%,
      color-mix(in srgb, var(--c-work-bloom) 60%, transparent) 0%,
      transparent 70%),
    radial-gradient(ellipse 30% 22% at 83% 60%,
      color-mix(in srgb, var(--c-services-bloom) 60%, transparent) 0%,
      transparent 70%),
    radial-gradient(ellipse 35% 22% at 25% 88%,
      color-mix(in srgb, var(--c-process-bloom) 60%, transparent) 0%,
      transparent 70%),
    radial-gradient(ellipse 35% 22% at 75% 88%,
      color-mix(in srgb, var(--c-contact-bloom) 60%, transparent) 0%,
      transparent 70%);
}

.grid {
  display: grid;
  width: 100%;
  height: 100%;
  min-height: calc(100dvh - clamp(6rem, 14vw, 10rem));
  gap: clamp(0.75rem, 1.2vw, 1.25rem);
  /* Mobile-first: 2 columns × 7 rows vertical stack. */
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(7, minmax(70px, 1fr));
  grid-template-areas:
    'hero    hero'
    'hero    hero'
    'about   brand'
    'work    work'
    'services services'
    'process process'
    'contact contact';
}

/* Tablet: 4 columns × 6 rows. */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-template-areas:
      'hero hero hero hero'
      'hero hero hero hero'
      'about about brand brand'
      'work work services services'
      'process process process process'
      'contact contact contact contact';
  }
}

/* Desktop: 6 columns × 4 rows — Hero-Left Asymmetric (the user-approved A layout).
   The whole playfield carries the base isometric tilt + parallax — the floor
   and its blocks rotate together as one 3D object. */
@media (min-width: 1024px) {
  .playfield {
    transform: rotateX(calc(6deg + var(--parallax-x))) rotateY(calc(-3deg + var(--parallax-y)));
  }
  .grid {
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-template-areas:
      'hero hero hero brand about    about'
      'hero hero hero work  about    about'
      'hero hero hero work  services services'
      'process process process contact contact contact';
  }
  .floor {
    display: block;
  }
}

/* Reduced-motion users get a flat, untilted scene with no parallax response
   and no floor (the floor's effect comes from the parallax tilt). */
@media (prefers-reduced-motion: reduce) {
  .viewport { perspective: none; }
  .playfield { transform: none !important; transition: none !important; }
  .floor { display: none !important; }
}
```

Key changes from the previous file:
1. `.viewport` gains the four-layer atmospheric `background` and `position: relative; overflow: hidden;` (so the gradients are painted onto the home page itself).
2. `.playfield` loses `padding`, `border-radius`, `background`, `border`, `box-shadow`. Keeps `position`, `width`, `max-width`, `transform-style`, `transition`, `--parallax-*` defaults.
3. New `.floor` rule (default hidden, shown at desktop, hidden under reduced motion).
4. Updated comments at the top of `.playfield` to reflect "invisible 3D transform host."
5. The desktop media query now also turns on `.floor { display: block; }`.

- [ ] **Step 2: Verify the file parses (no CSS syntax errors)**

Run: `npm run build` (or just `npx tsc -b && npx vite build` if you want to skip prerender)

Expected: build succeeds. If CSS has a syntax error, the Vite/PostCSS pipeline will surface it here.

- [ ] **Step 3: Run the test suite**

Run: `npm test`

Expected: all tests pass — including `tetris-grid.test.tsx` from Task 2 (the floor element still renders; only its CSS changed).

- [ ] **Step 4: Commit**

```bash
git add src/components/TetrisGrid/TetrisGrid.module.css
git commit -m "feat(tetris-grid): replace playfield chrome with implied glass cube atmospherics"
```

---

## Task 4: Manual Visual Verification

**Files:** none (verification only — no code or commit).

The cube illusion's success cannot be asserted by automated tests. This task walks through every theme and every breakpoint to confirm the visual is right and to log any tuning needs before declaring the work done.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

Open the URL Vite prints (typically `http://localhost:5173`).

- [ ] **Step 2: Verify the default theme (modern-vibrant) on desktop**

Resize the browser window to ≥1024px wide.

Confirm visually:
- [ ] No visible playfield border, background tint, inner top shadow, or outer drop shadow
- [ ] Blocks tilt with parallax as the cursor moves (existing behavior preserved)
- [ ] Soft warm/cool radial atmosphere at top of viewport (ceiling light)
- [ ] Subtle bloom at bottom (floor glow)
- [ ] Slight color leak in top-right corner (caustic)
- [ ] Edges of viewport gently darkened (vignette)
- [ ] Beneath the blocks, the floor plane shows soft block-colored blooms tilting with the parallax

- [ ] **Step 3: Cycle through all four themes on desktop**

Use the theme toggler. For each of `modern-vibrant`, `classic`, `pastel`, `arcade-neon`:
- [ ] Atmospherics tint matches the theme's palette (no theme should have invisible atmospherics or oversaturated atmospherics)
- [ ] Floor blooms render with theme-appropriate colors
- [ ] No theme appears flat / uncubed

If any theme reads as muddy or invisible, note which `--cube-*` or `--c-*-bloom` token needs tuning. Adjust in `tokens.css` and re-verify. Do **not** commit tuning unless visually justified — small numeric tweaks should bundle into a single follow-up commit.

- [ ] **Step 4: Verify tablet breakpoint (768px–1023px)**

Resize the browser to ~900px wide.

Confirm:
- [ ] The 4×6 tablet grid layout still renders correctly
- [ ] The floor element is hidden (no horizontal stripe at bottom)
- [ ] Viewport atmospherics still render (those are kept on smaller breakpoints)

- [ ] **Step 5: Verify mobile breakpoint (<768px)**

Resize the browser to ~400px wide (or use device emulation).

Confirm:
- [ ] The 2×7 mobile grid layout still renders correctly
- [ ] The floor element is hidden
- [ ] Viewport atmospherics still render

- [ ] **Step 6: Verify reduced motion**

In macOS: System Settings → Accessibility → Display → Reduce motion. (Or use Chrome DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce.)

Confirm at desktop width:
- [ ] Playfield has no tilt or parallax
- [ ] Floor element is hidden
- [ ] Viewport atmospherics still render
- [ ] No animation on page load

- [ ] **Step 7: Verify the gravity-drop animation still plays correctly**

Open the page in a fresh browser session (to clear sessionStorage) at desktop width with reduced motion off.

Confirm:
- [ ] The 7-block staggered drop animation plays as before
- [ ] Hero block lands last, with squash bounce
- [ ] Content reveals (title, subtitle, CTA) burst in after each block settles
- [ ] No visual artifacts, flicker, or layout shifts

- [ ] **Step 8: Verify hover lift**

At desktop width, hover each block.

Confirm:
- [ ] Each block lifts with the existing tilt + glow
- [ ] No regression in the hover-mousemove tilt response
- [ ] Hover lift continues to feel "in front of" the cube atmosphere

- [ ] **Step 9: If any tuning is needed, apply and commit as a single follow-up**

If Steps 3–8 surfaced specific token values that need tuning (e.g., pastel's bloom too pale, arcade-neon's caustic too aggressive), apply the changes in `tokens.css` and commit:

```bash
git add src/styles/tokens.css
git commit -m "tune(themes): adjust glass cube tokens after visual verification"
```

If no tuning is needed, no commit is created in this task.

---

## Self-Review Checklist (already completed)

**Spec coverage:** Each spec section is implemented:
- Spec §1 (strip chrome) → Task 3 Step 1
- Spec §2 (viewport atmospherics) → Task 1 (tokens) + Task 3 Step 1 (consumption)
- Spec §3 (floor element + bloom) → Task 1 (tokens) + Task 2 (DOM) + Task 3 Step 1 (CSS)
- Spec §4 (responsive + a11y) → Task 3 Step 1 (media queries) + Task 4 Steps 4–6 (verification)
- Spec §5 (files changed) → matches the File Map above

**Placeholder scan:** No "TBD"/"TODO"/"appropriate"/"similar to" markers remain. All theme values are concrete. All test code is complete.

**Type/name consistency:** `--c-*-bloom` token names (Task 1) match exactly the tokens consumed in `.floor` background (Task 3 Step 1). `data-floor` attribute (Task 2 Step 3) matches the test selector (Task 2 Step 1). `aria-hidden="true"` is consistent across spec, JSX, and test.
