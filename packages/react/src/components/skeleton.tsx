"use client"

import { motion } from 'motion/react'
import { forwardRef, type HTMLAttributes } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { cn } from '../utils/cn'
import type { WithoutMotionConflicts } from '../utils/motion-types'

export type SkeletonProps = WithoutMotionConflicts<HTMLAttributes<HTMLDivElement>>

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ className, ...props }, ref) {
    const reduced = useReducedMotion()
    return (
      <motion.div
        ref={ref}
        role="status"
        aria-busy="true"
        aria-live="polite"
        animate={
          reduced
            ? { opacity: 0.6 }
            : {
                opacity: [0.6, 1, 0.6],
              }
        }
        transition={{
          duration: reduced ? 0 : 1.2,
          repeat: reduced ? 0 : Infinity,
          ease: 'linear',
        }}
        className={cn(
          'block h-4 w-full bg-po-surface',
          'border-2 border-po-border',
          'rounded-none',
          className,
        )}
        {...props}
      />
    )
  },
)

Skeleton.displayName = 'Skeleton'
