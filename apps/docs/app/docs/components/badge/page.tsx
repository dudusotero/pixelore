import type { Metadata } from 'next'
import { Badge } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Badge',
  description: 'A small label for status, counts, or short categorical text.',
}

export default function BadgeDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Data Display
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Badge</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A small label for status, counts, tags, or short categorical text. Seven semantic
          variants ship out of the box.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Variants</h2>
      <ComponentPreview
        code={`<Badge variant="primary">Quest</Badge>
<Badge variant="secondary">Info</Badge>
<Badge variant="accent">NEW</Badge>
<Badge variant="success">+200 XP</Badge>
<Badge variant="warning">Low HP</Badge>
<Badge variant="danger">Boss</Badge>
<Badge variant="neutral">NPC</Badge>`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">Quest</Badge>
          <Badge variant="secondary">Info</Badge>
          <Badge variant="accent">NEW</Badge>
          <Badge variant="success">+200 XP</Badge>
          <Badge variant="warning">Low HP</Badge>
          <Badge variant="danger">Boss</Badge>
          <Badge variant="neutral">NPC</Badge>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        With an icon
      </h2>
      <ComponentPreview
        code={`<Badge variant="success">
  <span aria-hidden="true">✓</span> Saved
</Badge>
<Badge variant="warning">
  <span aria-hidden="true">!</span> Unsaved
</Badge>`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">
            <span aria-hidden="true">✓</span> Saved
          </Badge>
          <Badge variant="warning">
            <span aria-hidden="true">!</span> Unsaved
          </Badge>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Badge is a non-interactive <code className="font-mono">{'<span>'}</code> — purely
          visual. If the badge conveys live state (e.g. a notification count), wrap it in a
          region with <code className="font-mono">aria-live=&ldquo;polite&rdquo;</code> on the
          parent.
        </li>
        <li>
          Colour alone never carries meaning. Always pair the badge with text or a paired icon
          so it remains intelligible to colour-blind users and at 4:1 contrast.
        </li>
      </ul>
    </>
  )
}
