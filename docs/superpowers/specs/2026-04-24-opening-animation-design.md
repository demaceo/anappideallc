# Opening Animation — Design Spec
**Date:** 2026-04-24
**Status:** Approved for implementation

---

## Overview

Enhance the TetrisGrid opening animation from a simple gravity drop to a choreographed sequence with physical weight, staggered narrative, and a secondary content reveal. The same treatment applies to the reverse fly-in when a visitor navigates back to `/`.

The Tetris metaphor is made more expressive: small blocks scaffold the grid first, the hero crashes in last as a payoff, and every block's content (title, subtitle, CTA) bursts in after it settles — making the information feel earned rather than instant.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Concept | Weighted Drop+ (refine current) | Deepens existing metaphor rather than replacing it |
| Stagger order | Small blocks first, hero last | Build-up → payoff; hero earns its entrance |
| Landing impact | Heavy (squash + content burst) | Physical weight, Tetris-faithful, memorable |
| Return animation | Same treatment as entry | Consistent experience; visitor deserves the full payoff on return too |

---

## Section 1: Entry Animation — `useGravityDrop`

### Stagger Order

Blocks drop in this sequence (absolute delay from animation start):

| Block | Delay | Notes |
|---|---|---|
| brand | 0 ms | |
| about | 110 ms | |
| services | 210 ms | |
| work | 310 ms | |
| process | 390 ms | |
| contact | 460 ms | |
| **hero** | **600 ms** | Always last |

### Non-Hero Block Keyframes (WAAPI)

Duration: 800–900 ms (randomised ±50 ms for organic feel)
Easing: `cubic-bezier(0.55, 0.085, 0.68, 0.53)` (gravity-in)

```
offset 0.00  translateY(-130%)  opacity:0         easing: gravity-in
offset 0.03  opacity:1                            (fades in during fall)
offset 0.20  translateY(0)                        (lands)
offset 0.26  scaleX(1.06) scaleY(0.90)           (squash on impact)
offset 0.32  scaleX(0.98) scaleY(1.02) translateY(-6px)  (bounce up)
offset 0.38  scaleX(1) scaleY(1) translateY(0)   (settle)
```

### Hero Block Keyframes (WAAPI)

Duration: 980–1020 ms
Easing: `cubic-bezier(0.55, 0.02, 0.65, 0.40)` (heavier gravity)

```
offset 0.00  translateY(-140%) scaleX(0.90) scaleY(1.10)  opacity:0
offset 0.04  opacity:1                                     (fades in during fall)
offset 0.22  translateY(0) scaleX(0.90) scaleY(1.10)      (arrives elongated)
offset 0.28  scaleX(1.10) scaleY(0.87)                    (big squash)
offset 0.35  scaleX(0.96) scaleY(1.04) translateY(-13px)  (big bounce)
offset 0.42  scaleX(1) scaleY(1) translateY(0)            (settle)
```

### Content Reveal

After each block settles, its child elements animate in via WAAPI. Target elements are queried with `el.querySelectorAll('[data-reveal]')` (DOM order: title → subtitle → cta).

Each child keyframe:
```
from  opacity:0  translateY(6px)  filter:blur(2px)
to    opacity:1  translateY(0)    filter:blur(0)
```

- Duration: 380 ms, easing: `ease-out`
- Start delay: `settleMs + (childIndex × 80 ms)`
  - `settleMs` = block's absolute delay + (duration × settle_offset_fraction)
  - settle_offset_fraction: 0.38 for non-hero, 0.42 for hero
- `fill: 'backwards'` so children are invisible before their delay fires

### Unchanged Behaviour

- Once-per-session guard (`SESSION_KEY` in sessionStorage) — unchanged
- Return-flag check (`RETURN_FLAG`) — unchanged; if returning from a non-root path, gravity drop is skipped in favour of the reverse fly-in
- `prefers-reduced-motion` guard — unchanged; all animations skipped, session flag set immediately

---

## Section 2: Return Animation — `useLineClear`

Applied when a visitor lands on `/` with `RETURN_FLAG` set (browser back, HomeIcon click, programmatic `navigate('/')`).

### Stagger Order

Faster gaps than entry (visitor already knows the grid):

| Block | Delay | Notes |
|---|---|---|
| brand | 0 ms | |
| about | 60 ms | |
| services | 120 ms | |
| work | 180 ms | |
| process | 240 ms | |
| contact | 300 ms | |
| **hero** | **420 ms** | Always last |

### Non-Hero Block Keyframes (WAAPI)

Duration: 480 ms
Easing: `cubic-bezier(0, 0, 0.2, 1)` (deceleration)

```
offset 0.00  translate(tx vw, ty vh) rotate(rot deg)  opacity:0
offset 0.05  opacity:1
offset 0.80  translate(0, 0) rotate(0)                (arrives)
offset 0.88  scaleX(1.06) scaleY(0.90)                (squash on arrival)
offset 0.94  scaleX(0.98) scaleY(1.02) translateY(-4px)  (small bounce)
offset 1.00  scaleX(1) scaleY(1) translateY(0)        (settle)
```

FLY vectors (`tx`, `ty`, `rot` per blockId) remain exactly as defined in the existing `FLY` map.

### Hero Block on Return

Same heavier keyframes as entry squash (`scaleX(1.10) scaleY(0.87)`, bounce `-10px`), duration 520 ms.

### Content Reveal on Return

Identical keyframes and stagger as entry (opacity/translateY/blur, 380 ms ease-out, 80 ms between children).

Start delay per child: `settleMs + (childIndex × 80 ms)`

- `settleMs` = block's absolute delay + (duration × 1.00)
  — the return animation settles at the final keyframe (offset 1.00), so content fires immediately after the block comes to rest
- Non-hero example: `delay(0–300 ms) + 480 ms + child offset`
- Hero example: `420 ms + 520 ms + child offset`

### Unchanged Behaviour

- `playOutAndNavigate` (forward fly-out on click) — untouched
- FLY scatter vectors — untouched
- Framer Motion `layoutId` morph on the clicked block — untouched
- `prefers-reduced-motion` guard — unchanged

---

## Section 3: Block.tsx — Queryability

`useGravityDrop` and `useLineClear` need to target child elements by stable selectors. CSS module class names are hashed in production builds, making `querySelector('[class*="title"]')` unreliable.

**Change:** Add `data-reveal` attributes to the three child spans:

```tsx
<span data-reveal="title" className={styles.title}>{title}</span>
{subtitle ? <span data-reveal="subtitle" className={styles.subtitle}>{subtitle}</span> : null}
{cta ? <span data-reveal="cta" className={styles.cta}>{cta} →</span> : null}
```

`el.querySelectorAll('[data-reveal]')` returns them in DOM order (title, subtitle, cta), which matches the desired reveal sequence. Blocks with no subtitle or cta simply have fewer children to animate — no special-casing needed.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/TetrisGrid/useGravityDrop.ts` | New stagger order; squash + bounce keyframes; hero special treatment; child content reveal via `[data-reveal]` |
| `src/components/TetrisGrid/useLineClear.ts` | Stagger on reverse fly-in; squash + bounce on arrival; child content reveal |
| `src/components/TetrisGrid/Block.tsx` | `data-reveal` attributes on title, subtitle, cta spans |

No new files. No CSS changes. No changes to routing, parallax, or theme logic.

---

## Timing Summary

Full entry sequence (first visit): ~1.4 s from first block drop to last hero content reveal
Full return sequence: ~1.0 s (faster stagger, visitor already oriented)

Both sequences remain well under 2 s — the threshold where entrance animations start feeling like loading delays rather than welcome choreography.
