/**
 * pixelore design tokens — the source of truth for colors, spacing,
 * typography and elevation. The CSS theme in styles/index.css mirrors these
 * values; any addition here should also be reflected there.
 */

export const colors = {
  bg: '#0d0f1c',
  bgElevated: '#171a2e',
  surface: '#1f2340',
  fg: '#f4f4f8',
  fgMuted: '#9ea1c1',
  border: '#2a2f55',

  primary: '#ff2d6c',
  primaryFg: '#ffffff',
  primaryStrong: '#cc0d4d',

  secondary: '#00e5ff',
  secondaryFg: '#0d0f1c',
  secondaryStrong: '#00b8cc',

  accent: '#ffd93d',
  accentFg: '#0d0f1c',

  success: '#00ff88',
  successFg: '#0d0f1c',

  warning: '#ff8c00',
  warningFg: '#0d0f1c',

  danger: '#ff3838',
  dangerFg: '#ffffff',
} as const

export type ColorToken = keyof typeof colors

export const spacing = {
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const

export const fontFamilies = {
  display: '"Press Start 2P", "VT323", monospace',
  body: '"VT323", "Press Start 2P", monospace',
  mono: '"VT323", ui-monospace, monospace',
} as const

export const fontSizes = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
} as const

export const radii = {
  none: '0',
  pixel: '0',
} as const

/**
 * Pixel-perfect shadows. We avoid CSS filters / soft shadows and instead use
 * solid offsets to keep the 8-bit feel.
 */
export const shadows = {
  pixel: '4px 4px 0 0 rgba(0, 0, 0, 0.6)',
  pixelSm: '2px 2px 0 0 rgba(0, 0, 0, 0.6)',
  pixelLg: '6px 6px 0 0 rgba(0, 0, 0, 0.6)',
  inset: 'inset 2px 2px 0 0 rgba(255, 255, 255, 0.15), inset -2px -2px 0 0 rgba(0, 0, 0, 0.3)',
  glow: '0 0 0 2px var(--po-color-primary), 4px 4px 0 0 var(--po-color-primary-strong)',
} as const

export const motion = {
  durationFast: 0.08,
  durationBase: 0.12,
  durationSlow: 0.22,
  ease: [0.32, 0.72, 0, 1] as const,
  step: [0.25, 0, 0.5, 1] as const, // a more "stepped" ease for 8-bit feel
} as const

export const tokens = {
  colors,
  spacing,
  fontFamilies,
  fontSizes,
  radii,
  shadows,
  motion,
} as const

export type Tokens = typeof tokens
