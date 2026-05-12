"use client"

import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1',
    'font-display uppercase tracking-wider',
    'border-2 border-black',
    'rounded-none',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-po-primary text-po-primary-fg',
        secondary: 'bg-po-secondary text-po-secondary-fg',
        accent: 'bg-po-accent text-po-accent-fg',
        success: 'bg-po-success text-po-success-fg',
        warning: 'bg-po-warning text-po-warning-fg',
        danger: 'bg-po-danger text-po-danger-fg',
        neutral: 'bg-po-surface text-po-fg',
      },
      size: {
        sm: 'px-1.5 py-0 text-[8px]',
        md: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-xs',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, ...props },
  ref,
) {
  return <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
})

export { badgeVariants }
Badge.displayName = 'Badge'
