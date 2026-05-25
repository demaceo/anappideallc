import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Swatch } from '../Swatch'

describe('Swatch', () => {
  const baseProps = {
    id: 'steel' as const,
    label: 'Polished Steel',
    sublabel: 'Mirror',
    active: false,
    onSelect: vi.fn(),
  }

  it('renders label + sublabel', () => {
    const { getByText } = render(<Swatch {...baseProps} />)
    expect(getByText('Polished Steel')).toBeInTheDocument()
    expect(getByText('Mirror')).toBeInTheDocument()
  })

  it('is a <button> for keyboard and a11y', () => {
    const { container } = render(<Swatch {...baseProps} />)
    expect(container.querySelector('button')).toBeInTheDocument()
  })

  it('has aria-pressed reflecting active state', () => {
    const { container, rerender } = render(<Swatch {...baseProps} active={false} />)
    expect(container.querySelector('button')).toHaveAttribute('aria-pressed', 'false')

    rerender(<Swatch {...baseProps} active={true} />)
    expect(container.querySelector('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('preview carries data-material-preview matching the preset id', () => {
    const { container } = render(<Swatch {...baseProps} id="gold" />)
    const preview = container.querySelector('[data-material-preview]')
    expect(preview?.getAttribute('data-material-preview')).toBe('gold')
  })

  it('clicking the swatch invokes onSelect with the id', () => {
    const onSelect = vi.fn()
    const { container } = render(<Swatch {...baseProps} onSelect={onSelect} />)
    fireEvent.click(container.querySelector('button')!)
    expect(onSelect).toHaveBeenCalledWith('steel')
  })

  it('forwards tabIndex prop to the underlying <button>', () => {
    const { container, rerender } = render(<Swatch {...baseProps} tabIndex={0} />)
    expect(container.querySelector('button')).toHaveAttribute('tabindex', '0')

    rerender(<Swatch {...baseProps} tabIndex={-1} />)
    expect(container.querySelector('button')).toHaveAttribute('tabindex', '-1')
  })
})
