# Regal Builder Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Regal Builder identity system and mobile experience enhancements across the An App Idea LLC site — locking in a single canonical theme with directional-light depth, a unified font system, a stronger Work block, and a mobile grid that feels alive.

**Architecture:** Seven tasks in strict dependency order: token values first (C1), then visual depth (C2), then font cleanup (C3), then Work block content (W1/W2), then mobile stagger via the gravity-drop hook (B2), press state CSS (B3), and finally gyroscope parallax (B4). Tasks 1–4 touch no runtime JS and are safe to commit together. Tasks 5–7 require device testing before merge.

**Tech Stack:** React 18, TypeScript, CSS Modules, Web Animations API, `DeviceOrientationEvent` (iOS 13+), Vitest + Testing Library

---

## File Map

| File | Task | Change |
|---|---|---|
| `src/styles/tokens.css` | C1 | Replace `:root` / `[data-theme="modern-vibrant"]` block with Regal Builder values |
| `src/components/TetrisGrid/Block.module.css` | C2, C3, B2, B3 | Replace bevel with directional light; remove per-block font overrides; add mobile stagger CSS (none needed — hook handles it); add `:active` press state |
| `src/components/Page/Page.module.css` | C2 | Replace `.header` bevel with directional light |
| `index.html` | C3 | Strip Google Fonts URL down to Syne only |
| `src/components/TetrisGrid/TetrisGrid.tsx` | W1, B4 | Update work block subtitle + import/call `useGyroParallax` |
| `src/components/TetrisGrid/Block.tsx` | W2 | Add `tags?: string[]` prop; render tag row |
| `src/components/TetrisGrid/Block.module.css` | W2 | Add `.tags` / `.tag` styles |
| `src/components/TetrisGrid/useGravityDrop.ts` | B2 | Add `DROP_DELAY_MOBILE` map; apply on mobile via `matchMedia` |
| `src/components/TetrisGrid/useGyroParallax.ts` | B4 | Create hook — device orientation → `--parallax-x` / `--parallax-y` |
| `src/components/TetrisGrid/__tests__/block.test.tsx` | W2 | Add tests for `tags` prop |

---

## Task 1 — C1: Regal Builder Token Values

**Files:**
- Modify: `src/styles/tokens.css` (lines 5–61 — the `:root, [data-theme="modern-vibrant"]` block)

The token file has four theme blocks. Only the first block (`:root, [data-theme="modern-vibrant"]`) changes. The three alternate themes remain untouched — they're reachable via Konami code.

- [ ] **Step 1: Replace the `:root, [data-theme="modern-vibrant"]` token block**

Open `src/styles/tokens.css` and replace lines 5–61 (from `:root,` through the closing `}` before `[data-theme="classic"]`) with:

```css
:root,
[data-theme="modern-vibrant"] {
  --bg: #2E294E;
  --fg: #F1E9DA;
  --fg-muted: #B8A8C8;
  --accent: #D90368;
  --focus-ring: #FFD400;

  --c-hero: linear-gradient(135deg, #D90368, #541388);
  --c-hero-fg: #F1E9DA;
  --c-brand: #F1E9DA;
  --c-brand-fg: #2E294E;
  --c-about: #FFD400;
  --c-about-fg: #2E294E;
  --c-work: #1F6F50;
  --c-work-fg: #F1E9DA;
  --c-services: #00B4AA;
  --c-services-fg: #2E294E;
  --c-process: #C47820;
  --c-process-fg: #F1E9DA;
  --c-contact: #D90368;
  --c-contact-fg: #F1E9DA;

  /* Bloom tokens — match block colors exactly */
  --c-hero-bloom:     #D90368;
  --c-brand-bloom:    #F1E9DA;
  --c-about-bloom:    #FFD400;
  --c-work-bloom:     #1F6F50;
  --c-services-bloom: #00B4AA;
  --c-process-bloom:  #C47820;
  --c-contact-bloom:  #D90368;

  /* Glass cube — tuned for warm indigo background */
  --cube-ceiling:    rgba(200, 180, 230, 0.40);
  --cube-floor-glow: rgba(217, 3, 104, 0.28);
  --cube-caustic:    rgba(255, 212, 0, 0.45);
  --cube-vignette:   rgba(0, 0, 0, 0.70);
  --cube-edge-light: rgba(255, 255, 255, 0.15);
  --cube-back-wall: linear-gradient(
    to bottom,
    rgba(30, 20, 50, 0.88) 0%,
    rgba(20, 15, 40, 0.93) 50%,
    rgba(28, 18, 45, 0.88) 100%
  );

  /* Bevel + shadow — kept for reduced-motion fallback; overridden by C2 */
  --bevel-light: rgba(255, 255, 255, 0.35);
  --bevel-dark: rgba(0, 0, 0, 0.22);
  --shadow-base: 0 4px 0 rgba(0,0,0,0.32), 0 8px 20px rgba(0,0,0,0.28), 0 24px 48px rgba(0,0,0,0.16);
  --shadow-hover: 0 20px 0 rgba(0,0,0,0.38), 0 32px 60px rgba(0,0,0,0.30), 0 56px 80px rgba(0,0,0,0.18);

  --toggler-bg: rgba(0, 0, 0, 0.45);
  --toggler-border: rgba(255, 255, 255, 0.12);
}
```

