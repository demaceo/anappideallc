import { NavLink } from 'react-router'

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
        // NavLink rather than Link so the current route gets aria-current="page"
        // and a visible active style. With plain Link there was no way — visually
        // or in the accessibility tree — to tell which section you were in.
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `persona-tag${isActive ? ' persona-tag--active' : ''}`
          }
        >
          {/* The "↳" is decorative but pseudo-element content cannot be hidden
              from assistive tech, so every link used to announce as
              "↳ About". It lives in an aria-hidden span instead. */}
          <span className="persona-tag-mark" aria-hidden="true">↳</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
