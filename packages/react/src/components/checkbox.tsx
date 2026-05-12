"use client"

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'motion/react'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { cn } from '../utils/cn'

const checkboxVariants = cva(
  [
    'peer shrink-0 border-2 bg-po-bg-elevated',
    'rounded-none transition-colors',
    'data-[state=checked]:bg-po-primary data-[state=checked]:text-po-primary-fg',
    'data-[state=indeterminate]:bg-po-accent data-[state=indeterminate]:text-po-accent-fg',
    'focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-5',
        md: 'h-6 w-6',
        lg: 'h-7 w-7',
      },
      invalid: {
        true: 'border-po-danger',
        false: 'border-black',
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
    },
  },
)

const checkSizes = {
  sm: 12,
  md: 14,
  lg: 18,
} as const

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  /** Marks the checkbox as invalid (red border + aria-invalid). */
  invalid?: boolean
}

export const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  function Checkbox({ className, size, invalid, 'aria-invalid': ariaInvalid, ...props }, ref) {
    const reduced = useReducedMotion()
    const isInvalid = invalid ?? Boolean(ariaInvalid)
    const checkPx = checkSizes[size ?? 'md']
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        aria-invalid={isInvalid || undefined}
        className={cn(checkboxVariants({ size, invalid: isInvalid }), className)}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex h-full w-full items-center justify-center">
          <motion.svg
            initial={reduced ? { opacity: 0 } : { scale: 0 }}
            animate={reduced ? { opacity: 1 } : { scale: 1 }}
            transition={{ duration: reduced ? 0.05 : 0.12, ease: [0.32, 0.72, 0, 1] }}
            width={checkPx}
            height={checkPx}
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Pixel-art check mark, drawn with discrete rects */}
            <rect x="2" y="6" width="2" height="2" fill="currentColor" />
            <rect x="4" y="8" width="2" height="2" fill="currentColor" />
            <rect x="6" y="10" width="2" height="2" fill="currentColor" />
            <rect x="8" y="8" width="2" height="2" fill="currentColor" />
            <rect x="10" y="6" width="2" height="2" fill="currentColor" />
            <rect x="12" y="4" width="2" height="2" fill="currentColor" />
          </motion.svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )
  },
)

Checkbox.displayName = 'Checkbox'
