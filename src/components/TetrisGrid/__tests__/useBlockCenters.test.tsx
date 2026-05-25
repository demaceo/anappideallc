import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { RefObject } from 'react'
import { useBlockCenters } from '../useBlockCenters'
import type { BlockId } from '../Block'

interface MockAnchor {
  offsetLeft: number
  offsetTop: number
  offsetWidth: number
  offsetHeight: number
}

function makeRef(rect: MockAnchor): RefObject<HTMLAnchorElement | null> {
  return { current: rect as unknown as HTMLAnchorElement }
}

class MockResizeObserver {
  static instances: MockResizeObserver[] = []
  callback: ResizeObserverCallback
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    MockResizeObserver.instances.push(this)
  }
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  fire(entries: ResizeObserverEntry[] = []) {
    this.callback(entries, this as unknown as ResizeObserver)
  }
}

beforeEach(() => {
  MockResizeObserver.instances = []
  ;(globalThis as { ResizeObserver: typeof MockResizeObserver }).ResizeObserver =
    MockResizeObserver
})

describe('useBlockCenters', () => {
  it('returns null when container ref is null', () => {
    const containerRef: RefObject<HTMLDivElement | null> = { current: null }
    const blockRefs: { id: BlockId; ref: RefObject<HTMLAnchorElement | null> }[] = []
    const { result } = renderHook(() => useBlockCenters(containerRef, blockRefs))
    expect(result.current).toBeNull()
  })

  it('computes centers from offsetLeft/offsetTop + offsetWidth/offsetHeight halves', () => {
    const containerRef = {
      current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
    }
    const blockRefs = [
      { id: 'hero' as BlockId, ref: makeRef({ offsetLeft: 100, offsetTop: 200, offsetWidth: 200, offsetHeight: 150 }) },
      { id: 'brand' as BlockId, ref: makeRef({ offsetLeft: 400, offsetTop: 50, offsetWidth: 100, offsetHeight: 100 }) },
    ]
    const { result } = renderHook(() => useBlockCenters(containerRef, blockRefs))
    expect(result.current?.hero).toEqual({ x: 200, y: 275 })   // 100+100, 200+75
    expect(result.current?.brand).toEqual({ x: 450, y: 100 })  // 400+50, 50+50
  })

  it('recomputes when the ResizeObserver fires', () => {
    const containerRef = {
      current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
    }
    const block = { offsetLeft: 100, offsetTop: 200, offsetWidth: 200, offsetHeight: 150 }
    const blockRefs = [{ id: 'hero' as BlockId, ref: makeRef(block) }]

    const { result } = renderHook(() => useBlockCenters(containerRef, blockRefs))
    expect(result.current?.hero).toEqual({ x: 200, y: 275 })

    // Simulate a layout shift: hero block moves
    block.offsetLeft = 150
    block.offsetTop = 100
    act(() => {
      MockResizeObserver.instances[0].fire()
    })
    expect(result.current?.hero).toEqual({ x: 250, y: 175 })
  })

  it('disconnects the observer on unmount', () => {
    const containerRef = {
      current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
    }
    const blockRefs = [{ id: 'hero' as BlockId, ref: makeRef({ offsetLeft: 0, offsetTop: 0, offsetWidth: 100, offsetHeight: 100 }) }]
    const { unmount } = renderHook(() => useBlockCenters(containerRef, blockRefs))
    const observer = MockResizeObserver.instances[0]
    unmount()
    expect(observer.disconnect).toHaveBeenCalled()
  })
})
