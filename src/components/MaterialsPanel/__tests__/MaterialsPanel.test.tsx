import { render, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { MotionConfig } from 'motion/react'
import { MaterialProvider, useMaterial } from '../../../lib/material'
import { MaterialsPanel } from '../MaterialsPanel'
import type { ReactNode } from 'react'

// MotionConfig reducedMotion="always" makes <AnimatePresence> exit
// animations resolve instantly in tests so we can assert removal
// synchronously (happy-dom defaults prefers-reduced-motion: no-preference).
function Wrapper({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="always">
      <MaterialProvider>{children}</MaterialProvider>
    </MotionConfig>
  )
}

// Helper to render the panel with the provider already opened.
function PanelOpener({ children }: { children: ReactNode }) {
  const { openPanel } = useMaterial()
  return (
    <>
      <button onClick={openPanel} data-testid="open-panel">open</button>
      {children}
    </>
  )
}

describe('MaterialsPanel', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-material')
  })

  it('renders nothing when panelOpen is false', () => {
    const { queryByRole } = render(
      <Wrapper>
        <MaterialsPanel />
      </Wrapper>,
    )
    expect(queryByRole('dialog')).toBeNull()
  })

  it('renders a dialog when panelOpen is true', () => {
    const { getByRole, getByTestId } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    expect(getByRole('dialog')).toBeInTheDocument()
  })

  it('dialog has aria-modal and aria-labelledby', () => {
    const { getByRole, getByTestId } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    const dialog = getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby')
  })

  it('renders 7 swatches when open', () => {
    const { getByTestId, getAllByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    // Each swatch is a button with aria-pressed; the close button doesn't
    // have aria-pressed. Filter to swatches by attribute.
    const buttons = getAllByRole('button')
    const swatches = buttons.filter((b) => b.hasAttribute('aria-pressed'))
    expect(swatches).toHaveLength(7)
  })

  it('clicking a swatch updates the active material', () => {
    const { getByTestId, getAllByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    const buttons = getAllByRole('button')
    const steelSwatch = buttons.find(
      (b) => b.getAttribute('aria-label')?.includes('Polished Steel'),
    )
    fireEvent.click(steelSwatch!)
    expect(document.documentElement.dataset.material).toBe('steel')
  })

  it('clicking the close button closes the panel', async () => {
    const { getByTestId, queryByRole, getByLabelText } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    expect(queryByRole('dialog')).toBeInTheDocument()
    fireEvent.click(getByLabelText('Close Materials panel'))
    await waitFor(() => expect(queryByRole('dialog')).toBeNull())
  })

  it('Escape key closes the panel', async () => {
    const { getByTestId, queryByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    expect(queryByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(queryByRole('dialog')).toBeNull())
  })

  // Focus restoration is part of the dialog focus-trap contract (WCAG
  // 2.4.3). When the panel closes, focus must return to the element that
  // opened it — the Brand block. We render a stub element with the
  // `data-block-id="brand"` selector and verify it receives focus.
  it('restores focus to the Brand block when the panel closes', async () => {
    const { getByTestId, queryByRole } = render(
      <Wrapper>
        <PanelOpener>
          <a
            href="#brand"
            data-block-id="brand"
            data-testid="brand-stub"
          >
            brand
          </a>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    const brandStub = getByTestId('brand-stub') as HTMLAnchorElement
    fireEvent.click(getByTestId('open-panel'))
    expect(queryByRole('dialog')).toBeInTheDocument()
    // Some other element holds focus while panel is open.
    ;(document.body as HTMLElement).focus()
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(brandStub))
  })

  it('does NOT steal focus to the Brand block on initial mount', () => {
    const { getByTestId } = render(
      <Wrapper>
        <input data-testid="outside-input" />
        <a href="#brand" data-block-id="brand" data-testid="brand-stub">brand</a>
        <MaterialsPanel />
      </Wrapper>,
    )
    const input = getByTestId('outside-input') as HTMLInputElement
    input.focus()
    expect(document.activeElement).toBe(input)
  })

  // ─── Roving tabindex (WAI-ARIA toolbar / radio-group pattern) ─────────
  // Only one swatch is in the tab sequence at a time; ArrowLeft/Right/
  // Up/Down (and Home/End) shift focus among them while Tab moves out of
  // the group. Focus and selection are decoupled — arrow keys move focus
  // only; Enter/Space activates.

  function getSwatchButtons(getAllByRole: (role: string) => HTMLElement[]) {
    return getAllByRole('button').filter((b) =>
      b.hasAttribute('aria-pressed'),
    ) as HTMLButtonElement[]
  }

  it('exactly one swatch has tabIndex=0 when the panel opens', async () => {
    const { getByTestId, getAllByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    await waitFor(() => {
      const swatches = getSwatchButtons(getAllByRole)
      const tabbable = swatches.filter((b) => b.tabIndex === 0)
      expect(tabbable).toHaveLength(1)
    })
  })

  it('initial focused swatch matches the current material (default = anodized, index 0)', async () => {
    const { getByTestId, getAllByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    await waitFor(() => {
      const swatches = getSwatchButtons(getAllByRole)
      // anodized is index 0 in MATERIAL_PRESETS.
      expect(swatches[0].tabIndex).toBe(0)
      expect(swatches.slice(1).every((b) => b.tabIndex === -1)).toBe(true)
    })
  })

  it('ArrowRight moves the roving tabIndex to the next swatch', async () => {
    const { getByTestId, getAllByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    let swatches: HTMLButtonElement[] = []
    await waitFor(() => {
      swatches = getSwatchButtons(getAllByRole)
      expect(swatches[0].tabIndex).toBe(0)
    })
    fireEvent.keyDown(swatches[0], { key: 'ArrowRight' })
    await waitFor(() => {
      const next = getSwatchButtons(getAllByRole)
      expect(next[0].tabIndex).toBe(-1)
      expect(next[1].tabIndex).toBe(0)
    })
  })

  it('ArrowLeft from the first swatch wraps to the last', async () => {
    const { getByTestId, getAllByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    let swatches: HTMLButtonElement[] = []
    await waitFor(() => {
      swatches = getSwatchButtons(getAllByRole)
      expect(swatches[0].tabIndex).toBe(0)
    })
    fireEvent.keyDown(swatches[0], { key: 'ArrowLeft' })
    await waitFor(() => {
      const next = getSwatchButtons(getAllByRole)
      expect(next[next.length - 1].tabIndex).toBe(0)
    })
  })

  it('Home and End jump to the first / last swatch', async () => {
    const { getByTestId, getAllByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    let swatches: HTMLButtonElement[] = []
    await waitFor(() => {
      swatches = getSwatchButtons(getAllByRole)
      expect(swatches[0].tabIndex).toBe(0)
    })
    fireEvent.keyDown(swatches[0], { key: 'End' })
    await waitFor(() => {
      const next = getSwatchButtons(getAllByRole)
      expect(next[next.length - 1].tabIndex).toBe(0)
    })
    fireEvent.keyDown(swatches[swatches.length - 1], { key: 'Home' })
    await waitFor(() => {
      const next = getSwatchButtons(getAllByRole)
      expect(next[0].tabIndex).toBe(0)
    })
  })

  it('ArrowUp / ArrowDown also move focus (grid-layout fallback)', async () => {
    const { getByTestId, getAllByRole } = render(
      <Wrapper>
        <PanelOpener>
          <MaterialsPanel />
        </PanelOpener>
      </Wrapper>,
    )
    fireEvent.click(getByTestId('open-panel'))
    let swatches: HTMLButtonElement[] = []
    await waitFor(() => {
      swatches = getSwatchButtons(getAllByRole)
      expect(swatches[0].tabIndex).toBe(0)
    })
    fireEvent.keyDown(swatches[0], { key: 'ArrowDown' })
    await waitFor(() => {
      const next = getSwatchButtons(getAllByRole)
      expect(next[1].tabIndex).toBe(0)
    })
  })
})
