import { Link, useLocation } from 'react-router'
import { IconSend } from '../icons'

// Floating action button for /contact. Hidden on the contact page itself
// so it doesn't compete with the form already on screen.
//
// The button is fixed, so it paints over mid-scroll content. Under 480px CSS
// collapses it to a compact icon-only disc (see .contact-fab in globals.css) —
// the label is hidden and this icon takes its place, so the affordance survives
// at a fraction of the footprint. The link's aria-label carries the accessible
// name in both states, and the icon is decorative.
export function ContactFAB() {
  const { pathname } = useLocation()
  if (pathname === '/contact') return null

  return (
    <Link to="/contact" className="contact-fab" aria-label="Contact">
      <span className="contact-fab-label">Contact</span>
      <span className="contact-fab-icon" aria-hidden="true">
        <IconSend size={18} />
      </span>
    </Link>
  )
}
