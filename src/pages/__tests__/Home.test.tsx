import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { ThemeProvider } from '../../lib/theme'
import Home from '../Home'

// happy-dom does not implement WAAPI or matchMedia; stub both so TetrisGrid renders.
let originalMatchMedia: typeof window.matchMedia

beforeAll(() => {
  originalMatchMedia = window.matchMedia
  HTMLElement.prototype.animate = () =>
    ({ finished: Promise.resolve(), playState: 'finished', cancel: () => {} }) as unknown as Animation
  vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue(
    { finished: Promise.resolve(), playState: 'finished', cancel: vi.fn() } as unknown as Animation,
  )
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

afterAll(() => {
  vi.restoreAllMocks()
  window.matchMedia = originalMatchMedia
})

function renderHome() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('Home page', () => {
  it('wraps the grid content in a VelvetStage', () => {
    const { container } = renderHome()
    expect(container.querySelector('[data-env="velvet"]')).toBeInTheDocument()
  })

  it('renders the TetrisGrid inside the VelvetStage', () => {
    const { container } = renderHome()
    const stage = container.querySelector('[data-env="velvet"]')
    expect(stage?.querySelector('[data-block-id="hero"]')).toBeInTheDocument()
  })
})
