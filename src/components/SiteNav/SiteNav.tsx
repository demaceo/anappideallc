import { Link } from 'react-router'

const NAV_LINKS = [
  { to: '/about',    label: 'About'    },
  { to: '/work',     label: 'Work'     },
  { to: '/services', label: 'Services' },
  { to: '/process',  label: 'Process'  },
] as const

export function SiteNav() {
  return (
    <nav className="personas-bar" aria-label="Main navigation">
      {NAV_LINKS.map(({ to, label }) => (
        <Link key={to} to={to} className="persona-tag">
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
