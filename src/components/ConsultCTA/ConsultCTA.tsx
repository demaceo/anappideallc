import { SITE } from '../../data/site'
import { IconCalendar, IconArrowRight } from '../icons'

interface ConsultCTAProps {
  // Optional override copy so the same block can headline different pages.
  eyebrow?: string
  title?: string
  blurb?: string
}

// Booking call-to-action. Points at SITE.booking.consultationUrl (Calendly or
// any scheduling link) and opens in a new tab. Used on Home, Contact, and the
// "Why not AI" page so the path to a first conversation is always one click.
export function ConsultCTA({
  eyebrow = 'Free first call',
  title = SITE.booking.label,
  blurb = SITE.booking.blurb,
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
      </div>
      <a
        className="consult-cta-btn"
        href={SITE.booking.consultationUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics="book-consultation"
      >
        Book a time
        <IconArrowRight size={15} />
      </a>
    </div>
  )
}