- [ ] **Step 2: Verify in browser**

Run: `npm run dev`

Open `http://localhost:5173`. Expected:
- Background is Space Indigo (`#2E294E`) — warm dark purple, not the previous near-black
- Hero block gradient: Berry → Deep Indigo
- Work block: Pine Core green
- About block: Gold
- Process block: Amber-Rust
- No missing or broken styles

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(tokens): apply Regal Builder palette as canonical theme"
```

---

## Task 2 — C2: Directional Light Block Depth

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css` (lines 14–17 and lines 113–132)
- Modify: `src/components/Page/Page.module.css` (lines 19–23)

Replace the 4px inset bevel with a physically-grounded directional light. Light source is top-left. The `::before` overlay is always visible (opacity: 1) — not gated on hover.

- [ ] **Step 1: Replace `.block` base shadow in `Block.module.css`**

Find lines 14–17 (the `box-shadow` inside `.block`):
```css
  box-shadow:
    inset 4px 4px 0 var(--bevel-light),
    inset -4px -4px 0 var(--bevel-dark),
    var(--shadow-base);
```
Replace with:
```css
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 1px 0 0 rgba(255, 255, 255, 0.18),
    0 4px 0 rgba(0, 0, 0, 0.32),
    0 8px 20px rgba(0, 0, 0, 0.28),
    0 24px 48px rgba(0, 0, 0, 0.16);
```

- [ ] **Step 2: Replace `.block::before` gloss overlay in `Block.module.css`**

Find lines 113–127 (`.block::before`):
```css
.block::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.05) 45%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 300ms ease-out;
  pointer-events: none;
}
```
Replace with:
```css
.block::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.06) 40%,
    transparent 70%,
    rgba(0, 0, 0, 0.08) 100%
  );
  opacity: 1;
  pointer-events: none;
  transition: none;
}
```

- [ ] **Step 3: Update hover state in `Block.module.css`**

Find the `.block:hover` rule inside `@media (hover: hover)` (around line 141). Replace its `box-shadow` value:
```css
  .block:hover {
    transform: translateZ(calc(var(--block-z, 20px) + 30px))
               rotateX(var(--hover-rx, 0deg))
               rotateY(var(--hover-ry, 0deg));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.45),
      inset 1px 0 0 rgba(255, 255, 255, 0.22),
      var(--shadow-hover),
      0 40px 80px rgba(0, 0, 0, 0.22);
    transition:
      background 200ms,
      color 200ms,
      box-shadow 240ms ease-out,
      transform 100ms ease-out;
  }
```

Also update `.block:hover::before` — the opacity is already 1, but the rule can stay for clarity:
```css
  .block:hover::before { opacity: 1; }
```

- [ ] **Step 4: Update focus-visible state in `Block.module.css`**

