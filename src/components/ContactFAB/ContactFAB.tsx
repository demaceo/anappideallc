import { Link, useLocation } from 'react-router'

// Floating action button for /contact. Hidden on the contact page itself
// so it doesn't compete with the form already on screen.
//
// Under 480px CSS docks it as a full-width bar along the bottom edge (see
// .contact-fab in globals.css). It used to collapse to an icon-only disc that
// still sat on top of body text, and a bare paper-plane glyph did not read as
// "contact" to a first-time visitor — so the label now stays visible at every
// width and doubles as the accessible name.
export function ContactFAB() {
  const { pathname } = useLocation()
  if (pathname === '/contact') return null

  return (
    <Link to="/contact" className="contact-fab">
      <span className="contact-fab-label">Contact</span>
    </Link>
  )
}
