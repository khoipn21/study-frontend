import { Check, User } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

interface User {
  id: string
  username: string
  role?: string
}

interface MentionDropdownProps {
  users: Array<User>
  selectedIndex: number
  onSelect: (user: User) => void
  onKeyDown: (event: KeyboardEvent) => boolean
  position: { x: number; y: number } | null
  isOpen: boolean
}

export function MentionDropdown({
  users,
  selectedIndex,
  onSelect,
  onKeyDown,
  position,
  isOpen,
}: MentionDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && onKeyDown(event)) {
        event.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onKeyDown])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // This will be handled by the parent component
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isOpen || !position || users.length === 0) {
    return null
  }

  return (
    <div
      ref={dropdownRef}
      className="fixed z-50 bg-popover border border-border rounded-md shadow-lg p-1 min-w-[200px] max-h-60 overflow-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {users.map((user, index) => (
        <div
          key={user.id}
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md transition-colors',
            index === selectedIndex
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-accent/50',
          )}
          onClick={() => onSelect(user)}
        >
          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">@{user.username}</div>
            <div className="text-xs text-muted-foreground capitalize truncate">
              {user.role || 'student'}
            </div>
          </div>
          {index === selectedIndex && (
            <Check className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      ))}

      {users.length === 0 && (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          No users found
        </div>
      )}
    </div>
  )
}
