import type { ComponentType } from 'react'
import type { RouteObject } from 'react-router'
import App from './App'
import Home from './pages/Home'
import { RouteError } from './components/RouteError/RouteError'

// Every page except Home loads on demand: Vite turns each module matched here
// into its own chunk, so a visitor downloads only the page they're on (the
// legal pages alone were close to half the old single bundle). Home stays in
// the main bundle as the most-visited page.
const pageModules = import.meta.glob<{ default: ComponentType }>(['./pages/**/*.tsx', '!./pages/Home.tsx'])

// `module` is the page's source path, which is also its key in Vite's build
// manifest: the prerender step uses it to preload the page's chunk from that
// page's HTML.
export interface PageHandle {
  module: string
}

function page(file: string) {
  const load = pageModules[file]
  if (!load) throw new Error(`routes.tsx: no page module at ${file}`)
  return {
    lazy: async () => ({ Component: (await load()).default }),
    handle: { module: `src/${file.slice(2)}` } satisfies PageHandle,
  }
}

// URL path → page module, written once each.
const PAGES: [path: string, file: string][] = [
  ['about', './pages/About.tsx'],
  ['work', './pages/Work.tsx'],
  ['work/:slug', './pages/ProjectDetail.tsx'],
  ['services', './pages/Services.tsx'],
  ['process', './pages/Process.tsx'],
  ['why-not-ai', './pages/WhyNotAI.tsx'],
  ['support', './pages/Support.tsx'],
  ['support/payback', './pages/PaybackSupport.tsx'],
  ['contact', './pages/Contact.tsx'],
  ['legal', './pages/legal/LegalIndex.tsx'],
  ['legal/:app', './pages/legal/LegalApp.tsx'],
  ['legal/drayagepro/privacy', './pages/legal/DrayageProPrivacy.tsx'],
  ['legal/drayagepro/terms', './pages/legal/DrayageProTerms.tsx'],
  ['legal/pinpoint/privacy', './pages/legal/PinpointPrivacy.tsx'],
  ['legal/pinpoint/terms', './pages/legal/PinpointTerms.tsx'],
  ['legal/payback/privacy', './pages/legal/PaybackPrivacy.tsx'],
  ['legal/payback/terms', './pages/legal/PaybackTerms.tsx'],
  ['legal/payback/data-deletion', './pages/legal/PaybackDataDeletion.tsx'],
  ['legal/yap/privacy', './pages/legal/YapPrivacy.tsx'],
  ['legal/yap/terms', './pages/legal/YapTerms.tsx'],
  ['legal/zoori/privacy', './pages/legal/ZooriPrivacy.tsx'],
  ['legal/zoori/terms', './pages/legal/ZooriTerms.tsx'],
  ['legal/fengshui/privacy', './pages/legal/FengshuiPrivacy.tsx'],
  ['legal/fengshui/terms', './pages/legal/FengshuiTerms.tsx'],
  ['legal/stlmnt/privacy', './pages/legal/StlmntPrivacy.tsx'],
  ['legal/stlmnt/terms', './pages/legal/StlmntTerms.tsx'],
]

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: App,
    // Catches a page chunk that fails to load (e.g. a tab left open across a
    // redeploy) and unknown URLs. See RouteError.
    ErrorBoundary: RouteError,
    children: [{ index: true, Component: Home }, ...PAGES.map(([path, file]) => ({ path, ...page(file) }))],
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
