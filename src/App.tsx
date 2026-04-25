import { Outlet } from 'react-router'
import { LayoutGroup } from 'motion/react'
import { ThemeProvider } from './lib/theme'
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

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}
