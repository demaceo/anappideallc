import { useCallback, useEffect, useMemo, useState, useContext } from 'react'
import type { ReactNode } from 'react'
import {
  DEFAULT_MATERIAL,
  MATERIAL_IDS,
  MaterialContext,
  type MaterialId,
} from './material-context'

const STORAGE_KEY = 'material'

function readInitial(): MaterialId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && (MATERIAL_IDS as readonly string[]).includes(saved)) {
      return saved as MaterialId
    }
  } catch {
    // localStorage may throw in private browsing / SSR — fall through to default
  }
  return DEFAULT_MATERIAL
}

export interface MaterialProviderProps {
  children: ReactNode
}

/**
 * Provides the active Materials Panel preset and panel-open state. Persists
 * the preset to localStorage and mirrors it onto `<html data-material>` so
 * CSS can scope alternate material recipes via attribute selectors.
 */
export function MaterialProvider({ children }: MaterialProviderProps) {
  const [material, setMaterialState] = useState<MaterialId>(readInitial)
  const [panelOpen, setPanelOpen] = useState(false)

  // Sync to localStorage + DOM attribute on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, material)
    } catch {
      // ignore
    }
    document.documentElement.dataset.material = material
  }, [material])

  const setMaterial = useCallback((next: MaterialId) => {
    setMaterialState(next)
  }, [])

  const openPanel = useCallback(() => setPanelOpen(true), [])
  const closePanel = useCallback(() => setPanelOpen(false), [])

  const value = useMemo(
    () => ({ material, setMaterial, panelOpen, openPanel, closePanel }),
    [material, setMaterial, panelOpen, openPanel, closePanel],
  )

  return <MaterialContext.Provider value={value}>{children}</MaterialContext.Provider>
}

export function useMaterial() {
  const ctx = useContext(MaterialContext)
  if (!ctx) {
    throw new Error('useMaterial must be used inside <MaterialProvider>')
  }
  return ctx
}
