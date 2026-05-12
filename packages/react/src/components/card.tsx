"use client"

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, interactive = false, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'po-bevel bg-po-surface text-po-fg border-2 border-black p-4',
        'rounded-none transition-transform duration-100',
        interactive && [
          'cursor-pointer',
          'focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2',
          // Subtle hover lift + Button-style press-down.
          'hover:-translate-x-px hover:-translate-y-px',
          'active:translate-x-[2px] active:translate-y-[2px]',
          // Under reduced motion, swap translates for an opacity tint.
          'motion-reduce:transition-none',
          'motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0',
          'motion-reduce:hover:brightness-110',
          'motion-reduce:active:translate-x-0 motion-reduce:active:translate-y-0',
          'motion-reduce:active:brightness-95',
        ],
        className,
      )}
      {...(interactive && {
        tabIndex: 0,
        role: 'group',
      })}
      {...props}
    />
  )
})

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn('mb-3 flex flex-col gap-1', className)} {...props} />
  },
)

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, children, ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={cn('font-display text-sm uppercase tracking-wide text-po-fg', className)}
        {...props}
      >
        {children}
      </h3>
    )
  },
)

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p ref={ref} className={cn('font-body text-base text-po-fg-muted', className)} {...props} />
  )
})

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn('font-body text-base', className)} {...props} />
  },
)

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn('mt-4 flex items-center gap-2', className)} {...props} />
    )
  },
)
Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardTitle.displayName = 'CardTitle'
CardDescription.displayName = 'CardDescription'
CardContent.displayName = 'CardContent'
CardFooter.displayName = 'CardFooter'
