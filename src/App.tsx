import { Outlet, useLocation } from 'react-router'
import { InnerNav } from './components/InnerNav/InnerNav'
import { RouteFocusReset } from './components/RouteFocusReset'

function AppShell() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      <RouteFocusReset />
      {!isHome && <InnerNav />}
      <Outlet />
    </>
  )
}

export default function App() {
  return <AppShell />
}