Find `.block:focus-visible` (around line 166). Replace its `box-shadow`:
```css
.block:focus-visible {
  outline: 3px solid var(--block-fg);
  outline-offset: 4px;
  transform: translateZ(calc(var(--block-z, 20px) + 30px)) rotateX(-4deg) rotateY(4deg);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    inset 1px 0 0 rgba(255, 255, 255, 0.22),
    var(--shadow-hover);
}
```

- [ ] **Step 5: Update `.header` in `Page.module.css`**

Find lines 19–23 in `src/components/Page/Page.module.css`:
```css
  box-shadow:
    inset 4px 4px 0 var(--bevel-light),
    inset -4px -4px 0 var(--bevel-dark),
    var(--shadow-base);
```
Replace with:
```css
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),
    inset 1px 0 0 rgba(255, 255, 255, 0.18),
    0 4px 0 rgba(0, 0, 0, 0.32),
    0 8px 20px rgba(0, 0, 0, 0.28),
    0 24px 48px rgba(0, 0, 0, 0.16);
```

- [ ] **Step 6: Verify in browser**

In the running dev server, reload. Expected:
- Blocks have a subtle top-left specular catch (1px bright edge top + left)
- Directional gradient visible across block face — brighter top-left, slightly darker bottom-right
- No harsh 4px inset bevel corners
- Inner page headers (e.g. `/work`) have the same depth treatment

- [ ] **Step 7: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css src/components/Page/Page.module.css
git commit -m "feat(depth): replace bevel with directional light on blocks and inner page headers"
```

---

## Task 3 — C3: Font System Cleanup

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css` (per-block font-family overrides)
- Modify: `index.html` (Google Fonts URL)

Every block currently declares its own `font-family` on `.title`. All become Syne (inherited from `.title { font-family: 'Syne', ... }`) or explicitly set to Syne. Theme-specific font overrides for `pastel`, `arcade-neon`, and `classic` that reference removed fonts are deleted.

- [ ] **Step 1: Remove per-block default font overrides in `Block.module.css`**

Find and delete the following lines (they appear in the per-block color binding section, approx lines 92–110):

```css
.block-brand .title { font-family: 'Outfit', system-ui, ...; }
.block-about .title { font-family: 'Cabinet Grotesk', system-ui, ...; }
.block-work .title  { font-family: 'Poppins', system-ui, ...; }
.block-services .title { font-family: 'Oxanium', system-ui, ...; }
.block-process .title  { font-family: 'Space Mono', system-ui, ...; }
```

Keep these two lines (already correct):
```css
.block-hero .title    { font-family: 'Syne', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.block-contact .title { font-family: 'Syne', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
```

And update `.block-brand .title` to Syne:
```css
.block-brand .title { font-family: 'Syne', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
```

After this step, only `.block-hero`, `.block-brand`, and `.block-contact` have explicit `font-family` declarations on `.title` — all pointing to Syne. All others inherit from `.title { font-family: 'Syne', ... }` already defined at the top of the file.

- [ ] **Step 2: Remove theme-specific font overrides in `Block.module.css`**

Find and delete the entire "Theme-specific font overrides" section (approx lines 177–210):

```css
/* Theme-specific font overrides — each theme remixes the block fonts
   for visual cohesion with the overall aesthetic. */

/* Pastel theme: soften geometric fonts, favor organic readability */
[data-theme="pastel"] .block-services .title { ... }
[data-theme="pastel"] .block-process .title  { ... }

/* Arcade-neon theme: bold geometric, aggressive personality */
[data-theme="arcade-neon"] .block-brand .title { ... }
[data-theme="arcade-neon"] .block-about .title { ... }
[data-theme="arcade-neon"] .block-work .title  { ... }

/* Classic theme: clean & stark, favor Outfit + monospace accents */
[data-theme="classic"] .block-hero .title    { ... }
[data-theme="classic"] .block-about .title   { ... }
[data-theme="classic"] .block-work .title    { ... }
[data-theme="classic"] .block-contact .title { ... }
```

Delete all 17 lines. The alternate themes (reachable via Konami code) will also use Syne — acceptable since they're a hidden easter egg, not a public-facing experience.

