import type { Metadata } from 'next'
import { Checkbox, Label } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'
import { CheckboxIndeterminateDemo } from './_demos'

export const metadata: Metadata = {
  title: 'Checkbox',
  description: 'A two-state checkbox with a pixel-art tick and indeterminate support.',
}

export default function CheckboxDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Form
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Checkbox</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A two-state checkbox built on Radix. The tick is drawn as discrete{' '}
          <code className="font-mono">rect</code>s so it stays pixel-crisp at any zoom level.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<Checkbox id="quest" />
<Label htmlFor="quest">Accept the quest</Label>`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox id="cb-1" />
            <Label htmlFor="cb-1" className="cursor-pointer">
              Unchecked
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-2" defaultChecked />
            <Label htmlFor="cb-2" className="cursor-pointer">
              Checked
            </Label>
          </div>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Indeterminate
      </h2>
      <p className="mb-2 font-body text-lg text-po-fg-muted">
        A third state, drawn in the accent colour, that means &ldquo;<em>some but not all</em> of
        the things this checkbox represents are selected.&rdquo; You set it by passing{' '}
        <code className="font-mono">checked=&ldquo;indeterminate&rdquo;</code> instead of a
        boolean.
      </p>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        The canonical use is a <strong>&ldquo;select all&rdquo; row</strong> sitting above a
        list of child checkboxes. The parent reflects the aggregate state of its children:
      </p>
      <ul className="mb-6 ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          All children checked → parent is{' '}
          <code className="font-mono text-po-success">true</code>
        </li>
        <li>
          No children checked → parent is{' '}
          <code className="font-mono text-po-danger">false</code>
        </li>
        <li>
          Some children checked → parent is{' '}
          <code className="font-mono text-po-accent">&ldquo;indeterminate&rdquo;</code>
        </li>
      </ul>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        Try the demo below: toggle individual party members and watch the parent
        &ldquo;Select all&rdquo; checkbox switch through all three states. Click the parent
        itself to check or uncheck everyone at once.
      </p>
      <ComponentPreview
        code={`const [selected, setSelected] = useState(new Set(['warrior']))

const checkedCount = members.filter(m => selected.has(m.id)).length
const parentState =
  checkedCount === 0 ? false :
  checkedCount === members.length ? true :
  'indeterminate'

<Checkbox
  checked={parentState}
  onCheckedChange={() => {
    if (parentState === true) setSelected(new Set())
    else setSelected(new Set(members.map(m => m.id)))
  }}
/>`}
      >
        <CheckboxIndeterminateDemo />
      </ComponentPreview>
      <p className="mt-2 font-body text-base text-po-fg-muted">
        Note: <code className="font-mono">&ldquo;indeterminate&rdquo;</code> is purely a visual
        + <code className="font-mono">aria-checked=&ldquo;mixed&rdquo;</code> state. Clicking
        an indeterminate checkbox calls{' '}
        <code className="font-mono">onCheckedChange</code> with{' '}
        <code className="font-mono">true</code> — it&apos;s up to your handler to decide what
        clicking it means (in the demo, we check everyone).
      </p>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Disabled
      </h2>
      <ComponentPreview
        code={`<Checkbox id="locked" disabled defaultChecked />
<Label htmlFor="locked">Cannot unequip</Label>`}
      >
        <div className="flex items-center gap-2">
          <Checkbox id="cb-4" disabled defaultChecked />
          <Label htmlFor="cb-4">Cannot unequip</Label>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Built on Radix Checkbox — full keyboard support (<code className="font-mono">Space</code>{' '}
          toggles), proper <code className="font-mono">aria-checked</code> states including{' '}
          <code className="font-mono">mixed</code> for indeterminate (screen readers announce
          &ldquo;partially checked&rdquo;).
        </li>
        <li>
          The tick is rendered with Motion. Under{' '}
          <code className="font-mono">prefers-reduced-motion</code> the scale-in animation swaps
          for an instant opacity fade.
        </li>
        <li>
          Always associate a Label via <code className="font-mono">htmlFor</code> — the label
          itself is the larger, easier click target.
        </li>
      </ul>
    </>
  )
}
