---
title: Contact form API
type: subsystem
created: 2026-11-10
updated: 2026-11-10
sources:
  - code: api/contact.ts
  - code: src/data/services.ts
  - code: src/__tests__/contact-api.test.ts
verified_at: 2ca39a1
---

# Contact form API

The site's only server code: a Vercel serverless function at `/api/contact`
that turns a project-inquiry submission into an email to the studio inbox via
Resend, then optionally sends the visitor a fixed confirmation email. The client
that talks to it is described in [[contact-form-ui]].

## Flow

1. **POST only.** Other methods get 405 (`api/contact.ts:78`).
2. **Bot screening, before validation** (`api/contact.ts:83-96`):
   - `website` is a hidden honeypot field
   - `elapsedMs` below 2 s (`MIN_FILL_MS`, `api/contact.ts:18`) means too fast to
     be a human
   Both silently answer success and send nothing.
3. **Validation** (`api/contact.ts:124-145`): a name is required; either an email
   or a phone number is required; and there must be **something to go on**: a
   description, a voice note, *or* at least one known service. The description
   can arrive as `description` or the legacy `message`.
4. **Inquiry email** to `TO_EMAIL`, with summary rows, contact details and an
   optional voice-note attachment of up to 6 MB (`MAX_AUDIO_BYTES`)
   (`api/contact.ts:147-232`). The rows start with "Services" when any were
   ticked and end with "Used the guided questions" when `usedGuide` is exactly
   `true`. With services but no message and no voice note, the email says
   "They did not write a message" instead of a "Their idea" block.
5. **Confirmation email** to the visitor, best-effort (`api/contact.ts:245`,
   `sendConfirmation` at `api/contact.ts:254`).

Env vars: `RESEND_API_KEY`, `TO_EMAIL`, `FROM_EMAIL`. The last two default to
`hello@anappidea.llc`.

## Array fields

`services` and `platforms` go through one helper, `strings()`
(`api/contact.ts:52`): non-string elements are dropped and at most 20 are kept.
Services are then de-duplicated and filtered to ids present in `SERVICE_LABELS`
(`api/contact.ts:41`), so unknown ids never reach the email and never count as
"something to go on".

> ⚠️ `SERVICE_LABELS` is a **hand-kept copy** of the id and title of every entry in
> `src/data/services.ts`. The function cannot import from `src/` (same reason as
> `BOOKING_URL` below). Add or rename a service and this map must change too;
> `src/__tests__/contact-api.test.ts` ("keeps the API label map in step") reads
> `api/contact.ts` as text and fails when they drift. Without it the email would
> silently drop the new service.

> ⚠️ Bot checks must stay **before** validation and must answer a normal
> `{ ok: true }`. Returning an error or running validation first lets a bot learn
> what to change. These checks only stop browser-filling bots; scripted POSTs
> rely on a Vercel Firewall rate-limit rule on this path, which lives outside
> this repository.

> ⚠️ Keep `MIN_FILL_MS` **low** (2 s). A dropped submission is silent, so a real
> visitor who autofills their details and pastes a message looks the same as a
> bot, and the lead is simply lost. The honeypot and the rate limit are the real
> defences; this is a backstop (`api/contact.ts:14-18`).

> ⚠️ Array elements must be string-checked before use. A non-string element used
> to reach `escHtml` and throw a `TypeError` **outside the try block**, giving an
> unhandled 500 (`api/contact.ts:111-114`). The `audio` object is checked the same way: a
> non-string `base64` or `mimeType` is treated as no voice note.

> ⚠️ The Resend SDK does **not throw** when a send is rejected (bad key, quota,
> unverified domain). It resolves with `{ data: null, error }`. Always check
> `error`. Relying on try/catch alone once told visitors "thanks" for messages
> that never arrived (`api/contact.ts:208-232`).

> ⚠️ The confirmation email is **fixed copy, no echo** of the name or message,
> and is only sent when `elapsedMs` is present. Echoing form text would let
> anyone send arbitrary content from this domain to a stranger's address
> (`api/contact.ts:238-253`).

> ⚠️ `BOOKING_URL` is duplicated from `SITE.booking.consultationUrl` in
> `src/data/site.ts` on purpose. This function ships as its own ESM bundle, and
> an extensionless import into `src/` is a runtime resolution risk. Change both
> together (`api/contact.ts:9-12`).

> ⚠️ All user text going into the inquiry HTML must pass through `escHtml`
> (`api/contact.ts:299`).