- [ ] **Step 3: Clean up Google Fonts URL in `index.html`**

Find line 35 (the long `href` URL) and replace the entire `<link>` element with:

```html
    <link
      href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
```

The self-hosted `BricolageGrotesque-Variable.ttf` (already in `public/fonts/`) and the `@font-face` block already in `src/styles/globals.css` handle Bricolage. Cabinet Grotesk, Poppins, Space Mono, Outfit, and Oxanium are no longer referenced anywhere after Step 1–2.

- [ ] **Step 4: Verify in browser**

Reload the dev server. Check the Network tab in DevTools. Expected:
- Only one Google Fonts request — for Syne
- No requests for Cabinet Grotesk, Poppins, Space Mono, Outfit, or Oxanium
- All block titles render in Syne — uniform geometry across all blocks
- All subtitles render in Bricolage Grotesque with slight condensing (wdth 87.5)

- [ ] **Step 5: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css index.html
git commit -m "feat(fonts): unify all blocks to Syne titles; remove 5 unused Google Fonts"
```

---

## Task 4 — W1 + W2: Work Block Content

**Files:**
- Modify: `src/components/TetrisGrid/TetrisGrid.tsx` (work block entry in BLOCKS array)
- Modify: `src/components/TetrisGrid/Block.tsx` (add `tags` prop)
- Modify: `src/components/TetrisGrid/Block.module.css` (add `.tags` / `.tag` styles)
- Modify: `src/components/TetrisGrid/__tests__/block.test.tsx` (add tags tests)

The Work block gets a new subtitle (proof of productivity) and its CTA area replaced by domain category tags (proof of range). We follow TDD: write tests first, then implement.

- [ ] **Step 1: Write failing tests for the `tags` prop**

Open `src/components/TetrisGrid/__tests__/block.test.tsx` and add after the existing tests:

```tsx
  it('renders tag elements when tags prop is provided', () => {
    const { container } = renderBlock({ tags: ['Civic Tech', 'Privacy', 'PropTech'] })
    const tags = container.querySelectorAll('[data-reveal="tags"] span')
    expect(tags).toHaveLength(3)
    expect(tags[0]).toHaveTextContent('Civic Tech')
    expect(tags[1]).toHaveTextContent('Privacy')
    expect(tags[2]).toHaveTextContent('PropTech')
  })

  it('renders no tags container when tags prop is absent', () => {
    const { container } = renderBlock()
    expect(container.querySelector('[data-reveal="tags"]')).toBeNull()
  })

  it('does not render cta when tags are provided', () => {
    const { container } = renderBlock({ cta: 'View work', tags: ['Civic Tech'] })
    expect(container.querySelector('[data-reveal="cta"]')).toBeNull()
  })
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- block.test
```

Expected: 3 new failures — `tags` prop doesn't exist yet.

- [ ] **Step 3: Add `tags` prop to `BlockProps` and render in `Block.tsx`**

In `src/components/TetrisGrid/Block.tsx`, update `BlockProps`:

```tsx
export interface BlockProps {
  id: BlockId
  to: string
  title: string
  subtitle?: string
  cta?: string
  tags?: string[]
  ariaLabel?: string
  onNavigate?: (id: BlockId, to: string) => void
}
```

Update the function signature destructuring:

```tsx
export const Block = forwardRef<HTMLAnchorElement, BlockProps>(function Block(
  { id, to, title, subtitle, cta, tags, ariaLabel, onNavigate },
  ref,
) {
```

Replace the CTA render line:
```tsx
      {cta ? <span data-reveal="cta" className={styles.cta}>{cta} →</span> : null}
```
With (tags take priority over cta):
```tsx
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
```

- [ ] **Step 4: Add `.tags` and `.tag` styles to `Block.module.css`**

Append after the `.cta` rule:

```css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.4rem;
  align-self: flex-start;
}

.tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(241, 233, 218, 0.15);
  color: rgba(241, 233, 218, 0.9);
  letter-spacing: 0.02em;
}
```

- [ ] **Step 5: Run tests — all should pass**

```bash
npm test -- block.test
```

Expected: All 8 tests pass (5 original + 3 new).

- [ ] **Step 6: Update the Work block entry in `TetrisGrid.tsx`**

Find the `work` block in the BLOCKS array (line ~28) and update:

```tsx
  {
    id: 'work' as const,
    to: '/work',
    title: 'Work',
    subtitle: '5 solo builds · iOS · Android · Web · AI-integrated',
    tags: ['Civic Tech', 'Privacy', 'PropTech', 'Spatial AI', 'Translation'],
  },
