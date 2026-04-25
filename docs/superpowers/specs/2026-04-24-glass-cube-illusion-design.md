# Glass Cube Illusion — Design Spec
**Date:** 2026-04-24
**Status:** Awaiting user review

---

## Overview

Replace the visible `.playfield` container chrome (translucent tint, hairline border, inner top shadow, outer drop shadow) with an **implied glass cube** atmosphere. The blocks should appear to free-fall into a 3D space the viewer is looking *inside of*, rather than into a framed well.

This is **Approach A — Implied Glass Cube** (atmospheric, no literal walls). Approaches B (edge-defined hairlines + back wall) and C (six-plane architectural cube) remain on the table for a follow-up if A doesn't fully sell the illusion.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Visible playfield chrome | Removed | Conflicts with "looking inside a cube" — the blocks should float in space, not sit in a tray |
| Cube illusion source | Environmental cues (radial gradients + 3D floor plane) | Reads as glass without adding a competing visible frame |
| Floor plane element | Real `<div className={styles.floor}>` | Easier to inspect, iterate, and target than a `::after` pseudo |
| Floor bloom source | Per-block colors stacked as 7 radial gradients in a single `background` | One element, no extra DOM per block, theme-aware via existing color vars |
| Bloom intensity | Subtle (~0.35 layer opacity, 60% color-mix) | Glass refraction, not paint |
| Cube opacity behavior | Same in light/dark themes, tints adapt via CSS vars | Consistent across the four themes the site supports |

---

## Section 1: `.playfield` — Strip the Chrome

### Remove
- `background: color-mix(...)` — the translucent tint
- `border: 1px solid ...` — the hairline rim
- `box-shadow: inset ..., 0 30px 60px ...` — both the inner top recession shadow and the outer drop shadow
- `border-radius: clamp(...)` — no longer needed without a visible container
- `padding: clamp(...)` — no longer needed without a visible container

### Keep
- `position: relative` — anchors absolutely-positioned children (the new floor)
- `width: 100%; max-width: 1280px` — layout constraint
- `transform-style: preserve-3d` — required for block translateZ floats
- `transform: rotateX(...) rotateY(...)` (desktop) — the isometric tilt + parallax
- `transition: transform 200ms ease-out` — parallax smoothing
- `--parallax-x`, `--parallax-y` defaults

The playfield becomes an invisible 3D transform host. Its children (grid, floor) inherit the tilt and parallax response as a single rigid scene.

---

## Section 2: `.viewport` — The Room

The viewport gains four flat-to-camera atmospheric cues, layered as comma-separated radial gradients in a single `background` declaration:

| Cue | Position | Size | Color | Opacity |
|---|---|---|---|---|
| Ceiling light | `50% 0%` | `60% 40%` | `var(--cube-ceiling)` | 0.18 |
| Floor glow | `50% 100%` | `80% 30%` | `var(--cube-floor-glow)` | 0.12 |
| Corner caustic | `100% 0%` | `30% 30%` | `var(--cube-caustic)` | 0.22 |
| Vignette | `50% 50%` | `closest-side` (inverted) | `var(--cube-vignette)` | 0.0 → 0.45 |

These are **flat to the camera** — they do not tilt with the playfield's 3D transform. They're rendered onto the viewport's background, painting "the room you're standing in" while the playfield is "the cube you're looking into."

### New theme tokens (add to `src/styles/tokens.css`)

For each theme block (`modern-vibrant`, `classic`, `pastel`, `arcade-neon`):
```css
--cube-ceiling:    /* a soft warm or cool tint, theme-appropriate */;
--cube-floor-glow: /* a warm low-saturation tint */;
--cube-caustic:    /* an accent color from the theme's palette */;
--cube-vignette:   /* a darker version of --bg */;
```

Concrete values per theme will be tuned during implementation. Suggested starting points:
- **modern-vibrant** (dark bg): ceiling = `#a8a8c0` 18%, floor-glow = `#ff9d4a` 10%, caustic = `#4ad4ff` 22%, vignette = `#000`
- **classic** (black bg): ceiling = `#888` 14%, floor-glow = `#00f0f0` 8%, caustic = `#00f0f0` 20%, vignette = `#000`
- **pastel** (cream bg): ceiling = `#fff` 30%, floor-glow = `#ffb5a7` 14%, caustic = `#ffb5a7` 18%, vignette = `#2a2a2a` 25% (gentler)
- **arcade-neon** (deep purple bg): ceiling = `#ff00ff` 16%, floor-glow = `#ff00ff` 12%, caustic = `#00ffff` 26%, vignette = `#000`

