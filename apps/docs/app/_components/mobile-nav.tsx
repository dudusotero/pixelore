'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useReducedMotion } from '@pixelore/react'
import { primaryNav, sidebarGroups } from './nav-data'
import { Logo } from './logo'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const close = useCallback(() => setOpen(false), [])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        aria-label="Open menu"
        className="inline-flex h-10 w-10 items-center justify-center border-2 border-po-border bg-po-bg-elevated text-po-fg transition-colors hover:bg-po-surface focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2 md:hidden"
      >
        <HamburgerIcon />
      </DialogPrimitive.Trigger>

      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.05 : 0.18 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              asChild
              aria-describedby={undefined}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[20rem] flex-col border-l-2 border-po-border bg-po-bg outline-none"
            >
              <motion.div
                initial={reduced ? { opacity: 0 } : { x: '100%' }}
                animate={reduced ? { opacity: 1 } : { x: 0 }}
                exit={reduced ? { opacity: 0 } : { x: '100%' }}
                transition={{ duration: reduced ? 0.05 : 0.22, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="flex h-16 items-center justify-between border-b-2 border-po-border px-4">
                  <DialogPrimitive.Title asChild>
                    <Link
                      href="/"
                      className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2"
                    >
                      <Logo />
                      <span className="font-display text-sm uppercase tracking-widest text-po-fg">
                        Pixelore<span className="ml-1.5 text-po-primary">UI</span>
                      </span>
                    </Link>
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close
                    aria-label="Close menu"
                    className="inline-flex h-9 w-9 items-center justify-center border-2 border-black bg-po-danger text-po-danger-fg font-display text-xs hover:brightness-110 focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2"
                  >
                    <span aria-hidden="true">X</span>
                  </DialogPrimitive.Close>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6">
                  <nav aria-label="Primary" className="mb-6">
                    <ul className="flex flex-col gap-1">
                      {primaryNav.map((link) => (
                        <li key={link.href}>
                          {link.external ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={close}
                              className="block border-2 border-po-border bg-po-bg-elevated px-3 py-2.5 font-display text-[10px] uppercase tracking-wider text-po-fg-muted hover:bg-po-surface hover:text-po-fg focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              onClick={close}
                              className="block border-2 border-po-border bg-po-bg-elevated px-3 py-2.5 font-display text-[10px] uppercase tracking-wider text-po-fg-muted hover:bg-po-surface hover:text-po-fg focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2"
                            >
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="border-t-2 border-po-border pt-6">
                    {sidebarGroups.map((group) => (
                      <div key={group.title} className="mb-6">
                        <h3 className="mb-2 font-display text-[10px] uppercase tracking-widest text-po-fg-muted">
                          {group.title}
                        </h3>
                        <ul className="flex flex-col gap-1">
                          {group.items.map((item) => {
                            const active = pathname === item.href
                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={close}
                                  aria-current={active ? 'page' : undefined}
                                  className={
                                    'block px-3 py-2 font-body text-base transition-colors focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2 ' +
                                    (active
                                      ? 'bg-po-primary text-po-primary-fg'
                                      : 'text-po-fg-muted hover:bg-po-bg-elevated hover:text-po-fg')
                                  }
                                >
                                  {item.label}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

function HamburgerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      aria-hidden="true"
      style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
    >
      <rect x="2" y="3" width="12" height="2" fill="currentColor" />
      <rect x="2" y="7" width="12" height="2" fill="currentColor" />
      <rect x="2" y="11" width="12" height="2" fill="currentColor" />
    </svg>
  )
}
