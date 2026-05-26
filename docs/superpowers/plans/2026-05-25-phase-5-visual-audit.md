# Phase 5 Visual Audit Plan (WebKit-driven)

> **For the agent picking this up after Claude Code session restart:** This plan executes a comprehensive visual audit of the v2.0 UI (Phases 1–5) using the Playwright MCP configured to use WebKit. The project-level `.mcp.json` override is committed at the repo root.

## Pre-flight (run before starting)

1. **Confirm dev server is running:** `lsof -i :5173 -P -n | grep LISTEN`. If not running, start: `cd /Users/demaceovincent/coding/anappideallc/.claude/worktrees/phase-5-audit-fixes && pnpm dev &` (background).

2. **Confirm WebKit-loaded MCP:** Try `mcp__playwright__browser_navigate` to `http://localhost:5173/`. If it errors with "Chromium distribution 'chrome' is not found," the `.mcp.json` override didn't load — verify the file exists at the repo/worktree root and restart Claude Code again.

3. **Pre-downloaded WebKit:** Should already be cached at `~/Library/Caches/ms-playwright/webkit-2287/`. If missing, run `npx playwright install webkit`.

4. **Set canonical viewport for the audit:** `mcp__playwright__browser_resize` to **1440 × 900** (the spec's primary design viewport). Mobile sweeps come later.

## Audit Scope (Phases 1–5 ship state)

The audit covers what's currently merged on `main` plus the open audit-fix PR #6. Phase 6+ (inner-page Velvet Vitrine, moss/crochet themes, mobile polish) is NOT yet shipped — don't flag those as bugs; they're planned phases.

### Section A — Home grid (modern-vibrant, default Anodized material)

1. **Navigate to** `http://localhost:5173/`
2. **Take full-page screenshot:** `home-modern-vibrant-anodized.png`
3. **Take accessibility snapshot** for structural reference.
4. **Verify (visual checklist):**
   - 7 blocks rendered in the bento grid (Hero, Brand, About, Work, Services, Process, Contact)
   - Hero block has aurora window cutout inside (cyan + magenta radial gradients, deep-space backing, small white stars)
   - Each block shows the **Editorial Hardware** material treatment: 135° multi-stop gradient, brushed micro-grain (faint 118° diagonals), pearl rim, cushioned offset shadow, colored bloom halo below
   - **Velvet Stage atmospherics** visible: warm overhead spotlight, burgundy fabric floor (woven micro-pattern, tilted), inset vignette darkening corners
   - **Thread line** (gold/amber serpentine path connecting all 7 blocks) is faintly visible with shimmer
   - **Brand block pulses** with gold halo every ~30s (watch for ~1 minute to confirm)

### Section B — Materials Panel

1. **Hover** the Brand block — verify hover lift + intensified shadow
2. **Click** the Brand block — Materials Panel drawer slides up from bottom over ~320ms
3. **Take screenshot:** `materials-panel-open.png`
4. **Verify:**
   - 7 swatches visible: Anodized (active, gold outline) · Polished Steel · Gold Leaf · Frosted Glass · Patinated Bronze · Cream Ceramic · Showcase
   - Each swatch is a tilted mini-block preview rendered in its preset's actual material recipe
   - Close button (✕) is 44×44 px touch target with focus ring
   - Header reads "MATERIALS" + "Each preset applies globally · saved to localStorage"
5. **Click each non-Anodized swatch** in sequence (Steel → Gold → Frosted → Bronze → Ceramic → Showcase → Anodized):
   - Wait 700ms between clicks (let the 600ms transition complete)
   - Take screenshot after each switch: `material-{name}.png`
   - Verify: all grid blocks smoothly transition to the new material — no hard cuts
   - Note any contrast/readability issues on title text per material
6. **Press Escape** — panel closes
7. **Refresh page** (`browser_navigate` to same URL) — confirm last-selected material persists (localStorage)
8. **Reset to Anodized** before continuing.

### Section C — Chain reactions (per-block gadgets)

For each non-Brand block, click it and observe the chain visual before navigation fires. Use `browser_evaluate` to disable animations or `browser_wait_for time: <s>` to pace through.

**Hero block** (`/contact` destination, 2000ms sequence):
1. Reload home page. Click Hero block.
2. Take screenshot at **800ms** (marble mid-flight): `hero-chain-800ms.png`
3. Take screenshot at **1100ms** (post-impact, bell flash): `hero-chain-1100ms.png`
4. Take screenshot at **1700ms** (aurora growing): `hero-chain-1700ms.png`
5. Confirm navigation lands on `/contact` with the AuroraChamber atmospheric backdrop visible (cyan/magenta/gold radials, stars, vignette, Contact heading + email link readable on top)
6. Take screenshot: `contact-aurora-chamber.png`

**About block** (`/about` destination, 1400ms sequence):
1. Navigate back to `/`. Click About block.
2. Take screenshot at **400ms** (pendulum mid-swing): `about-pendulum-400ms.png`
3. Take screenshot at **800ms** (pendulum at apex / return): `about-pendulum-800ms.png`
4. Confirm navigation to `/about`

**Work block** (`/work` destination, 1500ms sequence):
1. Click Work. Screenshot at **400ms** (marble rolling), **900ms** (dominos mid-cascade): `work-chain-{400,900}ms.png`
2. Confirm navigation

**Services block** (`/services`, 1300ms sequence):
1. Click. Screenshot at **500ms** (lever raising), **1100ms** (flag unfurling): `services-chain-{500,1100}ms.png`
2. Confirm navigation

**Process block** (`/process`, 1400ms sequence):
1. Click. Screenshot at **400ms** (wheel spinning, weight rising), **800ms** (near completion): `process-chain-{400,800}ms.png`
2. Confirm navigation

**Contact block** (`/contact`, 1200ms sequence):
1. Click. Screenshot at **300ms** (spring uncoiling), **600ms** (envelope mid-slide): `contact-chain-{300,600}ms.png`
2. Confirm navigation lands on `/contact` (NOTE: this is the only block where navigation matches Hero's destination but the path is via spring gadget, not aurora portal — verify the AuroraChamber still renders correctly when reached this way)

### Section D — Cancellation / Edge cases

1. Navigate home. Click Hero block, then **press Escape** within 1 second. Verify:
   - Marble disappears
   - Aurora grow does NOT happen
   - Navigation does NOT fire (stay on home)
   - Screenshot: `escape-cancel-home-state.png`

2. Test **modifier-click** (cmd+click) on About block. Verify it bypasses the chain (browser default — opens in new tab or just doesn't fire the chain). Document behavior.

3. Test **double-click** rapidly on Work block. Verify only one chain plays (no-queue semantics).

### Section E — Theme switching (Konami code)

1. Home page. Send the Konami sequence via `browser_press_key` calls:
   `ArrowUp`, `ArrowUp`, `ArrowDown`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `ArrowLeft`, `ArrowRight`, `b`, `a`
2. **ThemeSwitcher** UI should appear (small overlay/toggle).
3. Switch to each theme in sequence: `classic` → `pastel` → `arcade-neon` → back to `modern-vibrant`.
4. For each theme, take a home screenshot: `theme-{name}.png`
5. **Verify:**
   - **classic**: high-contrast colors (cyan/yellow/purple etc. on black); NO Editorial Hardware shadows; NO velvet floor; NO aurora portal cutout in Hero
   - **pastel**: soft pinks/blues on cream bg; same — no v2 effects
   - **arcade-neon**: neon glow rings; no v2 effects
   - Brand block click on non-modern-vibrant themes: should navigate to /about (NOT open Materials Panel)
6. Test chain reactions on a non-modern-vibrant theme (e.g., classic): click Work block. Verify the chain visuals STILL render (gadgets are CSS-class-scoped, not theme-scoped) but navigation fires correctly.

### Section F — Reduced-motion

1. Use `browser_evaluate` to inject:
   ```js
   const style = document.createElement('style');
   style.textContent = `* { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }`;
   document.head.appendChild(style);
   ```
   (Or use Playwright's `emulateMedia` if available via the MCP — `prefers-reduced-motion: reduce`.)
2. Verify:
   - Brand pulse glow stops
   - Aurora drift stops
   - Click a block — navigation should fire near-instantly (chain skipped)
   - Material switch is instant (no 600ms transition)

### Section G — Inner pages (current state — Velvet Vitrine is Phase 6)

For each: `/about`, `/work`, `/services`, `/process`, `/contact`
1. Navigate directly (no chain).
2. Take screenshot: `route-{name}.png`
3. Verify:
   - `/contact` has the AuroraChamber backdrop on modern-vibrant
   - Other routes (`/about`, `/work`, `/services`, `/process`) use v1 page styling — NO Velvet Vitrine yet (that's Phase 6)
   - All routes are reachable, content renders, no console errors
4. Use `mcp__playwright__browser_console_messages` to capture any console errors per route.

### Section H — Multi-viewport (desktop / tablet / mobile)

Resize and re-screenshot home:
- 1440 × 900 (desktop — already captured)
- 1024 × 768 (tablet) → `home-tablet.png`
- 414 × 896 (iPhone 11 Pro Max portrait) → `home-mobile.png`

Verify:
- Grid degrades gracefully to single-column or 2-column on mobile (v1 behavior)
- Editorial Hardware material survives on mobile (the v2 material recipe doesn't have a 1023px breakpoint)
- ThreadLine is hidden on mobile (per CSS) OR renders correctly — note actual behavior
- Materials Panel layout on mobile (swatches should reflow to fewer columns per CSS at 768px and 480px breakpoints)

## Reporting

Save all screenshots to `docs/superpowers/specs/screenshots/2026-05-25-phase-5-visual-audit/`. Write the findings report to `docs/superpowers/plans/2026-05-25-phase-5-visual-audit-findings.md` using this format:

### Findings format

```markdown
## Critical (must fix)
- **{Title}** — {description}. Repro: {steps}. Screenshot: {path}.

## Important (should fix)
- {same format}

## Minor (nice-to-have)
- {same format}

## What's notably good
- {brief list of working things — keep concise}

## Spec compliance
- §X.Y delivered correctly: {evidence}
- §X.Y partial/missing: {what's not there — only if it's NOT a documented Phase 6+ deferral}
```

After writing the findings doc, commit + push to the PR #6 branch and add a comment summarizing top findings.

## Verification before continuing to Phase 6

This audit must complete WITHOUT any Critical findings before Phase 6 work begins. Important findings should be addressed on the audit-fix branch (PR #6) and merged. Minor findings can be tracked for later.

---

## Notes for next-session agent

- The dev server at port 5173 may still be running from this session. If you see a process at `lsof -i :5173`, you can reuse it. Otherwise restart: `cd /Users/demaceovincent/coding/anappideallc/.claude/worktrees/phase-5-audit-fixes && pnpm dev &`.
- The `.mcp.json` override at the worktree root forces WebKit. If the playwright MCP STILL fails with "chrome not found," check that the worktree is the cwd of the new Claude Code session (it should be, since EnterWorktree carried over).
- **MCP config precedence trap (learned 2026-05-26):** project-level `.mcp.json` does NOT override user-global `~/.claude.json` MCP entries. If WebKit still doesn't load after restart, check for a `playwright` entry in `~/.claude.json` and add `--browser webkit` to its `args` (it was previously registered without the flag). Two restarts may be needed: first to land the worktree config, second after editing user-global. See the 2026-05-25 audit's "Audit infrastructure notes" section for the full diagnosis.
- **Worktree node_modules:** each Claude Code worktree should `pnpm install` immediately on creation. Don't rely on a sibling worktree's install — when a sibling's dev server dies, your worktree's server dies too. The 2026-05-25 audit ran into this mid-Section B and had to recover with a fresh install.
- Take liberal screenshots — they're cheap, easy to reference in findings, and prove the audit was thorough.
- When you finish, kill the dev server: `pkill -f "vite" || true`. Don't leave it running indefinitely.