---

## Section 3: `.floor` — The Glass Floor With Block Bloom

### DOM placement

```jsx
<div className={styles.viewport}>
  <div ref={playfieldRef} className={styles.playfield}>
    <div className={styles.floor} data-floor aria-hidden="true" />
    <div className={styles.grid} data-grid>
      {/* blocks */}
    </div>
  </div>
</div>
```

The floor is a sibling of `.grid`, not a child. Both live inside `.playfield` and inherit its `transform-style: preserve-3d`.

### Geometry

```css
.floor {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60%;
  transform: rotateX(90deg) translateZ(-1px);
  transform-origin: bottom center;
  pointer-events: none;
  opacity: 0.35;
}
```

- `rotateX(90deg)` lays the plane flat. After the rotation, the plane's original Y axis maps to depth into the cube.
- `translateZ(-1px)` prevents Z-fighting with the lowest blocks at parallax extremes.
- `transform-origin: bottom center` hinges the plane from the front-bottom edge of the cube — so it recedes *away* from the viewer.
- `opacity: 0.35` is the "subtle" intensity the user picked. Tunable.

### Block bloom layout

Seven radial gradients stacked in `background`. After `rotateX(90deg)`, gradient `at <X> <Y>` maps to (cube horizontal, cube depth). Higher Y = deeper in the cube.

```css
.floor {
  background:
    /* hero — left half, mid-depth */
    radial-gradient(ellipse 35% 25% at 25% 35%,
      color-mix(in srgb, var(--c-hero-bloom) 60%, transparent) 0%,
      transparent 70%),
    /* brand — right side, deep back */
    radial-gradient(ellipse 30% 20% at 58% 12%,
      color-mix(in srgb, var(--c-brand-bloom) 60%, transparent) 0%,
      transparent 70%),
    /* about — far right, mid-back */
    radial-gradient(ellipse 30% 22% at 83% 30%,
      color-mix(in srgb, var(--c-about-bloom) 60%, transparent) 0%,
      transparent 70%),
    /* work — center-right, mid */
    radial-gradient(ellipse 28% 22% at 58% 55%,
      color-mix(in srgb, var(--c-work-bloom) 60%, transparent) 0%,
      transparent 70%),
    /* services — far right, mid-front */
    radial-gradient(ellipse 30% 22% at 83% 60%,
      color-mix(in srgb, var(--c-services-bloom) 60%, transparent) 0%,
      transparent 70%),
    /* process — left half, near front */
    radial-gradient(ellipse 35% 22% at 25% 88%,
      color-mix(in srgb, var(--c-process-bloom) 60%, transparent) 0%,
      transparent 70%),
    /* contact — right half, near front */
    radial-gradient(ellipse 35% 22% at 75% 88%,
      color-mix(in srgb, var(--c-contact-bloom) 60%, transparent) 0%,
      transparent 70%);
}
```

### `--c-*-bloom` tokens (NEW, REQUIRED)

The existing `--c-hero` (modern-vibrant, pastel) is a `linear-gradient(...)` value. `color-mix()` only accepts solid colors, so we cannot use `--c-hero` directly in the bloom gradient. We add seven new solid-color tokens per theme:

```css
[data-theme="modern-vibrant"] {
  --c-hero-bloom:     #ff3d7f;  /* dominant stop of the hero gradient */
  --c-brand-bloom:    #ffffff;
  --c-about-bloom:    #4ad4ff;
  --c-work-bloom:     #ffd93d;
  --c-services-bloom: #7ef078;
  --c-process-bloom:  #c678ff;
  --c-contact-bloom:  #ff6b6b;
}

[data-theme="classic"] {
  --c-hero-bloom:     #00f0f0;
  --c-brand-bloom:    #ffffff;
  --c-about-bloom:    #f0f000;
  --c-work-bloom:     #a000f0;
  --c-services-bloom: #00f000;
  --c-process-bloom:  #f0a000;
  --c-contact-bloom:  #f00000;
}

[data-theme="pastel"] {
  --c-hero-bloom:     #ffb5a7;
  --c-brand-bloom:    #f8edeb;
  --c-about-bloom:    #a7d8ff;
  --c-work-bloom:     #ffe5a1;
  --c-services-bloom: #b8e8b8;
  --c-process-bloom:  #d8b9ff;
  --c-contact-bloom:  #ffc9c9;
}

[data-theme="arcade-neon"] {
  /* Neon theme blocks have bg = page color (#0a0018) and glow color on --c-*-fg.
     The bloom should use the glow color, not the bg. */
  --c-hero-bloom:     #ff00ff;
  --c-brand-bloom:    #00ffff;
  --c-about-bloom:    #00ff88;
  --c-work-bloom:     #ffff00;
  --c-services-bloom: #ff8800;
  --c-process-bloom:  #ff00ff;
  --c-contact-bloom:  #ff0066;
}
```

