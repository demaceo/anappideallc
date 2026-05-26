import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import styles from './VelvetVitrine.module.css'

export interface VelvetVitrineProps {
  children: ReactNode
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
}

/**
 * VelvetVitrine — the Velvet Stage atmosphere for scrollable inner pages.
 * Used by About / Work / Services / Process. Contact uses AuroraChamber
 * instead (the Hero portal's dedicated inner environment).
 *
 * Carries the burgundy velvet floor + spotlight + corner vignette from the
 * home stage into inner pages, closing the "experience cliff" described in
 * the v1 UX critique and in spec §11.2. The three atmosphere layers fade in
 * over 500ms on mount, matching VelvetStage's entry timing.
 *
 * Architecture notes:
 * — No `perspective` (inner page content is flat, not 3D).
 * — `padding-top: var(--inner-nav-height)` clears the InnerNav fixed bar.
 * — Children are elevated to z-index: 2 via `.content` wrapper so they sit
 *   above the floor (z-index 0) and spot (z-index 1) layers.
 * — The vignette (z-index 10) is purely `box-shadow: inset` so it only
 *   darkens the edges without obscuring center content or blocking clicks.
 * — On non-modern-vibrant themes, all atmosphere layers are display:none.
 */
export function VelvetVitrine({ children }: VelvetVitrineProps) {
  return (
    <div className={styles.vitrine} data-env="velvet-vitrine">
      <motion.div className={styles.floor} aria-hidden="true" {...fadeIn} />
      <motion.div className={styles.spot} aria-hidden="true" {...fadeIn} />
      <div className={styles.content}>{children}</div>
      <motion.div className={styles.vignette} aria-hidden="true" {...fadeIn} />
    </div>
  )
}
