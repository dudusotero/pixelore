import * as TabsPrimitive from '@radix-ui/react-tabs'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../utils/cn'

export const Tabs = TabsPrimitive.Root

export const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(function TabsList({ className, ...props }, ref) {
  // Dividers are rendered as 2px gaps with the parent's black background
  // showing through. This avoids the sub-pixel rendering artifact we used
  // to get with per-trigger `border-r-2`, where inline-flex could assign a
  // child a fractional width and the right-border would paint blurry.
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex items-stretch gap-[2px] border-2 border-black bg-black p-0',
        'rounded-none',
        className,
      )}
      {...props}
    />
  )
})

export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap',
        'bg-po-bg-elevated px-4 py-2 font-display text-[10px] uppercase tracking-wider',
        'text-po-fg-muted transition-colors',
        'hover:bg-po-surface hover:text-po-fg',
        'data-[state=active]:bg-po-primary data-[state=active]:text-po-primary-fg',
        'focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:-outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'rounded-none',
        className,
      )}
      {...props}
    />
  )
})

export const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-4 font-body text-base',
        'focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2',
        className,
      )}
      {...props}
    />
  )
})

TabsList.displayName = 'TabsList'
TabsTrigger.displayName = 'TabsTrigger'
TabsContent.displayName = 'TabsContent'
