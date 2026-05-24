import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import styles from './AuroraChamber.module.css'

export interface AuroraChamberProps {
  children: ReactNode
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6, ease: 'easeOut' as const },
}

/**
 * AuroraChamber — the v2.0 environment for /contact on modern-vibrant.
 * Wraps the page content with a cosmic aurora composition: cyan, magenta,
 * and gold radial gradients drift against a deep-space backing, with a
 * sparse star field and an inset vignette framing the viewport. Layers
 * fade in over 600ms on mount via Motion. On other themes the wrapper is
 * a transparent passthrough.
 */
export function AuroraChamber({ children }: AuroraChamberProps) {
  return (
    <div className={styles.chamber} data-env="aurora">
      <motion.div className={styles.auroraCyan} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.auroraMagenta} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.auroraGold} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.stars} aria-hidden="true" {...fadeIn} />
      {children}
      <motion.div className={styles.vignette} aria-hidden="true" {...fadeIn} />
    </div>
  )
}
