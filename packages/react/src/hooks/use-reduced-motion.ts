"use client"

import { useReducedMotion as useMotionReducedMotion } from 'motion/react'

/**
 * Returns `true` when the user has requested reduced motion via OS settings
 * (`prefers-reduced-motion: reduce`). Components in this library use it to
 * either disable animations entirely or swap them for a non-vestibular
 * alternative (typically a short opacity fade).
 *
 * Mirrors Motion's hook so consumers can `import { useReducedMotion } from
 * '@pixelore/react'` without pulling in `motion/react` directly.
 */
export function useReducedMotion(): boolean {
  return Boolean(useMotionReducedMotion())
}
