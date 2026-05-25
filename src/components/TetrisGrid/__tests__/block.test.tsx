import { render, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Block } from '../Block'
import type { BlockProps } from '../Block'
import { MaterialProvider, useMaterial } from '../../../lib/material'
import { ThemeProvider } from '../../../lib/theme'
import { ChainProvider } from '../../../lib/chain'

function renderBlock(props: Partial<BlockProps> = {}) {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <MaterialProvider>
          <ChainProvider>
            <Block id="hero" to="/" title="Test Title" {...props} />
          </ChainProvider>
        </MaterialProvider>
      </ThemeProvider>
    </MemoryRouter>,
  )
}

describe('Block', () => {
  it('adds data-reveal="title" to the title span', () => {
    const { getByText } = renderBlock({ title: 'Hello' })
    expect(getByText('Hello')).toHaveAttribute('data-reveal', 'title')
  })

  it('adds data-reveal="subtitle" to the subtitle span when present', () => {
    const { getByText } = renderBlock({ subtitle: 'Sub text' })
    expect(getByText('Sub text')).toHaveAttribute('data-reveal', 'subtitle')
  })

  it('adds data-reveal="cta" to the cta span when present', () => {
    const { getByText } = renderBlock({ cta: 'Click me' })
    expect(getByText('Click me →')).toHaveAttribute('data-reveal', 'cta')
  })

  it('renders no data-reveal="subtitle" when subtitle is absent', () => {
    const { container } = renderBlock()
    expect(container.querySelector('[data-reveal="subtitle"]')).toBeNull()
  })

  it('renders no data-reveal="cta" when cta is absent', () => {
    const { container } = renderBlock()
    expect(container.querySelector('[data-reveal="cta"]')).toBeNull()
  })

  it('renders tag elements when tags prop is provided', () => {
    const { container } = renderBlock({ tags: ['Civic Tech', 'Privacy', 'PropTech'] })
    const tags = container.querySelectorAll('[data-reveal="tags"] span')
    expect(tags).toHaveLength(3)
    expect(tags[0]).toHaveTextContent('Civic Tech')
    expect(tags[1]).toHaveTextContent('Privacy')
    expect(tags[2]).toHaveTextContent('PropTech')
  })

  it('renders no tags container when tags prop is absent', () => {
    const { container } = renderBlock()
    expect(container.querySelector('[data-reveal="tags"]')).toBeNull()
  })

  it('does not render cta when tags are provided', () => {
    const { container } = renderBlock({ cta: 'View work', tags: ['Civic Tech'] })
    expect(container.querySelector('[data-reveal="cta"]')).toBeNull()
  })

  it('renders the portal slot before the title when provided', () => {
    const { container, getByText } = renderBlock({
      portal: <div data-testid="portal-content">portal here</div>,
      title: 'Hero',
    })
    const portal = container.querySelector('[data-testid="portal-content"]')
    const title = getByText('Hero')
    expect(portal).toBeInTheDocument()
    // Portal precedes title in DOM order
    if (portal && title.parentElement) {
      const children = Array.from(title.parentElement.children)
      expect(children.indexOf(portal)).toBeLessThan(children.indexOf(title))
    }
  })

  it('does not render any portal element when portal prop is absent', () => {
    const { container } = renderBlock()
    expect(container.querySelector('[data-testid="portal-content"]')).toBeNull()
  })
})

describe('Brand block click behavior', () => {
  function renderBrand(theme: string) {
    document.documentElement.dataset.theme = theme
    return render(
      <MemoryRouter>
        <ThemeProvider>
          <MaterialProvider>
            <ChainProvider>
              <Block id="brand" to="/about" title="AAI" />
            </ChainProvider>
          </MaterialProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )
  }

  it('on modern-vibrant, has aria-haspopup="dialog"', () => {
    const { container } = renderBrand('modern-vibrant')
    expect(container.querySelector('[data-block-id="brand"]')).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    )
  })

  it('on classic, has NO aria-haspopup (regular link)', () => {
    const { container } = renderBrand('classic')
    expect(container.querySelector('[data-block-id="brand"]')).not.toHaveAttribute(
      'aria-haspopup',
    )
  })
})

