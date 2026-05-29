import { Link, NavLink } from 'react-router'

const NAV_LINKS = [
  { to: '/about',    label: 'About'    },
  { to: '/work',     label: 'Work'     },
  { to: '/services', label: 'Services' },
  { to: '/process',  label: 'Process'  },
  { to: '/contact',  label: 'Contact'  },
] as const

export function InnerNav() {
  return (
    <nav className="inner-nav" aria-label="Inner pages">
      <Link to="/" className="inner-nav-logo" aria-label="Home">
        AAI
      </Link>
      <ul className="inner-nav-links" role="list">
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `inner-nav-link${isActive ? ' active' : ''}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
