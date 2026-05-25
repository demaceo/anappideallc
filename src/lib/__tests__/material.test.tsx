/// <reference types="node" />
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { MaterialProvider, useMaterial } from '../material'
import type { ReactNode } from 'react'

const wrapper = ({ children }: { children: ReactNode }) => (
  <MaterialProvider>{children}</MaterialProvider>
)

describe('useMaterial', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-material')
  })

  it('defaults to "anodized"', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    expect(result.current.material).toBe('anodized')
  })

  it('reads initial value from localStorage', () => {
    localStorage.setItem('material', 'steel')
    const { result } = renderHook(() => useMaterial(), { wrapper })
    expect(result.current.material).toBe('steel')
  })

  it('prefers <html data-material> over localStorage (bootstrap-set value wins)', () => {
    // The bootstrap script in index.html writes the validated value to
    // <html data-material> before React mounts. readInitial should honor
    // that attribute and skip the localStorage round-trip.
    document.documentElement.dataset.material = 'gold'
    localStorage.setItem('material', 'steel')
    const { result } = renderHook(() => useMaterial(), { wrapper })
    expect(result.current.material).toBe('gold')
  })

  it('falls back to localStorage when data-material is missing', () => {
    // Already covered above; explicit to document the fallback path.
    localStorage.setItem('material', 'frosted')
    const { result } = renderHook(() => useMaterial(), { wrapper })
    expect(result.current.material).toBe('frosted')
  })

  it('persists changes to localStorage', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    act(() => result.current.setMaterial('gold'))
    expect(localStorage.getItem('material')).toBe('gold')
  })

  it('mirrors active material onto <html data-material>', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    act(() => result.current.setMaterial('frosted'))
    expect(document.documentElement.dataset.material).toBe('frosted')
  })

  it('panel is closed by default', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    expect(result.current.panelOpen).toBe(false)
  })

  it('openPanel() opens the panel', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    act(() => result.current.openPanel())
    expect(result.current.panelOpen).toBe(true)
  })

  it('closePanel() closes the panel', () => {
    const { result } = renderHook(() => useMaterial(), { wrapper })
    act(() => result.current.openPanel())
    act(() => result.current.closePanel())
    expect(result.current.panelOpen).toBe(false)
  })

  it('ignores unknown values from localStorage and falls back to default', () => {
    localStorage.setItem('material', 'bogus-value')
    const { result } = renderHook(() => useMaterial(), { wrapper })
    expect(result.current.material).toBe('anodized')
  })
})
