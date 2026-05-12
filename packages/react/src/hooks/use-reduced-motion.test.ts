import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useReducedMotion } from './use-reduced-motion'

describe('useReducedMotion', () => {
  it('returns false when prefers-reduced-motion is "no-preference"', () => {
    const { result } = renderHook(() => useReducedMotion())
    // Default setup.ts mock: matchMedia.matches === false
    expect(result.current).toBe(false)
  })

  it('coerces motion library result to a strict boolean', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(typeof result.current).toBe('boolean')
  })
})
