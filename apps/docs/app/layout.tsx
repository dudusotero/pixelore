import type { Metadata, Viewport } from 'next'
import { TooltipProvider } from '@pixelore/react'
import { Header } from './_components/header'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://pixelore.vercel.app'),
  title: {
    default: 'Pixelore UI — 8-bit React design system',
    template: '%s · Pixelore UI',
  },
  description:
    'An 8-bit aesthetic React design system. Accessible. Animated. Pixel-perfect. Built with Tailwind v4, Motion and Radix.',
  keywords: [
    'react',
    'design system',
    '8-bit',
    'pixel art',
    'retro',
    'tailwindcss',
    'motion',
    'accessibility',
  ],
  authors: [{ name: 'Eduardo Sotero' }],
  openGraph: {
    type: 'website',
    title: 'Pixelore UI — 8-bit React design system',
    description:
      'An 8-bit aesthetic React design system. Accessible. Animated. Pixel-perfect.',
    url: 'https://pixelore.vercel.app',
    siteName: 'Pixelore UI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pixelore UI',
    description: '8-bit React design system. Accessible. Animated. Pixel-perfect.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0d0f1c',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-po-bg text-po-fg antialiased">
        <TooltipProvider delayDuration={150}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-po-accent focus:text-po-accent-fg focus:px-3 focus:py-2 focus:font-display focus:text-xs focus:uppercase"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  )
}
