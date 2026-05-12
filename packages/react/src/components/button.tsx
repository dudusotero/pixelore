"use client"

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'motion/react'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { cn } from '../utils/cn'
import type { WithoutMotionConflicts } from '../utils/motion-types'

const buttonVariants = cva(
  [
    'po-bevel inline-flex items-center justify-center gap-2',
    'font-display tracking-wider uppercase',
    'border-2 border-black select-none',
    'transition-colors',
    'focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'rounded-none',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-po-primary text-po-primary-fg hover:bg-po-primary-strong active:bg-po-primary-strong',
        secondary:
          'bg-po-secondary text-po-secondary-fg hover:bg-po-secondary-strong active:bg-po-secondary-strong',
        accent: 'bg-po-accent text-po-accent-fg hover:brightness-95',
        success: 'bg-po-success text-po-success-fg hover:brightness-95',
        danger: 'bg-po-danger text-po-danger-fg hover:brightness-95',
        ghost:
          'bg-transparent text-po-fg border-po-border hover:bg-po-bg-elevated shadow-none [&]:shadow-none',
        outline: 'bg-po-bg text-po-fg border-po-fg hover:bg-po-bg-elevated',
      },
      size: {
        sm: 'text-[10px] px-3 py-2 gap-1.5',
        md: 'text-xs px-4 py-3',
        lg: 'text-sm px-6 py-4',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      block: false,
    },
  },
)

export interface ButtonProps
  extends WithoutMotionConflicts<ButtonHTMLAttributes<HTMLButtonElement>>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    asChild = false,
    className,
    variant,
    size,
    block,
    loading = false,
    leadingIcon,
    trailingIcon,
    disabled,
    children,
    ...props
  },
  ref,
) {
  const reduced = useReducedMotion()
  const classes = cn(buttonVariants({ variant, size, block }), className)
  const isDisabled = disabled || loading

  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={classes}
        aria-busy={loading || undefined}
        data-disabled={isDisabled || undefined}
        {...props}
      >
        {children}
      </Slot>
    )
  }

  const animationProps = reduced
    ? {
        whileHover: { opacity: 0.92 },
        whileTap: { opacity: 0.85 },
        transition: { duration: 0.08 },
      }
    : {
        whileHover: { x: -1, y: -1 },
        whileTap: { x: 2, y: 2 },
        transition: { duration: 0.08, ease: [0.32, 0.72, 0, 1] as const },
      }

  return (
    <motion.button
      ref={ref}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...animationProps}
      {...props}
    >
      {loading ? <LoadingPixel /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </motion.button>
  )
})

function LoadingPixel() {
  const reduced = useReducedMotion()
  return (
    <span
      role="status"
      aria-label="Loading"
      className="inline-flex h-3 w-3 items-center justify-center"
    >
      <motion.span
        className="block h-3 w-3 bg-current"
        animate={reduced ? { opacity: [1, 0.4, 1] } : { rotate: [0, 90, 180, 270, 360] }}
        transition={{
          duration: reduced ? 1 : 0.8,
          repeat: Infinity,
          ease: 'linear',
        }}
        aria-hidden="true"
      />
    </span>
  )
}

export { buttonVariants }

Button.displayName = 'Button'
