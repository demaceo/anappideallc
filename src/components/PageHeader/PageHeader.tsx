import { Link, useLocation } from 'react-router'
import { SiteNav } from '../SiteNav/SiteNav'

interface PageHeaderProps {
  children: React.ReactNode
}

export function PageHeader({ children }: PageHeaderProps) {
  const { pathname } = useLocation()

  return (
    <>
      <div className="page-header-wrap">
        {/* First focusable element on every page. The back-home button and the
            nav links sit ahead of the content, so keyboard and switch users
            need a way past them. Visually hidden until focused (see
            .skip-link in globals.css). */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {pathname !== '/' && (
          <nav aria-label="Back to home">
            <Link to="/" className="back-home" aria-label="Back to home">
              ←
            </Link>
          </nav>
        )}
        {children}
      </div>
      {/* A sibling of the masthead wrapper, not a child of it. `position:
          sticky` only holds while the element's parent is still on screen, so
          inside the wrapper the nav would scroll away with the masthead. As a
          child of the page, it scrolls up with the masthead and then sticks
          to the top for the rest of the page. */}
      <SiteNav />
    </>
  )
}
