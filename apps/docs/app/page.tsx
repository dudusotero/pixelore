import Link from 'next/link'
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
  Checkbox,
  HeartBar,
  Input,
  Label,
  Progress,
  Switch,
} from '@pixelore/react'
import pixelorePkg from '@pixelore/react/package.json'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ForWho />
      <Showcase />
      <DemoCallout />
      <Pillars />
      <Footer />
    </>
  )
}

function Hero() {
  return (
    <section className="po-hero-noise relative overflow-hidden border-b-2 border-po-border py-14 sm:py-20 md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:gap-8">
        <Badge variant="accent" className="text-[9px]">
          v{pixelorePkg.version} — Press Start
        </Badge>
        <h1 className="font-display text-2xl uppercase leading-tight tracking-wider text-po-fg sm:text-4xl md:text-6xl [overflow-wrap:anywhere]">
          <span className="block">Build</span>
          <span className="block text-po-primary">Browser Games</span>
          <span className="block">Faster</span>
        </h1>
        <p className="max-w-xl font-body text-base leading-snug text-po-fg-muted sm:text-xl md:text-2xl">
          The 8-bit React design system for HTML games. Drop-in HUDs, menus, dialog
          screens, and player feedback — fully accessible, motion-aware, and pixel-perfect.
        </p>
        <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <Button asChild variant="primary" size="lg">
            <Link href="/docs">Get Started</Link>
          </Button>
          <Button asChild variant="accent" size="lg">
            <a
              href="https://pixelore-rpg.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              Play the Demo
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/docs/components/button">Browse Components</Link>
          </Button>
        </div>
        <code className="max-w-full border-2 border-po-border bg-po-bg-elevated px-3 py-1.5 font-mono text-sm text-po-accent sm:text-base [overflow-wrap:anywhere]">
          pnpm add @pixelore/react motion
        </code>
      </div>
    </section>
  )
}

function ForWho() {
  return (
    <section className="border-b-2 border-po-border bg-po-bg-elevated/30 py-10 sm:py-12">
      <div className="mx-auto max-w-5xl px-4">
        <header className="mb-8 flex flex-col items-start gap-2">
          <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
            Built for
          </span>
          <h2 className="font-display text-xl uppercase tracking-wider text-po-fg sm:text-2xl [overflow-wrap:anywhere]">
            React-powered browser games
          </h2>
        </header>
        <div className="grid gap-4 sm:grid-cols-3">
          <UseCaseCard
            badge="HTML Games"
            title="Turn-based RPGs, roguelikes, idle games"
            body="HUDs, inventories, ability menus, dialog screens, encounter UIs — without rebuilding the basics every time."
          />
          <UseCaseCard
            badge="Creative Tools"
            title="Pixel art tools, level editors, jam tooling"
            body="Same retro vibe consumers expect from a creative tool, with grown-up accessibility built in."
          />
          <UseCaseCard
            badge="Personality"
            title="Portfolios, side projects, anything with vibes"
            body="When &lsquo;flat shadcn dashboard&rsquo; is wrong but you don&apos;t want to hand-roll a theme."
          />
        </div>
      </div>
    </section>
  )
}

function UseCaseCard({
  badge,
  title,
  body,
}: {
  badge: string
  title: string
  body: string
}) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="neutral" size="sm" className="self-start">
          {badge}
        </Badge>
        <CardTitle className="mt-1">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-body text-base text-po-fg-muted">{body}</p>
      </CardContent>
    </Card>
  )
}

function Showcase() {
  return (
    <section className="border-b-2 border-po-border py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-8 flex flex-col items-start gap-2 sm:mb-10">
          <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
            Showcase
          </span>
          <h2 className="font-display text-xl uppercase tracking-wider text-po-fg sm:text-2xl [overflow-wrap:anywhere]">
            Pick a component. Press a button.
          </h2>
          <p className="max-w-2xl font-body text-base text-po-fg-muted sm:text-lg">
            Everything below is rendered with the live library. Hover, focus, click —
            then check the source in the docs.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ShowcaseCard title="Button">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </ShowcaseCard>

          <ShowcaseCard title="Heart Bar">
            <div className="flex flex-col items-start gap-3">
              <HeartBar value={3} max={3} />
              <HeartBar value={2} max={3} />
              <HeartBar value={1} max={5} />
            </div>
          </ShowcaseCard>

          <ShowcaseCard title="Badge">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Quest</Badge>
              <Badge variant="success">+200 XP</Badge>
              <Badge variant="warning">Low HP</Badge>
              <Badge variant="danger">Boss</Badge>
              <Badge variant="neutral">NPC</Badge>
            </div>
          </ShowcaseCard>

          <ShowcaseCard title="Form Controls">
            <div className="flex w-full flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Player Name</Label>
                <Input id="name" placeholder="LINK" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="agree" defaultChecked />
                <Label htmlFor="agree" className="cursor-pointer">
                  Accept the quest
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="sound" defaultChecked />
                <Label htmlFor="sound" className="cursor-pointer">
                  Sound FX
                </Label>
              </div>
            </div>
          </ShowcaseCard>

          <ShowcaseCard title="Progress">
            <div className="flex w-full flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-display text-[10px] uppercase tracking-wider text-po-fg-muted">
                  Loading World
                </span>
                <Progress value={64} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-[10px] uppercase tracking-wider text-po-fg-muted">
                  XP to Level
                </span>
                <Progress value={32} />
              </div>
            </div>
          </ShowcaseCard>

          <ShowcaseCard title="Card + Avatar">
            <Card className="w-full">
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
          </ShowcaseCard>

          <div className="sm:col-span-2 lg:col-span-3">
            <Alert variant="info">
              <AlertTitle>Tip</AlertTitle>
              <AlertDescription>
                Every component honours <code className="font-mono">prefers-reduced-motion</code>.
                Toggle it in your OS to see translates swap for opacity fades — no flicker, no
                vestibular cue.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </section>
  )
}

function ShowcaseCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-[120px] items-center justify-center py-2">{children}</div>
      </CardContent>
    </Card>
  )
}

function DemoCallout() {
  return (
    <section className="border-b-2 border-po-border py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Card className="overflow-hidden">
          <CardHeader>
            <Badge variant="primary" size="sm" className="self-start">
              Live Demo
            </Badge>
            <CardTitle className="mt-2 text-xl sm:text-2xl">Pixelore Quest</CardTitle>
            <CardDescription className="text-base sm:text-lg">
              A complete turn-based RPG, built entirely with the design system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-body text-base leading-snug text-po-fg-muted sm:text-lg [overflow-wrap:anywhere]">
              Map navigation, random encounters, animated battle screen, party stats,
              inventory, NPC merchants, save/load — orchestrating Dialog, Card, Badge,
              Button, HeartBar, Progress, Tabs, Tooltip, and Motion in one stateful app.
              Play it at{' '}
              <a
                href="https://pixelore-rpg.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-po-accent underline underline-offset-2"
              >
                pixelore-rpg.vercel.app
              </a>{' '}
              or clone <code className="font-mono text-po-accent">apps/rpg-demo</code>{' '}
              from the repo as a starting point for your own browser game.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <HeartBar value={3} max={3} />
              <Badge variant="success">+200 XP</Badge>
              <Badge variant="danger">Boss</Badge>
              <span className="font-body text-lg text-po-fg-muted">
                ← every element here is a real component you can import.
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="primary">
              <a
                href="https://pixelore-rpg.vercel.app"
                target="_blank"
                rel="noreferrer"
              >
                Play the Demo
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a
                href="https://github.com/dudusotero/pixelore/tree/main/apps/rpg-demo"
                target="_blank"
                rel="noreferrer"
              >
                See the source
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/docs/components/heart-bar">Read about HeartBar</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

function Pillars() {
  const pillars = [
    {
      title: 'Game-ready, not generic',
      body: 'HeartBar, HP/MP progress, badge tags, modal dialogs, focus-trapped overlays — the patterns a game UI actually needs, not yet another empty Card.',
    },
    {
      title: 'Accessible by default',
      body: 'Radix primitives under everything. Keyboard support, ARIA, focus management, screen-reader-tested. WCAG 2.2 AA targets — your jam game can pass a11y audits.',
    },
    {
      title: 'Motion that respects you',
      body: 'Powered by Motion. Translates and scales swap to opacity under prefers-reduced-motion. Players prone to motion sickness still get feedback.',
    },
    {
      title: 'Pixel-perfect, framework-friendly',
      body: 'Box-shadow borders so anti-aliasing can\'t blur them. Press Start 2P + VT323 typography. Works in Next.js App Router, Vite, Remix, Astro islands — anywhere React runs.',
    },
  ]

  return (
    <section className="border-b-2 border-po-border py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 font-display text-xl uppercase tracking-wider text-po-fg sm:mb-10 sm:text-2xl [overflow-wrap:anywhere]">
          Four rules of the engine
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {pillars.map((p) => (
            <Card key={p.title}>
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-base leading-snug text-po-fg-muted sm:text-lg">{p.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
        <p className="font-body text-base text-po-fg-muted">
          Crafted with pixels by{' '}
          <a
            className="text-po-secondary underline underline-offset-2"
            href="https://github.com/dudusotero"
          >
            Eduardo Sotero
          </a>
        </p>
        <p className="font-display text-[10px] uppercase tracking-widest text-po-fg-muted">
          MIT · 2026
        </p>
      </div>
    </footer>
  )
}
