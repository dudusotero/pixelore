"use client"

import { motion } from 'motion/react'
import { forwardRef, type HTMLAttributes } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { cn } from '../utils/cn'
import type { WithoutMotionConflicts } from '../utils/motion-types'

/** Named theme colour or any valid CSS colour value. */
type HeartColor =
  | 'danger'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'accent'
  | 'warning'
  | string

const NAMED_COLOR_VAR: Record<string, string> = {
  danger: 'var(--po-color-danger)',
  primary: 'var(--po-color-primary)',
  secondary: 'var(--po-color-secondary)',
  success: 'var(--po-color-success)',
  accent: 'var(--po-color-accent)',
  warning: 'var(--po-color-warning)',
}

function resolveHeartColor(color: HeartColor) {
  return NAMED_COLOR_VAR[color] ?? color
}

export interface HeartBarProps
  extends WithoutMotionConflicts<Omit<HTMLAttributes<HTMLDivElement>, 'role'>> {
  /** Current health value (0..max). */
  value: number
  /** Maximum value, e.g. number of hearts displayed. @default 3 */
  max?: number
  /** A label announced to assistive tech. @default "Hearts" */
  label?: string
  /**
   * Fill colour for active hearts. Accepts a theme token name (`'danger'`,
   * `'primary'`, `'success'`, ...) or any valid CSS colour value.
   * @default 'danger'
   */
  color?: HeartColor
  /** Size of each heart cell. @default 'md' */
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASS: Record<NonNullable<HeartBarProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

/**
 * A signature 8-bit HP/lives indicator — renders `max` heart slots and fills
 * `value` of them. Accessible: exposes a `progressbar` role and aria values so
 * screen readers announce the current health without the user having to count
 * pixels.
 */
export const HeartBar = forwardRef<HTMLDivElement, HeartBarProps>(function HeartBar(
  {
    value,
    max = 3,
    label = 'Hearts',
    color = 'danger',
    size = 'md',
    className,
    ...props
  },
  ref,
) {
  const safeValue = Math.max(0, Math.min(max, Math.floor(value)))
  const reduced = useReducedMotion()
  const fillColor = resolveHeartColor(color)
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={safeValue}
      aria-label={`${label}: ${safeValue} of ${max}`}
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < safeValue
        return (
          <motion.span
            key={i}
            aria-hidden="true"
            initial={false}
            animate={filled ? { scale: 1 } : { scale: 0.92 }}
            transition={{
              duration: reduced ? 0 : 0.15,
              delay: reduced ? 0 : i * 0.03,
            }}
            className={cn('inline-block', SIZE_CLASS[size])}
          >
            <PixelHeart filled={filled} fillColor={fillColor} />
          </motion.span>
        )
      })}
    </div>
  )
})

function PixelHeart({ filled, fillColor }: { filled: boolean; fillColor: string }) {
  // 7x6 pixel heart drawn as discrete rects, then scaled via SVG viewBox.
  const fill = filled ? fillColor : 'var(--po-color-border)'
  const outline = 'var(--po-color-bg)'
  const pixels: Array<[number, number]> = [
    [1, 0], [2, 0], [4, 0], [5, 0],
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4],
    [3, 5],
  ]
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 7 6"
      style={{ imageRendering: 'pixelated', display: 'block', shapeRendering: 'crispEdges' }}
    >
      <rect width="7" height="6" fill={outline} opacity="0" />
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill={fill} />
      ))}
    </svg>
  )
}

HeartBar.displayName = 'HeartBar'
