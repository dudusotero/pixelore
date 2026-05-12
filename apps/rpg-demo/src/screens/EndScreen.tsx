import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@pixelore/react'
import type { Hero } from '../game/types'

interface EndScreenProps {
  variant: 'victory' | 'defeat'
  hero: Hero
  steps: number
  onRestart: () => void
  onTitle: () => void
}

export function EndScreen({ variant, hero, steps, onRestart, onTitle }: EndScreenProps) {
  const isVictory = variant === 'victory'
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <Badge variant={isVictory ? 'success' : 'danger'}>
        {isVictory ? 'The Realm is Saved' : 'Game Over'}
      </Badge>

      <h1
        className={
          'font-display text-4xl uppercase tracking-wider sm:text-6xl ' +
          (isVictory ? 'text-po-success' : 'text-po-danger')
        }
      >
        {isVictory ? 'Victory!' : 'You Died'}
      </h1>

      <Card className="w-full max-w-md text-left">
        <CardHeader>
          <CardTitle>{hero.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-3 font-body text-lg text-po-fg-muted">
            <dt>Level</dt>
            <dd className="text-po-fg">{hero.level}</dd>
            <dt>XP</dt>
            <dd className="text-po-fg">{hero.xp}</dd>
            <dt>Lives left</dt>
            <dd className="text-po-fg">
              {hero.lives} / {hero.maxLives}
            </dd>
            <dt>Steps taken</dt>
            <dd className="text-po-fg">{steps}</dd>
          </dl>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" onClick={onRestart}>
          Play Again
        </Button>
        <Button variant="ghost" onClick={onTitle}>
          Title Screen
        </Button>
      </div>
    </main>
  )
}
