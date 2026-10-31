import type { ComponentType } from 'react'
import type { RouteObject } from 'react-router'
import App from './App'
import Home from './pages/Home'

// Every page except Home loads on demand: Vite turns each dynamic import into
// its own chunk, so a visitor downloads only the page they're on (the legal
// pages alone were close to half the old single bundle). Home stays in the
// main bundle as the most-visited page.
//
// `module` is the page's source path. The prerender step uses it to find the
// page's chunk in Vite's manifest and preload it in that page's HTML. Vite
// needs the import() path written literally, so the path appears twice; a
// test loads each route both ways to keep them in step.
export interface PageHandle {
  module: string
}

function page(module: string, load: () => Promise<{ default: ComponentType }>) {
  return {
    lazy: async () => ({ Component: (await load()).default }),
    handle: { module } satisfies PageHandle,
  }
}

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: 'about', ...page('src/pages/About.tsx', () => import('./pages/About')) },
      { path: 'work', ...page('src/pages/Work.tsx', () => import('./pages/Work')) },
      { path: 'work/:slug', ...page('src/pages/ProjectDetail.tsx', () => import('./pages/ProjectDetail')) },
      { path: 'services', ...page('src/pages/Services.tsx', () => import('./pages/Services')) },
      { path: 'process', ...page('src/pages/Process.tsx', () => import('./pages/Process')) },
      { path: 'why-not-ai', ...page('src/pages/WhyNotAI.tsx', () => import('./pages/WhyNotAI')) },
      { path: 'support', ...page('src/pages/Support.tsx', () => import('./pages/Support')) },
      { path: 'support/payback', ...page('src/pages/PaybackSupport.tsx', () => import('./pages/PaybackSupport')) },
      { path: 'contact', ...page('src/pages/Contact.tsx', () => import('./pages/Contact')) },
      { path: 'legal', ...page('src/pages/legal/LegalIndex.tsx', () => import('./pages/legal/LegalIndex')) },
      { path: 'legal/:app', ...page('src/pages/legal/LegalApp.tsx', () => import('./pages/legal/LegalApp')) },
      { path: 'legal/drayagepro/privacy', ...page('src/pages/legal/DrayageProPrivacy.tsx', () => import('./pages/legal/DrayageProPrivacy')) },
      { path: 'legal/drayagepro/terms', ...page('src/pages/legal/DrayageProTerms.tsx', () => import('./pages/legal/DrayageProTerms')) },
      { path: 'legal/pinpoint/privacy', ...page('src/pages/legal/PinpointPrivacy.tsx', () => import('./pages/legal/PinpointPrivacy')) },
      { path: 'legal/pinpoint/terms', ...page('src/pages/legal/PinpointTerms.tsx', () => import('./pages/legal/PinpointTerms')) },
      { path: 'legal/payback/privacy', ...page('src/pages/legal/PaybackPrivacy.tsx', () => import('./pages/legal/PaybackPrivacy')) },
      { path: 'legal/payback/terms', ...page('src/pages/legal/PaybackTerms.tsx', () => import('./pages/legal/PaybackTerms')) },
      { path: 'legal/payback/data-deletion', ...page('src/pages/legal/PaybackDataDeletion.tsx', () => import('./pages/legal/PaybackDataDeletion')) },
      { path: 'legal/yap/privacy', ...page('src/pages/legal/YapPrivacy.tsx', () => import('./pages/legal/YapPrivacy')) },
      { path: 'legal/yap/terms', ...page('src/pages/legal/YapTerms.tsx', () => import('./pages/legal/YapTerms')) },
      { path: 'legal/zoori/privacy', ...page('src/pages/legal/ZooriPrivacy.tsx', () => import('./pages/legal/ZooriPrivacy')) },
      { path: 'legal/zoori/terms', ...page('src/pages/legal/ZooriTerms.tsx', () => import('./pages/legal/ZooriTerms')) },
      { path: 'legal/fengshui/privacy', ...page('src/pages/legal/FengshuiPrivacy.tsx', () => import('./pages/legal/FengshuiPrivacy')) },
      { path: 'legal/fengshui/terms', ...page('src/pages/legal/FengshuiTerms.tsx', () => import('./pages/legal/FengshuiTerms')) },
      { path: 'legal/stlmnt/privacy', ...page('src/pages/legal/StlmntPrivacy.tsx', () => import('./pages/legal/StlmntPrivacy')) },
      { path: 'legal/stlmnt/terms', ...page('src/pages/legal/StlmntTerms.tsx', () => import('./pages/legal/StlmntTerms')) },
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
  '/support/payback',
  '/contact',
  '/legal',
  '/legal/yap',
  '/legal/payback',
  '/legal/pinpoint',
  '/legal/drayagepro',
  '/legal/zoori',
  '/legal/fengshui',
  '/legal/stlmnt',
  '/legal/drayagepro/privacy',
  '/legal/drayagepro/terms',
  '/legal/pinpoint/privacy',
  '/legal/pinpoint/terms',
  '/legal/payback/privacy',
  '/legal/payback/terms',
  '/legal/payback/data-deletion',
  '/legal/yap/privacy',
  '/legal/yap/terms',
  '/legal/zoori/privacy',
  '/legal/zoori/terms',
  '/legal/fengshui/privacy',
  '/legal/fengshui/terms',
  '/legal/stlmnt/privacy',
  '/legal/stlmnt/terms',
]
