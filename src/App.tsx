import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { RouteFocusReset } from './components/RouteFocusReset'

function AppShell() {
  const { pathname } = useLocation()

  // Reset progress to 0 on every route change (scroll resets to top)
  useEffect(() => {
    document.documentElement.style.setProperty('--header-progress', '0')
  }, [pathname])

  useEffect(() => {
    const COLLAPSE_START = 60
    const COLLAPSE_RANGE = 140
    let ticking = false

    const update = () => {
      const progress = Math.min(1, Math.max(0, (window.scrollY - COLLAPSE_START) / COLLAPSE_RANGE))
      document.documentElement.style.setProperty('--header-progress', progress.toFixed(4))
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
