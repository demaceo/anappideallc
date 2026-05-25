import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ChainProvider, useChain } from '../../../lib/chain'
import { HeroAuroraGrow } from '../HeroAuroraGrow'

beforeEach(() => {
  vi.useFakeTimers()
  // Stub a hero block element in the DOM with stable bounds.
  const stub = document.createElement('a')
  stub.setAttribute('data-block-id', 'hero')
  stub.getBoundingClientRect = () =>
    ({ left: 100, top: 200, right: 200, bottom: 280, width: 100, height: 80, x: 100, y: 200, toJSON: () => '' } as DOMRect)
  document.body.appendChild(stub)
})

afterEach(() => {
  vi.useRealTimers()
  document.body.querySelector('[data-block-id="hero"]')?.remove()
})

function ChainStarter() {
  const { startChain } = useChain()
  return <button data-testid="start" onClick={() => startChain('hero', () => {})}>start</button>
}

describe('HeroAuroraGrow', () => {
  it('renders nothing when no chain is active', () => {
    const { container } = render(
      <ChainProvider>
        <HeroAuroraGrow />
      </ChainProvider>,
    )
    expect(container.querySelector('[class*="growWrapper"]')).toBeNull()
  })

  it('renders the aurora overlay when hero chain is active', () => {
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter />
        <HeroAuroraGrow />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    expect(container.querySelector('[class*="growWrapper"]')).toBeInTheDocument()
  })

  it('the grow wrapper has aria-hidden="true"', () => {
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter />
        <HeroAuroraGrow />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    const wrapper = container.querySelector('[class*="growWrapper"]')
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })

  it('positions itself at the hero block center via getBoundingClientRect', () => {
    const { container, getByTestId } = render(
      <ChainProvider>
        <ChainStarter />
        <HeroAuroraGrow />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    const wrapper = container.querySelector('[class*="growWrapper"]') as HTMLElement
    // hero rect: left=100, top=200, width=100, height=80 → center at (150, 240)
    expect(wrapper.style.left).toBe('150px')
    expect(wrapper.style.top).toBe('240px')
  })

  it('does NOT render for non-hero blocks (e.g., work)', () => {
    function WorkStarter() {
      const { startChain } = useChain()
      return <button data-testid="start" onClick={() => startChain('work', () => {})}>start</button>
    }
    const { container, getByTestId } = render(
      <ChainProvider>
        <WorkStarter />
        <HeroAuroraGrow />
      </ChainProvider>,
    )
    act(() => {
      getByTestId('start').click()
    })
    expect(container.querySelector('[class*="growWrapper"]')).toBeNull()
  })
})
