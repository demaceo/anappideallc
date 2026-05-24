import type { ReactNode } from 'react'
import styles from './VelvetStage.module.css'

export interface VelvetStageProps {
  children: ReactNode
}

/**
 * VelvetStage — the v2.0 environmental wrapper for the home grid (and
 * later, Velvet Vitrine inner pages in Phase 6). Renders three decorative
 * layers (floor, spot, vignette) as absolutely-positioned siblings to the
 * provided children. On non-modern-vibrant themes, those layers are hidden
 * via CSS theme-scoping so other themes get their v1 environments instead.
 */
export function VelvetStage({ children }: VelvetStageProps) {
  return (
    <div className={styles.stage} data-env="velvet">
      <div className={styles.floor} aria-hidden="true" />
      <div className={styles.spot} aria-hidden="true" />
      {children}
      <div className={styles.vignette} aria-hidden="true" />
    </div>
  )
}
