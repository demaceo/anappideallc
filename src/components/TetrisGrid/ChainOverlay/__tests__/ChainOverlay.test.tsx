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

  it('does NOT render a visual when activeBlock is any non-hero block (Phase 5b scope)', () => {
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
    // work's gadget visual isn't shipped yet (Phase 5c+)
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
