import type { MaterialId } from '../../lib/material-context'

export interface MaterialPreset {
  id: MaterialId
  label: string
  sublabel: string
}

/**
 * Display metadata for the 7 Materials Panel presets — ordered for the
 * swatch grid. The id is the source of truth; CSS recipes are keyed by
 * `[data-material="{id}"]` selectors in Block.module.css.
 */
export const MATERIAL_PRESETS: readonly MaterialPreset[] = [
  { id: 'anodized', label: 'Anodized',         sublabel: 'Default' },
  { id: 'steel',    label: 'Polished Steel',   sublabel: 'Mirror' },
  { id: 'gold',     label: 'Gold Leaf',        sublabel: 'Warm soft' },
  { id: 'frosted',  label: 'Frosted Glass',    sublabel: 'Translucent' },
  { id: 'bronze',   label: 'Patinated Bronze', sublabel: 'Aged warm' },
  { id: 'ceramic',  label: 'Cream Ceramic',    sublabel: 'Matte' },
  { id: 'showcase', label: 'Showcase',         sublabel: 'All distinct' },
] as const