describe('Brand block pulse animation pause', () => {
  // Capture the context so we can drive panelOpen from the test.
  let materialApi: ReturnType<typeof useMaterial> | null = null
  function Capture() {
    materialApi = useMaterial()
    return null
  }

  function renderBrand() {
    document.documentElement.dataset.theme = 'modern-vibrant'
    return render(
      <MemoryRouter>
        <ThemeProvider>
          <MaterialProvider>
            <ChainProvider>
              <Capture />
              <Block id="brand" to="/about" title="AAI" />
            </ChainProvider>
          </MaterialProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )
  }

  it('does not set animation-play-state when panel is closed', () => {
    const { container } = renderBrand()
    const el = container.querySelector('[data-block-id="brand"]') as HTMLElement
    expect(el.style.animationPlayState).toBe('')
  })

  it('sets animation-play-state: paused when panel is open', () => {
    const { container } = renderBrand()
    act(() => {
      materialApi?.openPanel()
    })
    const el = container.querySelector('[data-block-id="brand"]') as HTMLElement
    expect(el.style.animationPlayState).toBe('paused')
  })
})

describe('Block chain integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.documentElement.dataset.theme = 'modern-vibrant'
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('defers navigation until the chain completes for non-Brand blocks', () => {
    const onNavigate = vi.fn()
    render(
      <MemoryRouter>
        <ThemeProvider>
          <MaterialProvider>
            <ChainProvider>
              <Block id="work" to="/work" title="Work" onNavigate={onNavigate} />
            </ChainProvider>
          </MaterialProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )

    const block = document.querySelector('[data-block-id="work"]') as HTMLElement
    act(() => {
      block.click()
    })

    // Click captured by chain — navigation not yet fired
    expect(onNavigate).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    // After the sequence, navigation fires
    expect(onNavigate).toHaveBeenCalledWith('work', '/work')
  })

  it('defers navigation until the chain completes for the Hero block', () => {
    const onNavigate = vi.fn()
    render(
      <MemoryRouter>
        <ThemeProvider>
          <MaterialProvider>
            <ChainProvider>
              <Block id="hero" to="/contact" title="Hero" onNavigate={onNavigate} />
            </ChainProvider>
          </MaterialProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )

    const block = document.querySelector('[data-block-id="hero"]') as HTMLElement
    act(() => {
      block.click()
    })

    // Click captured by chain — navigation not yet fired
    expect(onNavigate).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    // After the hero sequence (2000ms), navigation fires
    expect(onNavigate).toHaveBeenCalledWith('hero', '/contact')
  })

  it('Brand block on modern-vibrant still opens panel (not chain)', () => {
    const onNavigate = vi.fn()
    render(
      <MemoryRouter>
        <ThemeProvider>
          <MaterialProvider>
            <ChainProvider>
              <Block id="brand" to="/about" title="AAI" onNavigate={onNavigate} />
            </ChainProvider>
          </MaterialProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )

    const block = document.querySelector('[data-block-id="brand"]') as HTMLElement
    act(() => {
      block.click()
    })

    // Brand path: panel opens, navigation never fires
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('modifier-click navigates directly (skip chain) for new-tab behavior', () => {
    const onNavigate = vi.fn()
    render(
      <MemoryRouter>
        <ThemeProvider>
          <MaterialProvider>
            <ChainProvider>
              <Block id="services" to="/services" title="Services" onNavigate={onNavigate} />
            </ChainProvider>
          </MaterialProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )

    const block = document.querySelector('[data-block-id="services"]') as HTMLElement
    act(() => {
      block.dispatchEvent(new MouseEvent('click', { metaKey: true, bubbles: true, cancelable: true }))
    })

    // Modifier-click bypasses chain (browser default tab behavior preserved)
    // No timer advance needed — the chain code returns early
    // onNavigate is also not called because the early return is BEFORE both
    // onNavigate and chain start. This matches v1 behavior.
    expect(onNavigate).not.toHaveBeenCalled()
  })
})
