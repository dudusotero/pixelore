"use client"

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../utils/cn'

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent({ className, sideOffset = 6, ...props }, ref) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-50 max-w-xs select-none border-2 border-black bg-po-fg px-3 py-1.5',
          'font-display text-[10px] uppercase tracking-wider text-po-bg',
          'rounded-none shadow-[var(--po-shadow-pixel-sm)]',
          // Animations: tiny scale-in. CSS-based animation honours
          // prefers-reduced-motion through the base @layer rule.
          'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0',
          'data-[state=delayed-open]:zoom-in-95 data-[state=closed]:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1',
          'data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
          'motion-reduce:data-[state=delayed-open]:animate-none motion-reduce:data-[state=closed]:animate-none',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
})

TooltipContent.displayName = 'TooltipContent'
