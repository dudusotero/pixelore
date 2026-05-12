'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { href: '/docs', label: 'Introduction' },
      { href: '/docs/accessibility', label: 'Accessibility' },
      { href: '/docs/motion', label: 'Motion & reduced motion' },
      { href: '/docs/tokens', label: 'Design tokens' },
    ],
  },
  {
    title: 'Actions',
    items: [{ href: '/docs/components/button', label: 'Button' }],
  },
  {
    title: 'Surfaces',
    items: [
      { href: '/docs/components/card', label: 'Card' },
      { href: '/docs/components/separator', label: 'Separator' },
    ],
  },
  {
    title: 'Forms',
    items: [
      { href: '/docs/components/input', label: 'Input' },
      { href: '/docs/components/textarea', label: 'Textarea' },
      { href: '/docs/components/label', label: 'Label' },
      { href: '/docs/components/checkbox', label: 'Checkbox' },
      { href: '/docs/components/switch', label: 'Switch' },
      { href: '/docs/components/radio-group', label: 'RadioGroup' },
    ],
  },
  {
    title: 'Data Display',
    items: [
      { href: '/docs/components/avatar', label: 'Avatar' },
      { href: '/docs/components/badge', label: 'Badge' },
      { href: '/docs/components/heart-bar', label: 'HeartBar' },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { href: '/docs/components/alert', label: 'Alert' },
      { href: '/docs/components/progress', label: 'Progress' },
      { href: '/docs/components/skeleton', label: 'Skeleton' },
      { href: '/docs/components/tooltip', label: 'Tooltip' },
    ],
  },
  {
    title: 'Overlays',
    items: [{ href: '/docs/components/dialog', label: 'Dialog' }],
  },
  {
    title: 'Navigation',
    items: [{ href: '/docs/components/tabs', label: 'Tabs' }],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Documentation navigation"
      className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pr-4"
    >
      {groups.map((group) => (
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