For solid-color blocks, `--c-*-bloom` equals the existing `--c-*` value. For gradient blocks (hero in modern-vibrant and pastel), the bloom uses the dominant stop. For the neon theme (where `--c-*` is the page bg and the visual color lives on `--c-*-fg`), the bloom uses the glow color.

---

## Section 4: Responsive & Accessibility Behavior

### `<1024px` (mobile + tablet)
- Floor element: `display: none`. Without the desktop tilt, the floor would render as a flat horizontal stripe with no perspective sense.
- Viewport atmospherics: kept (cheap, still helps the visual mood).

### `prefers-reduced-motion: reduce`
- Floor element: `display: none`. The floor's effect comes from the parallax tilt; without it, it's just colored noise at the bottom.
- Viewport atmospherics: kept (they don't move).

### `aria-hidden="true"` on `.floor`
The floor is purely decorative. Screen readers should ignore it.

---

## Section 5: Files Changed

| File | Change |
|---|---|
| `src/components/TetrisGrid/TetrisGrid.module.css` | Strip `.playfield` chrome; add `.floor` styles |
| `src/components/TetrisGrid/TetrisGrid.tsx` | Insert `<div className={styles.floor} aria-hidden="true" />` inside `.playfield`, before `.grid` |
| `src/styles/tokens.css` | Add `--c-*-bloom` tokens (7 per theme × 4 themes); add `--cube-ceiling`, `--cube-floor-glow`, `--cube-caustic`, `--cube-vignette` per theme |

No global CSS changes — only the home page is a cube, so viewport atmospherics live in the TetrisGrid module.

No JS changes. No test changes expected (the existing playfield/parallax/gravity tests continue to pass; they don't assert chrome). If new tests are warranted (e.g., floor element exists in DOM at desktop), they'll be added in the implementation plan.

---

## Section 6: Risks & Mitigations

| Risk | Mitigation |
|---|---|
| 7 stacked radial gradients oversaturating the floor | Bloom radii capped at 35% × 25%; layer opacity 0.35; `color-mix` at 60% blends each stop with transparent before stacking |
| Floor plane Z-fighting with lowest blocks at parallax extremes | `translateZ(-1px)` offset on the floor |
| GPU shimmer on rotated gradient planes (some Intel/older GPUs) | No `will-change` on `.floor`; keep parallax range tight (already true) |
| `color-mix` not supported in older browsers | Graceful degradation: gradient stop falls back to plain color, bloom appears slightly bolder. Acceptable. |
| Removing `.playfield` chrome could leave the page feeling "empty" in light themes (pastel) | Pastel theme gets a stronger `--cube-vignette` and warmer `--cube-floor-glow` to compensate |
| Floor bloom assumes desktop grid layout, but layout is set via media query | Floor is hidden below 1024px (same breakpoint as the desktop grid) — bloom positions are guaranteed correct |

---

## Section 7: Out of Scope

- **No B/C cube approaches.** Edge hairlines, back wall, side panes, ceiling plane — all deferred.
- **No per-block animated bloom.** The bloom is static (driven by the active theme's tokens). If hover or drop animations should ripple the floor, that's a future enhancement.
- **No glass refraction shader / WebGL.** Pure CSS only.
- **No changes to `useGravityDrop`, `useGridParallax`, `useLineClear`.** They continue to operate on `.playfield` as before.

---

## Open Questions (resolve during implementation)

1. **arcade-neon `--c-*-bloom` values** — need to read the full theme block in `tokens.css` and pick representative solids.
2. **Should the viewport atmospherics live in `TetrisGrid.module.css` or in `globals.css`?** — currently the viewport is a module class. If the cube illusion should also apply to inner pages (about, work, etc.), the gradients belong globally. Default: keep in the module for now; only the home page is a cube.
3. **Bloom positions for pastel theme** — pastel's lighter background may need slightly higher bloom opacity (0.45 vs 0.35) to read at all. Tune during impl with visual inspection.
