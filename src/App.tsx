import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { RouteFocusReset } from './components/RouteFocusReset'

function AppShell() {
  const { pathname } = useLocation()

  // Scroll to top on every route change so the header always starts expanded.
  // RouteFocusReset uses preventScroll:true, so this is the only scroll reset.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <RouteFocusReset />
      <Outlet />
    </>
  )
}

export default function App() {
  return <AppShell />
}
