import { Outlet } from 'react-router'
import { RouteFocusReset } from './components/RouteFocusReset'

function AppShell() {
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
