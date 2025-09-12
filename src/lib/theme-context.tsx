import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
type ThemeStyle = 'academic' | 'corporate'

interface ThemeContextType {
  theme: Theme
  themeStyle: ThemeStyle
  setTheme: (theme: Theme) => void
  setThemeStyle: (style: ThemeStyle) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [themeStyle, setThemeStyleState] = useState<ThemeStyle>('academic')

  useEffect(() => {
    const savedTheme = localStorage.getItem('study-theme') as Theme
    const savedStyle = localStorage.getItem('study-theme-style') as ThemeStyle
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      setThemeState(savedTheme)
    } else if (prefersDark) {
      setThemeState('dark')
    }

    if (savedStyle) {
      setThemeStyleState(savedStyle)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'academic', 'corporate')
    
    // Add current theme classes
    root.classList.add(theme, themeStyle)
    
    // Save to localStorage
    localStorage.setItem('study-theme', theme)
    localStorage.setItem('study-theme-style', themeStyle)
  }, [theme, themeStyle])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const setThemeStyle = (newStyle: ThemeStyle) => {
    setThemeStyleState(newStyle)
  }

  const toggleTheme = () => {
    setThemeState(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeStyle,
        setTheme,
        setThemeStyle,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}