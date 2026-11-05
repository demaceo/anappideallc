import { SITE } from '../../data/site'
import { IconArrowRight } from '../icons'

interface ConsultCTAProps {
  // Optional override copy so the same block can headline different pages.
  eyebrow?: string
  title?: string
  blurb?: string
  // What happens on the call, as short steps, plus an optional closing line.
  // Shown where a visitor decides whether to book (Home, Contact); omitted on
  // pages where the band is only a repeat reminder.
  steps?: readonly string[]
  note?: string
}

// Tier 1 of three call-to-action shapes: book a call. A full-width forest-green
// card, the loudest thing on any page it appears on, so it appears once per
// page. Tier 2 (write to me) is MessageCTA; tier 3 (keep reading) is
// StoryNext. Shape and colour tell a visitor which is which before they read.
//
// Points at SITE.booking.consultationUrl and opens in a new tab.
export function ConsultCTA({
  eyebrow = 'No cost, no pressure',
  title = SITE.booking.label,
  blurb = SITE.booking.blurb,
  steps,
  note,
}: ConsultCTAProps) {
  return (
    <div className={`consult-cta${steps?.length ? ' consult-cta--steps' : ''}`}>
      <span className="consult-cta-eyebrow">{eyebrow}</span>
      <p className="consult-cta-title">{title}</p>
      <p className="consult-cta-blurb">{blurb}</p>
      {steps && steps.length > 0 && (
        <div className="consult-cta-steps">
          <p className="consult-cta-steps-label">On the call</p>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}
      {steps && steps.length > 0 && note && <p className="consult-cta-steps-note">{note}</p>}
      <a
        className="consult-cta-btn"
        href={SITE.booking.consultationUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics="book-consultation"
      >
        Book a free call
        <IconArrowRight size={15} />
      </a>
    </div>
  )
}
