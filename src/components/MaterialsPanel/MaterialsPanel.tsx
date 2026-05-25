import { useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useMaterial } from '../../lib/material'
import { MATERIAL_PRESETS } from './materialPresets'
import { Swatch } from './Swatch'
import styles from './MaterialsPanel.module.css'

const SLIDE_UP = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const },
}

/**
 * MaterialsPanel — bottom drawer revealing the 7 material presets.
 * Reads panelOpen + material from useMaterial(); dispatches setMaterial
 * + closePanel back to context. Escape closes; close button closes;
 * clicking a swatch applies the preset (without closing — visitor may
 * want to try several).
 */
export function MaterialsPanel() {
  const { material, setMaterial, panelOpen, closePanel } = useMaterial()
  const titleId = useId()

  // Escape key handler — bound while panel is open, unbound otherwise.
  useEffect(() => {
    if (!panelOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [panelOpen, closePanel])

  return (
    <AnimatePresence>
      {panelOpen && (
        <motion.div
          {...SLIDE_UP}
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>Materials</h2>
            <span className={styles.meta}>
              Each preset applies globally · saved to localStorage
            </span>
            <button
              type="button"
              onClick={closePanel}
              className={styles.close}
              aria-label="Close Materials panel"
            >
              ✕
            </button>
          </div>
          <div className={styles.swatches}>
            {MATERIAL_PRESETS.map((preset) => (
              <Swatch
                key={preset.id}
                id={preset.id}
                label={preset.label}
                sublabel={preset.sublabel}
                active={material === preset.id}
                onSelect={setMaterial}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
