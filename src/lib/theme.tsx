import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type ThemeId = 'modern-vibrant' | 'classic' | 'pastel' | 'arcade-neon'

export const THEMES: { id: ThemeId; label: string; swatch: string }[] = [
  { id: 'modern-vibrant', label: 'Modern Vibrant', swatch: 'linear-gradient(135deg,#ff3d7f,#ff9d4a)' },
  { id: 'classic', label: 'Classic NES Tetris', swatch: '#00f0f0' },
  { id: 'pastel', label: 'Pastel Pop', swatch: '#ffb5a7' },
  { id: 'arcade-neon', label: 'Dark Arcade Neon', swatch: '#ff00ff' },
]

const DEFAULT_THEME: ThemeId = 'modern-vibrant'
const STORAGE_KEY = 'theme'

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (next: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
})

function readInitialTheme(): ThemeId {
  if (typeof document === 'undefined') return DEFAULT_THEME
  const fromAttr = document.documentElement.dataset.theme as ThemeId | undefined
  if (fromAttr && THEMES.some((t) => t.id === fromAttr)) return fromAttr
  return DEFAULT_THEME
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(readInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const setTheme = (next: ThemeId) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage unavailable (private mode, etc.) — silently ignore.
    }
    setThemeState(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
