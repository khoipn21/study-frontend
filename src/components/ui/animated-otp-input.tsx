import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedOTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
}

export function AnimatedOTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
}: AnimatedOTPInputProps) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return

    // Only allow digits
    const digit = inputValue.replace(/[^0-9]/g, '')
    if (digit.length > 1) return

    const newValue = value.split('')
    newValue[index] = digit
    const updatedValue = newValue.join('')

    onChange(updatedValue)

    // Auto-advance to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
    }

    // Auto-submit when complete
    if (updatedValue.length === length && updatedValue.split('').every((d) => d)) {
      onComplete?.(updatedValue)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      const newValue = value.split('')
      
      if (value[index]) {
        // Clear current digit
        newValue[index] = ''
        onChange(newValue.join(''))
      } else if (index > 0) {
        // Move to previous and clear
        newValue[index - 1] = ''
        onChange(newValue.join(''))
        inputRefs.current[index - 1]?.focus()
        setFocusedIndex(index - 1)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
      setFocusedIndex(index - 1)
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return
    e.preventDefault()

    const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, length)
    onChange(pastedData.padEnd(length, ''))

    // Focus last filled input
    const nextIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
    setFocusedIndex(nextIndex)

    // Auto-submit if complete
    if (pastedData.length === length) {
      onComplete?.(pastedData)
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setFocusedIndex(index)}
          disabled={disabled}
          className={cn(
            'w-12 h-14 text-center text-2xl font-bold',
            'border-2 rounded-lg',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            focusedIndex === index
              ? 'border-[oklch(0.25_0.06_230)] ring-[oklch(0.25_0.06_230)] scale-105'
              : 'border-[oklch(0.86_0.01_85)]',
            value[index]
              ? 'border-[oklch(0.25_0.06_230)] bg-[oklch(0.94_0.01_85)]'
              : 'bg-white',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      ))}
    </div>
  )
}
