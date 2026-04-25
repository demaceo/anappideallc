import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  DEFAULT_THEME,
  STORAGE_KEY,
  ThemeContext,
  THEMES,
} from './theme-context'
import type { ThemeId } from './theme-context'

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
