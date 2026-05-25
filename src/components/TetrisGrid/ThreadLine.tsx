import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { computeThreadSegments } from './threadPath'
import { useBlockCenters, type BlockRefEntry } from './useBlockCenters'
import type { BlockId } from './Block'
import styles from './ThreadLine.module.css'

export interface ThreadLineProps {
  containerRef: RefObject<HTMLDivElement | null>
  blockRefs: readonly BlockRefEntry[]
}

const PROXIMITY_PX = 60

/**
 * ThreadLine — renders the golden serpentine thread connecting all 7
 * grid blocks as a closed Catmull-Rom loop. Mounted INSIDE `.playfield`
 * so it inherits the parallax tilt; coordinates are container-local
 * (offsetLeft/Top), which are transform-invariant, so the path stays
 * geometrically valid across the 3D scene.
 *
 * Ambient state: each segment runs an 8s opacity shimmer (CSS-driven).
 * Cursor proximity: when the pointer is within PROXIMITY_PX of a block's
 * center (container-local coords), the two segments touching that block
 * brighten to 0.55 stroke-opacity. Cursor coords come from mousemove on
 * the container; brightening updates via React state.
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function ThreadLine({ containerRef, blockRefs }: ThreadLineProps) {
  const snapshot = useBlockCenters(containerRef, blockRefs)
  const segments = snapshot ? computeThreadSegments(snapshot.centers) : []

  const [nearBlock, setNearBlock] = useState<BlockId | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !snapshot) return

    const { centers } = snapshot
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      let closest: { id: BlockId; dist: number } | null = null
      for (const [id, pt] of Object.entries(centers) as [BlockId, { x: number; y: number }][]) {
        const dx = pt.x - x
        const dy = pt.y - y
        const dist = Math.hypot(dx, dy)
        if (!closest || dist < closest.dist) {
          closest = { id, dist }
        }
      }
      const next = closest && closest.dist <= PROXIMITY_PX ? closest.id : null
      // Avoid re-renders unless the near-block actually changes
      setNearBlock((prev) => (prev === next ? prev : next))
    }

    container.addEventListener('mousemove', onMove)
    return () => container.removeEventListener('mousemove', onMove)
  }, [containerRef, snapshot])

  // SVG always mounts so Phase 5 chain animations can target it even
  // before the first layout snapshot lands. Width/height fall back to
  // 1 (not 0) so the viewBox is technically valid; segments only render
  // when snapshot is populated.
  const width = snapshot?.containerSize.width ?? 1
  const height = snapshot?.containerSize.height ?? 1

  return (
    <svg
      className={styles.threadLayer}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {segments.map((seg) => {
        const adjacent = nearBlock !== null && (seg.from === nearBlock || seg.to === nearBlock)
        const className = `${styles.segment} ${adjacent ? styles.segmentBright : ''}`
        return (
          <path
            key={`${seg.from}-${seg.to}`}
            className={className}
            d={seg.d}
            data-from={seg.from}
            data-to={seg.to}
          />
        )
      })}
    </svg>
  )
}
