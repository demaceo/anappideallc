import type { RefObject } from 'react'
import { useChain } from '../../../lib/chain'
import { useBlockCenters, type BlockRefEntry } from '../useBlockCenters'
import { HeroMarbleDrop } from './HeroMarbleDrop'
import { HeroBellFlash } from './HeroBellFlash'
import { AboutPendulum } from './AboutPendulum'
import { WorkDominoCascade } from './WorkDominoCascade'
import { ServicesLever } from './ServicesLever'
import { ProcessPulley } from './ProcessPulley'
import { ContactSpring } from './ContactSpring'
import styles from './ChainOverlay.module.css'

export interface ChainOverlayProps {
  containerRef: RefObject<HTMLDivElement | null>
  blockRefs: readonly BlockRefEntry[]
}

/**
 * ChainOverlay — full-coverage layer that renders the active chain
 * reaction's gadget visuals. Sits inside `.playfield` as a sibling
 * to `.grid` and `ThreadLine`. Reads `activeBlock` from `useChain()`
 * and dispatches to per-block gadget components positioned over each
 * block's center (looked up via `blockRefs` + `useBlockCenters`).
 *
 * Phase 5b ships only the Hero marble drop. Other blocks' visuals
 * land in Phase 5c+ — `activeBlock` matching `about` / `work` / etc.
 * currently renders nothing.
 *
 * Decorative — pointer-events:none, no interactive content.
 */
export function ChainOverlay({ containerRef, blockRefs }: ChainOverlayProps) {
  const { activeBlock } = useChain()
  const snapshot = useBlockCenters(containerRef, blockRefs)
  const heroCenter = snapshot?.centers.hero
  const aboutCenter = snapshot?.centers.about
  const workCenter = snapshot?.centers.work
  const servicesCenter = snapshot?.centers.services
  const processCenter = snapshot?.centers.process
  const contactCenter = snapshot?.centers.contact

  return (
    <div className={styles.overlay} data-chain-overlay>
      {activeBlock === 'hero' && heroCenter && (
        <>
          <HeroMarbleDrop targetX={heroCenter.x} targetY={heroCenter.y} />
          <HeroBellFlash targetX={heroCenter.x} targetY={heroCenter.y} />
        </>
      )}
      {activeBlock === 'about' && aboutCenter && (
        <AboutPendulum targetX={aboutCenter.x} targetY={aboutCenter.y} />
      )}
      {activeBlock === 'work' && workCenter && (
        <WorkDominoCascade targetX={workCenter.x} targetY={workCenter.y} />
      )}
      {activeBlock === 'services' && servicesCenter && (
        <ServicesLever targetX={servicesCenter.x} targetY={servicesCenter.y} />
      )}
      {activeBlock === 'process' && processCenter && (
        <ProcessPulley targetX={processCenter.x} targetY={processCenter.y} />
      )}
      {activeBlock === 'contact' && contactCenter && (
        <ContactSpring targetX={contactCenter.x} targetY={contactCenter.y} />
      )}
    </div>
  )
}
