# Client-Journey Audit — anappidea.llc

> **Date:** 2026-10-30
> **Scope:** the path a prospective client takes from first screen to booking or
> sending the contact form. Visual design, contrast and accessibility are
> covered by [`ux-audit-2026-08.md`](./ux-audit-2026-08.md) and not repeated.
> **Method:** production build served locally and driven in Chromium at 390px
> and 1440px; the contact wizard was walked end to end with the API mocked.
> **Assumed visitor:** a non-technical founder with an app or website idea.

## Fixed

| Finding | Change | Where |
|---|---|---|
| About, Work, Services, Process and every case study ended with no call to action | Shared closing section: book a call, or use the guided form | `src/components/NextStep/NextStep.tsx`, `ConsultCTA` (`showFormLink`) |
| Contact missing from the main nav; on mobile the only route was an unlabelled paper-plane disc over body text | Contact added to `SiteNav`; below 480px the floating button docks as a labelled full-width bar | `SiteNav.tsx`, `ContactFAB.tsx`, `.contact-fab` in `globals.css` |
| Wizard asked every founder to rate "SEO" and "GEO" | Plain-language labels; step shown only when a website is in scope (step count holds at 6 except for "Both") | `src/pages/Contact.tsx` |
| Contact page said a budget range helps, but the form had nowhere to put one | Optional free-text budget field, included in the inquiry email | `Contact.tsx`, `api/contact.ts` |
| Success view was a dead end | Lists what happens next and links straight to booking | `Contact.tsx` |
| A rejected Resend send still returned `{ ok: true }` — the SDK resolves `{ error }` rather than throwing, and the handler only had try/catch | Checks `error`, answers 502 | `api/contact.ts`, `src/__tests__/contact-api.test.ts` |
| No acknowledgement to the visitor after sending | Fixed-copy confirmation email (no echo of form input — the endpoint is unthrottled, so echoing would make it a relay) | `api/contact.ts` |

## Waiting on real values

Both are wired and tested, and render nothing until filled in.

- **Pricing signal** — set `SITE.pricing.range` (and optionally `note`) in
  `src/data/site.ts`. Appears on Services and Contact via
  `src/components/PricingNote/PricingNote.tsx`. Update the "stays hidden" test in
  `src/__tests__/client-journey.test.tsx` when you do.
- **Client work vs own products** — set `client: '<Client name>'` on each
  client project in `src/data/case-studies.ts`. Tagged entries show
  "Client work · <name>" and sort to the top of `/work`.

## Open

- **Calendly brand mismatch.** The booking page is titled "30 Minute FREE
  Consultation - Demaceo Howard" at the slug `demaceo-milehighinterface`, the
  retired brand. Changing it is done in Calendly; afterwards update
  `SITE.booking.consultationUrl` and `BOOKING_URL` in `api/contact.ts` together.
- **Timeline mismatch.** Home promises an MVP in 6–8 weeks; the Process phases
  add up to 7–13 weeks. One of them needs a sentence explaining the difference.
- **Proof.** `src/data/testimonials.ts` is still empty, and four apps
  (STLMNT, Zoori, Feng Shui, RentHarbor) have no store or live link.
- **Contact endpoint has no rate limit or bot check.** The confirmation email
  is deliberately static because of this, but the inbox itself can still be
  flooded.
