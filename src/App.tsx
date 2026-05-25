import { Outlet } from 'react-router'
import { LayoutGroup, MotionConfig } from 'motion/react'
import { ThemeProvider } from './lib/theme'
import { MaterialProvider } from './lib/material'
import { RouteTracker } from './components/RouteTracker'
import { RouteFocusReset } from './components/RouteFocusReset'
import { HomeIcon } from './components/HomeIcon/HomeIcon'
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher'
import { useKonamiCode } from './lib/useKonamiCode'

function AppShell() {
  const konamiUnlocked = useKonamiCode()
  return (
    <LayoutGroup>
      <RouteTracker />
      <RouteFocusReset />
      <HomeIcon />
      {konamiUnlocked && <ThemeSwitcher />}
      <Outlet />
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
          <AppShell />
        </MaterialProvider>
      </ThemeProvider>
    </MotionConfig>
  )
}
