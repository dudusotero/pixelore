import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Switch,
} from '@pixelore/react'
import { useState } from 'react'
import type { Settings, Difficulty } from '../game/settings'

interface SettingsDialogProps {
  settings: Settings
  onChange: (next: Settings) => void
  trigger: React.ReactNode
}

const DIFFICULTY_HINTS: Record<Difficulty, string> = {
  easy: 'Player takes 25% less damage. Rewards reduced.',
  normal: 'Balanced. Recommended for first runs.',
  hard: 'Player takes 50% more damage. Rewards boosted.',
}

/**
 * Settings dialog — wired live as the user changes options, then committed
 * with the "Save" button. Exercises Dialog, Switch, RadioGroup, Separator,
 * Label, Button.
 */
export function SettingsDialog({ settings, onChange, trigger }: SettingsDialogProps) {
  // Local draft state so the user can cancel and discard.
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Settings>(settings)

  // Sync draft to incoming settings each time the dialog opens.
  function handleOpen(next: boolean) {
    if (next) setDraft(settings)
    setOpen(next)
  }

  function commit() {
    onChange(draft)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Audio, motion, and difficulty. Changes save when you press Confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="setting-sound" className="cursor-pointer">
              Sound effects
            </Label>
            <Switch
              id="setting-sound"
              checked={draft.sound}
              onCheckedChange={(v) => setDraft((s) => ({ ...s, sound: v === true }))}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="setting-scanlines" className="cursor-pointer">
              CRT scanlines overlay
            </Label>
            <Switch
              id="setting-scanlines"
              checked={draft.scanlines}
              onCheckedChange={(v) =>
                setDraft((s) => ({ ...s, scanlines: v === true }))
              }
            />
          </div>

          <Separator />

          <fieldset className="flex flex-col gap-2">
            <legend className="font-display text-[10px] uppercase tracking-wider text-po-fg-muted">
              Difficulty
            </legend>
            <RadioGroup
              value={draft.difficulty}
              onValueChange={(v) =>
                setDraft((s) => ({ ...s, difficulty: v as Difficulty }))
              }
            >
              {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
                <div key={d} className="flex items-start gap-3">
                  <RadioGroupItem id={`diff-${d}`} value={d} />
                  <div className="flex flex-col">
                    <Label htmlFor={`diff-${d}`} className="cursor-pointer">
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </Label>
                    <span className="font-body text-base text-po-fg-muted">
                      {DIFFICULTY_HINTS[d]}
                    </span>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </fieldset>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={commit}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
