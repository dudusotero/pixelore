export interface NavItem {
  href: string
  label: string
  external?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const primaryNav: NavItem[] = [
  { href: '/docs', label: 'Docs' },
  { href: '/docs/components/button', label: 'Components' },
  { href: 'https://pixelore-rpg.vercel.app', label: 'Play Demo', external: true },
  { href: 'https://github.com/dudusotero/pixelore', label: 'GitHub', external: true },
]

export const sidebarGroups: NavGroup[] = [
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
