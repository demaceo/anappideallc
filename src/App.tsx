import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { RouteFocusReset } from './components/RouteFocusReset'
import { BookingFAB } from './components/BookingFAB/BookingFAB'
import { CustomCursor } from './components/CustomCursor/CustomCursor'
import { useScrollScenes } from './motion/useScrollScenes'

function AppShell() {
  const { pathname } = useLocation()
  const scopeRef = useRef<HTMLDivElement>(null)
  // Site-wide scroll motion, re-initialized per route (see useScrollScenes).
  useScrollScenes(scopeRef, pathname)

  // Scroll to top on every route change so the header always starts expanded.
  // RouteFocusReset uses preventScroll:true, so this is the only scroll reset.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <RouteFocusReset />
      <div ref={scopeRef} className="app-scope">
        <Outlet />
      </div>
      <BookingFAB />
      <CustomCursor />
    </>
  )
}

export default function App() {
  return <AppShell />
}
