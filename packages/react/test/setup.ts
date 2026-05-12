import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// JSDOM doesn't ship matchMedia — Motion's `useReducedMotion` reads it, so
// every component test would otherwise blow up.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

// JSDOM doesn't implement IntersectionObserver — Motion uses it for inView.
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  // @ts-expect-error — minimal mock
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// JSDOM ResizeObserver — used by some Radix components.
if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  // @ts-expect-error — minimal mock
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

afterEach(() => {
  cleanup()
})
