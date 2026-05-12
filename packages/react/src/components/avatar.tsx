"use client"

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../utils/cn'

export const Avatar = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(function Avatar({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 overflow-hidden',
        'border-2 border-black bg-po-bg-elevated',
        'rounded-none',
        className,
      )}
      {...props}
    />
  )
})

export const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(function AvatarImage({ className, style, ...props }, ref) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn('h-full w-full object-cover', className)}
      {...props}
      // image-rendering: pixelated is the default, but consumers can override
      // by passing their own `style` prop (their value wins via spread order).
      style={{ imageRendering: 'pixelated', ...style }}
    />
  )
})

export const AvatarFallback = forwardRef<
  ElementRef<typeof AvatarPrimitive.Fallback>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(function AvatarFallback({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center',
        'font-display text-xs uppercase text-po-fg',
        className,
      )}
      {...props}
    />
  )
})
Avatar.displayName = 'Avatar'
AvatarImage.displayName = 'AvatarImage'
AvatarFallback.displayName = 'AvatarFallback'
