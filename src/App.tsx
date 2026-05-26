import { Outlet, useLocation } from 'react-router'
import { LayoutGroup, MotionConfig, AnimatePresence } from 'motion/react'
import { ThemeProvider } from './lib/theme'
import { MaterialProvider } from './lib/material'
import { ChainProvider } from './lib/chain'
import { RouteTracker } from './components/RouteTracker'
import { RouteFocusReset } from './components/RouteFocusReset'
import { InnerNav } from './components/InnerNav/InnerNav'
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher'
import { useKonamiCode } from './lib/useKonamiCode'

function AppShell() {
  const konamiUnlocked = useKonamiCode()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <LayoutGroup>
      <RouteTracker />
      <RouteFocusReset />
      {/* InnerNav subsumes HomeIcon's back-to-home affordance via the "AAI"
          studio mark link, so HomeIcon is no longer rendered separately. */}
      {!isHome && <InnerNav />}
      {konamiUnlocked && <ThemeSwitcher />}
      {/* AnimatePresence activates the Block → page-header layoutId
          animation: as the old Outlet exits and the new one enters, Motion
          plays the shared layout FLIP between the home Block element and
          the inner page's matching motion.h1. mode="popLayout" removes the
          exiting element from layout flow immediately so the entering page
          can settle into its final position without fighting for space.
          initial={false} prevents the entry animation on first page load. */}
      <AnimatePresence mode="popLayout" initial={false}>
        <Outlet key={pathname} />
      </AnimatePresence>
    </LayoutGroup>
  )
}

/**
 * App root. MotionConfig `reducedMotion="user"` honours the user's OS
 * `prefers-reduced-motion: reduce` setting for every Motion component in
 * the tree — Motion zeroes transform and opacity animations when the
 * media query is active. This pairs with the CSS `@media (prefers-
 * reduced-motion: reduce)` guards on the aurora drift @keyframes for
 * complete reduced-motion respect.
 */
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <MaterialProvider>
          <ChainProvider>
            <AppShell />
          </ChainProvider>
        </MaterialProvider>
      </ThemeProvider>
    </MotionConfig>
  )
}
