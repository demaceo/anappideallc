# UI/UX, Accessibility & Responsive Audit — anappidea.llc

> **Date:** 2026-08-22
> **Scope:** the live production site (www.anappidea.llc) and the source in `src/`
> **Method:** the deployed build was mirrored locally and driven in Chromium at
> 320 / 360 / 390 / 540 / 768 / 1440px across 10 routes. Contrast was measured by
> resolving each computed color through a canvas (the site's computed values are
> `oklch()`, which naive parsing misreports). Every number below was measured,
> not estimated; each finding notes how it was confirmed.

This supersedes `ux-critique.md`, which reviewed the retired Tetris-bento /
glass-cube / "Velvet Stage" design and no longer describes this site.

---

## Scorecard

| Dimension | Score | Rationale |
|---|---|---|
| Visual design / brand | **7**/10 | Distinctive and confident; undermined by three competing visual languages |
| Typography | **5**/10 | Great display face; `font-weight: 500` is a no-op ×11, 35 ad-hoc sizes, outlined keyword illegible |
| Layout & spacing | **6**/10 | Clean hairline grid; 44 ad-hoc spacing values, dead spacing scale, thin content density |
| Accessibility | **6**/10 | Above-average baseline; 4 real contrast failures, focus lost in closed panels, no skip link |
| Responsive design | **6**/10 | Thoughtful breakpoints and nav collapse; horizontal scroll on project pages at every phone width, FAB covered copy on mobile |
| Navigation & IA | **5**/10 | Good sticky collapse; no active state, Contact/Support absent from nav, no footer nav |
| Content & conversion | **6**/10 | Genuinely strong copy and a best-in-class wizard; no CTA above the fold |
| Robustness / progressive enhancement | **3**/10 | Hero silently disappears on non-supporting browsers |
| **Overall** | **6.0**/10 | Strong point of view and real craft, held back by a handful of concrete defects |

### What is working and should be protected

- **The hero line.** "Got an app idea? / *Let's build it.*" with the yellow
  knockout is the strongest thing on the site — specific, confident, and it
  answers the visitor's question in six words.
- **The sticky masthead collapse.** Measured 442px → 80px on desktop and
  453px → 93px on mobile. The tuning is genuinely good; it reclaims the screen
  without ever feeling jumpy.
- **The full-bleed riso color blocks.** Yellow / ink / lime / orange / lavender
  with 4px ink borders and film grain is a real point of view, and the ink-on-color
  contrast is excellent throughout (15.5:1 on yellow, 8.2:1 on orange, 7.7:1 on lavender).
- **The contact wizard.** The best-designed thing here. Every question optional,
  "not sure" always offered, error copy that names the actual problem and jumps
  back to the step that needs it, and a voice-note fallback. Keep this.
- **The writing.** Honest, human, and specific — "Most 'AI-powered' apps are a
  single API call in a modal" earns more trust than any amount of polish.
- **The engineering baseline.** Prerendered routes, JSON-LD, reduced-motion
  handling, `focus-visible` rings, `aria-expanded`/`aria-controls`, `role="alert"`,
  and an existing WCAG contrast pass that fixed most of the muted-label problem.

---

## P0 — The hero silently disappears without scroll-timeline support

**Files:** `src/styles/globals.css` — the `*-collapse` keyframes and the eight
rules that consumed them.

The sticky header was driven by `animation: <name> linear both` plus
`animation-timeline: scroll(root)`, with **no `@supports` guard anywhere in the
file** (verified: zero matches).

The `animation` shorthand resets `animation-duration`. Browsers that support
scroll-driven animations resolve that to `auto` (the full timeline range).
Browsers that do **not** resolve it to `0s` — and a `0s` animation with
`fill-mode: both` completes instantly and pins the element to its **end**
keyframe forever.

Measured by stripping `animation-timeline` in-page on the live build:

| | with support | without support |
|---|---|---|
| `h1` font-size | 68px | **21.6px** |
| `.subtitle` | visible | **`max-height: 0`, `opacity: 0`** |
| `.overline` | visible | **`opacity: 0`** |
| `.date-line` | visible | **`opacity: 0`** |
| header height | 442px | 80px |

So on **iOS ≤ 18, Firefox ESR 140, and older Chrome/Edge**, the homepage loads
permanently collapsed: no headline, no subtitle, no eyebrow, no email line — on
every route. The value proposition never renders at all. This is invisible to
anyone testing in a current browser, which is why it survived.

Worth pinning down how far inside the support window this reached. The project
sets no `build.target` and ships no browserslist, so Vite 8's default applies —
`baseline-widely-available`, which resolves to:

```
["chrome111", "edge111", "firefox114", "safari16.4", "ios16.4"]
```

