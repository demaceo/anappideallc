import { Link, useLocation } from 'react-router'
import { IconSend } from '../icons'

// Floating action button for /contact. Hidden on the contact page itself
// so it doesn't compete with the form already on screen.
export function ContactFAB() {
  const { pathname } = useLocation()
  if (pathname === '/contact') return null

  return (
    <Link to="/contact" className="contact-fab" aria-label="Contact">
      <IconSend size={18} />
      <span className="contact-fab-label">Contact</span>
    </Link>
  )
}
