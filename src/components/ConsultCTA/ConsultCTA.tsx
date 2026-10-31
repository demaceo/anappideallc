import { Link } from 'react-router'
import { SITE } from '../../data/site'
import { IconCalendar, IconArrowRight } from '../icons'

interface ConsultCTAProps {
  // Optional override copy so the same block can headline different pages.
  eyebrow?: string
  title?: string
  blurb?: string
  // Offer the guided form as the written alternative to booking. Off where the
  // form is already on screen (Contact) or the page offers it in its own prose
  // (Home), so the same two next steps read identically everywhere else.
  showFormLink?: boolean
}

// Booking call-to-action. Points at SITE.booking.consultationUrl (Calendly or
// any scheduling link) and opens in a new tab. Closes every page a prospect
// reads before deciding — Home, About, Work, each case study, Services,
// Process, Why not AI — and heads Contact, so the next step is never further
// than the end of the page.
export function ConsultCTA({
  eyebrow = 'No cost, no pressure',
  title = SITE.booking.label,
  blurb = SITE.booking.blurb,
  showFormLink = true,
}: ConsultCTAProps) {
  return (
    <div className="consult-cta">
      <div className="consult-cta-icon">
        <IconCalendar size={22} />
      </div>
      <div className="consult-cta-body">
        <span className="consult-cta-eyebrow">{eyebrow}</span>
        <p className="consult-cta-title">{title}</p>
        <p className="consult-cta-blurb">{blurb}</p>
        {showFormLink && (
          <p className="consult-cta-alt">
            Prefer to write? <Link to="/contact">Send me a message →</Link>
          </p>
        )}
      </div>
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
