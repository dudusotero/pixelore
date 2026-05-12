"use client"

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'motion/react'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { cn } from '../utils/cn'

export const RadioGroup = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(function RadioGroup({ className, ...props }, ref) {
  return (
    <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-2', className)} {...props} />
  )
})

const radioItemVariants = cva(
  [
    'aspect-square shrink-0 border-2 bg-po-bg-elevated',
    'rounded-none',
    'focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-po-primary',
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
    defaultVariants: { size: 'md', invalid: false },
  },
)

const dotSizes = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
} as const

export interface RadioGroupItemProps
  extends Omit<ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'size'>,
    VariantProps<typeof radioItemVariants> {
  /** Marks the radio as invalid (red border + aria-invalid). */
  invalid?: boolean
}

export const RadioGroupItem = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(function RadioGroupItem(
  { className, size, invalid, 'aria-invalid': ariaInvalid, ...props },
  ref,
) {
  const reduced = useReducedMotion()
  const isInvalid = invalid ?? Boolean(ariaInvalid)
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      aria-invalid={isInvalid || undefined}
      className={cn(radioItemVariants({ size, invalid: isInvalid }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex h-full w-full items-center justify-center">
        <motion.span
          initial={reduced ? { opacity: 0 } : { scale: 0 }}
          animate={reduced ? { opacity: 1 } : { scale: 1 }}
          transition={{ duration: reduced ? 0.05 : 0.1 }}
          className={cn('block bg-po-primary-fg', dotSizes[size ?? 'md'])}
          aria-hidden="true"
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})

RadioGroup.displayName = 'RadioGroup'
RadioGroupItem.displayName = 'RadioGroupItem'
