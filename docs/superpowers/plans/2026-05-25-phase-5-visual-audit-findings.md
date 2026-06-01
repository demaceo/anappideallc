# Phase 5 Visual Audit — Findings

**Audit date:** 2026-05-25
**Resolution date:** 2026-05-26 (all findings addressed)
**Branch under test:** `claude/pedantic-wozniak-496a1e` (forked off PR #6 `worktree-phase-5-audit-fixes`)
**Browser:** WebKit headless (via `@playwright/mcp` with `--browser webkit`)
**Viewport (primary):** 1440 × 900; also 1024 × 768 (tablet) and 414 × 896 (iPhone 11 Pro Max)
**Scope:** Phases 1–5 shipped state — home grid, materials panel, chain reactions, themes, reduced-motion, inner pages, multi-viewport
**Screenshots:** `docs/superpowers/specs/screenshots/2026-05-25-phase-5-visual-audit/` (35 original + 3 fixed = 38 files)
**Test suite after fixes:** 334/334 passing (307 baseline + 27 new regression tests)

---

## Critical (must fix)

- ✅ **RESOLVED 2026-05-26.** **Classic theme is unreadable — dark-on-dark blocks.** *Root cause:* `@property --bloom-dark { initial-value: transparent }` (and same for `--bloom`, `--bloom-bright`) in `src/styles/tokens.css:10-24` makes those custom properties always *declared* per the CSS Properties and Values L1 spec. The gradient in `Block.module.css` used the nested fallback `var(--bloom-dark, var(--block-bg, transparent))`, which never fell through to `--block-bg` because `--bloom-dark` was never "missing" — it computed to `transparent` from `@property`. Classic, pastel, and arcade-neon ended up with transparent gradient stops over the dark stage. *Fix:* `src/components/TetrisGrid/Block.module.css:196-202` now pre-bind `--bloom-dark / --bloom / --bloom-bright` to `var(--block-bg)` on every `.block-{section}` rule. modern-vibrant's `[data-theme="modern-vibrant"] .block-{section}` selector (higher specificity) still overrides with the Editorial Hardware material palette. *Tests:* `src/components/TetrisGrid/__tests__/block-theme-fallback.test.ts` (21 assertions, one per section × triple). *Visual proof:* `theme-classic-fixed.png` — all 7 NES Tetris colors render correctly (cyan/white/yellow/purple/green/orange/red).

## Important (should fix)

- ✅ **RESOLVED 2026-05-26.** **Cream Ceramic preset reduces text contrast on light blocks.** *Root cause:* the ceramic recipe paints a cream radial gradient (`#fff → #f1e9da → #c8b89c`); per-block `--block-fg` can be white (Hero/Work/Contact). White text on cream is unreadable. *Fix:* `src/components/TetrisGrid/Block.module.css:556` adds `color: #2a1810` to the ceramic rule — a warm earth-tone that harmonizes with the cream palette and overrides any per-block white `--block-fg`. *Test:* `block-theme-fallback.test.ts` "ceramic .block overrides color to a dark earth-tone". *Visual proof:* `material-ceramic-fixed.png` — all 7 blocks now show dark text on cream.

- ✅ **RESOLVED 2026-05-26.** **Frosted Glass preset collapses block color identity.** *Root cause:* the original frosted recipe (`Block.module.css:495-499`) used hardcoded teal gradient stops (`rgba(0, 180, 170, 0.5)` etc.) for every block. *Fix:* replaced the hardcoded teal with `color-mix(in srgb, var(--bloom-dark), transparent 50%)` etc., so each block tints its frosted gradient with its own Editorial Hardware palette. The backdrop-filter blur is preserved — visitors still see frosted glass character, but Hero stays magenta-frosted, Work stays green-frosted, etc. *Tests:* `block-theme-fallback.test.ts` "frosted recipe references --bloom-dark / --bloom-bright". *Visual proof:* `material-frosted-fixed.png` — distinct color identity restored across all 7 blocks.

- ⚠️→✅ **FALSE POSITIVE — corrected.** ~~Aurora chamber on `/contact` is missing the gold radial.~~ Live re-verification in WebKit shows `.auroraGold` *is* in the CSS (`AuroraChamber.module.css:39-48`) and *does* render: positioned at `50% 100%` (bottom-center), `radial-gradient(60% 60% at 50% 100%, var(--aurora-gold) /* rgba(255, 212, 0, 0.32) */, transparent 70%)`. The element computes `display: block, opacity: 1`, has a 864×360 rect visible in the 900px viewport. The original audit observation missed it because the gold is subtle by design — opacity 0.32, 34px blur, positioned underneath the more saturated magenta layer (`50%, 80% 60%`). Looking carefully at `contact-aurora-chamber.png` you can see the faint amber band along the bottom edge. No fix needed; this is correct intentional behavior.

## Minor (nice-to-have)

- ✅ **RESOLVED 2026-05-26.** **Hero block is unaffected by Materials Panel (clarification).** *What was actually happening:* the Hero block *does* receive each material recipe just like every other block — the gradient and shadow change correctly. What stays constant is the HeroPortalWindow component (the aurora cutout) which layers on top of Hero's gradient. Because the cutout's deep-space backing + cyan/magenta radials are opaque enough, Hero *visually* reads as "aurora portal" regardless of the material below — which made the audit observation "Hero opts out of materials" look true at a glance. *Fix:* added clarifying JSDoc to `HeroPortalWindow.tsx` ("Material independence") and `MaterialsPanel.tsx` ("Hero block note") so the intentional decoupling is documented for future contributors.

- ✅ **RESOLVED 2026-05-26.** **Visible focus ring on inner pages.** *Root cause:* `RouteFocusReset` programmatically focuses `<main>` (with `tabindex=-1`) after every navigation, and the browser's default `:focus` outline renders for every visitor — not just keyboard users. *First attempt:* `main:focus:not(:focus-visible) { outline: none }`. This failed because WebKit's `:focus-visible` heuristic treats programmatic `.focus()` on a `tabindex=-1` element as visible, defeating the `:not()` filter. *Final fix:* unconditional `main:focus { outline: none }` in `src/styles/globals.css`. `<main>` is a non-interactive content container; interactive elements *inside* still get their own focus rings via the `a:focus-visible / button:focus-visible` rules above. *Test:* `src/styles/__tests__/main-focus-ring.test.ts`.

- ✅ **RESOLVED 2026-05-26.** **Chain navigation timing — false positive.** Live re-measurement in WebKit (clicking Work, capturing the precise time delta with `performance.now()` between `link.click()` and the URL changing to `/work`): **2074 ms**. `WORK_CHAIN_DURATION_MS = 1500` plus React-Router navigation/render overhead. The original audit observation of "<400ms" was a measurement artifact — `browser_wait_for(0.4)` and then querying URL doesn't measure precisely from click. The chain controller `src/lib/chain.tsx` correctly waits the full sequence before firing `onNavigate`. No code change needed; the spec is correct.

- ✅ **RESOLVED 2026-05-26.** **Thread line is visible on mobile.** Decision: hide below 768 px. *Rationale:* at narrow viewports the grid stacks vertically, so the serpentine path between vertically-stacked blocks becomes a few short curves — not the sweeping expressive connection the gold thread provides at desktop widths. Consistent with the existing pattern of v2 atmospherics being mobile-optional (e.g., TetrisGrid's `.floor` and `.backWall` gate on `min-width: 1024px`). *Fix:* `src/components/TetrisGrid/ThreadLine.module.css` adds `@media (max-width: 767px) { .threadLayer { display: none } }`. *Test:* `src/components/TetrisGrid/__tests__/thread-line-mobile.test.ts`.

## What's notably good

- **All 7 blocks render correctly** with the Editorial Hardware material treatment (135° gradient, brushed micro-grain, pearl rim, cushioned shadow, bloom halo) on default Anodized.
- **Velvet Stage atmospherics work** — `_stage_` element with the spotlight gradient, `_floor_` with `matrix3d(1,0,0,0, 0,0.669,0.743,0, 0,-0.743,0.669,0, 0,0,0,1)` (a ~48° X-axis tilt) and a woven `repeating-linear-gradient` micro-pattern.
- **Brand block gold pulse** is wired correctly: computed animation `30s ease-in-out infinite _brand-pulse_w66of_1`.
- **Materials Panel is structurally clean:** drawer mounts as `[role="dialog"]`, close button is exactly 44 × 44 px (accessible touch target), header text matches spec, and `Escape` closes it cleanly.
- **localStorage persistence works** — `material` key persists across navigation/reload, and the app applies it on mount via `data-material` on `<html>`.
- **Material transitions are smooth** — measured `transition: --bloom, --bloom-bright, --bloom-dark, background 0.6s cubic-bezier(0.4, 0, 0.2, 1)` on every block. No hard cuts.
- **Konami code unlocks ThemeSwitcher** correctly: `ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a` reveals the 4-theme overlay.
- **Brand block on non-modern-vibrant themes navigates to `/about`** (not the Materials Panel) — confirmed on arcade-neon.
- **Chain reactions still fire on non-modern-vibrant themes** — Work block on classic theme navigated to `/work` correctly, gadgets are CSS-scoped, not theme-scoped.
- **Escape during chain cancels cleanly** — click Hero + immediate Escape leaves user on `/` with no aurora-grow element in DOM, marble cleared. URL: `/`, no nav fired.
- **Cmd+click bypasses chain** — opens destination in a new tab while current tab stays put. Browser default preserved.
- **Double-click is single-fire** — rapid double-click on Work results in one navigation to `/work`. No queue.
- **Reduced-motion path skips chain** — with CSS override + `matchMedia('prefers-reduced-motion')` mocked to true, Work click navigated in ~100 ms (vs ~1500 ms normal). Brand pulse computed to `0.001 s` duration (effectively off).
- **No console errors on direct navigation to any inner route** (`/about`, `/work`, `/services`, `/process`, `/contact`).
- **AuroraChamber renders on `/contact`** with cyan + magenta radials, stars, vignette, "Contact" heading and `hello@milehighinterface.com` link readable on top.
- **Multi-viewport survives** — Editorial Hardware material recipe preserved at 1024 × 768 (tablet) and 414 × 896 (mobile). Mobile reflows to single-column with About+AAI as a small paired row. No layout glitches.

## Spec compliance

- **§A (Home grid)** delivered: 7 blocks, aurora cutout in Hero, Editorial Hardware on all, velvet stage + tilted floor, thread line (svg with 7 children), 30 s brand pulse. *Evidence: `home-modern-vibrant-anodized.png`, DOM probe results in audit log.*
- **§B (Materials Panel)** delivered: 7 swatches in correct order, Anodized active by default, header text matches, close button = 44 × 44, Escape closes, localStorage `material` key persists. *Evidence: `materials-panel-open.png` + `material-{steel,gold,frosted,bronze,ceramic,showcase,anodized}.png`.*
- **§C (Chain reactions)** delivered for all 6 non-Brand blocks: Hero→/contact, About→/about, Work→/work, Services→/services, Process→/process, Contact→/contact. Navigation timing appears faster than spec'd (see Minor finding). *Evidence: `{hero,about,work,services,process,contact}-chain-*.png`.*
- **§D (Cancellation)** delivered: Escape cancels chain + navigation; Cmd+click bypasses chain + opens new tab; double-click is single-fire. *Evidence: `escape-cancel-home-state.png` + tabs state in audit log.*
- **§E (Theme switching)** partial: ThemeSwitcher overlay appears; all 4 themes selectable; pastel and arcade-neon look correct; **classic is broken (see Critical)**. Brand-on-non-modern-vibrant navigates correctly. Chain fires on classic theme. *Evidence: `theme-{classic,pastel,arcade-neon,modern-vibrant}.png`.*
- **§F (Reduced-motion)** delivered: CSS injection + matchMedia mock both honored. Brand pulse stops, chain navigation is near-instant (~100 ms vs ~1500 ms normal). *Evidence: animation/transition duration probes show 0.001 s after injection.*
- **§G (Inner pages)** delivered: all 5 routes reachable, content renders, zero console errors per route. `/contact` has AuroraChamber as expected; other routes use v1 styling. Velvet Vitrine is Phase 6 (documented deferral). *Evidence: `route-{about,work,services,process,contact}.png`.*
- **§H (Multi-viewport)** delivered: tablet + mobile screenshots captured; Editorial Hardware preserved on mobile; grid reflows cleanly; Materials Panel reflow per CSS breakpoints (panel not re-opened on mobile in this run — visual inspection of mobile home only). Thread line is visible on mobile (not hidden, per Minor finding). *Evidence: `home-tablet.png`, `home-mobile.png`.*

---

## Verdict

**Original (2026-05-25):** 1 Critical, 3 Important, 4 Minor → Phase 6 gated.
**Resolution (2026-05-26):** 1 Critical FIXED, 2 Important FIXED + 1 false positive corrected, 4 Minor FIXED (2 real fixes + 1 clarifying doc + 1 false positive corrected). **Phase 6 unblocked.**

**Resolution summary:**

| Finding | Status | Fix |
|---|---|---|
| Classic theme dark-on-dark | ✅ Fixed | `Block.module.css:196-202` bind `--bloom-*` to `var(--block-bg)` per block, sidestepping the `@property` initial-value gotcha |
| Cream Ceramic contrast | ✅ Fixed | `Block.module.css:556` adds `color: #2a1810` to ceramic rule |
| Frosted Glass identity | ✅ Fixed | `Block.module.css:498-501` replace hardcoded teal with `color-mix(in srgb, var(--bloom-*), ...)` |
| AuroraChamber gold radial | ⚠️ False positive | Gold radial IS present and rendering at bottom of viewport; just visually subtle by design |
| Hero materials opt-out doc | ✅ Fixed | JSDoc clarifications in `HeroPortalWindow.tsx` and `MaterialsPanel.tsx` |
| Focus ring scope | ✅ Fixed | `globals.css` adds unconditional `main:focus { outline: none }` (WebKit's `:focus-visible` heuristic defeated the `:not()` approach) |
| Chain timing vs spec | ⚠️ False positive | Live re-measurement confirms 2074 ms click→nav (chain runs full 1500 ms then navigates) |
| Mobile thread line | ✅ Fixed | `ThreadLine.module.css` hides `.threadLayer` below 768 px |

**Tests added:**
- `src/components/TetrisGrid/__tests__/block-theme-fallback.test.ts` — 25 assertions
- `src/components/TetrisGrid/__tests__/thread-line-mobile.test.ts` — 1 assertion
- `src/styles/__tests__/main-focus-ring.test.ts` — 1 assertion

**Test suite:** 334/334 passing (307 baseline + 27 new audit-fix regression tests).

Phase 6 (inner-page Velvet Vitrine, moss/crochet themes, mobile polish) can now start.

## Audit infrastructure notes (for next-session agent)

The plan's preflight predicted a `Chromium 'chrome' not found` error from the Playwright MCP and prescribed restarting Claude Code with a worktree-level `.mcp.json` WebKit override. That alone wasn't enough — there was a *user-global* `~/.claude.json` playwright entry registered with default args that was shadowing the worktree config. Fix applied: added `--browser webkit` to the args list in the user-global entry. Two restarts were needed to land WebKit. Update the plan's "Notes for next-session agent" section to warn about user-global precedence.

Also: this worktree had no `node_modules` until partway through the audit (dev server was originally being served from a sibling worktree's install). When the original server died mid-Section B, the recovery required a fresh `pnpm install` in this worktree. Recommendation: each Claude Code worktree should `pnpm install` immediately on creation so its dev server can survive sibling-worktree changes.
