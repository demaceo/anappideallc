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

Scored as found, with the score after this pass alongside. Nothing here is
graded on intent — every "after" is a re-measurement.

| Dimension | Before | After | What moved |
|---|---|---|---|
| Visual design / brand | **7**/10 | **7**/10 | Unchanged — the three competing visual languages are a design decision, still open |
| Typography | **5**/10 | **7**/10 | 11 no-op weights now render; outlined keyword legible at every size. 35 ad-hoc sizes remain |
| Layout & spacing | **6**/10 | **7**/10 | Footer seam gone, 23 dead tokens out. No enforced spacing scale yet — deliberately, see below |
| Accessibility | **6**/10 | **9**/10 | 0 contrast failures (was 4, plus a 5th on hover), skip link, `inert` panels, `aria-current`, decorative glyphs out of names, system cursor restored |
| Responsive design | **6**/10 | **9**/10 | No horizontal scroll at any width; FAB no longer covers copy |
| Navigation & IA | **5**/10 | **8**/10 | Active state + `aria-current`, footer index on all 8 pages, `mailto:` links |
| Content & conversion | **6**/10 | **7**/10 | Hero CTA above the fold, LinkedIn restored. Still no pricing signal |
| Robustness / progressive enhancement | **3**/10 | **9**/10 | Hero renders on every browser in the declared support target; guards are tested |
| **Overall** | **6.0**/10 | **7.9**/10 | The concrete defects are closed; what remains is design judgement |

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

## P2 — Fixed

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

**A fifth failure, worse than any of the above, only turned up during the fix.**
The sweep measures resting state — it never hovers. `.stat-box.positive` and
`.caution` invert on hover to a solid swatch fill with bone text, and the muted
label opacities (0.75 and 0.6) still apply on top of that already-tinted
ground:

| | before | after |
|---|---|---|
| hover `.stat-label-top` on green | **2.66**:1 | 4.59:1 |
| hover `.stat-desc` on green | **2.21**:1 | 4.59:1 |
| hover `.stat-desc` on gold | **2.25**:1 | 5.00:1 |

**Fixed** by darkening the only two swatches that carry text — green 58% → 52%
and gold 60% → 52% — which lifts both the resting numeral and the inverted
hover fill past AA, and by dropping the muted opacities on those inverted
states (size and tracking already mark the labels as secondary). The other five
swatches are glyph-only, sit under WCAG 1.4.11's 3:1 graphics floor, and keep
their original values. Placeholders got their own token rather than sharing
`--c-bg-faint`, which is correct at 0.18 for the hairlines it also feeds.

Re-measured in Chromium across 10 routes × 2 viewports: **0 contrast failures.**
Two entries in that final sweep were tool artifacts, not defects, and are worth
recording so nobody re-chases them:

- `.svc-cta` read 1.05:1 because it paints its slab with
  `linear-gradient(#0a0f1c, #0a0f1c)` rather than a `background-color`, so the
  probe read straight through to the page bone. It actually renders #e8fbff on
  #0a0f1c — **17.9:1**, confirmed from computed styles and a screenshot.
- The nav's `↳` marker read 3.60:1. It is `aria-hidden` ornament, which WCAG
  1.4.3 exempts as pure decoration.

The probe now skips `aria-hidden` subtrees and refuses to guess at gradient
grounds instead of reporting against the wrong surface.

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

**Fixed**: all eleven are 700, the nearest weight the family actually ships.
The two `font-weight: 600` rules did render bold (600 resolves *up* to 700) but
are normalised to 700 as well, so the file states what it paints.

Related and also fixed: **Unbounded 700 was downloaded but never used** — only
400 and 900 are referenced — and is now out of the font request.

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

**Fixed**: 23 dead tokens removed, 62 → 39, and a test now fails if a token is
declared without a consumer. `--c-pink` stays: it backs the `pink` variant in
Section's colour union, which is a real if currently unused option in the
system, unlike the nine compat aliases whose migration was finished.

**The spacing scale was deleted rather than adopted in the first pass**, on the
grounds that snapping 44 values onto 10 steps was a redesign rather than a
cleanup. That was right about the risk and wrong about the model.

**Now closed.** Measuring two models settled it:

| model | steps | already exact | shift ≥2px | worst |
|---|---|---|---|---|
| 12-step named ladder | 12 | 45% | 9% | 8.0px |
| **4px grid (0.25rem)** | 16 | **52%** | **1% (4 of 315)** | **2.7px** |
| 2px grid | 24 | 52% | 0% | 0.9px |

The **4px grid** is now the rule: every padding, margin and gap is a multiple of
`0.25rem`, with twelve named `--space-*` tokens for the steps that carry weight.
The named ladder was rejected for a specific reason — it forces `1.75rem` (11
uses), `2.25rem` (8) and `2.75rem` (3) to snap a full 4px each, which is where
its 9% came from. On a grid those are legal values.

That is also the post-mortem on the deleted `--s-*` scale: it omitted `1.25rem`,
which has **32 uses**. A scale that cannot express the code's most common value
will not be adopted, however well-intentioned.

