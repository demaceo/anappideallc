import { Link, useLocation } from 'react-router'
import { IconArrowLeft } from '../icons'
import { SiteNav } from '../SiteNav/SiteNav'

interface PageHeaderProps {
  children: React.ReactNode
}

export function PageHeader({ children }: PageHeaderProps) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

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
        {children}
      </div>
      {/* The site bar (back-home button + nav) is a sibling of the masthead
          wrapper, not a child of it. `position: sticky` only holds while the
          element's parent is still on screen, so inside the wrapper the bar
          would scroll away with the masthead. As a child of the page, it
          scrolls up with the masthead and then sticks to the top for the rest
          of the page, with the way home always in reach. */}
      <div className={`site-bar${isHome ? '' : ' site-bar--has-back'}`}>
        {!isHome && (
          <nav aria-label="Back to home">
            {/* An SVG, not a "←" text glyph: fonts draw arrows low in the line
                box, which left the glyph ~4px below the centre of its square. */}
            <Link to="/" className="back-home" aria-label="Back to home">
              <IconArrowLeft size={20} strokeWidth={2} />
            </Link>
          </nav>
        )}
        <SiteNav />
      </div>
    </>
  )
}
