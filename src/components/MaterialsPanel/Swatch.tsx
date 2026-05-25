import { forwardRef } from 'react'
import type { MaterialId } from '../../lib/material-context'
import styles from './Swatch.module.css'

export interface SwatchProps {
  id: MaterialId
  label: string
  sublabel: string
  active: boolean
  onSelect: (id: MaterialId) => void
  /**
   * Roving-tabindex value. Exactly one swatch in the group has
   * `tabIndex={0}` (the currently-focused one); all others have
   * `tabIndex={-1}` so they're skipped by Tab but remain
   * programmatically focusable. Defaults to 0 when omitted so
   * Swatch keeps working in isolation (tests, future reuse).
   */
  tabIndex?: number
}

/**
 * A single Materials Panel swatch. Renders as a button containing a
 * tilted mini-block preview rendered in the preset's actual material
 * recipe (via data-material-preview attribute that the CSS recipes
 * also target alongside the global data-material scope).
 */
export const Swatch = forwardRef<HTMLButtonElement, SwatchProps>(function Swatch(
  { id, label, sublabel, active, onSelect, tabIndex },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.swatch} ${active ? styles.active : ''}`}
      aria-pressed={active}
      aria-label={`Apply ${label} material${active ? ' (active)' : ''}`}
      tabIndex={tabIndex}
      onClick={() => onSelect(id)}
    >
      <div
        className={styles.preview}
        data-material-preview={id}
        aria-hidden="true"
      />
      <span className={styles.label}>{label}</span>
      <span className={styles.sublabel}>{sublabel}</span>
    </button>
  )
})
