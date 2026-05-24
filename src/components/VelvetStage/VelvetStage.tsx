import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import styles from './VelvetStage.module.css'

export interface VelvetStageProps {
  children: ReactNode
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6, ease: 'easeOut' as const },
}

/**
 * VelvetStage — the v2.0 environmental wrapper for the home grid (and
 * later, Velvet Vitrine inner pages in Phase 6). Renders three decorative
 * layers (floor, spot, vignette) as absolutely-positioned siblings to the
 * provided children. Layers fade in over 600ms on mount via Motion so the
 * environment feels like it's materializing. On non-modern-vibrant themes,
 * the layers are display:none via CSS theme-scoping so other themes get
 * their v1 environments unchanged.
 */
export function VelvetStage({ children }: VelvetStageProps) {
  return (
    <div className={styles.stage} data-env="velvet">
      <motion.div className={styles.floor} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.spot} aria-hidden="true" {...fadeIn} />
      {children}
      <motion.div className={styles.vignette} aria-hidden="true" {...fadeIn} />
    </div>
  )
}
