import type { RouteObject } from 'react-router'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import Services from './pages/Services'
import Process from './pages/Process'
import Contact from './pages/Contact'
import WhyNotAI from './pages/WhyNotAI'
import ProjectDetail from './pages/ProjectDetail'
import DrayageProPrivacy from './pages/legal/DrayageProPrivacy'
import DrayageProTerms from './pages/legal/DrayageProTerms'
import PinpointPrivacy from './pages/legal/PinpointPrivacy'
import PinpointTerms from './pages/legal/PinpointTerms'

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
      { path: 'why-not-ai', Component: WhyNotAI },
      { path: 'contact', Component: Contact },
      { path: 'legal/drayagepro/privacy', Component: DrayageProPrivacy },
      { path: 'legal/drayagepro/terms', Component: DrayageProTerms },
      { path: 'legal/pinpoint/privacy', Component: PinpointPrivacy },
      { path: 'legal/pinpoint/terms', Component: PinpointTerms },
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
  '/why-not-ai',
  '/contact',
  '/legal/drayagepro/privacy',
  '/legal/drayagepro/terms',
  '/legal/pinpoint/privacy',
  '/legal/pinpoint/terms',
]
