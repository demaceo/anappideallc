---
title: Contact form UI
type: subsystem
created: 2026-11-10
updated: 2026-11-10
sources:
  - code: src/components/ContactForm/ContactForm.tsx
  - code: src/components/ContactForm/QuickFields.tsx
  - code: src/components/ContactForm/GuidedSteps.tsx
  - code: src/components/ServicePicker/ServicePicker.tsx
  - code: src/components/VoiceNote/VoiceNote.tsx
  - code: src/components/PageHeader/PageHeader.tsx
  - code: src/lib/contact-draft.ts
  - code: src/pages/Contact.tsx
  - code: src/pages/Services.tsx
verified_at: 2ca39a1
---

# Contact form UI

`/contact` opens on a **quick message form**: a services checklist, the message,
a voice note, then contact details, then Send. The old question-by-question
wizard is an alternative, opened from a quiet link under the message box. It
sends to [[contact-form-api]].

The voice note (`src/components/VoiceNote/VoiceNote.tsx`) sits **directly under the
message box** as one row: a short offer ("Easier to say it out loud? ...") on the
left, one 48px ink mic button on the right.

`src/pages/Contact.tsx` is page chrome only; the form is `ContactForm`
(`src/components/ContactForm/ContactForm.tsx`). It owns all state and the single
send path. `QuickFields` is the default view; `GuidedSteps` is the questions
(type, stores, search visibility, business, audience, budget).

## How the two routes fit together

- **Guided ends by writing a draft** into the message box (`buildDraftMessage`,
  `src/lib/contact-draft.ts`), ticks the services the answers imply, and returns
  to the quick form. Nobody sends from the guide itself.
- **A draft never overwrites typed text.** `mergeDraft` fills an empty box,
  replaces the previous draft in place when run again, and otherwise appends
  underneath.
- **Services** come from `services` in `src/data/services.ts`, the single source
  (`ContactForm.tsx` `SERVICE_OPTIONS`). The Services page "Start here" links to
  `/contact?service=<id>`, which pre-ticks that service.
- **Validation** runs in the order the fields appear: something to go on (message,
  voice note or a ticked service), then name, then email, then email-or-phone.
- **Budget** is asked in the guided route only, by design.

> ⚠️ The quick form must **stay mounted** while the guide runs (it is `hidden`,
> not unmounted). Unmounting it drops an in-progress voice recording along with
> the typed text, ticks and details. `.contact-quick[hidden]` needs its own
> `display: none` rule, because the class sets `display: flex`, which beats the
> browser's `[hidden]` (`src/styles/globals.css`, `.contact-quick`).

> ⚠️ The voice note's button is **one element for every state** (record, stop,
> remove), with its label, icon and handler changing. Separate buttons per state
> get unmounted as the state changes and drop keyboard focus to the page. Its
> announcements use a plain `aria-live="polite"` span, **not** `role="status"`:
> that role is what the "Message received" confirmation uses, and an always-present
> second one makes `getByRole('status')` (and "the status" for assistive tech)
> ambiguous (`VoiceNote.tsx`, `src/__tests__/voice-note.test.tsx`).

> ⚠️ The back button in the site bar is an **SVG arrow**, not a "←" text glyph:
> fonts draw arrows low in the line box, which left it about 4px below the centre
> of its square. It is positioned on whole pixels (`top: calc((var(--nav-h) -
> 44px) / 2)`), because `top: 50%` of the bar's 63px interior lands on a half pixel
> and blurs its border (`src/components/PageHeader/PageHeader.tsx`, `.back-home`).

> ⚠️ Read `?service=` through `useSyncExternalStore` with an empty server
> snapshot, never straight from `useLocation()` into the first render. The page
> is prerendered without the query, so reading it on the first client render
> ticks a service the HTML never had and React reports a hydration mismatch.
> `src/__tests__/contact-hydration.test.tsx` fails if this regresses
> (`ContactForm.tsx`, `clientSearch`).

> ⚠️ **Enter in a checkbox submits the enclosing form** in Chrome and Firefox,
> which would send a half-written message. `ServicePicker` turns Enter into a
> toggle on its checkboxes (`ServicePicker.tsx`, the checkbox `onKeyDown`). Keep
> that if the picker is rebuilt.

> ⚠️ Do not use `String.replace(old, new)` with a string replacement for drafts:
> text like a "$10k" budget contains `$&`-style patterns. `mergeDraft` uses a
> function replacement for this reason (`src/lib/contact-draft.ts`).

> ⚠️ The picker is deliberately an inline disclosure of native checkboxes: no
> `<select multiple>`, no listbox/combobox, no popover, no click-outside-to-close.
> A panel that collapses as the visitor reaches for the next field shifts the
> layout under their finger. It closes with the toggle or Esc only.

> ⚠️ Tests: happy-dom has no `MediaRecorder`, so the real `VoiceNote` only shows
> its "unsupported" hint. Stub `../components/VoiceNote/VoiceNote` (see
> `src/__tests__/contact-quick.test.tsx`). The `.wizard-next` class is asserted
> by `src/styles/__tests__/contrast-tokens.test.ts`, and new CSS must stay on the
> 0.25rem spacing grid (`var(--space-N)`).

> ⚠️ **Known, pre-existing:** the prerendered `/contact` page throws React error
> #418 (hydration mismatch) when it loads, on `main` as well as here, while `/`,
> `/about` and `/services` are clean. React recovers by re-rendering the tree on
> the client. The form itself hydrates cleanly in isolation (the hydration test
> above), so the cause is elsewhere on the page. Not yet diagnosed
> (unverified: likely a different component on `/contact`).

> ⚠️ Local check: `vite preview` serves the prerendered page at `/contact/` (with a
> trailing slash). At `/contact` it serves the empty SPA shell and every route
> looks like it throws a hydration error. Production uses `cleanUrls`
> (`vercel.json`), so it is not affected.
