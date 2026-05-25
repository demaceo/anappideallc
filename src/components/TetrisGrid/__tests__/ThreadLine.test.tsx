import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThreadLine } from '../ThreadLine'
import type { BlockId } from '../Block'

class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  constructor(_cb: ResizeObserverCallback) {}
}

beforeEach(() => {
  ;(globalThis as unknown as { ResizeObserver: typeof MockResizeObserver }).ResizeObserver =
    MockResizeObserver
})

function setupRefs() {
  const containerRef = {
    current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
  }
  const order: BlockId[] = ['hero', 'brand', 'about', 'work', 'services', 'process', 'contact']
  const blockRefs = order.map((id, i) => ({
    id,
    ref: {
      current: {
        offsetLeft: 100 + i * 80,
        offsetTop: 100 + (i % 3) * 100,
        offsetWidth: 60,
        offsetHeight: 60,
      } as unknown as HTMLAnchorElement,
    },
  }))
  return { containerRef, blockRefs }
}

describe('ThreadLine', () => {
  it('renders an SVG layer with aria-hidden="true"', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={blockRefs} />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders 7 <path> segments', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={blockRefs} />,
    )
    expect(container.querySelectorAll('path').length).toBe(7)
  })

  it('each path has a non-empty d attribute', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={blockRefs} />,
    )
    const paths = container.querySelectorAll('path')
    paths.forEach((p) => {
      const d = p.getAttribute('d')
      expect(d).toBeTruthy()
      expect(d!.length).toBeGreaterThan(10)
    })
  })

  it('renders nothing when block refs are empty', () => {
    const containerRef = {
      current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
    }
    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={[]} />,
    )
    // SVG may still render but with 0 paths
    expect(container.querySelectorAll('path').length).toBe(0)
  })
})
