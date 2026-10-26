import { Link } from 'react-router'

// Every route that a visitor should be able to reach directly. The masthead nav
// carries only the four main sections, so before this existed Contact was
// reachable only through the floating action button, and Support and Why not AI
// only through prose links buried mid-page. The footer is where people look for
// a full index, and it also gives every page a crawlable link to the rest.
const FOOTER_LINKS = [
  { to: '/about',      label: 'About'       },
  { to: '/work',       label: 'Work'        },
  { to: '/services',   label: 'Services'    },
  { to: '/process',    label: 'Process'     },
  { to: '/why-not-ai', label: 'Why not AI'  },
  { to: '/support',    label: 'Support'     },
  { to: '/legal',      label: 'Legal'       },
  { to: '/contact',    label: 'Contact'     },
] as const

export function FooterNav() {
  return (
    <nav className="footer-nav" aria-label="Footer navigation">
      {FOOTER_LINKS.map(({ to, label }) => (
        <Link key={to} to={to} className="footer-nav-link">
          {label}
        </Link>
      ))}
    </nav>
  )
}
