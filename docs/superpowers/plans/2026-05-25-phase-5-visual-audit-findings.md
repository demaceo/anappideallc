# Phase 5 Visual Audit — Findings

**Audit date:** 2026-05-25
**Branch under test:** `claude/pedantic-wozniak-496a1e` (forked off PR #6 `worktree-phase-5-audit-fixes`)
**Browser:** WebKit headless (via `@playwright/mcp` with `--browser webkit`)
**Viewport (primary):** 1440 × 900; also 1024 × 768 (tablet) and 414 × 896 (iPhone 11 Pro Max)
**Scope:** Phases 1–5 shipped state — home grid, materials panel, chain reactions, themes, reduced-motion, inner pages, multi-viewport
**Screenshots:** `docs/superpowers/specs/screenshots/2026-05-25-phase-5-visual-audit/` (35 files)

---

## Critical (must fix)

- **Classic theme is unreadable — dark-on-dark blocks.** On `theme=classic`, all bento blocks render with the v2 Editorial Hardware dark backing (`_block_w66of_*`) but lose the v1 high-contrast NES palette that should give them readable color. Result: nearly-invisible dark-gray-on-dark-gray text for Hero, WORK, ABOUT, PROCESS, CONTACT, AAI. The spec explicitly says classic should have *no v2 effects* and use "high-contrast colors (cyan/yellow/purple etc. on black)." Pastel and arcade-neon look correct; only classic is broken. Repro: home page → Konami code (Up Up Down Down Left Right Left Right b a) → click "Classic NES Tetris". Screenshot: `theme-classic.png`. Hypothesis: the v2 material/stage CSS is wrapped in something that doesn't gate on `[data-theme="modern-vibrant"]`, so it leaks onto every theme — but the classic palette's dark-on-dark relies on the v2 surfaces being absent.

## Important (should fix)

- **Cream Ceramic preset reduces text contrast on light blocks.** The AAI/LLC and ABOUT blocks become very low-contrast against the cream surface in Anodized → Ceramic mode — white-on-cream on AAI and dim charcoal-on-cream on ABOUT. Other blocks (Hero, WORK, SERVICES, PROCESS, CONTACT) keep their distinct color identity and remain legible. Repro: home → click Brand → click "Cream Ceramic". Screenshot: `material-ceramic.png`. Suggest darkening the title text per-block in ceramic mode, or boosting text-shadow.

- **Frosted Glass preset collapses block color identity.** In Frosted mode all blocks render as nearly identical dark-teal translucent panels — the 7-block visual hierarchy that the design depends on dissolves. Hero is the only block that retains distinctive coloring (because its aurora stays through every material). Repro: home → Brand → "Frosted Glass". Screenshot: `material-frosted.png`. Either intentional (translucent = uniform) or an oversight; if intentional, note in spec; if not, allow per-block tint to bleed through the frosted layer.

- **Aurora chamber on `/contact` is missing the gold radial.** The spec for the AuroraChamber backdrop calls for "cyan/magenta/gold radials." Observed: cyan and magenta are clearly visible (top-left and right respectively), but no detectable gold/amber bleed anywhere in viewport. Repro: navigate `/contact`. Screenshot: `contact-aurora-chamber.png` and `route-contact.png`. Likely missing a third radial-gradient layer in `AuroraChamber.module.css`, or its opacity is 0.

## Minor (nice-to-have)

- **Hero block is unaffected by Materials Panel.** Switching presets doesn't change the Hero's appearance — it keeps the dark teal + aurora portal regardless. This is probably intentional (the aurora cutout is the brand anchor) but is undocumented in the spec, so add a one-line note in the MaterialsPanel docs: "Hero block opts out of material switching; its aurora cutout is preset-agnostic."

- **Visible blue focus ring on inner pages.** The `<main>` (or content wrapper) on `/about`, `/work`, etc. shows a visible blue 2-px focus outline by default — likely from `RouteFocusReset` programmatically focusing the heading region after route changes. This is good for accessibility but the resulting "blue rectangle" border looks like a visual element rather than a focus indicator. Repro: navigate `/about`. Screenshot: `route-about.png`. Suggest restricting the outline to `:focus-visible` only.

- **Chain navigation fires earlier than spec'd durations.** Plan spec says, e.g., Work chain is 1500ms total with nav at the end. Observed: clicking Work resulted in URL change to `/work` within ≤ 400ms of click (and similarly for About, Services, Process, Contact). Either the chain controller navigates early and continues animating over the destination route (intentional), or the chain durations have been shortened post-spec. Worth reconciling the plan doc vs the actual `chain.tsx` timing constants. Screenshots: `work-chain-400ms.png` etc. show the destination block isolated on the dark stage — consistent with View-Transitions-style hand-off.

- **Thread line is visible on mobile.** Spec was uncertain whether the thread line is hidden at 414 px wide; observed: it renders (`display: block`, `opacity: 1`). At the narrow viewport it's geometrically constrained between vertically-stacked blocks, so it's far less expressive than on desktop. Decide whether to hide-below-768px or leave visible; document the choice either way.

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
- **AuroraChamber renders on `/contact`** with cyan + magenta radials, stars, vignette, "Contact" heading and `hello@anappidea.llc` link readable on top.
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

**Critical findings: 1** (classic theme unreadable). This must be fixed before Phase 6 begins per the audit's gating rule.
**Important findings: 3** (ceramic/frosted readability, missing gold radial on AuroraChamber).
**Minor findings: 4** (hero opt-out doc, focus ring, chain timing reconciliation, mobile thread line decision).

**Recommended next steps:**
1. Fix classic theme on this branch (PR #6 audit-fix track) — likely needs a `[data-theme="modern-vibrant"]` gate around the v2 Editorial Hardware material in `Block.module.css` (or equivalent), so classic actually gets v1 surfaces.
2. Triage ceramic/frosted contrast — either tune the swatch recipes for legibility, or accept the visual identity and document it.
3. Add the missing gold radial to `AuroraChamber.module.css`.
4. Reconcile the chain timing constants in `chain.tsx` against the plan's stated durations — update whichever is wrong.
5. Resolve the Minor findings (focus ring scope, hero material opt-out doc, mobile thread line decision) as cleanup.

After (1) lands, this audit can be re-run to confirm; once green, Phase 6 (inner-page Velvet Vitrine, moss/crochet themes, mobile polish) can start.

## Audit infrastructure notes (for next-session agent)

The plan's preflight predicted a `Chromium 'chrome' not found` error from the Playwright MCP and prescribed restarting Claude Code with a worktree-level `.mcp.json` WebKit override. That alone wasn't enough — there was a *user-global* `~/.claude.json` playwright entry registered with default args that was shadowing the worktree config. Fix applied: added `--browser webkit` to the args list in the user-global entry. Two restarts were needed to land WebKit. Update the plan's "Notes for next-session agent" section to warn about user-global precedence.

Also: this worktree had no `node_modules` until partway through the audit (dev server was originally being served from a sibling worktree's install). When the original server died mid-Section B, the recovery required a fresh `pnpm install` in this worktree. Recommendation: each Claude Code worktree should `pnpm install` immediately on creation so its dev server can survive sibling-worktree changes.
