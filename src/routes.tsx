import type { RouteObject } from 'react-router'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import Services from './pages/Services'
import Process from './pages/Process'
import Contact from './pages/Contact'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'work', Component: Work },
      { path: 'services', Component: Services },
      { path: 'process', Component: Process },
      { path: 'contact', Component: Contact },
    ],
  },
]

export const PRERENDER_PATHS = [
  '/',
  '/about',
  '/work',
  '/services',
  '/process',
  '/contact',
]
