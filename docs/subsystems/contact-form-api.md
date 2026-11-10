---
title: Contact form API
type: subsystem
created: 2026-11-10
updated: 2026-11-10
sources:
  - code: api/contact.ts
verified_at: e07eb5d
---

# Contact form API

The site's only server code: a Vercel serverless function at `/api/contact`
that turns a project-inquiry submission into an email to the studio inbox via
Resend, then optionally sends the visitor a fixed confirmation email.

## Flow

1. **POST only.** Other methods get 405 (`api/contact.ts:54`).
2. **Bot screening, before validation** (`api/contact.ts:60-73`):
   - `website` is a hidden honeypot field
   - `elapsedMs` below 3 s (`MIN_FILL_MS`) means too fast to be a human
   Both silently answer success and send nothing.
3. **Validation** (`api/contact.ts:96-114`): a name is required; either an email
   or a phone number is required; a description *or* a voice note is required.
   The description can arrive as `description` (wizard) or legacy `message`.
4. **Inquiry email** to `TO_EMAIL`, with summary rows, contact details and an
   optional voice-note attachment of up to 6 MB (`MAX_AUDIO_BYTES`)
   (`api/contact.ts:116-200`).
5. **Confirmation email** to the visitor, best-effort (`api/contact.ts:209`,
   `sendConfirmation` at `api/contact.ts:218`).

Env vars: `RESEND_API_KEY`, `TO_EMAIL`, `FROM_EMAIL`. The last two default to
`hello@anappidea.llc`.

> ⚠️ Bot checks must stay **before** validation and must answer a normal
> `{ ok: true }`. Returning an error or running validation first lets a bot learn
> what to change. These checks only stop browser-filling bots; scripted POSTs
> rely on a Vercel Firewall rate-limit rule on this path, which lives outside
> this repository.

> ⚠️ The Resend SDK does **not throw** when a send is rejected (bad key, quota,
> unverified domain). It resolves with `{ data: null, error }`. Always check
> `error`. Relying on try/catch alone once told visitors "thanks" for messages
> that never arrived (`api/contact.ts:172-196`).

> ⚠️ The confirmation email is **fixed copy, no echo** of the name or message,
> and is only sent when `elapsedMs` is present. Echoing form text would let
> anyone send arbitrary content from this domain to a stranger's address
> (`api/contact.ts:202-217`).

> ⚠️ `BOOKING_URL` is duplicated from `SITE.booking.consultationUrl` in
> `src/data/site.ts` on purpose. This function ships as its own ESM bundle, and
> an extensionless import into `src/` is a runtime resolution risk. Change both
> together (`api/contact.ts:9-12`).

> ⚠️ All user text going into the inquiry HTML must pass through `escHtml`
> (`api/contact.ts:263`).
