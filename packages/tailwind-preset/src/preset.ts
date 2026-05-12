import type { Config } from 'tailwindcss'

/**
 * pixelore Tailwind v3 preset. Drop into `tailwind.config.{ts,js}`:
 *
 *     import pixelorePreset from "@pixelore/tailwind-preset"
 *     export default { presets: [pixelorePreset], content: [...] }
 *
 * Tailwind v4 users should `@import "@pixelore/tailwind-preset/css"` instead
 * — the CSS file mirrors these tokens via `@theme`.
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        'po-bg': '#0d0f1c',
        'po-bg-elevated': '#171a2e',
        'po-surface': '#1f2340',
        'po-fg': '#f4f4f8',
        'po-fg-muted': '#9ea1c1',
        'po-border': '#2a2f55',
        'po-primary': '#ff2d6c',
        'po-primary-fg': '#ffffff',
        'po-primary-strong': '#cc0d4d',
        'po-secondary': '#00e5ff',
        'po-secondary-fg': '#0d0f1c',
        'po-secondary-strong': '#00b8cc',
        'po-accent': '#ffd93d',
        'po-accent-fg': '#0d0f1c',
        'po-success': '#00ff88',
        'po-success-fg': '#0d0f1c',
        'po-warning': '#ff8c00',
        'po-warning-fg': '#0d0f1c',
        'po-danger': '#ff3838',
        'po-danger-fg': '#ffffff',
      },
      fontFamily: {
        display: ['"Press Start 2P"', '"VT323"', 'monospace'],
        body: ['"VT323"', '"Press Start 2P"', 'monospace'],
        mono: ['"VT323"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        pixel: '0px',
      },
      boxShadow: {
        pixel: '4px 4px 0 0 rgba(0, 0, 0, 0.6)',
        'pixel-sm': '2px 2px 0 0 rgba(0, 0, 0, 0.6)',
        'pixel-lg': '6px 6px 0 0 rgba(0, 0, 0, 0.6)',
      },
    },
  },
}

export default preset
