import { useEffect, useId, useRef } from 'react'
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
  // Tracks whether the panel was previously open, so we only restore focus
  // on a true open→close transition (not on initial mount, when panelOpen
  // begins false and we don't want to steal focus to the Brand block).
  const wasOpenRef = useRef(false)

  // Escape key handler — bound while panel is open, unbound otherwise.
  useEffect(() => {
    if (!panelOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [panelOpen, closePanel])

  // Focus restoration: when the panel closes, send focus back to the Brand
  // block that opened it. Part of the dialog focus-trap contract (WCAG
  // 2.4.3). Only fires on a real open→close transition, not on initial
  // mount, so we don't yank focus from elsewhere when the page first loads.
  useEffect(() => {
    if (panelOpen) {
      wasOpenRef.current = true
      return
    }
    if (!wasOpenRef.current) return
    wasOpenRef.current = false
    const brand = document.querySelector<HTMLElement>('[data-block-id="brand"]')
    brand?.focus()
  }, [panelOpen])

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
