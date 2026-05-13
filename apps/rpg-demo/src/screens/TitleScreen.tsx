import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from '@pixelore/react'
import { CLASSES } from '../game/data'
import { Sprite } from '../sprites'
import type { HeroClass } from '../game/types'

interface TitleScreenProps {
  onStart: (name: string, heroClass: HeroClass) => void
  /** True when a previous save exists — enables Continue. */
  hasSave?: boolean
  onContinue?: () => void
}

const CLASS_ORDER: HeroClass[] = ['warrior', 'mage', 'rogue']

export function TitleScreen({ onStart, hasSave = false, onContinue }: TitleScreenProps) {
  const [name, setName] = useState('Eddy')
  const [heroClass, setHeroClass] = useState<HeroClass>('warrior')
  const trimmed = name.trim() || 'Eddy'

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8 text-center sm:gap-8 sm:px-6 sm:py-12">
      <Badge variant="accent">A Pixelore UI Tale</Badge>
      <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg sm:text-4xl md:text-6xl">
        <span className="block">Pixelore</span>
        <span className="block text-po-primary">Quest</span>
      </h1>
      <p className="max-w-md font-body text-base leading-snug text-po-fg-muted sm:text-xl">
        A tiny turn-based RPG forged out of the Pixelore UI design system. Defeat
        the Pixel Dragon — or fall trying.
      </p>

      <Card className="w-full max-w-2xl text-left">
        <CardHeader>
          <CardTitle>New game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hero-name">Hero name</Label>
              <Input
                id="hero-name"
                value={name}
                maxLength={16}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eddy"
              />
            </div>

            <Separator />

            <fieldset className="flex flex-col gap-2">
              <legend className="font-display text-[10px] uppercase tracking-wider text-po-fg-muted">
                Choose your class
              </legend>
              <RadioGroup
                value={heroClass}
                onValueChange={(v) => setHeroClass(v as HeroClass)}
                className="grid gap-3 sm:grid-cols-3"
              >
                {CLASS_ORDER.map((id) => {
                  const profile = CLASSES[id]
                  const selected = heroClass === id
                  return (
                    <label
                      key={id}
                      htmlFor={`class-${id}`}
                      className={
                        'block cursor-pointer border-2 p-3 transition-colors ' +
                        (selected
                          ? 'border-po-primary bg-po-surface'
                          : 'border-po-border bg-po-bg-elevated hover:border-po-fg')
                      }
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem id={`class-${id}`} value={id} />
                          <span className="font-display text-xs uppercase tracking-wider text-po-fg">
                            {profile.name}
                          </span>
                        </div>
                        <Sprite
                          kind="hero"
                          id={id}
                          size={48}
                          animated
                          label={profile.name}
                        />
                      </div>
                      <p className="mb-2 font-body text-base leading-snug text-po-fg-muted">
                        {profile.blurb}
                      </p>
                      <dl className="grid grid-cols-3 gap-1 font-mono text-sm text-po-fg">
                        <StatPill label="HP" value={profile.hp} />
                        <StatPill label="MP" value={profile.mp} />
                        <StatPill label="ATK" value={profile.atk} />
                      </dl>
                    </label>
                  )
                })}
              </RadioGroup>
            </fieldset>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-3">
        {hasSave && onContinue && (
          <Button variant="secondary" size="lg" onClick={onContinue}>
            Continue saved game
          </Button>
        )}
        <Button
          variant="primary"
          size="lg"
          onClick={() => onStart(trimmed, heroClass)}
        >
          {hasSave ? 'New Game' : 'Press Start'}
        </Button>
        <p className="font-body text-base text-po-fg-muted">
          arrow keys or WASD to move on the world map
        </p>
      </div>
    </main>
  )
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between border border-po-border bg-po-bg-elevated px-1.5 py-0.5">
      <span className="text-[9px] uppercase tracking-wider text-po-fg-muted">
        {label}
      </span>
      <span className="text-po-fg">{value}</span>
    </div>
  )
}
