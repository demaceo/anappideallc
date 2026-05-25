import { useEffect, useState, useRef } from 'react'
import type { RefObject } from 'react'
import type { BlockId } from './Block'
import type { Point } from './threadPath'

export type BlockCenters = Record<BlockId, Point>

export interface BlockRefEntry {
  id: BlockId
  ref: RefObject<HTMLAnchorElement | null>
}

function readCenters(
  blockRefs: readonly BlockRefEntry[],
): Partial<BlockCenters> | null {
  if (blockRefs.length === 0) return null
  const out: Partial<BlockCenters> = {}
  for (const { id, ref } of blockRefs) {
    const el = ref.current
    if (!el) continue
    out[id] = {
      x: el.offsetLeft + el.offsetWidth / 2,
      y: el.offsetTop + el.offsetHeight / 2,
    }
  }
  return out
}

/**
 * Observes the container's layout via ResizeObserver and returns the
 * current center positions of all blocks in container-local coordinates
 * (offsetLeft/Top space). These coordinates are TRANSFORM-INVARIANT —
 * they do not change when `.playfield` tilts via parallax, so the
 * computed thread geometry stays valid across the 3D scene.
 *
 * Returns null until the container ref is mounted, then a partial map
 * of BlockId → Point. Caller should defensively check completeness
 * before passing to `computeThreadSegments`.
 */
export function useBlockCenters(
  containerRef: RefObject<HTMLDivElement | null>,
  blockRefs: readonly BlockRefEntry[],
): Partial<BlockCenters> | null {
  const [centers, setCenters] = useState<Partial<BlockCenters> | null>(() =>
    readCenters(blockRefs),
  )

  // Stable callback ref so the effect doesn't rebind every render
  const blockRefsRef = useRef(blockRefs)
  blockRefsRef.current = blockRefs

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      setCenters(null)
      return
    }

    // Initial read on mount (covers the case where refs land after first render)
    setCenters(readCenters(blockRefsRef.current))

    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      setCenters(readCenters(blockRefsRef.current))
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [containerRef])

  return centers
}
