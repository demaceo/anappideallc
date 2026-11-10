# Work log

Append-only. Newest entries at the bottom.

---

## [2026-11-10] setup | docs/ wiki scaffolded

- Categories: concepts - architecture - subsystems - decisions - reference - operations - history
- Baseline commit: `e07eb5d`
- Created: `docs/{CLAUDE,index,log}.md`, `raw/`, 4 `.claude/commands/docs-*`,
  and `.claude/scripts/docs-lint.py`

<!-- TODO: after filling in the content, record what was done here.
     If you split an existing document, which file became which page;
     if you wrote from the code, what range you covered. -->
- 2026-11-10: started in grow mode (scaffold + [[contact-form-api]]) at e07eb5d.

## [2026-11-10] work | contact flow redesigned

- Quick message form is now the default on `/contact`; the wizard became the guided
  alternative and ends by drafting the message.
- Added [[contact-form-ui]]. Updated [[contact-form-api]] (services, `usedGuide`, 2 s
  bot floor, services count as something to go on, string-checked arrays), verified
  at `2ca39a1`.
- Found, not fixed: `/contact` throws React hydration error #418 on `main` too.

