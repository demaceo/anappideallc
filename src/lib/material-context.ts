import { createContext } from 'react'

export type MaterialId =
  | 'anodized'
  | 'steel'
  | 'gold'
  | 'frosted'
  | 'bronze'
  | 'ceramic'
  | 'showcase'

export const MATERIAL_IDS: readonly MaterialId[] = [
  'anodized',
  'steel',
  'gold',
  'frosted',
  'bronze',
  'ceramic',
  'showcase',
] as const

export const DEFAULT_MATERIAL: MaterialId = 'anodized'

export interface MaterialContextValue {
  material: MaterialId
  setMaterial: (next: MaterialId) => void
  panelOpen: boolean
  openPanel: () => void
  closePanel: () => void
}

export const MaterialContext = createContext<MaterialContextValue | null>(null)
