"use client"

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type HTMLAttributes } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { cn } from '../utils/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogPortal = DialogPrimitive.Portal

export const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/70',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        'motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none',
        className,
      )}
      {...props}
    />
  )
})

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean
}

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent({ className, children, showCloseButton = true, ...props }, ref) {
  const reduced = useReducedMotion()
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        asChild
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
          // Cap height to the viewport; inner body scrolls.
          'flex max-h-[calc(100vh-2rem)] flex-col',
          'border-2 border-black bg-po-surface text-po-fg',
          'rounded-none shadow-[var(--po-shadow-pixel-lg)]',
          className,
        )}
        {...props}
      >
        <motion.div
          // No layout classes here — they collide with the parent's fixed
          // positioning when Radix forwards via asChild.
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: reduced ? 0.05 : 0.14, ease: [0.32, 0.72, 0, 1] }}
        >
          {showCloseButton && (
            <DialogPrimitive.Close
              className="absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center border-2 border-black bg-po-danger text-po-danger-fg font-display text-xs hover:brightness-110 focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2"
              aria-label="Close"
            >
              <span aria-hidden="true">X</span>
            </DialogPrimitive.Close>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})

// Wrap content in an AnimatePresence-aware shell when needed
export function DialogAnimatePresence({ children }: { children: React.ReactNode }) {
  return <AnimatePresence>{children}</AnimatePresence>
}

export const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('mb-4 flex flex-col gap-1', className)}
        {...props}
      />
    )
  },
)

export const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
        {...props}
      />
    )
  },
)

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        'font-display text-sm uppercase tracking-wider text-po-fg',
        className,
      )}
      {...props}
    />
  )
})

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('font-body text-base text-po-fg-muted', className)}
      {...props}
    />
  )
})

DialogOverlay.displayName = 'DialogOverlay'
DialogContent.displayName = 'DialogContent'
DialogTitle.displayName = 'DialogTitle'
DialogDescription.displayName = 'DialogDescription'
DialogHeader.displayName = 'DialogHeader'
DialogFooter.displayName = 'DialogFooter'
