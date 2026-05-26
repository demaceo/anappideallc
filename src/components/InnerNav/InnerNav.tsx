import { Link, NavLink } from 'react-router'
import styles from './InnerNav.module.css'

const NAV_LINKS = [
  { to: '/about',    label: 'About'    },
  { to: '/work',     label: 'Work'     },
  { to: '/services', label: 'Services' },
  { to: '/process',  label: 'Process'  },
  { to: '/contact',  label: 'Contact'  },
] as const

/**
 * InnerNav — persistent navigation bar shown on all non-home routes.
 *
 * Left: "AAI" studio mark links to "/" (subsumes the HomeIcon back-
 *   affordance so AppShell no longer renders HomeIcon on inner routes).
 * Right: 5 inner-page NavLinks with a gold underline active indicator.
 *   React Router's NavLink applies aria-current="page" automatically on
 *   the active link — screen readers announce the current section.
 *
 * Height: var(--inner-nav-height, 52px) — defined in globals.css and
 * referenced by VelvetVitrine's padding-top so content clears the bar.
 */
export function InnerNav() {
  return (
    <nav className={styles.nav} aria-label="Inner pages">
      <Link to="/" className={styles.studio} aria-label="Home">
        AAI
      </Link>
      <ul className={styles.links} role="list">
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive
                  ? `${styles.link} ${styles.linkActive}`
                  : styles.link
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
