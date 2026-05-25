import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
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

  // Roving tabindex (WAI-ARIA toolbar / radio-group pattern). Only one
  // swatch is in the tab sequence at a time; ArrowLeft/Right/Up/Down +
  // Home/End shift focus among them. Tab moves out of the group entirely.
  // We seed the focused index from the currently-active material so
  // keyboard users land on "the current selection" when the panel opens.
  const activePresetIndex = useMemo(
    () => Math.max(0, MATERIAL_PRESETS.findIndex((p) => p.id === material)),
    [material],
  )
  const [focusedIndex, setFocusedIndex] = useState(activePresetIndex)
  const swatchRefs = useRef<Array<HTMLButtonElement | null>>([])

  // When the panel opens, sync the focused index to the current selection
  // and move DOM focus to that swatch. Without this, focus would still be
  // on the Brand block that opened the panel (or wherever inert just
  // displaced it), and arrow keys would have no anchor.
  useEffect(() => {
    if (!panelOpen) return
    setFocusedIndex(activePresetIndex)
    // Wait one frame so the animated dialog is mounted + interactive.
    const id = requestAnimationFrame(() => {
      swatchRefs.current[activePresetIndex]?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [panelOpen, activePresetIndex])

  const focusSwatch = useCallback((index: number) => {
    setFocusedIndex(index)
    swatchRefs.current[index]?.focus()
  }, [])

  const onSwatchesKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const count = MATERIAL_PRESETS.length
      // Horizontal-primary navigation; Up/Down behave like Left/Right so
      // keyboard users on the responsive multi-row mobile layouts still
      // get linear movement through the group.
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault()
          focusSwatch((focusedIndex + 1) % count)
          break
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault()
          focusSwatch((focusedIndex - 1 + count) % count)
          break
        }
        case 'Home': {
          e.preventDefault()
          focusSwatch(0)
          break
        }
        case 'End': {
          e.preventDefault()
          focusSwatch(count - 1)
          break
        }
      }
    },
    [focusedIndex, focusSwatch],
  )

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
          <div className={styles.swatches} onKeyDown={onSwatchesKeyDown}>
            {MATERIAL_PRESETS.map((preset, i) => (
              <Swatch
                key={preset.id}
                ref={(el) => {
                  swatchRefs.current[i] = el
                }}
                id={preset.id}
                label={preset.label}
                sublabel={preset.sublabel}
                active={material === preset.id}
                tabIndex={i === focusedIndex ? 0 : -1}
                onSelect={setMaterial}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
