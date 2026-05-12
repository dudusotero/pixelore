"use client"

import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, 'aria-invalid': ariaInvalid, ...props },
  ref,
) {
  const isInvalid = invalid ?? Boolean(ariaInvalid)
  return (
    <textarea
      ref={ref}
      aria-invalid={isInvalid || undefined}
      className={cn(
        'w-full border-2 px-3 py-2',
        'rounded-none bg-po-bg-elevated text-po-fg placeholder:text-po-fg-muted',
        'font-body text-base resize-y min-h-[6rem]',
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
Textarea.displayName = 'Textarea'
