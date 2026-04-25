import { Outlet } from 'react-router'
import { LayoutGroup } from 'motion/react'
import { ThemeProvider } from './lib/theme'
import { RouteTracker } from './components/RouteTracker'
import { RouteFocusReset } from './components/RouteFocusReset'
import { HomeIcon } from './components/HomeIcon/HomeIcon'
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher'

export default function App() {
  return (
    <ThemeProvider>
      <LayoutGroup>
        <RouteTracker />
        <RouteFocusReset />
        <HomeIcon />
        <ThemeSwitcher />
        <Outlet />
      </LayoutGroup>
    </ThemeProvider>
  )
}
