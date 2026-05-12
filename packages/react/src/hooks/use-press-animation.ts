"use client"

import { type Variants } from 'motion/react'
import { useReducedMotion } from './use-reduced-motion'

/**
 * The classic 8-bit "press down" animation: shift two pixels down + right and
 * remove the drop shadow. When the user prefers reduced motion we skip the
 * translate (which produces a vestibular cue) and keep only a subtle opacity
 * change — following the WCAG 2.3.3 motion-actuated guidance.
 */
export function usePressAnimation(): Variants {
  const reduced = useReducedMotion()

  if (reduced) {
    return {
      idle: { opacity: 1 },
      hover: { opacity: 0.9 },
      pressed: { opacity: 0.8 },
    }
  }

  return {
    idle: { x: 0, y: 0 },
    hover: { x: -1, y: -1 },
    pressed: { x: 2, y: 2 },
  }
}
