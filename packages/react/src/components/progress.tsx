"use client"

import * as ProgressPrimitive from '@radix-ui/react-progress'
import { motion } from 'motion/react'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { cn } from '../utils/cn'

export interface ProgressProps
  extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /**
   * When true, the bar animates with a "stepped" easing for that retro
   * loading-bar feel. Always disabled under `prefers-reduced-motion`.
   * @default true
   */
  stepped?: boolean
}

export const Progress = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(function Progress({ className, value = 0, max = 100, stepped = true, ...props }, ref) {
  const reduced = useReducedMotion()
  const pct = Math.max(0, Math.min(100, ((value ?? 0) / (max ?? 100)) * 100))

  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={value}
      max={max}
      className={cn(
        'relative h-5 w-full overflow-hidden',
        'border-2 border-black bg-po-bg-elevated',
        'rounded-none',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator asChild>
        <motion.div
          className="h-full bg-po-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{
            duration: reduced ? 0.05 : 0.4,
            ease: reduced ? 'linear' : stepped ? [0.85, 0, 0.15, 1] : [0.32, 0.72, 0, 1],
          }}
          style={{
            backgroundImage: stepped
              ? 'repeating-linear-gradient(90deg, transparent 0, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 8px)'
              : undefined,
          }}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
})

Progress.displayName = 'Progress'