`animation-timeline` did not reach Safari until **26**. Every Safari and iOS
version from **16.4 through 25** therefore sat inside the project's own declared
support target while receiving a hero that never rendered — this was not an
edge case at the far margin of support, it was most of the declared range.

(Checked and cleared while confirming the above: the CSS minifier rewrites all
18 width media queries into Media Queries Level 4 range syntax — `width<=640px`
rather than `max-width: 640px`. Range syntax also landed in Safari 16.4, so
that output is exactly consistent with the target and is **not** a defect.)

**Fixed** by wrapping every collapse rule in
`@supports (animation-timeline: scroll(root))`. Unsupported browsers now get the
static full-size masthead declared in the base rules, which is the correct
fallback and needs no other change.

---

## P1 — Defects

### The outlined keyword is illegible, worst on mobile

**File:** `src/styles/globals.css` — `.outline-word`

`-webkit-text-stroke: 3px` was a **fixed** width while the heading scales
`clamp(1.5rem, 4.2vw, 2.5rem)`. At 390px the `h2` renders at ~24px, so a 3px
stroke plus Unbounded 900's negative tracking merged adjacent letterforms into a
single shape. Confirmed visually at both 1440px and 390px on "WHAT I **BUILD**",
"WHAT **SHIPS** HERE", "WHY A **BUILDER**, NOT JUST A BOT" and "START A
**CONVERSATION**".

The design intent is sound, but the outlined half is the *keyword* of every
section heading — so the least legible word was consistently the most important
one.

**Fixed** with an em-relative stroke (`max(1.5px, 0.045em)`) so it tracks the
type, positive letter-spacing scoped to the outlined word so hollow forms get
the extra air they need, and a solid fill below 640px where even a scaled stroke
crowds.

### The Contact FAB prints on top of body copy on mobile

**Files:** `src/styles/globals.css` — `.contact-fab`; `src/components/ContactFAB/ContactFAB.tsx`

`body { padding-bottom: 5rem }` only protects the **end** of the document. The
FAB is `position: fixed`, so it paints over whatever happens to be mid-scroll.
At 390px the text column runs nearly edge to edge, so the full-width pill landed
directly on paragraph text and clipped words mid-sentence. Confirmed on `/`
("…so C‹olorado's› / Black-owned businesses ar‹en't›…") and on `/work`
("…nothing happens / until a human approves it").

**Fixed** by collapsing the FAB to a 48px icon-only disc below 480px — same
affordance, a fraction of the footprint — with `env(safe-area-inset-*)` and an
opaque ring so it reads as a distinct floating object over any section color.
The visible label is swapped for a `IconSend` glyph; the link's `aria-label`
carries the accessible name in both states.

**Residual:** a corner disc still overlays a ~48px square of the text column.
Fully eliminating the overlap would mean docking the CTA as a full-width bottom
bar and reserving matching `body` padding — a larger design decision, left open.

### Closed accordion panels keep focusable links

**Files:** `src/pages/Services.tsx`, `src/styles/globals.css` — `.svc-panel`

`grid-template-rows: 0fr` plus `overflow: hidden` collapses a panel **visually
only**. Measured on `/services`: all five `.svc-cta` links reported
`height: 48px`, no `hidden`, no `inert`, and all five sat in the tab order
regardless of open state. The actual tab sequence was:

```
trigger 01 → [invisible] "Start here" → trigger 02 → [invisible] "Start here" → …
```

Keyboard focus vanished off-screen five times on one page. WCAG 2.4.3 (Focus
Order) and 2.4.7 (Focus Visible).

**Fixed** with the `inert` attribute on closed panels — they leave the tab order
and the accessibility tree while their content stays in the DOM for crawlers,
which is what the original `0fr` approach was reaching for.

### Focus jumped to `<main>` on first load, skipping the nav — and there was no skip link

**File:** `src/components/RouteFocusReset.tsx`

`useEffect(…, [pathname])` fires on **mount**, not just on navigation. Measured
on a fresh load of `/services`: `document.activeElement` was `MAIN.container`
(tabindex −1), and the **first Tab landed on the accordion** — the back-home
button and all four nav links were reachable only by Shift+Tab.

There was also **no skip link anywhere on the site** (verified: zero matches).
The net effect was backwards: the nav got skipped when you didn't want it, and
there was no way to skip it when you did.

**Fixed** two ways. `RouteFocusReset` now guards the first render with a ref
(mirroring the `prevStep` pattern already used in `src/pages/Contact.tsx`), so a
plain page load leaves focus where the browser put it and Tab starts at the top.
And a real skip link is now the first focusable element in `PageHeader`,
targeting `#main-content` — an id and `tabIndex={-1}` that every `<main>` now
carries, following the convention `LegalPage` already used.

---

## P1 — Also fixed

