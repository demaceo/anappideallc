import { matchPath, useLocation } from 'react-router'
import { SITE } from '../../data/site'
import { openBookingPopup } from '../../lib/calendly'

// Floating "Book a free call" button. Opens Calendly's scheduler in a popup,
// loading Calendly only on click (see lib/calendly.ts).
//
// It replaced a floating "Contact" button: two floating buttons in the same
// corner competed for the same glance, and the written route to the guided
// form is already in the main nav, the footer and every page's closing
// section. Booking is the one action worth keeping a thumb's reach away.
//
// A real link to the booking page underneath, so it still works before the
// app hydrates, with JavaScript off, or if the popup can't load.
//
// Hidden on /contact, where the booking card and the form are both on screen.
// matchPath, not `pathname === '/contact'`: the prerendered HTML is rendered at
// `/contact`, but a browser may load it at `/contact/`. A strict comparison
// then shows the button on the client only, and hydration fails (React #418).
// matchPath applies the router's own rules (optional trailing slash, no case).
export function BookingFAB() {
  const { pathname } = useLocation()
  if (matchPath('/contact', pathname)) return null

  const url = SITE.booking.consultationUrl
  return (
    <aside aria-label="Book a free call">
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="booking-fab"
      data-analytics="fab-book-consultation"
      onClick={(e) => {
        // Modified clicks (new tab, new window) keep the browser's behaviour.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        void openBookingPopup(url)
      }}
    >
      <span className="booking-fab-label">Book a free call</span>
    </a>
    </aside>
  )
}
