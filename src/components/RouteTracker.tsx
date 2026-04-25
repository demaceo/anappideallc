import { useEffect } from 'react'
import { useLocation } from 'react-router'

const RETURN_FLAG = 'app:lastNonRootPath'

// Tracks navigation history at the route level so the line-clear hook
// can distinguish "user is popping back to /" from "user just hard-reloaded /".
// Whenever the user lands on a non-root route, we stash that path. The
// next mount of the / route consumes the flag.
export function RouteTracker() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname === '/') return
    try {
      sessionStorage.setItem(RETURN_FLAG, pathname)
    } catch {
      /* ignore */
    }
  }, [pathname])

  return null
}
