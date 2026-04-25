import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { Block } from '../Block'
import type { BlockProps } from '../Block'

function renderBlock(props: Partial<BlockProps> = {}) {
  return render(
    <MemoryRouter>
      <Block id="hero" to="/" title="Test Title" {...props} />
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
})
