# Design Spec — UI v2.0 (Photorealistic Dimensionality)

> Date: 2026-05-24
> Scope: Full UI/UX redesign — photoreal dimensionality, depth, texture, futuristic UX
> Approach: Editorial Hardware material + Velvet Stage / Aurora Portal environment + Rube Goldberg interaction layer + single-thread line system + 4-theme roster (each theme owns its world)
> Status: Approved for implementation planning

---

## 1 · Context & Goal

v1.0 shipped the Regal Builder identity (`docs/superpowers/specs/2026-04-25-regal-builder-redesign-design.md`) — one canonical `modern-vibrant` theme, Tetris bento grid, glass cube illusion, gravity-drop intro, line-clear navigation. It addressed the brand-coherence and mobile critiques from `docs/ux-critique.md`.

v2.0 is the next-level evolution. The brief: *"add photorealistic dimensionality, depth, and texture for a more advanced, supreme, and futuristic UX."* The brainstorming process (see session memory + `.superpowers/brainstorm/*/content/*.html` for the visual mockups) converged on a specific design: Editorial Hardware blocks on a Velvet Stage with an Aurora Portal Hero, layered with a Rube Goldberg interaction model where a single continuous thread physically connects the grid and triggers chain-reaction navigation. The Tetris-bento concept survives; what changes is the depth of material treatment, the environment around the blocks, and the interaction model that powers navigation.

The design also folds in three v1 critiques that were deferred: the Brand block now earns its real estate by acting as the entry point to a Materials panel; inner pages get a coherent visual language tied to the home (closing the "experience cliff"); and the Rube Goldberg layer turns "show off" into "show what I can build for you" — every click demonstrates a service.

---

## 2 · Locked Decisions Summary

| Axis | Decision | Source |
|---|---|---|
| Material | **Editorial Hardware** — anodized metal cushion + brushed micro-grain + glass caustic edge bloom + pearl rim | Blend 3 in `material-blends.html` |
| Environment | **Velvet Stage** (warm spotlight on deep burgundy fabric floor) + **Aurora Portal Hero** (hero block is a window into an aurora chamber) | Fusion 3 in `environment-fusion.html` |
| Tech ambition | **Volumetric WebGL** (React Three Fiber + Rapier physics) | Approach C in `approaches.html` |
| Per-section material | **Unified Hardware default** with 7-preset Materials Panel accessed via Brand block | `materials-panel.html` |
| Theme roster | **modern-vibrant (canonical)**, **classic**, **moss** (replaces pastel), **crochet** (replaces arcade-neon) | `craft-themes.html` + terminal confirmation |
| Per-theme environments | **Each theme owns its world** (velvet+aurora / minimalist / terrarium / cozy weave) | Terminal confirmation |
| Interaction model | **Path B — Merge: Editorial Hardware Machine.** Single-thread line physically connects all 6 grid blocks; clicking a block fires a Rube Goldberg sub-sequence (thread tightens → mechanism fires → block opens into inner page) | `rube-goldberg-and-line.html` |
| Single-thread tier | **Tier 3 (reactive cursor-tracked)** for ambient state, drives to **Tier 4 (3D thread)** during chain-reaction sequences | Same |
| Rube Goldberg tier | **Tier 2 (2D physics)** via Rapier2D for the per-block mechanism cascade | Same |

---

## 3 · Goals & Non-Goals

### 3.1 Goals
- Photoreal material fidelity (anodized metal, brushed grain, glass caustics) at hero scale and grid scale
- Two distinct environmental rooms in the canonical theme (velvet showroom + aurora chamber) with a narrative transition between them via the Hero portal
- Per-section material identity available on-demand through the Materials Panel (default unified; 6 alternate finishes + a "Showcase" mix)
- A single continuous thread physically connecting all six bento blocks, animating as a Rube Goldberg chain reaction during navigation
- Three additional themed "worlds" (classic, moss, crochet) each with their own materials AND their own environment
- Maintain v1's brand commitments: gravity-drop intro, Konami code easter egg, Plausible analytics, prerendered routes
- Solve v1 UX critiques: #3 (inner-page experience cliff), #5 (Brand block does nothing), #8 (mobile loses magic)

### 3.2 Non-Goals
- We are not abandoning the Tetris-bento grid or the 6-block content architecture
- We are not building a full 3D first-person scene (Path C / Tier 4 was rejected)
- We are not committing to per-theme Materials Panel variants — Materials Panel is exclusive to `modern-vibrant`
- We are not redesigning copy or content hierarchy in this spec (a separate `content` cycle if needed)
- We are not introducing CMS or runtime content sources (data still in `src/data/*.ts`)
- We are not adding analytics or tracking beyond existing Plausible setup

---

## 4 · Visual System

### 4.1 Editorial Hardware — the canonical block material

Each block is treated as a precious anodized hardware object. The material is built in CSS layers on top of an R3F-rendered base — a hybrid approach where the surface geometry, lighting, and caustic come from WebGL, and the chunky 3D cushion form, multi-layer shadows, and color tinting are CSS.

