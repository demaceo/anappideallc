import type { RouteObject } from 'react-router'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import Services from './pages/Services'
import Process from './pages/Process'
import Contact from './pages/Contact'
import WhyNotAI from './pages/WhyNotAI'
import Support from './pages/Support'
import ProjectDetail from './pages/ProjectDetail'
import DrayageProPrivacy from './pages/legal/DrayageProPrivacy'
import DrayageProTerms from './pages/legal/DrayageProTerms'
import PinpointPrivacy from './pages/legal/PinpointPrivacy'
import PinpointTerms from './pages/legal/PinpointTerms'
import PaybackPrivacy from './pages/legal/PaybackPrivacy'
import PaybackTerms from './pages/legal/PaybackTerms'
import YapPrivacy from './pages/legal/YapPrivacy'
import YapTerms from './pages/legal/YapTerms'
import ZooriPrivacy from './pages/legal/ZooriPrivacy'
import ZooriTerms from './pages/legal/ZooriTerms'
import FengshuiPrivacy from './pages/legal/FengshuiPrivacy'
import FengshuiTerms from './pages/legal/FengshuiTerms'
import StlmntPrivacy from './pages/legal/StlmntPrivacy'
import StlmntTerms from './pages/legal/StlmntTerms'

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
      { path: 'support', Component: Support },
      { path: 'contact', Component: Contact },
      { path: 'legal/drayagepro/privacy', Component: DrayageProPrivacy },
      { path: 'legal/drayagepro/terms', Component: DrayageProTerms },
      { path: 'legal/pinpoint/privacy', Component: PinpointPrivacy },
      { path: 'legal/pinpoint/terms', Component: PinpointTerms },
      { path: 'legal/payback/privacy', Component: PaybackPrivacy },
      { path: 'legal/payback/terms', Component: PaybackTerms },
      { path: 'legal/yap/privacy', Component: YapPrivacy },
      { path: 'legal/yap/terms', Component: YapTerms },
      { path: 'legal/zoori/privacy', Component: ZooriPrivacy },
      { path: 'legal/zoori/terms', Component: ZooriTerms },
      { path: 'legal/fengshui/privacy', Component: FengshuiPrivacy },
      { path: 'legal/fengshui/terms', Component: FengshuiTerms },
      { path: 'legal/stlmnt/privacy', Component: StlmntPrivacy },
      { path: 'legal/stlmnt/terms', Component: StlmntTerms },
    ],
  },
]

export const PRERENDER_PATHS = [
  '/',
  '/about',
  '/work',
  '/work/stlmnt-settlement-tracker',
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
  '/support',
  '/contact',
  '/legal/drayagepro/privacy',
  '/legal/drayagepro/terms',
  '/legal/pinpoint/privacy',
  '/legal/pinpoint/terms',
  '/legal/payback/privacy',
  '/legal/payback/terms',
  '/legal/yap/privacy',
  '/legal/yap/terms',
  '/legal/zoori/privacy',
  '/legal/zoori/terms',
  '/legal/fengshui/privacy',
  '/legal/fengshui/terms',
  '/legal/stlmnt/privacy',
  '/legal/stlmnt/terms',
]
