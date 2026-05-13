import Link from 'next/link'
import { Logo } from './logo'
import { MobileNav } from './mobile-nav'
import { primaryNav } from './nav-data'

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b-2 border-po-border bg-po-bg/90 backdrop-blur supports-[backdrop-filter]:bg-po-bg/70"
      style={{ height: 'var(--docs-header-height)' }}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-4 sm:gap-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2 sm:gap-3"
          aria-label="Pixelore UI home"
        >
          <Logo />
          <span className="truncate font-display text-xs uppercase tracking-widest text-po-fg sm:text-sm">
            Pixelore<span className="ml-1.5 text-po-primary">UI</span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-4 md:flex md:gap-6"
        >
          {primaryNav.map((link) => {
            const baseCls =
              'font-display text-[10px] uppercase tracking-wider hover:text-po-fg focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2'
            const toneCls =
              link.label === 'Play Demo'
                ? 'text-po-accent hover:text-po-primary'
                : 'text-po-fg-muted'
            return link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={`${baseCls} ${toneCls}`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`${baseCls} ${toneCls}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <MobileNav />
      </div>
    </header>
  )
}
