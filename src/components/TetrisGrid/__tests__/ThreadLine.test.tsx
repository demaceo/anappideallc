import { render, act } from '@testing-library/react'
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
  // Use a real div so addEventListener/removeEventListener/dispatchEvent work
  // for the mousemove proximity listener. Stub the layout properties.
  const container = document.createElement('div')
  Object.defineProperty(container, 'offsetWidth', { value: 1000, configurable: true })
  Object.defineProperty(container, 'offsetHeight', { value: 800, configurable: true })
  const containerRef = { current: container as HTMLDivElement }
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
    const div = document.createElement('div')
    Object.defineProperty(div, 'offsetWidth', { value: 1000, configurable: true })
    Object.defineProperty(div, 'offsetHeight', { value: 800, configurable: true })
    const containerRef = { current: div as HTMLDivElement }
    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={[]} />,
    )
    // SVG may still render but with 0 paths
    expect(container.querySelectorAll('path').length).toBe(0)
  })

  it('applies segmentBright class to segments adjacent to a near block on mousemove', () => {
    const { containerRef, blockRefs } = setupRefs()
    // Stub container.getBoundingClientRect for cursor coordinate translation
    ;(containerRef.current as unknown as { getBoundingClientRect: () => DOMRect }).getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 1000, bottom: 800, width: 1000, height: 800, x: 0, y: 0, toJSON: () => '' } as DOMRect)

    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={blockRefs} />,
    )

    // Hero center is at (130, 130) per setupRefs math (100+30, 100+30).
    // Dispatch a mousemove at (140, 140) — within 60px of hero.
    // The brightening listener is on `containerRef.current`, so dispatch
    // there rather than on the SVG.
    const moveEvent = new MouseEvent('mousemove', { clientX: 140, clientY: 140, bubbles: true })
    act(() => {
      ;(containerRef.current as unknown as HTMLDivElement).dispatchEvent(moveEvent)
    })

    // After mousemove, segments adjacent to hero (hero→brand and contact→hero)
    // should have the segmentBright class. happy-dom's CSS module class
    // names are hashed; we check via data-from/data-to selectors.
    // happy-dom exposes SVG className as a plain string (not SVGAnimatedString),
    // so we read via getAttribute('class').
    const heroOutgoing = container.querySelector('path[data-from="hero"]')
    const heroIncoming = container.querySelector('path[data-to="hero"]')
    expect(heroOutgoing?.getAttribute('class')).toMatch(/segmentBright/)
    expect(heroIncoming?.getAttribute('class')).toMatch(/segmentBright/)
  })

  it('removes segmentBright when cursor moves away from all blocks', () => {
    const { containerRef, blockRefs } = setupRefs()
    ;(containerRef.current as unknown as { getBoundingClientRect: () => DOMRect }).getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 1000, bottom: 800, width: 1000, height: 800, x: 0, y: 0, toJSON: () => '' } as DOMRect)

    const { container } = render(
      <ThreadLine containerRef={containerRef} blockRefs={blockRefs} />,
    )

    // First near hero
    act(() => {
      ;(containerRef.current as unknown as HTMLDivElement).dispatchEvent(
        new MouseEvent('mousemove', { clientX: 140, clientY: 140, bubbles: true }),
      )
    })
    // Then far away
    act(() => {
      ;(containerRef.current as unknown as HTMLDivElement).dispatchEvent(
        new MouseEvent('mousemove', { clientX: 900, clientY: 700, bubbles: true }),
      )
    })

    const paths = container.querySelectorAll('path')
    paths.forEach((p) => {
      expect(p.getAttribute('class') ?? '').not.toMatch(/segmentBright/)
    })
  })
})
