"use client"

import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

const alertVariants = cva(
  [
    'relative w-full border-2 border-black p-4',
    'po-bevel rounded-none',
    'font-body text-base',
    '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+*]:pl-7',
  ],
  {
    variants: {
      variant: {
        info: 'bg-po-secondary text-po-secondary-fg',
        success: 'bg-po-success text-po-success-fg',
        warning: 'bg-po-warning text-po-warning-fg',
        danger: 'bg-po-danger text-po-danger-fg',
      },
    },
    defaultVariants: { variant: 'info' },
  },
)

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, variant, role = 'alert', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role={role}
      aria-live={variant === 'danger' || variant === 'warning' ? 'assertive' : 'polite'}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
})

export const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function AlertTitle({ className, children, ...props }, ref) {
    return (
      <h5
        ref={ref}
        className={cn('mb-1 font-display text-xs uppercase tracking-wider', className)}
        {...props}
      >
        {children}
      </h5>
    )
  },
)

export const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function AlertDescription({ className, ...props }, ref) {
    return <div ref={ref} className={cn('font-body text-base leading-snug', className)} {...props} />
  },
)
Alert.displayName = 'Alert'
AlertTitle.displayName = 'AlertTitle'
AlertDescription.displayName = 'AlertDescription'
