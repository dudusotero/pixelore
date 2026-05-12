import type { Metadata } from 'next'
import { tokens } from '@pixelore/react/tokens'

export const metadata: Metadata = {
  title: 'Design tokens',
  description:
    'The colour, typography, spacing, and shadow tokens that power Pixelore UI — exposed as CSS variables and TypeScript exports.',
}

export default function TokensPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Reference
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">
          Design tokens
        </h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          Every value the design system uses, exposed two ways: as{' '}
          <code className="font-mono">--po-*</code> CSS variables (works in any
          stylesheet) and as TypeScript exports from{' '}
          <code className="font-mono">@pixelore/react/tokens</code> (works in any
          JS / TS context).
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">
        Colour
      </h2>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        Foreground/background pairs are designed for WCAG AA 4.5:1 contrast at the
        body text size. Override any token by redefining the CSS variable on{' '}
        <code className="font-mono">:root</code>.
      </p>
      <div className="my-6 grid gap-2 sm:grid-cols-2">
        {Object.entries(tokens.colors).map(([name, value]) => (
          <ColorSwatch key={name} name={name} value={value} />
        ))}
      </div>

      <h2 className="mb-3 mt-12 font-display text-lg uppercase tracking-wide text-po-fg">
        Typography
      </h2>
      <div className="my-4 grid gap-3">
        {Object.entries(tokens.fontFamilies).map(([name, value]) => (
          <TokenRow
            key={name}
            cssVar={`--font-${name}`}
            jsPath={`tokens.fontFamilies.${name}`}
            value={value}
          />
        ))}
      </div>
      <h3 className="mb-2 mt-6 font-display text-sm uppercase tracking-wider text-po-fg">
        Font sizes
      </h3>
      <div className="my-4 grid gap-3">
        {Object.entries(tokens.fontSizes).map(([name, value]) => (
          <TokenRow
            key={name}
            cssVar={`--text-${name}`}
            jsPath={`tokens.fontSizes.${name}`}
            value={value}
          />
        ))}
      </div>

      <h2 className="mb-3 mt-12 font-display text-lg uppercase tracking-wide text-po-fg">
        Spacing
      </h2>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        Spacing follows Tailwind&apos;s 4-pixel base. Reference these from JS for
        component dimensions that match the design system grid.
      </p>
      <div className="my-4 grid gap-3">
        {Object.entries(tokens.spacing).map(([name, value]) => (
          <TokenRow
            key={name}
            cssVar={null}
            jsPath={`tokens.spacing[${JSON.stringify(name)}]`}
            value={value}
          />
        ))}
      </div>

      <h2 className="mb-3 mt-12 font-display text-lg uppercase tracking-wide text-po-fg">
        Shadows
      </h2>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        Pixel shadows use solid offsets — no blur, no softness — to keep the 8-bit
        feel. Pair with the <code className="font-mono">.po-bevel</code> utility
        for the inset highlight.
      </p>
      <div className="my-4 grid gap-3">
        {Object.entries(tokens.shadows).map(([name, value]) => (
          <ShadowRow key={name} name={name} value={value} />
        ))}
      </div>

      <h2 className="mb-3 mt-12 font-display text-lg uppercase tracking-wide text-po-fg">
        Motion
      </h2>
      <div className="my-4 grid gap-3">
        {Object.entries(tokens.motion).map(([name, value]) => (
          <TokenRow
            key={name}
            cssVar={null}
            jsPath={`tokens.motion.${name}`}
            value={Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}
          />
        ))}
      </div>

      <h2 className="mb-3 mt-12 font-display text-lg uppercase tracking-wide text-po-fg">
        How to override
      </h2>
      <pre className="overflow-x-auto border-2 border-po-border bg-po-bg-elevated p-4 font-mono text-sm leading-relaxed text-po-fg">
        <code>{`/* In your global CSS, after importing @pixelore/react/styles.css */
:root {
  --po-color-primary: #00d4aa;       /* mint instead of hot pink */
  --po-color-primary-strong: #009b7a;
  --font-display: "Silkscreen", monospace;
}`}</code>
      </pre>
    </>
  )
}

function ColorSwatch({ name, value }: { name: string; value: string }) {
  const cssVar = `--po-color-${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`
  return (
    <div className="flex items-center gap-3 border-2 border-po-border bg-po-bg-elevated p-3">
      <div
        aria-hidden="true"
        className="h-12 w-12 shrink-0 border-2 border-black"
        style={{ background: value }}
      />
      <div className="min-w-0 flex-1 font-mono text-sm leading-snug">
        <div className="font-display text-[10px] uppercase tracking-wider text-po-fg-muted">
          {name}
        </div>
        <div className="text-po-fg">{cssVar}</div>
        <div className="text-po-fg-muted">{value}</div>
      </div>
    </div>
  )
}

function TokenRow({
  cssVar,
  jsPath,
  value,
}: {
  cssVar: string | null
  jsPath: string
  value: string
}) {
  return (
    <div className="border-2 border-po-border bg-po-bg-elevated p-3 font-mono text-sm">
      <div className="text-po-accent">{jsPath}</div>
      {cssVar && <div className="text-po-fg">{cssVar}</div>}
      <div className="text-po-fg-muted">{value}</div>
    </div>
  )
}

function ShadowRow({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-4 border-2 border-po-border bg-po-bg-elevated p-3">
      <div
        aria-hidden="true"
        className="h-10 w-10 shrink-0 border-2 border-black bg-po-primary"
        style={{ boxShadow: value.includes('var') ? '4px 4px 0 0 rgba(0,0,0,0.6)' : value }}
      />
      <div className="min-w-0 flex-1 font-mono text-sm">
        <div className="font-display text-[10px] uppercase tracking-wider text-po-fg-muted">
          {name}
        </div>
        <div className="break-all text-po-fg">{value}</div>
      </div>
    </div>
  )
}
