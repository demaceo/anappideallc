import type { ReactNode } from 'react'
import styles from './AuroraChamber.module.css'

export interface AuroraChamberProps {
  children: ReactNode
}

/**
 * AuroraChamber — the v2.0 environment for /contact on modern-vibrant.
 * Wraps the page content with a cosmic aurora composition: cyan, magenta,
 * and gold radial gradients drift against a deep-space backing, with a
 * sparse star field and an inset vignette framing the viewport. On other
 * themes the wrapper is a transparent passthrough.
 */
export function AuroraChamber({ children }: AuroraChamberProps) {
  return (
    <div className={styles.chamber} data-env="aurora">
      <div className={styles.auroraCyan} aria-hidden="true" />
      <div className={styles.auroraMagenta} aria-hidden="true" />
      <div className={styles.auroraGold} aria-hidden="true" />
      <div className={styles.stars} aria-hidden="true" />
      {children}
      <div className={styles.vignette} aria-hidden="true" />
    </div>
  )
}
