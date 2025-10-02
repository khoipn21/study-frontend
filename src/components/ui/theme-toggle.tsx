import { Building2, GraduationCap, Moon, Palette, Sun } from 'lucide-react'

import { useTheme } from '@/lib/theme-context'

import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'

export function ThemeToggle() {
  const { theme, themeStyle, setTheme, setThemeStyle } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex justify-between"
        >
          <span className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Light
          </span>
          {theme === 'light' && (
            <div className="h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="flex justify-between"
        >
          <span className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Dark
          </span>
          {theme === 'dark' && (
            <div className="h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Style</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setThemeStyle('academic')}
          className="flex justify-between"
        >
          <span className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Academic
          </span>
          {themeStyle === 'academic' && (
            <div className="h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setThemeStyle('corporate')}
          className="flex justify-between"
        >
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Corporate
          </span>
          {themeStyle === 'corporate' && (
            <div className="h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
