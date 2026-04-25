# Design Spec — Regal Builder Redesign
> Date: 2026-04-25
> Scope: Issues 2/7 (brand identity), 6 (Work block), 8 (mobile)
> Approach: Phase C (identity system) → Phase B (mobile-first execution)
> Status: Approved for implementation

---

## Context & Goal

The site's core tension: the experience optimizes for impressing technical peers; the business needs to convert founders. This spec addresses the three highest-priority issues that can be fixed without touching navigation or inner pages (deferred to a later cycle):

- **Issue 2/7** — Seven typefaces + four switchable themes dilute brand identity
- **Issue 6** — Work block subtitle is five proper nouns with no proof or reason to click
- **Issue 8** — Mobile loses all depth cues below 1024px; flat grid with no brand personality

The redesign is sequenced Phase C → Phase B: lock the identity system first, then build the mobile experience from that foundation.

---

## Phase C — Identity System

### C1. Canonical Theme: Regal Builder

One theme. The others remain in `tokens.css` but are unreachable from normal UI (see C4).

**Token values to update in `src/styles/tokens.css`** — replace the `modern-vibrant` block with:

| Token | Value | Role |
|---|---|---|
| `--bg` | `#2E294E` | Space Indigo — warm dark, rare in dev portfolios |
| `--fg` | `#F1E9DA` | Eggshell — warm cream, not clinical white |
| `--fg-muted` | `#B8A8C8` | Derived light purple |
| `--accent` | `#D90368` | Berry Lipstick |
| `--focus-ring` | `#FFD400` | Gold |
| `--c-hero` | `linear-gradient(135deg, #D90368, #541388)` | Berry → Deep Indigo |
| `--c-hero-fg` | `#F1E9DA` | |
| `--c-brand` | `#F1E9DA` | Eggshell |
| `--c-brand-fg` | `#2E294E` | |
| `--c-about` | `#FFD400` | Gold — premium signal |
| `--c-about-fg` | `#2E294E` | |
| `--c-work` | `#1F6F50` | Pine Core — trustworthy builder signal |
| `--c-work-fg` | `#F1E9DA` | |
| `--c-services` | `#00B4AA` | Teal — bridges jewel-toned + earthy |
| `--c-services-fg` | `#2E294E` | |
| `--c-process` | `#C47820` | Amber-Rust — craft/making signal |
| `--c-process-fg` | `#F1E9DA` | |
| `--c-contact` | `#D90368` | Berry Lipstick |
| `--c-contact-fg` | `#F1E9DA` | |

**Bloom tokens** (floor radials): update `--c-*-bloom` to match the above block colors exactly.

**Glass cube atmospheric tokens**: tune for the warmer indigo background —

| Token | Value |
|---|---|
| `--cube-ceiling` | `rgba(200, 180, 230, 0.40)` |
| `--cube-floor-glow` | `rgba(217, 3, 104, 0.28)` |
| `--cube-caustic` | `rgba(255, 212, 0, 0.45)` |
| `--cube-vignette` | `rgba(0, 0, 0, 0.70)` |
| `--cube-edge-light` | `rgba(255, 255, 255, 0.15)` |
| `--cube-back-wall` | `linear-gradient(to bottom, rgba(30, 20, 50, 0.88) 0%, rgba(20, 15, 40, 0.93) 50%, rgba(28, 18, 45, 0.88) 100%)` |

**Bevel + shadow tokens**: these will be overridden by the new depth system (C2) but keep them for reduced-motion fallback —

| Token | Value |
|---|---|
| `--bevel-light` | `rgba(255, 255, 255, 0.35)` |
| `--bevel-dark` | `rgba(0, 0, 0, 0.22)` |
| `--shadow-base` | `0 4px 0 rgba(0,0,0,0.32), 0 8px 20px rgba(0,0,0,0.28), 0 24px 48px rgba(0,0,0,0.16)` |
| `--shadow-hover` | `0 20px 0 rgba(0,0,0,0.38), 0 32px 60px rgba(0,0,0,0.30), 0 56px 80px rgba(0,0,0,0.18)` |
| `--toggler-bg` | `rgba(0, 0, 0, 0.45)` |
| `--toggler-border` | `rgba(255, 255, 255, 0.12)` |

---

### C2. Block Depth: Directional Light

Replace the 4px inset bevel with a physically-grounded directional light simulation. Light source is top-left. Applied to both desktop and mobile blocks.

**In `src/components/TetrisGrid/Block.module.css`** — replace the `.block` shadow and `::before` rules:

