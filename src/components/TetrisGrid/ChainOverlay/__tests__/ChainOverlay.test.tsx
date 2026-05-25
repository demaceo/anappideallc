import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { RefObject } from 'react'
import { ChainProvider, useChain } from '../../../../lib/chain'
import { ChainOverlay } from '../ChainOverlay'
import type { BlockId } from '../../Block'
import type { BlockRefEntry } from '../../useBlockCenters'

function makeBlockRef(rect: { offsetLeft: number; offsetTop: number; offsetWidth: number; offsetHeight: number }) {
  return { current: rect as unknown as HTMLAnchorElement }
}

function setupRefs() {
  const containerRef: RefObject<HTMLDivElement | null> = {
    current: { offsetWidth: 1000, offsetHeight: 800 } as unknown as HTMLDivElement,
  }
  const order: BlockId[] = ['hero', 'brand', 'about', 'work', 'services', 'process', 'contact']
  const blockRefs: BlockRefEntry[] = order.map((id, i) => ({
    id,
    ref: makeBlockRef({
      offsetLeft: 100 + i * 80,
      offsetTop: 100 + (i % 3) * 100,
      offsetWidth: 60,
      offsetHeight: 60,
    }),
  }))
  return { containerRef, blockRefs }
}

function ChainStarter({ blockId }: { blockId: BlockId }) {
  const { startChain } = useChain()
  return (
    <button data-testid="start" onClick={() => startChain(blockId, () => {})}>start</button>
  )
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ChainOverlay', () => {
  it('renders nothing in DOM when no chain is active', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container } = render(
      <ChainProvider>
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    // The overlay div may exist but no marble inside it
    expect(container.querySelector('svg')).toBeNull()
  })

  it('renders the marble when activeBlock is hero', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="hero" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('does NOT render a hero-style svg marble when activeBlock is work', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="work" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    // Work renders the domino cascade, not the hero marble svg
    expect(container.querySelector('svg')).toBeNull()
  })

  it('renders BOTH marble and bell when activeBlock is hero', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="hero" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    // Marble: svg + circle
    expect(container.querySelector('svg circle')).toBeInTheDocument()
    // Bell halo: a div with radial-gradient styling — find via halo class
    expect(container.querySelector('[class*="halo"]')).toBeInTheDocument()
  })

  it('renders AboutPendulum when activeBlock is about', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="about" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    // Pendulum has both a line (rod) and a circle (bob)
    expect(container.querySelector('line')).toBeInTheDocument()
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('does NOT render AboutPendulum when activeBlock is hero', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="hero" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    // Hero shows marble (circle) but no rod (line) since pendulum isn't dispatched
    expect(container.querySelector('line')).toBeNull()
  })

  it('renders WorkDominoCascade when activeBlock is work', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="work" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    expect(container.querySelectorAll('[data-domino]').length).toBe(5)
  })

  it('renders ContactSpring when activeBlock is contact', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="contact" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    expect(container.querySelector('[data-spring]')).toBeInTheDocument()
    expect(container.querySelector('[data-envelope]')).toBeInTheDocument()
  })

  it('renders ProcessPulley when activeBlock is process', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="process" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    expect(container.querySelector('[data-wheel]')).toBeInTheDocument()
    expect(container.querySelector('[data-weight]')).toBeInTheDocument()
  })

  it('renders ServicesLever when activeBlock is services', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter blockId="services" />
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    expect(container.querySelector('[data-lever]')).toBeInTheDocument()
    expect(container.querySelector('[data-flag]')).toBeInTheDocument()
  })

  it('overlay container has data-chain-overlay attribute (for inspection / Phase 5c hooks)', () => {
    const { containerRef, blockRefs } = setupRefs()
    const { container } = render(
      <ChainProvider>
        <ChainOverlay containerRef={containerRef} blockRefs={blockRefs} />
      </ChainProvider>,
    )
    expect(container.querySelector('[data-chain-overlay]')).toBeInTheDocument()
  })
})
