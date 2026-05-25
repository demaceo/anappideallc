import { useEffect, useState, useRef } from 'react'
import type { RefObject } from 'react'
import type { BlockId } from './Block'
import type { Point } from './threadPath'

export type BlockCenters = Record<BlockId, Point>

export interface BlockRefEntry {
  id: BlockId
  ref: RefObject<HTMLAnchorElement | null>
}

export interface ContainerSize {
  width: number
  height: number
}

export interface LayoutSnapshot {
  centers: Partial<BlockCenters>
  containerSize: ContainerSize
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

function readSnapshot(
  container: HTMLDivElement,
  blockRefs: readonly BlockRefEntry[],
): LayoutSnapshot | null {
  const centers = readCenters(blockRefs)
  if (!centers) return null
  return {
    centers,
    containerSize: {
      width: container.offsetWidth,
      height: container.offsetHeight,
    },
  }
}

/**
 * Observes the container's layout via ResizeObserver and returns both
 * the current center positions of all blocks AND the container's own
 * dimensions in container-local coordinates (offsetLeft/Top space).
 * These coordinates are TRANSFORM-INVARIANT — they do not change when
 * `.playfield` tilts via parallax, so the computed thread geometry
 * stays valid across the 3D scene.
 *
 * Returns null until the container ref is mounted (covers the initial
 * render window before refs are populated), then a LayoutSnapshot.
 * Bundling centers + containerSize in one state slot prevents the
 * one-frame "viewBox=0 0 0 0" window where the SVG would otherwise
 * render before useEffect ran. Uses useLayoutEffect so the observer
 * is installed BEFORE first paint — eliminates any timing race with
 * StrictMode's double-invoke.
 */
export function useBlockCenters(
  containerRef: RefObject<HTMLDivElement | null>,
  blockRefs: readonly BlockRefEntry[],
): LayoutSnapshot | null {
  const [snapshot, setSnapshot] = useState<LayoutSnapshot | null>(null)

  // Stable ref to blockRefs so the effect doesn't rebind on every render
  const blockRefsRef = useRef(blockRefs)
  blockRefsRef.current = blockRefs

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      setSnapshot(null)
      return
    }

    // Initial read after mount — refs are populated by the commit phase
    // so this captures the real layout. ThreadLine's SVG renders with
    // fallback viewBox (1×1) on the first render before this fires;
    // segments only appear once snapshot lands here.
    setSnapshot(readSnapshot(container, blockRefsRef.current))

    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      const c = containerRef.current
      if (!c) return
      setSnapshot(readSnapshot(c, blockRefsRef.current))
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [containerRef])

  return snapshot
}
