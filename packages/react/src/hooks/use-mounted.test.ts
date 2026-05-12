import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useMounted } from './use-mounted'

describe('useMounted', () => {
  it('returns true after the effect has run', () => {
    const { result } = renderHook(() => useMounted())
    // The effect fires synchronously after render in jsdom + React 19;
    // by the time renderHook returns, mounted is already true.
    expect(result.current).toBe(true)
  })
})
