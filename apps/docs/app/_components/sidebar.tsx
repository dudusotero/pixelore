'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sidebarGroups } from './nav-data'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Documentation navigation"
      className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pr-4"
    >
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
                    aria-current={active ? 'page' : undefined}
                    className={
                      'block px-3 py-1.5 font-body text-base transition-colors focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2 ' +
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
    </nav>
  )
}
