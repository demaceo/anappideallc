import { createContext, useContext } from 'react'

export type ThemeId = 'modern-vibrant' | 'classic' | 'pastel' | 'arcade-neon'

export const THEMES: { id: ThemeId; label: string; swatch: string }[] = [
  {
    id: 'modern-vibrant',
    label: 'Modern Vibrant',
    swatch: 'linear-gradient(135deg,#ff3d7f,#ff9d4a)',
  },
  { id: 'classic', label: 'Classic NES Tetris', swatch: '#00f0f0' },
  { id: 'pastel', label: 'Pastel Pop', swatch: '#ffb5a7' },
  { id: 'arcade-neon', label: 'Dark Arcade Neon', swatch: '#ff00ff' },
]

export const DEFAULT_THEME: ThemeId = 'modern-vibrant'
export const STORAGE_KEY = 'theme'

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (next: ThemeId) => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
})

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