```

(Remove the old `subtitle` value `'Pinpoint · Payback · RentHarbor · Feng Shui · Yap United'`.)

- [ ] **Step 7: Verify in browser**

Reload the dev server. Check the Work block. Expected:
- Subtitle: "5 solo builds · iOS · Android · Web · AI-integrated"
- Five pill tags below the subtitle: Civic Tech · Privacy · PropTech · Spatial AI · Translation
- Tags appear in `rgba(241, 233, 218, 0.15)` frosted-glass style against the Pine Core background
- No `→` arrow CTA visible on the Work block
- All other blocks with `cta` props still render their arrow pill normally

- [ ] **Step 8: Commit**

```bash
git add src/components/TetrisGrid/Block.tsx src/components/TetrisGrid/Block.module.css src/components/TetrisGrid/TetrisGrid.tsx src/components/TetrisGrid/__tests__/block.test.tsx
git commit -m "feat(work-block): stats subtitle + domain category tags; add tags prop to Block"
```

---

## Task 5 — B2: Staggered Mobile Block Entrance

**Files:**
- Modify: `src/components/TetrisGrid/useGravityDrop.ts`

**Critical implementation note:** `useGravityDrop` drives animations via `el.animate()` (Web Animations API), not via CSS `@keyframes` + `animation`. CSS `animation-delay` has zero effect here. The stagger must be JS-side — a mobile-specific delay map applied conditionally.

The current desktop order has `hero` last (600ms) for dramatic effect. Mobile reverses this: hero first (0ms) so the most important content appears immediately, then supporting blocks cascade downward row by row.

- [ ] **Step 1: Add `DROP_DELAY_MOBILE` and mobile detection to `useGravityDrop.ts`**

Open `src/components/TetrisGrid/useGravityDrop.ts`.

After the existing `DROP_DELAY` declaration (line 11), add:

```ts
const DROP_DELAY_MOBILE: Record<string, number> = {
  hero:     0,
  brand:    80,
  about:    80,
  work:     160,
  services: 220,
  process:  280,
  contact:  340,
}
```

Inside the `useEffect`, after the `if (matchMedia('(prefers-reduced-motion: reduce)').matches)` guard block, add:

```ts
const isMobile = matchMedia('(max-width: 1023px)').matches
const delays = isMobile ? DROP_DELAY_MOBILE : DROP_DELAY
```

Then update the `delay` line inside `refs.forEach` from:
```ts
const delay = DROP_DELAY[blockId] ?? 0
```
to:
```ts
const delay = delays[blockId] ?? 0
```

- [ ] **Step 2: Verify on desktop**

Reload `http://localhost:5173` in a desktop-width browser window (>1023px). Expected:
- Animation order unchanged: small blocks scaffold first, hero drops last
- No regression in timing or easing

- [ ] **Step 3: Verify on mobile (DevTools device emulation)**

In Chrome DevTools, enable a mobile device emulation (e.g. iPhone 14 — 390px wide). Hard-reload the page. Expected:
- Hero block drops in immediately (0ms delay)
- Brand + About cascade at ~80ms
- Work at ~160ms, Services at ~220ms, Process at ~280ms, Contact at ~340ms
- The grid feels assembled top-to-bottom rather than all-at-once

- [ ] **Step 4: Commit**

```bash
git add src/components/TetrisGrid/useGravityDrop.ts
git commit -m "feat(mobile): staggered block entrance — hero-first cascade via mobile DROP_DELAY map"
```

---

## Task 6 — B3: Tactile Press State on Mobile

**Files:**
- Modify: `src/components/TetrisGrid/Block.module.css`