### Horizontal scroll on project pages at every common phone width

`.project-metrics-row` is a grid whose items default to `min-width: auto`, so a
track can never shrink below its content's min-content width. A long metric
value ("KMS-encrypted", "Live status") therefore pushed the row wider than the
viewport and scrolled the **whole document** sideways. Measured across a
320 / 360 / 390 / 540px sweep:

| viewport | `/work/stlmnt-settlement-tracker` | `/work/pinpoint-civic-engagement` |
|---|---|---|
| 320px | doc 378px (**+58px**) | doc 401px (**+81px**) |
| 360px | doc 378px (**+18px**) | doc 401px (**+41px**) |
| 390px | clean | doc 401px (**+11px**) |
| 540px | clean | clean |

390px is the iPhone 14/15/16 Pro viewport, so this affects the single most
common phone width — not just small legacy devices.

**Fixed** with `min-width: 0` on `.project-metric-cell` and `.project-stat-item`
so the tracks can shrink, `overflow-wrap: break-word` on `.project-metric-value`
so a long token wraps inside the cell instead of spilling out of it, and a
single column below 400px where two columns can no longer hold a metric value
at its `clamp()` floor.

---

## P2 — Open (documented, not yet fixed)

### Four measured contrast failures

| Ratio | Needs | Element | Where |
|---|---|---|---|
| **1.60**:1 | 4.5 | `::placeholder` — `--c-bg-faint` at 18% alpha, 13px | contact form (the typed value is 17.6:1) |
| **2.66**:1 | 4.5 | `.project-stat-label`, `opacity: 0.4`, 10px | every project detail page |
| **3.06**:1 | 4.5 | `.overline a` breadcrumb — `--c-fg-soft` 0.6 × `opacity` 0.75 compounded | every project detail page |
| **3.57**:1 | 4.5 | `.stat-box.positive .stat-num` at 18.4px | home, **mobile only** — 24px on desktop clears the 3:1 large-text bar |

The existing WCAG block near the end of `globals.css` already fixed this whole
class of problem; these four selectors were simply missed. Note that
`.project-metric-label` was raised to 0.75 but its sibling `.project-stat-label`
was left at 0.4.

Invisible form placeholders on the conversion-critical page are the most
consequential of these.

### `font-weight: 500` renders as 400 — 11 silent no-ops

`index.html` loads Space Mono at **400 and 700 only**. The CSS font-matching
algorithm resolves a desired weight of 500 down to 400 when 400 is available (it
only synthesises above 500). Measured rendered widths for the same string:

| weight | width |
|---|---|
| 400 | 190.00px |
| **500** | **190.00px** |
| 600 | 183.03px |
| 700 | 183.03px |

So `.stat-pill strong`, `.source-list li strong`, `.project-stat-value`,
`.svc-num`, `.contact-fab-label`, `.sources-header h3`, `.chip.selected`,
`.rating-opt.selected` and `.feature-cta` all render with **no emphasis at all**.
The hierarchy the CSS describes never reaches the screen.

Related: **Unbounded 700 is downloaded but never used** — only 400 and 900 are
referenced — and can come out of the font request.

### The design system is half-wired

Verified usage counts across `src/`:

- **`--s-1` … `--s-10`, the entire spacing scale: 0 uses.** Meanwhile there are
  **44 distinct rem values** across `padding` / `margin` / `gap`.
- **35 distinct font sizes** across 109 `font-size` declarations. No type scale.
- Dead tokens: `--c-cta`, `--bw-brutal-lg`, `--neon-yellow`, and the entire
  "compat alias" block (`--ink`, `--paper`, `--accent`, `--muted`, `--rule`,
  `--panel`, `--white`, `--navy`, `--gold`) — all 0 uses. Their comment says
  "keep until every consumer reads the new tokens directly"; that migration is
  finished.
- `.section--pink` / `--c-pink` — defined, never applied.

Roughly 20 of 62 declared tokens are dead. `--c-cta` is documented as *the*
primary-conversion color, but every real CTA uses the neon system instead.

The colour half of the system is genuinely well-built. Spacing and type are not
a system at all yet — they're ad hoc values that happen to look consistent.

### Navigation and IA gaps

- `SiteNav` uses `Link`, not `NavLink` — there is **no active state and no
  `aria-current="page"` anywhere on the site** (verified: zero matches). A
  visitor cannot tell which section they are in.
- The nav is **About / Work / Services / Process** only. **Contact** is reachable
  only through the floating FAB; **Support** and **Why not AI** only through
  in-body prose.
- **The footer has zero navigation links** — four non-interactive text rows and
  social icons. That is a wayfinding miss and a lost internal-linking surface.
