"use client"

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, type = 'text', 'aria-invalid': ariaInvalid, ...props },
  ref,
) {
  const isInvalid = invalid ?? Boolean(ariaInvalid)
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={isInvalid || undefined}
      className={cn(
        'w-full border-2 px-3 py-2',
        'rounded-none bg-po-bg-elevated text-po-fg placeholder:text-po-fg-muted',
        'font-body text-base',
        'transition-colors',
        'focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isInvalid ? 'border-po-danger' : 'border-po-border focus:border-po-secondary',
        className,
      )}
      {...props}
    />
  )
})
Input.displayName = 'Input'
