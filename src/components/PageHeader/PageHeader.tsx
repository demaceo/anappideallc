import { Link, useLocation } from 'react-router'
import { SiteNav } from '../SiteNav/SiteNav'

interface PageHeaderProps {
  children: React.ReactNode
}

export function PageHeader({ children }: PageHeaderProps) {
  const { pathname } = useLocation()

  return (
    <div className="page-header-wrap">
      {/* First focusable element on every page. The sticky header puts the
          back-home button and four nav links ahead of the content, so keyboard
          and switch users need a way past them. Visually hidden until focused
          (see .skip-link in globals.css). */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {pathname !== '/' && (
        <Link to="/" className="back-home" aria-label="Back to home">
          ←
        </Link>
      )}
      {children}
      <SiteNav />
    </div>
  )
}
