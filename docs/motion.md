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

## Scenes

| Page | Scene | Story beat |
| --- | --- | --- |
| Home | `unfold` | Cube → phone → browser, then a key slides in: built for you, handed to you |
| About | `accumulation` | 36 triangles settle into one shape, base first: "an accumulation" |
| Work | `thread` | One line threads five framed nodes, one per mission app |
| Services | `split` | A square splits into BUILT and HANDED halves |
| Process | `timeline` | Five phase nodes morph from circles into shapes; the last is the key |
| Why not AI | `network` | Machine nodes rewire through one human node at the center |
| Contact | `door` | A door swings open onto chartreuse light |

Shape data shared by markup and timelines lives in `src/motion/scenes/geometry.ts`.

### How a scene plays (`sceneTimeline` in `src/motion/scenes/helpers.ts`)

- **Near the top of the page** (on screen, or nearly, at load): plays once at a
  fixed speed (~2.5s) as soon as the whole scene is in view. There's no
  stable scroll run to scrub across there: the header's collapse moves the
  layout for the first ~200px.
- **Further down:** scrubs to scroll. It never starts before the header has
  finished collapsing, gets at least 240px of scroll, and always finishes
  while the whole scene is still visible below the header.
- Verified by walking every page in 20px steps at 1440, 1024, and 390px wide:
  every scene finishes fully visible.

## Adding a scene

1. **Markup:** `src/components/scenes/<Name>Scene.tsx`. Wrap an inline SVG
   (viewBox `0 0 400 400`) in `<Scene name="<name>">`, drawn in its finished
   state, on `<SceneGrid />`. Use the `.scene-line`, `.scene-tile`,
   `.scene-dot`, `.scene-accent`, `.scene-light` classes so it matches the
   ink-and-chartreuse style. Mark animated parts with `data-p="name"` and
   select them with `parts(el)` from `helpers.ts`.
2. **Timeline:** `src/motion/scenes/<name>.ts`, default-exporting a
   `SceneSetup`. `gsap.set()` the opening state, then chain tweens onto
   `sceneTimeline(api)` so the timeline ends on the markup's state.
   `matchMedia` reverts it all.
3. **Register** it in `SCENES` in `src/motion/scenes/index.ts` (code-split:
   pages only download the scenes they render).
4. **Place** it: `<div className="split"><StoryChapter id="…" /><NameScene /></div>`.
5. **Test:** add it to `SCENE_CASES` in `motion.test.tsx` with a marker only
   its finished state contains.

## Layout tokens and grids

- `--shell` (1200px) container; prose capped at `--measure` (62ch).
- `.grid-2` / `.grid-3`: card grids; `.feature-item` rows become cards inside
  them. Collapse to one column below 768px (`.grid-3` → two below 1024px).
- `.split`: chapter + scene; single column with the scene first below 1024px.
- `--sticky-offset` clears the collapsed sticky header (123px on Home).
- Masthead spacing tokens (`--masthead-pad-*`, `--dateline-gap`) are shared by
  the base rules and the scroll-collapse keyframes; change them in one place.
