import type { Metadata } from 'next'
import { Avatar, AvatarFallback } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Avatar',
  description: 'A pixel-rendered profile image with a graceful text fallback.',
}

export default function AvatarDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Data Display
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Avatar</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A square portrait with pixel-perfect image rendering and a typographic fallback.
          Wraps Radix Avatar so the fallback only renders when the image fails or hasn&apos;t
          loaded.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<Avatar>
  <AvatarImage src="/hero.png" alt="" />
  <AvatarFallback>ES</AvatarFallback>
</Avatar>`}
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>ES</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback aria-hidden="true">🛡</AvatarFallback>
          </Avatar>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">Sizes</h2>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        Override the size by passing a Tailwind <code className="font-mono">h-* w-*</code>{' '}
        utility through <code className="font-mono">className</code>.
      </p>
      <ComponentPreview
        code={`<Avatar className="h-8 w-8"><AvatarFallback>S</AvatarFallback></Avatar>
<Avatar><AvatarFallback>M</AvatarFallback></Avatar>
<Avatar className="h-14 w-14"><AvatarFallback>L</AvatarFallback></Avatar>`}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <Avatar className="h-14 w-14">
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Always provide an <code className="font-mono">alt</code> on{' '}
          <code className="font-mono">AvatarImage</code>. Decorative avatars (next to the
          person&apos;s name in the same row) should set{' '}
          <code className="font-mono">alt=&ldquo;&rdquo;</code> so screen readers skip the
          duplicate.
        </li>
        <li>
          <code className="font-mono">AvatarImage</code> applies{' '}
          <code className="font-mono">image-rendering: pixelated</code> automatically — feed it
          a small low-resolution PNG to keep the 8-bit feel.
        </li>
        <li>
          <code className="font-mono">AvatarFallback</code> renders the typographic initials
          only after Radix decides the image won&apos;t load — there&apos;s never a flash.
        </li>
      </ul>
    </>
  )
}
