import { Link } from 'react-router'

const NAV_LINKS = [
  { to: '/about',    label: 'About',    color: '#b8860b' },
  { to: '/work',     label: 'Work',     color: '#27ae60' },
  { to: '/services', label: 'Services', color: '#16a085' },
  { to: '/process',  label: 'Process',  color: '#2980b9' },
  { to: '/contact',  label: 'Contact',  color: '#d35400' },
] as const

export function SiteNav() {
  return (
    <nav className="personas-bar" aria-label="Main navigation">
      {NAV_LINKS.map(({ to, label, color }) => (
        <Link key={to} to={to} className="persona-tag">
          <span className="persona-dot" style={{ background: color }} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
