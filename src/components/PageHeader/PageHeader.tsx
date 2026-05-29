import { Link, useLocation } from 'react-router'
import { SiteNav } from '../SiteNav/SiteNav'

interface PageHeaderProps {
  children: React.ReactNode
}

export function PageHeader({ children }: PageHeaderProps) {
  const { pathname } = useLocation()

  return (
    <div className="page-header-wrap">
      {pathname !== '/' && (
        <Link to="/" className="back-home" aria-label="Back to home">{'<'}</Link>
      )}
      {children}
      <SiteNav />
    </div>
  )
}