**Layer stack** (back to front):
1. **Body** — diagonal multi-stop gradient: `bloom-dark → bloom → bloom-bright → bloom → bloom-dark` (135°)
2. **Brushed micro-grain** — `repeating-linear-gradient(118deg, transparent 0 2px, rgba(255,255,255,0.045) 2px 3px)` with `mix-blend-mode: screen`
3. **Diagonal specular highlight** — `linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.25) 100%)`
4. **Pearl rim** — `inset 0 0 0 1px rgba(255,255,255,0.18)` + `inset 0 2px 0 rgba(255,255,255,0.5)` + `inset 0 -2px 0 rgba(0,0,0,0.4)`
5. **Cushioned shadow stack** — `0 18px 0 rgba(0,0,0,0.42)` (offset shadow, gives chunk) + `0 36px 70px rgba(bloom, 0.35)` (colored bloom) + `0 50px 80px rgba(0,0,0,0.45)` (atmospheric)
6. **Glass caustic floor spill** — `::after` pseudo: `radial-gradient(closest-side, var(--bloom-bright), transparent 70%)` blurred 10px, positioned below the block

This stack ships as a CSS module + a small R3F overlay layer; the WebGL piece adds pointer-tracked specular reflection that rakes across all blocks.

### 4.2 Per-section bloom tokens

Each section keeps its v1 color identity but new tokens describe the three-stop gradient. Tokens defined in `tokens.css` per theme:

| Section | --bloom-dark | --bloom | --bloom-bright |
|---|---|---|---|
| hero | `#8a0144` | `#d90368` | `#ff5e98` |
| about | `#b07700` | `#ffb800` | `#ffe066` |
| brand | `#a89a82` | `#f1e9da` | `#ffffff` |
| work | `#0d3d2b` | `#1f6f50` | `#4cb589` |
| services | `#006e68` | `#00b4aa` | `#5be3dc` |
| process | `#5a3618` | `#C47820` | `#e8a85a` |
| contact | `#8a0144` | `#d90368` | `#ff5e98` |

