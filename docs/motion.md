# Motion & layout system — anappidea.llc

How scroll motion and the wide-grid layout work, and how to add a new scene.

## Rules

1. **Markup is the finished picture.** Numbers are real, scenes are drawn,
   card borders are there. Motion only animates *toward* that state, so
   prerendered HTML, no-JS, and reduced-motion visitors lose nothing.
2. **Text never hides behind animation.** No word-splitting or fade-in copy
   (`src/__tests__/motion.test.tsx` fails if `data-split` / `data-reveal`
   come back). Only geometry, borders, and numbers move.
3. **Reduced motion never loads GSAP.** `motionAllowed()` bails first.
4. **No layout shift.** Scenes reserve their box with `aspect-ratio`; brand
   fonts have metric-matched fallbacks in `src/styles/tokens.css`.

## Engine — `src/motion/useScrollScenes.ts`

Runs once in the app shell (`src/App.tsx`) and re-initializes on every route.
GSAP, ScrollTrigger, DrawSVG, and MorphSVG are lazy-imported. Everything runs
inside `gsap.matchMedia()` with two tiers:

| Tier | Query | Behavior |
| --- | --- | --- |
| `desktop` | ≥ 1024px, motion allowed | Scenes sit sticky beside their chapter (`.split`) and play across it |
| `compact` | < 1024px, motion allowed | Scenes play as they scroll past, never pinned |

Attribute hooks it reads:

| Hook | Effect | Rendered by |
| --- | --- | --- |
| `[data-count]` | Counts up to the rendered value once | `<Counter>` (`src/components/Counter`) |
| `[data-frame]` | SVG rect draws itself around its card | `StoryChapter` |
| `[data-marquee]` | Marquee speed follows scroll velocity | `Marquee` |
| `[data-ghost]` | Watermark word parallax | `GhostWord` |
| `[data-tilt]` | Card tilts toward the pointer (fine pointers) | any card |
| `[data-scene]` | Runs that scene's timeline | `<Scene>` |

## Adding a scene

1. **Markup:** `src/components/scenes/<Name>Scene.tsx`. Wrap an inline SVG
   (viewBox `0 0 400 400`) in `<Scene name="<name>">`, drawn in its finished
   state. Use the `.scene-line`, `.scene-dot`, `.scene-fill`, `.scene-accent`
   classes so it matches the ink-and-chartreuse style. Mark animated parts
   with a data attribute (Unfold uses `data-uf`).
2. **Timeline:** `src/motion/scenes/<name>.ts`, default-exporting a
   `SceneSetup`. `gsap.set()` the opening state, then build one scrubbed
   timeline that ends on the markup's state. `matchMedia` reverts it all.
3. **Register** it in `SCENES` in `src/motion/scenes/index.ts` (code-split:
   pages only download the scenes they render).
4. **Place** it: `<div className="split"><StoryChapter id="…" /><NameScene /></div>`.
5. **Test** that it server-renders its finished state (see `motion.test.tsx`).

## Layout tokens and grids

- `--shell` (1200px) container; prose capped at `--measure` (62ch).
- `.grid-2` / `.grid-3`: card grids; `.feature-item` rows become cards inside
  them. Collapse to one column below 768px (`.grid-3` → two below 1024px).
- `.split`: chapter + scene; single column with the scene first below 1024px.
- `--sticky-offset` clears the collapsed sticky header (123px on Home).
- Masthead spacing tokens (`--masthead-pad-*`, `--dateline-gap`) are shared by
  the base rules and the scroll-collapse keyframes; change them in one place.
