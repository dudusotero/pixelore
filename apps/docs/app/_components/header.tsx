import Link from 'next/link'
import { Logo } from './logo'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-po-border bg-po-bg/90 backdrop-blur supports-[backdrop-filter]:bg-po-bg/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4">
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2"
          aria-label="Pixelore UI home"
        >
          <Logo />
          <span className="font-display text-sm uppercase tracking-widest text-po-fg">
            Pixelore<span className="ml-1.5 text-po-primary">UI</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/docs"
            className="font-display text-[10px] uppercase tracking-wider text-po-fg-muted hover:text-po-fg focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2"
          >
            Docs
          </Link>
          <Link
            href="/docs/components/button"
            className="font-display text-[10px] uppercase tracking-wider text-po-fg-muted hover:text-po-fg focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2"
          >
            Components
          </Link>
          <a
            href="https://github.com/dudusotero/pixelore"
            target="_blank"
            rel="noreferrer"
            className="font-display text-[10px] uppercase tracking-wider text-po-fg-muted hover:text-po-fg focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
