import { describe, it, expect } from 'vitest'
import { MATERIAL_PRESETS } from '../materialPresets'

describe('MATERIAL_PRESETS', () => {
  it('contains exactly 7 presets', () => {
    expect(MATERIAL_PRESETS).toHaveLength(7)
  })

  it('first preset is "anodized" (the default)', () => {
    expect(MATERIAL_PRESETS[0].id).toBe('anodized')
    expect(MATERIAL_PRESETS[0].label).toBe('Anodized')
    expect(MATERIAL_PRESETS[0].sublabel).toBe('Default')
  })

  it('last preset is "showcase"', () => {
    expect(MATERIAL_PRESETS[MATERIAL_PRESETS.length - 1].id).toBe('showcase')
  })

  it('every preset has unique id, non-empty label, non-empty sublabel', () => {
    const ids = new Set<string>()
    for (const p of MATERIAL_PRESETS) {
      expect(p.id).toBeTruthy()
      expect(p.label).toBeTruthy()
      expect(p.sublabel).toBeTruthy()
      expect(ids.has(p.id)).toBe(false)
      ids.add(p.id)
    }
    expect(ids.size).toBe(7)
  })
})
