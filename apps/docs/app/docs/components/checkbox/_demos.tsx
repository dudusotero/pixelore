'use client'

import { useMemo, useState } from 'react'
import { Checkbox, Label, Separator } from '@pixelore/react'

/**
 * The canonical use of `checked="indeterminate"`: a "select all" row that
 * sits above a group of child checkboxes. The parent reflects the aggregate
 * state of its children:
 *
 *   all children checked   → parent checked
 *   no children checked    → parent unchecked
 *   some children checked  → parent indeterminate
 *
 * Clicking the parent in any state either checks all children (if mixed or
 * unchecked) or unchecks all (if fully checked). Native browser behaviour
 * for `<input indeterminate>` works the same way — Radix mirrors it.
 */

interface PartyMember {
  id: string
  name: string
  /** Disabled members can't be toggled — useful for showing the locked state. */
  locked?: boolean
}

const PARTY: PartyMember[] = [
  { id: 'warrior', name: 'Warrior · Eddy' },
  { id: 'mage', name: 'Mage · Lyra' },
  { id: 'rogue', name: 'Rogue · Finn' },
  { id: 'cleric', name: 'Cleric · Maeve (locked — must rest)', locked: true },
]

export function CheckboxIndeterminateDemo() {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(['warrior']), // start with one checked so the parent begins indeterminate
  )

  // Aggregate state for the parent. We ignore locked rows so the parent
  // reaches "checked" once every togglable row is on.
  const togglable = useMemo(() => PARTY.filter((m) => !m.locked), [])
  const checkedCount = togglable.filter((m) => selected.has(m.id)).length
  const parentState: boolean | 'indeterminate' =
    checkedCount === 0 ? false : checkedCount === togglable.length ? true : 'indeterminate'

  const onParentToggle = () => {
    if (parentState === true) {
      // Currently all checked → uncheck everything
      setSelected(new Set())
    } else {
      // Mixed or empty → check every togglable row
      setSelected(new Set(togglable.map((m) => m.id)))
    }
  }

  const onChildToggle = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="party-all"
          checked={parentState}
          onCheckedChange={onParentToggle}
          aria-label="Select all party members"
        />
        <Label htmlFor="party-all" className="cursor-pointer">
          Select all party members
        </Label>
        <span className="ml-auto font-body text-base text-po-fg-muted">
          {checkedCount} / {togglable.length} ready
        </span>
      </div>

      <Separator />

      <div className="flex flex-col gap-2 pl-4">
        {PARTY.map((member) => (
          <div key={member.id} className="flex items-center gap-2">
            <Checkbox
              id={`party-${member.id}`}
              disabled={member.locked}
              checked={selected.has(member.id)}
              onCheckedChange={(checked) => onChildToggle(member.id, checked === true)}
            />
            <Label htmlFor={`party-${member.id}`} className="cursor-pointer">
              {member.name}
            </Label>
          </div>
        ))}
      </div>

      <p className="mt-1 font-body text-base text-po-fg-muted">
        State of the parent:{' '}
        <code className="font-mono text-po-accent">
          {parentState === 'indeterminate'
            ? '"indeterminate"'
            : parentState
              ? 'true'
              : 'false'}
        </code>
      </p>
    </div>
  )
}
