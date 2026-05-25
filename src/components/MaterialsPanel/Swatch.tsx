import type { MaterialId } from '../../lib/material-context'
import styles from './Swatch.module.css'

export interface SwatchProps {
  id: MaterialId
  label: string
  sublabel: string
  active: boolean
  onSelect: (id: MaterialId) => void
}

/**
 * A single Materials Panel swatch. Renders as a button containing a
 * tilted mini-block preview rendered in the preset's actual material
 * recipe (via data-material-preview attribute that the CSS recipes
 * also target alongside the global data-material scope).
 */
export function Swatch({ id, label, sublabel, active, onSelect }: SwatchProps) {
  return (
    <button
      type="button"
      className={`${styles.swatch} ${active ? styles.active : ''}`}
      aria-pressed={active}
      aria-label={`Apply ${label} material${active ? ' (active)' : ''}`}
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
}
