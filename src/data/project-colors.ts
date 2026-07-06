// Single source of truth for each case study's real brand color. Used as:
//  1. the Work-index tile background behind the line-glyph logo (Work.tsx)
//  2. the case-study hero-mark tile background (ProjectDetail.tsx)
//  3. the fallback "specimen swatch" fill (cover-strip + first chip) on the
//     project's own detail page, when the case study doesn't ship a more
//     tuned `theme.accent` override (see case-studies.ts `CaseStudyTheme`).
export const PROJECT_COLORS: Record<string, string> = {
  'stlmnt-settlement-tracker': '#1f6b3b',
  'pinpoint-civic-engagement': '#8A1C1C',
  'payback-consumer-intelligence': '#1a3a5c',
  'rentharbor-property-management': '#2563EB',
  'feng-shui-room-analysis': '#C44536',
  'yap-united-live-translation': '#0E7C86',
  'drayage-drivers': '#c0392b',
  'zoori-pet-care': '#F4533C',
  'hitldi-platform': '#2c3e50',
  'unmasked-coaching': '#8B4C99',
  'timeless-coach-consult': '#2D4A3E',
  'portfolio': '#2980b9',
}
