'use client'

import { useEffect, useState } from 'react'

/**
 * Returns `true` once the component has mounted on the client. Useful for
 * deferring SSR rendering of Portal-using primitives (Dialog, Tooltip) when
 * they're consumed from a Next.js Server Component — multiple Radix Portal
 * components rendered inline in the same Server Component subtree can race
 * during hydration and drop the first instance's trigger from the DOM. Mounting
 * the Portal content client-side sidesteps the race without affecting the
 * server-rendered trigger.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