Add a physical button-press feel to touch interactions. `scale(0.97) translateY(2px)` on `:active` — fast 80ms in, spring 200ms out.

- [ ] **Step 1: Add `:active` press state under the mobile breakpoint**

Open `src/components/TetrisGrid/Block.module.css`. Find the `@media (max-width: 1023px)` block at the end of the file:

```css
@media (max-width: 1023px) {
  .block { transform: none; }
  .block:hover { transform: none; }
  .block:focus-visible { transform: none; }
}
```

Replace it with:

```css
@media (max-width: 1023px) {
  .block {
    transform: none;
    transition:
      background 200ms,
      color 200ms,
      box-shadow 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
      transform 200ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .block:hover { transform: none; }
  .block:focus-visible { transform: none; }

  .block:active {
    transform: scale(0.97) translateY(2px);
    box-shadow:
      inset 0 0.5px 0 rgba(255, 255, 255, 0.25),
      inset 0.5px 0 0 rgba(255, 255, 255, 0.10),
      0 1px 0 rgba(0, 0, 0, 0.40),
      0 2px 8px rgba(0, 0, 0, 0.22);
    transition:
      transform 80ms ease-out,
      box-shadow 80ms ease-out;
  }
}
```

- [ ] **Step 2: Verify on mobile device or emulation**

In Chrome DevTools mobile emulation, tap-and-hold any block. Expected:
- Block visibly sinks: slight scale-down + 2px downward shift
- Shadow collapses to near-flat (press depth)
- On release: block springs back with the cubic-bezier spring easing (slightly overshoots then settles)
- The press-in feels immediate (80ms), the spring-out feels physical (200ms)

On desktop, blocks should show no `:active` scale — verify the desktop transition still works normally.

- [ ] **Step 3: Commit**

```bash
git add src/components/TetrisGrid/Block.module.css
git commit -m "feat(mobile): tactile press state on :active — scale(0.97) + shadow collapse, spring out"
```

---

## Task 7 — B4: Gyroscope Parallax

**Files:**
- Create: `src/components/TetrisGrid/useGyroParallax.ts`
- Modify: `src/components/TetrisGrid/TetrisGrid.tsx`

Replace mouse-based parallax with device orientation on mobile. The hook writes the same `--parallax-x` / `--parallax-y` CSS custom properties that `useGridParallax` already sets — no downstream CSS changes needed.

**Design:** `useGyroParallax(ref)` takes the existing playfield ref and attaches a device orientation listener. `useGridParallax` already skips touch devices via `!(hover: hover)` so the two hooks don't conflict.

- [ ] **Step 1: Create `src/components/TetrisGrid/useGyroParallax.ts`**

```ts
import { useEffect } from 'react'
import type { RefObject } from 'react'

const MAX_DEG = 3

export function useGyroParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const isMobile = matchMedia('(max-width: 1023px)').matches
    if (!isMobile) return

    const el = ref.current
    if (!el) return

    let frame = 0
    let pendingX = 0
    let pendingY = 0

    const apply = () => {
      el.style.setProperty('--parallax-y', `${pendingX}deg`)
      el.style.setProperty('--parallax-x', `${pendingY}deg`)
      frame = 0
    }

    const onOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0  // left-right tilt: [-90, 90]
      const beta  = e.beta  ?? 45 // front-back tilt: [-180, 180]; ~45 is natural hold angle

      // Normalize around resting hold angle (~45deg forward tilt)
      const nx = Math.max(-1, Math.min(1, gamma / 45))
      const ny = Math.max(-1, Math.min(1, (beta - 45) / 45))
      pendingX = nx * MAX_DEG
      pendingY = ny * MAX_DEG

      if (!frame) frame = requestAnimationFrame(apply)
    }

    let listening = false

    const startListening = () => {
      if (listening) return
      window.addEventListener('deviceorientation', onOrientation)
      listening = true
    }

    const requestGyroPermission = async () => {
      // iOS 13+ requires explicit permission for DeviceOrientationEvent.
      // We request lazily on first touchstart — never on page load.
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>
      }
      if (typeof DOE.requestPermission === 'function') {
        try {
          const result = await DOE.requestPermission()
          if (result === 'granted') startListening()
          // Denied — silent fallback, no parallax
        } catch {
          // Unsupported — silent fallback
        }
      } else {
        // Android Chrome and other non-iOS — no permission needed
        startListening()
      }
    }

    document.addEventListener('touchstart', requestGyroPermission, { once: true })

    return () => {
      document.removeEventListener('touchstart', requestGyroPermission)
      window.removeEventListener('deviceorientation', onOrientation)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref])
}
```