- Footer email addresses are **plain text, not `mailto:` links**.
- Decorative CSS `content` glyphs land in accessible names: every nav link
  announces as "**↳** About", list items as "**↳** …", `.feature-cta` as
  "View case study **↗**", `.section-num` as "**[** Services **]**". Pseudo-element
  content cannot be `aria-hidden`, so these need to move to `background-image`
  or into an `aria-hidden` span.

---

## P3 — Open (minor)

- **The reduced-motion guard misses the actual CTAs.** The guard kills animation
  on `.neon-btn`, but the shipped CTAs are `.consult-cta-btn` (`neonPulse`,
  infinite) and `.svc-cta` (`neonRotateAngle`, infinite) — neither carries
  `.neon-btn`. Hovering "Book a time" still pulses forever under
  `prefers-reduced-motion`.
- **Sub-24px tap targets** (WCAG 2.2 SC 2.5.8): the breadcrumb "Work" at 47×16
  and `.project-back-link` at 76×18. Both are standalone links, so the
  inline-in-a-sentence exception does not apply.
- **Half the first screen is masthead** — 442/900px on desktop (49%), 453/844px
  on mobile (54%) — and it contains **no call to action**. The first actionable
  element on the page is the corner FAB.
- **Positional index coupling** in `Work.tsx` (`PROJECT_LOGOS[i]`,
  `STUDY_LABELS[i]`), `About.tsx` (`DIFF_ICONS[i]`) and `Process.tsx`
  (`PROCESS_ICONS[i]`). This is the same bug already fixed in `Home.tsx`, whose
  comment records that a new entry "used to render `undefined` as a component
  here and crash the page". The keyed-record pattern exists in `Home.tsx` and
  `ProjectDetail.tsx`; these three files never adopted it.
- **`.sources-section { margin-top: 3.5rem }`** leaves a bone seam between the
  full-bleed lavender block and the black footer on Home. It reads as a glitch
  rather than a divider.
- **`CustomCursor` hides the system cursor** site-wide on fine pointers
  (`cursor: none`), replacing it with an 18px `mix-blend-mode: difference` dot
  and no opt-out. `prefers-reduced-motion` is not a good proxy for "I want my
  cursor back".
- **No LinkedIn** (`SITE.social.linkedin: ''`). For a founder-led B2B studio
  that is the single most load-bearing credibility profile.

---

## Opportunities

These are not defects — they are the changes most likely to move the numbers.

**Content density.** The loud sections are mostly padding. Section 03 is one
heading plus one `.verdict-box` wrapped in ~96px top and bottom; the ink section
is a single pullquote in a ~430px band. Either give these blocks more to say —
proof, client logos, a metric, a face — or tighten `.section-band`. Right now the
page reads as more scroll than substance.

**Measure.** Space Mono as the *body* face yields roughly 28 characters per line
at 390px, well under the 45–75 ideal, so paragraphs run very tall on mobile and
the eye works harder than it should. Keeping mono for labels, metadata and
eyebrows while moving body copy to a proportional face would buy real
readability without costing any of the brand's edge.

**Three visual languages in one page.** Bone/ink brutalism, loud riso colour
blocks, and cyberpunk neon slabs (`#0a0f1c` with cyan/green glow). The neon set
owns *every* primary CTA while belonging to none of the rest of the system — a
dark glowing pill inside a bone card on a lavender field is three grammars in
one component. Deriving the CTA treatment from the brutalist vocabulary instead
would tighten the brand considerably, and `--c-cta` is already defined and
waiting for exactly that job.

**A CTA above the fold.** Half the first screen is masthead and none of it is
actionable. A single button under the subtitle — "Book a free call" — would give
the strongest copy on the site somewhere to land.

**No pricing or engagement signal** anywhere on the site. Every visitor has to
book a call to learn whether they are in range, which filters out qualified
founders and admits unqualified ones. Even a band ("MVP engagements typically
run $X–$Y") or an engagement model would let people self-qualify.

---

## Verification harness

The measurements above are reproducible against a local `pnpm preview`:

- **Scroll-timeline fallback** — strip `animation-timeline` from the collapse
  rules in-page and read back `h1` font-size and `.subtitle` computed styles.
  With the `@supports` guard in place the hero must stay at 68px and visible.
- **Contrast** — resolve every text element's computed `color` and its nearest
  opaque ancestor `background-color` through a 1×1 canvas, composite alpha and
  inherited `opacity`, then compute the WCAG ratio. Parsing the strings directly
  does not work: the computed values are `oklch()`.
- **Overflow** — compare `document.documentElement.scrollWidth` against
  `clientWidth` at 320 / 360 / 390 / 540px and report the widest offending
  element.
- **Focus order** — press Tab from a fresh load and record `document.activeElement`
  at each stop; assert no stop lands inside a closed accordion panel.