The v1 `--c-hero`, `--c-about` etc. tokens remain (they're consumed by inner-page headers); the new `--bloom-*` triples drive the v2 block material gradient.

### 4.3 The Aurora Portal (Hero block special-case)

The Hero block is materially identical to the others (same anodized shell, same shadows) but its center is *cut out* and replaced with a window into an aurora chamber. Implementation: inner element with `inset: 14px; border-radius: 18px; overflow: hidden;` containing the aurora composition (two large radial gradients in cyan and magenta, deep-space gradient backing, scattered stars, optional drifting particles).

The aurora's color animation runs continuously at ambient state (slow drift, ~30s cycle) and intensifies during a Rube Goldberg sequence triggered on click.

---

## 5 · Scene Architecture

### 5.1 Velvet Stage (canonical home environment)

The home grid sits inside the Velvet Stage — a 3D-tilted floor plane with woven fabric texture, deep burgundy-to-near-black radial gradient, a warm overhead spotlight, and a heavy inset vignette.

**CSS structure:**
- `.stage` (the AppShell viewport wrapper) — `position: relative; perspective: 1400px;`
- `.stage-floor` — absolute-positioned, `bottom: 0`, `height: 45-50%`, `transform: rotateX(48deg)` + `transform-origin: top center`. Background: layered `repeating-linear-gradient` (woven micro-pattern) on top of `radial-gradient(120% 70% at 50% 100%, rgba(80,15,40,0.95), rgba(20,5,10,0.95) 100%)`.
- `.stage-spot` — absolute, top-anchored, `radial-gradient(50% 60% at 50% 0%, rgba(255,255,230,0.18) 0%, transparent 70%)`
- `.stage-vignette` — absolute, full-bleed, `box-shadow: inset 0 0 140px rgba(0,0,0,0.75)`

The Tetris bento grid is positioned inside the stage at `z-index: 2`. Block parallax (from v1's `useGridParallax`) continues to work — the velvet floor stays still; blocks tilt.

### 5.2 Aurora Chamber (post-portal inner environment)

When the visitor clicks the Hero portal, the camera (CSS perspective + `<motion>` orchestration) "pushes through" the portal window: the velvet stage recedes downward, the aurora composition envelops the viewport, and the Hero inner page (Contact) materializes inside the aurora chamber.

**Aurora composition tokens** (added to `:root` for `modern-vibrant`):
```css
--aurora-cyan: radial-gradient(60% 80% at 30% 30%, rgba(80,200,255,0.35), transparent 70%);
--aurora-magenta: radial-gradient(70% 60% at 80% 70%, rgba(217,3,104,0.5), transparent 70%);
--aurora-gold: radial-gradient(60% 60% at 50% 100%, rgba(255,212,0,0.32), transparent 70%);
--aurora-stars: /* 6-8 small radial-gradient stars at fixed positions */;
--aurora-vignette: inset 0 0 100px rgba(0,0,0,0.55);
```

The aurora chamber serves only the `/contact` route (clicked via Hero portal). All other inner pages (About, Work, Services, Process) get the Velvet Vitrine treatment.

### 5.3 Velvet Vitrine (default inner-page environment)

For non-Hero block clicks, the inner page is presented as if the clicked block has *opened* on the velvet stage to reveal its contents. Same stage, same velvet floor, same spotlight — but the clicked block has scaled up and unfurled to fill ~60% of the viewport with its content surface visible. The other 5 blocks recede into the background, dimmed and out of focus.

This solves v1 UX critique #3 (inner page "experience cliff") by carrying the velvet-stage atmosphere all the way through.

---

## 6 · Component Architecture

### 6.1 New components

```
src/components/
├── Stage/
│   ├── VelvetStage.tsx           — wraps AppShell, renders floor/spot/vignette
│   └── VelvetStage.module.css
├── AuroraChamber/
│   ├── AuroraChamber.tsx          — alternate stage for /contact post-portal
│   └── AuroraChamber.module.css
├── MachineGrid/                   — replaces TetrisGrid (see 6.2)
│   ├── MachineGrid.tsx
│   ├── MachineGrid.module.css
│   ├── Block.tsx                  — refactored, uses --bloom-* tokens
│   ├── Block.module.css
│   ├── HeroPortal.tsx             — hero block subclass with aurora window
│   ├── HeroPortal.module.css
│   ├── ThreadLine.tsx             — SVG single-thread connecting all blocks
│   ├── ThreadLine.module.css
│   ├── ChainReaction/             — Rube Goldberg interaction layer
│   │   ├── ChainReactionScene.tsx — Rapier2D world + gadget orchestration
│   │   ├── gadgets/Marble.tsx
│   │   ├── gadgets/Lever.tsx
│   │   ├── gadgets/Domino.tsx
│   │   ├── gadgets/Pendulum.tsx
│   │   ├── gadgets/Pulley.tsx
│   │   └── useChainSequence.ts    — declarative chain definition + playback
│   └── hooks/
│       ├── useGridParallax.ts     — preserved from v1
│       ├── useGyroParallax.ts     — preserved from v1
│       ├── useGravityDrop.ts      — preserved from v1
│       └── useSpecularPointer.ts  — NEW: pointer-tracked light rake
├── MaterialsPanel/
│   ├── MaterialsPanel.tsx         — drawer overlay with 7 swatches
│   ├── MaterialsPanel.module.css
│   └── useMaterial.ts             — context provider + localStorage
├── Webgl/
│   ├── SceneRoot.tsx              — top-level <Canvas> + lighting
│   ├── SpecularLight.tsx          — pointer-tracked spotlight rig
│   └── ThreadMesh.tsx             — optional tier-4 3D thread (TubeGeometry)
└── ...existing components preserved
```

### 6.2 TetrisGrid → MachineGrid refactor

The v1 `TetrisGrid` component is renamed `MachineGrid` to reflect the new role. Public API stays close to v1's: it still renders the 7 BLOCKS array, still uses parallax + gravity-drop hooks. New responsibilities:
- Tracks current `material` via context (from MaterialsPanel)
- Emits chain-reaction events when a block is clicked (instead of immediate navigation)
- Hosts the `<ThreadLine>` SVG layer absolutely positioned over the grid
- Hosts the `<ChainReactionScene>` Rapier physics layer absolutely positioned

### 6.3 Component responsibilities

| Component | Responsibility | Depends on |
|---|---|---|
| `VelvetStage` | Renders floor + spot + vignette environmental layer | nothing |
| `AuroraChamber` | Renders aurora composition for /contact route | nothing |
| `MachineGrid` | Lays out 7 blocks, hosts thread + chain reaction layers | VelvetStage |
| `Block` | Renders single block w/ Editorial Hardware material | useMaterial, useGridParallax |
| `HeroPortal` | Hero variant with aurora window inside | Block, aurora tokens |
| `ThreadLine` | SVG path connecting all 6 block centers; animates per chain state | MachineGrid layout refs |
| `ChainReactionScene` | Rapier2D world; on click, plays the gadget sequence for that block | MachineGrid block refs |
| `MaterialsPanel` | Bottom drawer with 7 material swatches, triggered by Brand block tap | useMaterial |
| `SceneRoot` | Single `<Canvas>` instance for ambient WebGL effects | R3F |
| `SpecularLight` | Drives `--specular-x` and `--specular-y` CSS custom props from pointer position | SceneRoot, pointer events |

---

## 7 · The Rube Goldberg Interaction Layer

### 7.1 Single-thread line system

A single continuous SVG path connects all 7 blocks at their centers in a serpentine route: `hero → brand → about → work → services → process → contact → hero` (closed loop). The path is rendered in a `<ThreadLine>` SVG layer positioned absolutely over the grid with `pointer-events: none`.

**Ambient state:** path is fully drawn, stroked at 1.5px in a near-transparent gold (`rgba(255,212,0,0.18)`). Subtle 8s ease-in-out shimmer cycles `stroke-opacity` between 0.12 and 0.24.

**Cursor-tracked state (Tier 3):** when the cursor approaches within 60px of a block, the segment of thread between the cursor and that block's center brightens to `rgba(255,212,0,0.55)` and pulses faintly. This is the "you can pluck this string" tell.

**Chain-reaction state:** when a block is clicked, the thread between the clicked block and the next block in sequence becomes the chain's spine. Each gadget along that thread fires in sequence, the thread visibly tightens (animated via `pathLength` from current draw to 1), and the navigation completes only after the last gadget fires.

### 7.2 Per-block chain reaction (the Rube Goldberg mechanism)

When a block is clicked, a per-block sequence plays — each sequence is a different gadget composition demonstrating a different studio capability. The sequence is short (~1.2s) and choreographed; the user can't interact with it mid-flight but can skip via Escape or pointer-tracked cancellation.

| Clicked block | Gadget sequence | Service demonstrated |
|---|---|---|
| Hero | Marble drops → bell rings → aurora chamber opens (Velvet → Aurora transition) | Hero/Contact narrative — "ring the bell, let's talk" |
| About | Pendulum swings → triggers a label flip revealing portrait | Founder presence — personal, hand-crafted |
| Work | Marble cascade → 5 dominos fall → Work block tilts open | Shipped iteration — visible cause + effect |
| Services | Lever raises → flag unfurls → Services block scrolls reveal | Operational systems — clear, mechanical |
| Process | Pulley pulls → curtain rises → Process block reveals steps | Process — orderly, sequential, ratcheted |
| Contact | Spring releases → letter slides out | Contact — the deliverable |
| Brand | (Special, `modern-vibrant` only) No chain reaction — opens Materials Panel drawer instead. In `classic` / `moss` / `crochet` themes, Brand reverts to a standard `/about` navigation (with chain reaction matching the theme's aesthetic) | Studio identity |

Gadget rendering is **Rapier2D + a thin CSS layer** — Rapier handles physics simulation (gravity, collisions, constraints), CSS handles the visual styling of each gadget. No 3D models needed for tier 2.

### 7.3 Implementation specifics

- **Physics world:** single `<ChainReactionScene>` instance, world bounds match the velvet stage viewport
- **Gadget assets:** SVG illustrations for each gadget (marble, lever, domino, pendulum, pulley, spring) styled in Editorial Hardware aesthetic — chunky cushioned shapes in gold/cream/magenta
- **Sequencing:** Each gadget has an `onTrigger` and `onComplete` callback. `useChainSequence` declares the sequence as an array; playback uses Rapier's `step()` loop with event listeners on collision events
- **Cancellation:** `Escape` key, route programmatic cancel, or `prefers-reduced-motion: reduce` all collapse the sequence to immediate navigation
- **Performance:** the physics scene only mounts during an active chain reaction. At rest, only the thread line SVG layer is in the DOM (cheap)

### 7.4 Reduced-motion path

`@media (prefers-reduced-motion: reduce)`: chain reactions are skipped entirely. Click → immediate route change with a cross-fade. The thread line still renders statically but does not shimmer. This is a hard requirement — accessibility cannot be compromised by the chain reaction.

---

## 8 · Single-Thread Line System (deep dive)

The thread is rendered as a single SVG `<path>` whose `d` attribute is recomputed when the grid layout changes (resize, theme switch, parallax tilt). The path connects block centers via cubic Bézier curves, with anchor points 30px outside each block and control points biased toward the next block's center.

**Path animation states:**
- `idle` — `pathLength: 1`, `stroke-opacity: animated 0.12↔0.24, 8s cycle`
- `cursor-near` — segment `pathLength` partial, brightness 0.55 on the active segment
- `chain-active` — `pathLength: 0 → 1` over the chain sequence duration, segment darkens as gadgets pass

The path is updated via Framer Motion's `motion.path` with `pathLength` and a CSS variable for color. The computed `d` string is recalculated only on layout changes (debounced via `ResizeObserver`), not every frame.

**Optional Tier-4 upgrade (post-launch):** swap the SVG path for a Three.js `TubeGeometry` rendered inside `SceneRoot`. The 3D thread casts real shadows on the velvet floor and can wrap around 3D gadget objects. Same data model (control point array), different renderer. Phased — not in v2.0 launch.

---

## 9 · Materials Panel

### 9.1 Trigger

The Brand block (the cream "AAI" tile in the bento grid) is the entry point. Click → drawer slides up from the bottom of the viewport with a 320ms `cubic-bezier(0.16, 1, 0.3, 1)` easing.

A subtle micro-interaction telegraphs the affordance: every ~30s the Brand block emits a soft gold pulse glow (`box-shadow` animation over 1.5s, then fades), gently inviting curiosity without becoming noise.

The Brand block's previous navigation target (`/about`) is moved to a dedicated nav-bar link in the persistent header (also new for v2 — see §11).

### 9.2 Panel UI

Bottom drawer overlay:
- Background: `linear-gradient(180deg, rgba(20,12,30,0.9), rgba(10,6,20,0.98))` + `backdrop-filter: blur(20px)`
- Top border: `1px solid rgba(255,255,255,0.1)`
- Header: "MATERIALS" left-aligned, meta text "Each preset applies globally · saved to localStorage" + close (✕)
- Body: 7-column grid of swatches (each ~80px square, rotated `rotateX(6deg) rotateY(-3deg)` for depth)
- Active swatch: 2px gold outline + label colored gold

### 9.3 Seven presets

| Order | Preset | Description |
|---|---|---|
| 1 | **Anodized** *(default)* | Editorial Hardware magenta — the canonical Block material |
| 2 | Polished Steel | Mirror-grade chrome with vertical horizon-reflection gradient |
| 3 | Gold Leaf | Soft hand-applied warm gold with imperfect specular spots |
| 4 | Frosted Glass | Translucent teal with backdrop-filter blur |
| 5 | Patinated Bronze | Warm oxidized copper with multiply-blend patina overlay |
| 6 | Cream Ceramic | Matte warm cream with subtle radial highlight |
| 7 | **Showcase** | Per-section distinct materials: Hero = anodized w/ aurora window, About = gold leaf, Brand = cream ceramic, Work = polished steel, Services = frosted glass, Process = patinated bronze, Contact = anodized (mirrors Hero) |

### 9.4 Switch animation

Preset change triggers a 600ms transition on the four core bloom CSS custom properties + the shadow stack: `--bloom-dark`, `--bloom`, `--bloom-bright`, `--block-shadow-stack`. Transitions are declared globally:

```css
.block { transition:
  --bloom-dark 600ms cubic-bezier(0.4, 0, 0.2, 1),
  --bloom 600ms cubic-bezier(0.4, 0, 0.2, 1),
  --bloom-bright 600ms cubic-bezier(0.4, 0, 0.2, 1),
  box-shadow 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

`@property` declarations register the bloom tokens as `<color>` types so they animate smoothly (without `@property`, custom-prop transitions hard-cut).

Reduced-motion: `transition-duration: 0`.

### 9.5 Persistence

`localStorage['material']` — `'anodized' | 'steel' | 'gold' | 'frosted' | 'bronze' | 'ceramic' | 'showcase'`. Bootstrap script in `index.html` reads this before first paint and sets a `data-material` attribute on `<html>` (alongside the existing `data-theme`).

### 9.6 Scope limitation

**Materials Panel is exclusive to `modern-vibrant`.** When the active theme is `classic`, `moss`, or `crochet`, the Brand block reverts to its `/about` navigation behavior and the panel is not available. This is a deliberate scope decision — each non-canonical theme has its own visual identity that doesn't benefit from material presets. If we add a Materials Panel for other themes later, it's a separate cycle.

---

## 10 · Per-Theme Worlds

Each theme owns its block material, its environment, and its lighting story.

### 10.1 modern-vibrant (canonical) — Editorial Hardware on Velvet+Aurora

Already specified in §4–7. Materials Panel available. Rube Goldberg chain reaction active. This is the default theme and where the spec is most detailed.

### 10.2 classic — Refined Minimalist

v1's classic theme survives unchanged in concept (high-contrast, geometric, black/white/primary accents) but gets the Editorial Hardware shadow + cushion treatment. The blocks are still flat-colored CMY/RGB but they have the chunky 3D cushion form and pearl rim.

**Environment:** No velvet. No aurora. A clean dark backdrop with a subtle grid mesh on the floor (perspective-tilted, faint white lines on near-black). Editorial-clinical, like a tech keynote stage at rest.

**Material:** `--bloom-dark`, `--bloom`, `--bloom-bright` derived from each section's existing classic color (e.g. for `--c-work = #a000f0`, the triple becomes `#5a008a`, `#a000f0`, `#c860ff`).

**Rube Goldberg:** Active, but gadgets are rendered as line-drawings in white stroke on black — matching the minimalist aesthetic.

### 10.3 moss — Sunlit Terrarium

A complete tonal pivot. Blocks are rendered as moss/succulent material via baked 4K PNG texture (see §13.3 for the texture pipeline). Each block is one tinted variant of the same source PNG.

**Environment:** Bright, sunlit. Background: linear-gradient from soft sky-blue at top to warm cream-green at bottom. Floor: warm wood grain texture (separate baked PNG, tile-aligned with viewport). Drifting motes simulate sunlight through foliage.

**Material recipe per block:**
```
background: var(--moss-texture-url);   /* tiled 4K PNG */
background-blend-mode: multiply;
background-color: var(--bloom);         /* tints the moss to the section color */
filter: saturate(1.1) brightness(1.05);
```

Stitching effect: a separate SVG overlay layer with tiny succulent rosettes at strategic positions.

**Rube Goldberg:** Gadgets are illustrated in a hand-drawn folk-art style — wooden marbles, twig levers, leaf-shaped dominos. Same physics, different aesthetic.

### 10.4 crochet — Cozy Weave

Blocks rendered as crochet yarn material via baked 4K PNG texture (separate from moss). Same tint-via-multiply approach.

**Environment:** Warm cozy domestic. Background: cream-to-burnt-sienna radial gradient. Floor: linen weave texture (third baked PNG). Soft warm light from upper-left.

**Stitching detail:** Inline SVG overlay of crisp yarn loop pattern at block edges, ensuring the texture stays sharp at all zooms (PNG handles bulk, SVG handles fine detail).

**Rube Goldberg:** Gadgets are yarn-themed — yarn ball marble, knitting needle lever, spool dominos. Whimsy fits the cozy aesthetic.

### 10.5 Theme switcher behavior

The existing v1 ThemeSwitcher (Konami code unlock) is preserved but slightly relocated. When `modern-vibrant` is active, Konami opens both the Materials Panel and a small Theme toggle inside it (allowing switching between the 4 themes from the same place). When a non-canonical theme is active, the Brand block reverts to `/about` (as noted), and the Konami still opens a minimalist Theme toggle.

---

## 11 · Inner Page Treatment

### 11.1 Persistent navigation (closes v1 critique #4)

A persistent header navigation bar appears on all inner-page routes (`/about`, `/work`, `/services`, `/process`, `/contact`). It does NOT appear on `/`. The header is minimal: studio mark (links home), 5 inner-page links, current page indicated by underline + gold dot. Theme-aware styling: it inherits the active theme's foreground color.

This solves "no persistent navigation" — visitors can flow About → Work → Services without returning home.

### 11.2 Velvet Vitrine inner-page layout (default for 5 routes)

When a non-Hero block is clicked:
1. Chain reaction fires (~1.2s)
2. The clicked block visibly scales up and "opens" — its top face rotates back, content slides up from inside
3. Other blocks remain visible on the velvet stage but dim to ~30% opacity, slightly out of focus
4. The opened block becomes a content surface ~60% of viewport width, centered, with the page content (still using Editorial Hardware shadow/material treatment) rendered on it

This means inner pages share the velvet stage with the home, just with one block "elevated and opened" — closing the experience cliff.

Page content layout within the elevated block:
- Header: the section's color band (`--c-{section}`) plus heading typography (Syne 800)
- Body: text content uses Bricolage Grotesque (from v1)
- Cards/grids: inherit the Editorial Hardware mini-block treatment (chunky shadow, pearl rim, brushed grain)

### 11.3 Aurora Chamber inner-page layout (/contact only)

Hero portal click → camera push → aurora chamber materializes. The Contact form floats in the aurora as glass panes (acrylic, frosted, subtly tinted aurora colors). Form inputs use the Editorial Hardware aesthetic but on a frosted-glass surface instead of opaque metal.

### 11.4 Back navigation

A persistent "back to home" affordance: the existing v1 `HomeIcon` component is preserved and visible on all inner routes. Clicking it triggers a *reverse* chain reaction — the velvet stage assembles back, the clicked block's contents close back into the block, and the visitor lands back on home. Round-trip narrative.

---

## 12 · Mobile Strategy

v1's critique #8 said mobile loses the magic — `@media (max-width: 1023px)` disables all 3D transforms. v2 changes the strategy: mobile gets a *different but equally magical* experience, not a flat fallback.

### 12.1 Mobile layout

The bento grid stacks vertically (single column on phones, 2-col on tablets). Each block keeps its Editorial Hardware treatment — the chunky cushion, brushed grain, pearl rim, and cushioned shadow all survive at mobile sizes.

### 12.2 Gyro parallax (preserved from v1)

v1's `useGyroParallax` hook continues to drive the specular highlight angle. Tilting the phone shifts where light catches across the blocks. This is the primary "magical" interaction on mobile.

### 12.3 Mobile chain reactions

On tap, a *simplified* chain reaction plays — vertical cascade variant of each gadget sequence. The physics still runs (Rapier2D is lightweight) but the gadget count is reduced to 1-2 per sequence (vs. 3-4 on desktop) to keep the duration under 0.8s on mobile.

### 12.4 Aurora portal on mobile

Hero portal on mobile is a vertical "rocket window" oriented portrait — the aurora chamber opens by pushing the velvet stage *down* and replacing it with the aurora. Same narrative, different geometry.

### 12.5 Low-tier degrade

For devices reporting `prefers-reduced-data: reduce` OR `deviceMemory < 4` OR `hardwareConcurrency < 4`: WebGL `<SceneRoot>` does not mount. The chain reactions still play (Rapier2D is CPU-cheap) but ambient pointer-tracked light is disabled. Static fallback styling kicks in.

---

## 13 · Tech Stack Additions

### 13.1 New runtime dependencies

| Package | Version target | Purpose | Bundle impact |
|---|---|---|---|
| `@react-three/fiber` | ^9.x | React renderer for Three.js | ~120KB gzip |
| `@react-three/drei` | ^10.x | Helper components (orbit controls, post-processing) | ~80KB gzip (tree-shakeable) |
| `three` | ^0.170 | Underlying 3D engine | ~150KB gzip |
| `@dimforge/rapier2d-compat` | ^0.14 | 2D physics for chain reactions | ~250KB gzip (WASM) |

Total v2 bundle add: ~600KB gzip — within the budget we agreed to in Approach C. Existing `motion`, `react-router` continue.

### 13.2 No-package additions

- SVG `<ThreadLine>` uses raw SVG + Framer Motion's existing `motion.path` — no new lib
- Materials Panel uses existing motion + CSS — no new lib
- VelvetStage and AuroraChamber are pure CSS — no new lib

### 13.3 Texture asset pipeline

For `moss` and `crochet` themes, the baked PNG textures live in `public/textures/`:

```
public/textures/
├── moss-2k.webp          (~250KB, 2048×2048, base tone)
├── crochet-2k.webp       (~280KB, 2048×2048, base tone)
├── velvet-floor-2k.webp  (~180KB, used by modern-vibrant velvet stage)
└── wood-floor-2k.webp    (~220KB, used by moss theme floor)
```

Format: WebP (better compression than PNG, supported by all target browsers).
Tileable: top edge matches bottom, left matches right.
Color: desaturated neutral so CSS `mix-blend-mode: multiply` with section bloom colors recolors at runtime.

Generation: AI image gen with prompts specified in the brainstorm transcript (the user owns the prompts and will produce the source PNGs). Verification: use Photoshop's `Filter → Other → Offset` half-tile to confirm seamless tileability.

Loading: lazy-loaded per active theme. `modern-vibrant` and `classic` users never download moss or crochet textures.

### 13.4 SSR/SSG considerations

The existing prerender pipeline (`scripts/prerender.mjs`) generates static HTML for the 6 routes. v2 must respect this:

- All static markup (headers, body content, copy) must render server-side as before
- The `<SceneRoot>` `<Canvas>` element is React-hydrated only on the client (`'use client'`-style guard); SSR returns a placeholder div with matching dimensions to avoid layout shift
- The `<ChainReactionScene>` Rapier physics layer is similarly client-only — gracefully absent during SSR
- The thread line SVG path renders statically server-side (it's pure SVG) — only the cursor-tracked highlight is client-only

This means: a user with JS disabled OR a search crawler still sees a fully laid-out, accessible, content-complete page — just without the WebGL specular layer, chain reactions, or pointer-tracked thread brightening.

---

## 14 · Performance Strategy

### 14.1 Initial load budget

- **LCP target:** < 2.5s on a 4G/Moto G4-equivalent device
- **FID target:** < 100ms
- **CLS target:** < 0.1
- **Bundle:** Initial JS chunk ≤ 80KB gzip (current v1 baseline); additional v2 chunks lazy-loaded

### 14.2 Lazy loading strategy

| Chunk | Trigger |
|---|---|
| `webgl` (R3F, Three, drei) | First pointer move OR first scroll OR 2000ms idle, whichever first |
| `rapier` (Rapier2D WASM) | First block hover |
| `materials-panel` | Brand block click |
| `aurora-chamber` | Hero portal hover (preload) or click |
| Theme textures (moss/crochet) | Active theme switch |

### 14.3 Suspense boundaries

All R3F components wrapped in `<Suspense fallback={<StaticFallback />}>`. Fallback renders the static CSS-only version of the scene (no specular pointer light, no 3D thread upgrade). This means a user lands on a fully-rendered Editorial Hardware home page, and the WebGL polish layer crossfades in once loaded.

### 14.4 Frame-rate budget

- Velvet stage at rest: 0% CPU (pure CSS)
- Ambient WebGL specular: ≤ 5% CPU, 60fps target
- Chain reaction sequence: ≤ 25% CPU spike for ~1.2s, then idle
- Mobile: Rapier physics at 30fps simulation, 60fps render

### 14.5 prefers-reduced-motion

When set, the following effects are disabled:
- Parallax tilt (already handled in v1)
- Cursor-tracked specular light rake
- Thread line shimmer
- Chain reaction sequences (immediate route change)
- Materials Panel morph (instant swap)
- Aurora drift (held static)

The Editorial Hardware material (shadows, gradients, depth) remains — it's *static* depth, not motion.

---

## 15 · Accessibility

### 15.1 Keyboard navigation

All blocks are real `<a>` elements with focus rings. Pressing Enter on a focused block triggers the chain reaction (and the route change). Pressing Escape during a chain reaction cancels it and routes immediately.

The Materials Panel is a focus trap: focus enters on swatch 1, arrow keys move between swatches, Enter selects, Escape closes.

The Aurora Portal hero block has `aria-label="Open contact — through the aurora portal"` to telegraph the destination.

### 15.2 Screen reader compatibility

- Chain reaction sequences are visual-only. `aria-live` regions announce the destination route after the chain fires (e.g., "Navigating to Work").
- The thread line is purely decorative: `aria-hidden="true"` on the SVG layer.
- The R3F `<Canvas>` is also `aria-hidden` — its content is not semantic.

### 15.3 Focus management

After navigation, focus moves to the inner-page heading (preserved from v1's `RouteFocusReset`).

### 15.4 Contrast & color

- Block bloom + foreground text combinations must pass WCAG AA (4.5:1 for body, 3:1 for headings ≥ 24px). The Frosted Glass material requires special attention — its low-opacity background can degrade label contrast. Mitigation: add a subtle text-shadow on light text over frosted material.

---

## 16 · SEO

### 16.1 Prerender unchanged

The 6 routes continue to be statically rendered into the `dist/` build. New v2 components must either render their content server-side (most of them — the Editorial Hardware blocks, header text, body content all SSR fine) or fall back to a server-rendered placeholder.

### 16.2 Meta tags

No changes from v1's `RouteHead` SEO component.

### 16.3 Structured data

Optional addition (not blocking v2 launch): JSON-LD for `Organization`, `LocalBusiness`, `Person` (founder), and `Service` (each service listed). Helps Knowledge Graph picking up the studio's profile.

---

## 17 · Build Phasing

Eight phases, each independently shippable to a preview deployment for review.

### Phase 1 — Material system refactor *(~1 week)*
- Add `--bloom-dark`, `--bloom`, `--bloom-bright` tokens for all sections
- Refactor `Block.module.css` to use the new tokens
- Implement the layered Editorial Hardware material recipe
- Verify all 7 blocks render correctly on `modern-vibrant`

### Phase 2 — Velvet Stage + Aurora Portal Hero *(~1 week)*
- Implement `VelvetStage` component (floor + spot + vignette)
- Refactor `HeroPortal` to include the aurora window inner element
- Implement `AuroraChamber` for /contact route
- Animate the velvet → aurora transition

### Phase 3 — Materials Panel *(~1 week)*
- Implement `MaterialsPanel` drawer overlay
- Connect to Brand block trigger
- Implement 7 material presets via CSS custom property overrides
- Persist selection via `localStorage` + bootstrap script

### Phase 4 — Single-thread line system *(~1 week)*
- Implement `ThreadLine` SVG component
- Path generation from block layout refs
- Ambient shimmer animation
- Cursor-tracked segment brightening

### Phase 5 — Rube Goldberg chain reactions *(~2-3 weeks)*
- Set up Rapier2D physics world
- Build 6 gadget components (Marble, Lever, Domino, Pendulum, Pulley, Spring)
- Implement `useChainSequence` orchestrator
- Wire each block's click to its sequence
- Implement skip/cancel via Escape

### Phase 6 — Inner page treatments *(~2 weeks)*
- Implement Velvet Vitrine for 5 routes (block-opens-on-velvet pattern)
- Implement Aurora Chamber inner page for /contact
- Implement persistent navigation header
- Refactor `Page.module.css` to use Editorial Hardware sub-element styling

### Phase 7 — Per-theme worlds *(~2-3 weeks)*
- Implement `classic` refined-minimalist environment + materials
- Implement `moss` terrarium environment + baked texture material
- Implement `crochet` cozy-weave environment + baked texture material
- Per-theme Rube Goldberg gadget aesthetic variants
- Texture asset preparation (verification, optimization, WebP encoding)

### Phase 8 — Mobile + perf polish *(~1-2 weeks)*
- Mobile chain reaction variants (vertical cascade)
- Mobile aurora portal (rocket window orientation)
- Lazy-load tuning per chunk
- Lighthouse pass — verify LCP, FID, CLS targets
- Accessibility audit — keyboard, screen reader, contrast
- Reduced-motion verification across all v2 effects

**Total: ~11-14 weeks solo build.** Each phase can ship to preview independently; v2 launch is gated on all phases complete + the accessibility/perf audit clean.

---

## 18 · Open Questions

These are decisions intentionally deferred from this spec, to be resolved during implementation planning or as we go:

1. **Theme switcher placement.** v1 has it Konami-only. v2 may want a discoverable toggle inside the Materials Panel (for `modern-vibrant` users) plus Konami for all. To be confirmed during Phase 3.
2. **Sound design.** Not in scope for v2 launch, but the Rube Goldberg sequences are *begging* for sound. Could be a v2.1 enhancement.
3. **Idle attract loop.** If a visitor sits on the home page for 60s without interacting, should the chain reaction auto-fire once as a demo? Aesthetic decision — defer until we have the system working.
4. **Per-theme Materials Panel.** Currently scoped to `modern-vibrant` only. If user demand emerges, can be added per-theme later.

---

## 19 · Success Criteria

v2.0 ships when:

- All 8 phases are merged
- LCP < 2.5s, FID < 100ms, CLS < 0.1 on a mid-tier mobile device
- Keyboard navigation works through home + all inner pages
- Screen reader can navigate the bento grid and inner pages without confusion
- All 4 themes render correctly on Chrome, Safari, Firefox, mobile Safari, Chrome Android
- `prefers-reduced-motion: reduce` cleanly disables all motion effects without breaking layout
- Lighthouse Performance score ≥ 85, Accessibility score = 100
- Brand block's Materials Panel discoverable within 2 minutes for a first-time visitor (informal test)
- The Rube Goldberg chain reactions feel *crafted*, not random — each demonstrates its block's service

The deeper success criterion is qualitative: a founder visiting the site should think *"this person can build the thing in my head, and they take craft seriously."* The Editorial Hardware + Rube Goldberg combo demonstrates exactly that — care, craft, and the technical ability to ship sophisticated systems.

---

*Companion brainstorm artifacts:*
- `.superpowers/brainstorm/*/content/material-direction.html` — material direction decision
- `.superpowers/brainstorm/*/content/material-blends.html` — Editorial Hardware blend selection
- `.superpowers/brainstorm/*/content/environment.html` — environment direction
- `.superpowers/brainstorm/*/content/environment-fusion.html` — velvet+aurora fusion
- `.superpowers/brainstorm/*/content/approaches.html` — approach ambition selection
- `.superpowers/brainstorm/*/content/per-section-materials.html` — unified vs distinct materials
- `.superpowers/brainstorm/*/content/materials-panel.html` — Materials Panel design
- `.superpowers/brainstorm/*/content/craft-themes.html` — theme roster decisions
- `.superpowers/brainstorm/*/content/rube-goldberg-and-line.html` — interaction model + thread line