```css
.block {
  /* Remove: inset 4px 4px 0 var(--bevel-light), inset -4px -4px 0 var(--bevel-dark) */
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.40),   /* specular top edge */
    inset 1px 0 0 rgba(255, 255, 255, 0.18),   /* specular left edge */
    0 4px 0 rgba(0, 0, 0, 0.32),              /* hard contact shadow */
    0 8px 20px rgba(0, 0, 0, 0.28),           /* mid ambient */
    0 24px 48px rgba(0, 0, 0, 0.16);          /* deep ambient */
}

/* Directional light gradient across block face */
.block::before {
  /* replaces the existing gloss overlay */
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
  opacity: 1; /* always visible, not just on hover */
  pointer-events: none;
  transition: none;
}
```

**Hover state** — amplify the existing shadow values, keep the directional gradient:
```css
.block:hover {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    inset 1px 0 0 rgba(255, 255, 255, 0.22),
    var(--shadow-hover),
    0 40px 80px rgba(0, 0, 0, 0.22);
}
.block:hover::before { opacity: 1; } /* no change needed — already always on */
```

**`src/components/Page/Page.module.css`** — apply the same depth to `.header` block on inner pages (replace its `inset` shadow values with the directional light pattern above).

---

### C3. Font System: Syne + Bricolage Grotesque wdth 87.5

**Already implemented:**
- `public/fonts/BricolageGrotesque-Variable.ttf` — self-hosted variable font
- `src/styles/globals.css` — `@font-face` block + `font-variation-settings: 'wdth' 87.5` on `html`
- `index.html` — Bricolage removed from Google Fonts URL