- [ ] **Step 2: Wire `useGyroParallax` into `TetrisGrid.tsx`**

Add the import at the top of `src/components/TetrisGrid/TetrisGrid.tsx`:

```tsx
import { useGyroParallax } from './useGyroParallax'
```

After `const playfieldRef = useGridParallax(4)`, add:

```tsx
useGyroParallax(playfieldRef)
```

The final TetrisGrid hook section should look like:

```tsx
const playfieldRef = useGridParallax(4)
useGyroParallax(playfieldRef)
```

- [ ] **Step 3: Verify on Android Chrome (DevTools orientation emulation)**

In Chrome DevTools → Sensors panel → Orientation, change the device orientation. Expected:
- The playfield tilts to follow the orientation values
- `--parallax-x` and `--parallax-y` update via rAF (visible in DevTools Computed styles panel)
- Rotation is clamped to ±3deg on both axes
- No tilt visible on desktop (useGridParallax handles desktop; useGyroParallax no-ops at >1023px)

- [ ] **Step 4: Verify on real iOS device (Safari)**

On iPhone iOS 13+:
1. Load the site over local network (`npm run dev -- --host`) or deployed preview URL
2. Tilt the phone — no permission dialog yet (expected — lazy request)
3. Tap any block — the permission dialog should appear asking for motion sensor access
4. Allow — tilt the phone and confirm the grid parallaxes with the device orientation
5. Deny — no parallax (silent fallback)

- [ ] **Step 5: Verify reduced-motion respected**

In iOS Settings → Accessibility → Motion → Reduce Motion ON, reload the page. Expected:
- No parallax — hook returns early before any listener is attached

- [ ] **Step 6: Commit**

```bash
git add src/components/TetrisGrid/useGyroParallax.ts src/components/TetrisGrid/TetrisGrid.tsx
git commit -m "feat(mobile): gyroscope parallax via deviceorientation — lazy iOS permission on first touch"
```

---

## Acceptance Checklist

Run through this after all 7 tasks are complete:

- [ ] Site renders in Regal Builder colors (Space Indigo bg) with no theme switcher visible in normal use
- [ ] Konami code ↑↑↓↓←→←→BA reveals the theme switcher
- [ ] All blocks use Syne for titles — no per-block font variation visible
- [ ] All subtitles render in Bricolage Grotesque wdth 87.5 — slightly condensed, not compressed
- [ ] Block depth reads as directional light (specular top-left edge + gradient face) — not inset bevel
- [ ] Inner page headers (`/work`, `/about`, etc.) have the same directional light treatment
- [ ] Work block subtitle: "5 solo builds · iOS · Android · Web · AI-integrated"
- [ ] Work block CTA area: five frosted-glass category tags (Civic Tech · Privacy · PropTech · Spatial AI · Translation)
- [ ] No Google Fonts requests for Cabinet Grotesk, Poppins, Space Mono, Outfit, or Oxanium
- [ ] Mobile blocks stagger in hero-first (0ms → brand/about 80ms → work 160ms → …)
- [ ] Mobile blocks have tactile press state on `:active` — fast in, spring out
- [ ] Mobile gyroscope parallax works on iOS Safari (lazy permission on first touch)
- [ ] Mobile gyroscope parallax works on Android Chrome (no permission needed)
- [ ] Gyroscope permission dialog appears on first tap, never on page load
- [ ] All motion enhancements are no-ops when `prefers-reduced-motion: reduce` is set
- [ ] All 8 Block component tests pass: `npm test -- block.test`
