import type { RefObject } from 'react'
import { computeThreadSegments } from './threadPath'
import { useBlockCenters, type BlockRefEntry } from './useBlockCenters'
import styles from './ThreadLine.module.css'

export interface ThreadLineProps {
  containerRef: RefObject<HTMLDivElement | null>
  blockRefs: readonly BlockRefEntry[]
}

/**
 * ThreadLine — renders the golden serpentine thread connecting all 7
 * grid blocks as a closed Catmull-Rom loop. Mounted INSIDE `.playfield`
 * so it inherits the parallax tilt; coordinates are container-local
 * (offsetLeft/Top), which are transform-invariant, so the path stays
 * geometrically valid across the 3D scene.
 *
 * Ambient state: each segment runs an 8s opacity shimmer (CSS-driven).
 * Cursor-proximity brightening lands in a follow-up task.
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function ThreadLine({ containerRef, blockRefs }: ThreadLineProps) {
  const centers = useBlockCenters(containerRef, blockRefs)
  const segments = centers ? computeThreadSegments(centers) : []

  const width = containerRef.current?.offsetWidth ?? 0
  const height = containerRef.current?.offsetHeight ?? 0

  return (
    <svg
      className={styles.threadLayer}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {segments.map((seg) => (
        <path
          key={`${seg.from}-${seg.to}`}
          className={styles.segment}
          d={seg.d}
          data-from={seg.from}
          data-to={seg.to}
        />
      ))}
    </svg>
  )
}
