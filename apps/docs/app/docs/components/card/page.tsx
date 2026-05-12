import type { Metadata } from 'next'
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Card',
  description: 'A bevelled surface for grouping related content — the foundation of every panel in the system.',
}

export default function CardDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Surface
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Card</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          The bevelled surface that everything else sits on. Comes with a header/content/footer
          composition so panels feel structurally consistent.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Anatomy</h2>
      <ComponentPreview
        code={`<Card>
  <CardHeader>
    <CardTitle>Hero stats</CardTitle>
    <CardDescription>Updated each turn.</CardDescription>
  </CardHeader>
  <CardContent>Lv 12 · HP 38 / 50</CardContent>
  <CardFooter>
    <Button size="sm">Save</Button>
  </CardFooter>
</Card>`}
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Hero stats</CardTitle>
            <CardDescription>Updated each turn.</CardDescription>
          </CardHeader>
          <CardContent>Lv 12 · HP 38 / 50</CardContent>
          <CardFooter>
            <Button size="sm">Save</Button>
          </CardFooter>
        </Card>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Card with avatar
      </h2>
      <ComponentPreview
        code={`<Card>
  <CardHeader>
    <div className="flex items-center gap-3">
      <Avatar><AvatarFallback>ES</AvatarFallback></Avatar>
      <div>
        <CardTitle>Eduardo</CardTitle>
        <CardDescription>Lvl 99 · Frontend</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>Joined the party.</CardContent>
</Card>`}
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>ES</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Eduardo</CardTitle>
                <CardDescription>Lvl 99 · Frontend</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>Joined the party.</CardContent>
        </Card>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Interactive
      </h2>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        Setting <code className="font-mono">interactive</code> turns the card into a focusable,
        hover-translating affordance — perfect for clickable list items.
      </p>
      <ComponentPreview
        code={`<Card interactive onClick={() => {}}>
  <CardHeader>
    <CardTitle>Slot 1</CardTitle>
    <CardDescription>Press to select.</CardDescription>
  </CardHeader>
</Card>`}
      >
        <Card interactive className="w-full max-w-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Slot 1</CardTitle>
                <CardDescription>Press to select.</CardDescription>
              </div>
              <Badge variant="accent">NEW</Badge>
            </div>
          </CardHeader>
        </Card>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          The default Card is a plain <code className="font-mono">div</code> — semantically a
          group container.
        </li>
        <li>
          Interactive cards add <code className="font-mono">tabIndex=0</code> and a visible focus
          outline. For navigation, wrap the card in a Next.js{' '}
          <code className="font-mono">{'<Link>'}</code> or render it as one via{' '}
          <code className="font-mono">asChild</code> patterns instead of relying on onClick.
        </li>
        <li>
          <code className="font-mono">CardTitle</code> renders as <code className="font-mono">h3</code>{' '}
          — make sure the heading level fits its position in the document outline.
        </li>
      </ul>
    </>
  )
}
