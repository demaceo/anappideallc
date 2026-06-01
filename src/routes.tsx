import type { RouteObject } from 'react-router'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import Services from './pages/Services'
import Process from './pages/Process'
import Contact from './pages/Contact'
import ProjectDetail from './pages/ProjectDetail'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'work', Component: Work },
      { path: 'work/:slug', Component: ProjectDetail },
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
  '/work/pinpoint-civic-engagement',
  '/work/payback-consumer-intelligence',
  '/work/rentharbor-property-management',
  '/work/feng-shui-room-analysis',
  '/work/yap-united-live-translation',
  '/work/drayage-drivers',
  '/work/zoori-pet-care',
  '/work/hitldi-platform',
  '/work/unmasked-coaching',
  '/work/timeless-coach-consult',
  '/work/portfolio',
  '/services',
  '/process',
  '/contact',
]
