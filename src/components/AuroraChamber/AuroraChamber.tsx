import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import styles from './AuroraChamber.module.css'

export interface AuroraChamberProps {
  children: ReactNode
}

// Motion fade-in for the decorative atmosphere. `exit` removed: the chamber
// is not wrapped in <AnimatePresence>, so an exit animation would never fire.
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: 'easeOut' as const },
}

/**
 * AuroraChamber — the v2.0 environment for /contact on modern-vibrant.
 * Wraps the page content with a cosmic aurora composition: cyan, magenta,
 * and gold radial gradients drift against a deep-space backing, with a
 * sparse star field and an inset vignette framing the viewport. Layers
 * fade in over 600ms on mount via Motion. On other themes the wrapper is
 * a transparent passthrough.
 *
 * Children are wrapped in a `.content` div with `position: relative;
 * z-index: 1` so the page's `<main>` reads on top of the aurora gradient
 * layers (all at z-index: 0). Without this wrapper, in-flow content paints
 * in stacking layer 5 and the positioned auroras paint above it in layer 6.
 */
export function AuroraChamber({ children }: AuroraChamberProps) {
  return (
    <div className={styles.chamber} data-env="aurora">
      <motion.div className={styles.auroraCyan} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.auroraMagenta} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.auroraGold} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.stars} aria-hidden="true" {...fadeIn} />
      <div className={styles.content}>{children}</div>
      <motion.div className={styles.vignette} aria-hidden="true" {...fadeIn} />
    </div>
  )
}