**Remaining work in `src/components/TetrisGrid/Block.module.css`**: remove all per-block `font-family` overrides. Every block currently has an individual typeface — these all become `Bricolage Grotesque` (inherited) for subtitles and `Syne` for titles. The `.block-brand .title` gets `Syne` explicitly (it's already the brand font). All other per-block `font-family` overrides are deleted.

Specific lines to remove/unify:
- `.block-brand .title { font-family: 'Outfit', ... }` → `font-family: 'Syne', ...`
- `.block-about .title { font-family: 'Cabinet Grotesk', ... }` → delete (inherits Syne from `.title`)
- `.block-work .title { font-family: 'Poppins', ... }` → delete
- `.block-services .title { font-family: 'Oxanium', ... }` → delete
- `.block-process .title { font-family: 'Space Mono', ... }` → delete
- `.block-contact .title { font-family: 'Syne', ... }` → keep (already correct)
- All `[data-theme="pastel"]`, `[data-theme="arcade-neon"]`, `[data-theme="classic"]` per-block font overrides → delete entirely

**Google Fonts URL cleanup** (index.html): Cabinet Grotesk, Poppins, Space Mono, Outfit, Oxanium are no longer needed. Remove them from the URL. Final URL keeps only Syne.

---

### C4. Theme Switcher: Konami Code Easter Egg

**Already implemented:**
- `src/lib/useKonamiCode.ts` — hook tracking ↑↑↓↓←→←→BA sequence
- `src/App.tsx` — `<ThemeSwitcher />` gated behind `konamiUnlocked`

No further changes needed for this item.

---

## Phase B — Mobile Experience

### B1. Bevel Restored on Mobile

The current mobile override (`@media (max-width: 1023px) { .block { transform: none; } }`) strips all depth. The directional light depth from C2 uses only `box-shadow` and a `::before` pseudo-element — neither of these is disabled by the mobile override. **No additional work needed** — C2 automatically restores tactile depth on mobile.

Verify: the `transform: none` overrides on mobile only affect `translateZ`, `rotateX`, `rotateY`. The `box-shadow` and `::before` gradient survive intact.

### B2. Staggered Block Entrance on Mobile

The gravity-drop animation (`useGravityDrop`) currently fires on all blocks simultaneously on mobile. Add CSS `animation-delay` values so blocks cascade in by row.

**In `Block.module.css`** — add under the mobile breakpoint:

```css
@media (max-width: 1023px) {
  /* Stagger delay per block — hero 0ms, then 40ms per row */
  .block-hero     { animation-delay: 0ms; }
  .block-brand,
  .block-about    { animation-delay: 80ms; }
  .block-work     { animation-delay: 160ms; }
  .block-services { animation-delay: 220ms; }
  .block-process  { animation-delay: 280ms; }
  .block-contact  { animation-delay: 340ms; }
}
```

Note: these `animation-delay` values only take effect if `useGravityDrop` applies an animation class. Verify the hook applies animation via a CSS class (not inline keyframes) — if it uses `element.style.animation`, the delay must be set via `element.style.animationDelay` in the hook instead.

### B3. Tactile Press State on Mobile

Add a physical "button press" feel on touch — `scale(0.97) translateY(2px)` on `:active`. Fast in, spring out.

**In `Block.module.css`**:

```css
@media (max-width: 1023px) {
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
  /* Spring back on release */
  .block {
    transition:
      background 200ms,
      color 200ms,
      box-shadow 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
      transform 200ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }
}
```

### B4. Gyroscope Parallax

Replace mouse-based parallax with device orientation on mobile. Reuse the existing `--parallax-x` / `--parallax-y` CSS custom property pipeline that `useGridParallax` already sets on the playfield.

**Create `src/components/TetrisGrid/useGyroParallax.ts`**:

```ts
// Mirrors useGridParallax's API — returns a ref to attach to the playfield.
// On mobile, feeds --parallax-x/y from DeviceOrientationEvent instead of mousemove.
// iOS 13+ requires requestPermission(); request lazily on first user interaction.
// Max tilt: ±3deg on both axes. Falls back silently if denied or unsupported.
```

**In `TetrisGrid.tsx`**: use `useGyroParallax` instead of `useGridParallax` on mobile. Detect mobile with `matchMedia('(max-width: 1023px)')` — not `window.innerWidth`, which is a point-in-time read and won't respond to orientation changes or browser resize. Both hooks write to the same `--parallax-x` / `--parallax-y` CSS variables so no downstream changes are needed.

**iOS permission pattern**:
```ts
// Trigger on first touchstart, not on mount — avoids the permission dialog
// appearing before the user has engaged with the page.
document.addEventListener('touchstart', requestGyroPermission, { once: true })
```

**Reduced motion**: `useGyroParallax` must respect `prefers-reduced-motion: reduce` — return a no-op ref if the media query matches.

---

## Work Block

### W1. Subtitle and CTA

**In `src/components/TetrisGrid/TetrisGrid.tsx`** — update the `work` block entry:

```ts
{
  id: 'work' as const,
  to: '/work',
  title: 'Work',
  subtitle: '5 solo builds · iOS · Android · Web · AI-integrated',
  // cta replaced with category tags — see W2
},
```

### W2. Category Tags in CTA Area

The `cta` prop on `Block` renders a pill button (`→`). Replace this for the Work block with a row of domain category tags.

**Option A (simpler)**: add a `tags?: string[]` prop to `BlockProps`. When present on the work block, render a `<span className={styles.tags}>` row instead of the CTA arrow pill. The tags are:
```ts
tags: ['Civic Tech', 'Privacy', 'PropTech', 'Spatial AI', 'Translation']
```

**Option B (no prop change)**: render the tags as the `cta` string value and style `.block-work .cta` differently in CSS to appear as a tag row. More fragile — use Option A.

**Tag styling** in `Block.module.css`:
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

---

## What This Spec Does Not Cover

The following issues from `docs/ux-critique.md` are explicitly deferred:

| Issue | Reason deferred |
|---|---|
| **1** — Value prop hierarchy | Requires content strategy work + home layout rethink |
| **3** — Inner pages experience cliff | Blocked on nav design (Issue 4) |
| **4** — No persistent navigation | Separate focused design cycle needed |
| **5** — AAI brand block | In progress separately |
| **9** — No pricing signal | Requires business model decision first |

---

## Implementation Sequence

Build in this order to avoid rework:

1. **C1** — Update `tokens.css` with Regal Builder values
2. **C2** — Replace bevel with directional light in `Block.module.css` and `Page.module.css`
3. **C3** — Remove per-block font overrides in `Block.module.css`; clean up Google Fonts URL in `index.html`
4. **W1 + W2** — Update Work block data + add `tags` prop to `Block`
5. **B2** — Add stagger delays under mobile breakpoint
6. **B3** — Add `:active` press state under mobile breakpoint
7. **B4** — Implement `useGyroParallax` + wire into `TetrisGrid`

Steps 1–4 are safe to do in one commit. Steps 5–7 should be tested on a real device before merging.

---

## Acceptance Criteria

- [ ] Site renders in Regal Builder colors with no theme switcher visible in normal use
- [ ] Konami code ↑↑↓↓←→←→BA reveals the theme switcher
- [ ] All blocks use Syne for titles, Bricolage Grotesque wdth 87.5 for subtitles — no per-block font variation
- [ ] Block depth reads as directional light, not inset bevel — on desktop and mobile
- [ ] Work block subtitle: "5 solo builds · iOS · Android · Web · AI-integrated"
- [ ] Work block CTA area: five category tags (Civic Tech · Privacy · PropTech · Spatial AI · Translation)
- [ ] Mobile blocks have staggered entrance (hero first, then cascade by row)
- [ ] Mobile blocks have tactile press state on `:active`
- [ ] Mobile gyroscope parallax works on iOS Safari and Android Chrome
- [ ] Gyroscope permission requested lazily on first touch, not on page load
- [ ] All motion enhancements respect `prefers-reduced-motion: reduce`
- [ ] No Google Fonts requests for Cabinet Grotesk, Poppins, Space Mono, Outfit, or Oxanium
