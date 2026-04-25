import { Outlet } from 'react-router'
import { LayoutGroup } from 'motion/react'

export default function App() {
  return (
    <LayoutGroup>
      <Outlet />
    </LayoutGroup>
  )
}