**Type is closed too.** 21 fluid headings carried 21 distinct `clamp()` curves.
Four already resolved to an identical 18.4→24px range while written three
different ways (`3vw` / `3vw` / `3.2vw` / `2.5vw`) — agreeing at both ends and
drifting apart at every width in between, which is exactly where the eye catches
things not lining up. Now seven shared `--text-fluid-*` steps plus six fixed
`--text-*` steps, with `.footer-giant` and `.ghost-word` left bespoke as
deliberate showpieces.

Measured effect: aggregate page height across 5 pages × 3 widths moved **+1.6%**
(range −2.4% to +4.5%; `/work` is the outlier because it repeats 12 case-study
rows, so per-row snaps accumulate there).

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

**All fixed.** `SiteNav` uses `NavLink`, so the current route now carries
`aria-current="page"` and an inverted active tab with an accent underline. A
`FooterNav` on all eight pages gives every route — including Contact, Support
and Why not AI — a link from every other. Footer emails are `mailto:` links.
The nav's `↳` moved into an `aria-hidden` span; the rest use the
`content: <string> / <alt>` syntax to supply empty alternative text, gated on
`@supports` so browsers below Safari 17.4 keep the visible ornament rather than
silently losing it — the same shape as the P0 guard.

One find along the way: `.feature-cta` rendered **"View case study → ↗"**, a
literal arrow in the JSX plus a second from CSS. The literal one is gone.

The `.verdict-box` category labels ("Assessment", "Note", "Warning", "Context",
"Get in touch") were *also* CSS `content`, but they are real words rather than
ornament — not selectable, not translatable, invisible to text extraction. They
now come from a `VerdictBox` component as actual DOM text, across all 11
usages.

---

## P3 — Fixed

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

**All fixed.** The reduced-motion guard now names the CTAs that actually
shipped (`.consult-cta-btn`, `.svc-cta`) rather than a `.neon-btn` base class no
button carries — hovering "Book a time" pulsed forever with reduced motion
requested. Both sub-24px links meet SC 2.5.8. `Work.tsx`, `About.tsx` and
`Process.tsx` key their icon/label lookups by slug, id and step instead of array
position; `Differentiator` gained a stable `id` for that purpose, since keying
on prose titles would break on any copy edit. The footer's `margin-top` moved
inside as padding, so it meets the preceding colour block flush.

**The custom cursor keeps its dot but no longer hides the system pointer.**
`cursor: none` was applied to the whole document; that removes the affordance
people with low vision or motor impairments use to track position, and
`mix-blend-mode: difference` can render the replacement invisible against
mid-greys, leaving nothing at all. The dot is an accent on top of the real
cursor now.

**LinkedIn is set**, which restores the footer icon and adds the profile to the
JSON-LD `sameAs` entity links.

**A hero CTA was added.** The masthead filled 49% of the desktop fold and 54% of
mobile with nothing actionable in it — the first interactive element was the
corner FAB. "Book a free call" now sits under the subtitle, drawn from the
brutalist vocabulary (ink slab, square corners, inversion on hover) rather than
the neon CTA set, and collapses with the rest of the masthead on scroll.

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

**Three visual languages in one page — now closed.** Bone/ink brutalism, loud
riso colour blocks, and cyberpunk neon slabs (`#0a0f1c` with cyan/green glow).

The tell was that `tokens.css` opens by declaring the system's rule — *"zero
border-radius, zero shadows: hairlines and inversion carry all structure and
depth"* — while the codebase shipped **17 glow declarations** against it. Not a
matter of taste: a stated principle the code did not follow.

The damage was in *where* the third language lived. All seven neon components
were things a visitor had to act on, so the entire conversion path was styled in
a vocabulary that appeared nowhere else, while brutalism and riso owned all the
static content. `ConsultCTA` showed it in one element: a bone card (language A)
inside a full-bleed lavender block (B) containing a dark slab with a pulsing
cyan glow (C) — and that button was the only dark object on the screen.

**Resolved by retiring neon.** All seven CTAs now use the same ink/bone
inversion as the rest of the system, in two surface variants — ink fill on bone
(`.consult-cta-btn`, `.project-link-btn`, `.contact-fab`), bone fill on ink
(`.svc-cta`, `.form-submit-btn`, `.wizard-next`), plus a bone hairline secondary
(`.wizard-back`) — with `--c-accent` as the single accent the token file always
claimed. The five `--neon-*` tokens, the `.neon-btn` base, both infinite
keyframes and the `@property --angle` that fed the conic rim are gone. Glow
declarations: **17 → 0**; the three remaining `box-shadow`s are solid rings (a
focus indicator, the nav active underline, a 1px separator).

Two guards became unnecessary and were removed with it: the reduced-motion
override for `.consult-cta-btn` / `.svc-cta` had nothing left to stop, and the
`forced-colors` rule that dropped `.neon-btn`'s glow no longer had a target.

**A CTA above the fold — done.** Half the first screen was masthead with nothing
actionable in it. "Book a free call" now sits under the subtitle, and it was the
first button drawn from the brutalist vocabulary — the precedent the other seven
were later ported to.

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
