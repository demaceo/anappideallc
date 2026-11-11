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
  - code: src/components/BookingFAB/BookingFAB.tsx
verified_at: 893f69f
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
  `/contact?service=<id>`, which pre-ticks that service. A newer link followed
  to the same page adds its service on top of the visitor's ticks.
- **Validation** runs in the order the fields appear: something to go on (message,
  voice note or a ticked service), then name, then email, then email-or-phone.
- **Budget** is asked in the guided route only, by design, and travels **inside the
  drafted message**, not as a separate field (a second copy would disagree with the
  message once the visitor edits it).
- **Guided answers are sent only while the draft is in use.** Emptying the message
  box after drafting clears `usedGuide`, so the email does not describe a draft the
  visitor threw away.

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

> ⚠️ `/contact` once threw React error #418 although this form hydrates cleanly.
> The mismatch was not in the page: the app shell's `BookingFAB` hides itself on
> `/contact` and compared the pathname with `===`, so at `/contact/` the client
> rendered a button the prerendered HTML did not have. Fixed; see
> [[prerender-hydration]] for the rule and for how to check a built page. If #418
> returns here, look at what the shell renders for this path before the form.

> ⚠️ Local check: load `/contact/` **with the trailing slash** on `vite preview`.
> Without it, preview serves the home page's HTML, not this route's
> ([[prerender-hydration]]).
