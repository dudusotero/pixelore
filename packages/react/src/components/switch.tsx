"use client"

import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../utils/cn'

const switchVariants = cva(
  [
    'group relative inline-flex shrink-0 cursor-pointer items-center',
    'border-2 bg-po-bg-elevated',
    'rounded-none transition-colors duration-100',
    'data-[state=checked]:bg-po-success',
    'focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'motion-reduce:transition-none',
  ],
  {
    variants: {
      size: {
        sm: 'h-6 w-10',
        md: 'h-7 w-12',
        lg: 'h-8 w-14',
      },
      invalid: {
        true: 'border-po-danger',
        false: 'border-black',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  },
)

const thumbVariants = cva(
  [
    'pointer-events-none block bg-po-fg',
    'border-2 border-black',
    'transition-transform duration-100',
    'motion-reduce:transition-none',
  ],
  {
    variants: {
      size: {
        // Slide math: translate-x = (w-track − w-thumb)rem − 8px (= borders + 4px padding each side).
        sm: 'h-4 w-4 translate-x-[4px] data-[state=checked]:translate-x-[calc(1.5rem-8px)]',
        md: 'h-5 w-5 translate-x-[4px] data-[state=checked]:translate-x-[calc(1.75rem-8px)]',
        lg: 'h-6 w-6 translate-x-[4px] data-[state=checked]:translate-x-[calc(2rem-8px)]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'size'>,
    VariantProps<typeof switchVariants> {
  /** Marks the switch as invalid (red border + aria-invalid). */
  invalid?: boolean
}

export const Switch = forwardRef<ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  function Switch(
    { className, size, invalid, 'aria-invalid': ariaInvalid, ...props },
    ref,
  ) {
    const isInvalid = invalid ?? Boolean(ariaInvalid)
    return (
      <SwitchPrimitive.Root
        ref={ref}
        aria-invalid={isInvalid || undefined}
        className={cn(switchVariants({ size, invalid: isInvalid }), className)}
        {...props}
      >
        <SwitchPrimitive.Thumb className={cn(thumbVariants({ size }))} />
      </SwitchPrimitive.Root>
    )
  },
)

Switch.displayName = 'Switch'
