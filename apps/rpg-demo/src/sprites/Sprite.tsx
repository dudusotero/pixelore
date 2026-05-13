import { useEffect, useState } from 'react'
import { NATIVE_SIZE, spritePath, type SpriteKind } from './registry'

export interface SpriteProps {
  kind: SpriteKind
  /** Same id used in the game data files (e.g. `dragon`, `bronze-sword`). */
  id: string
  /**
   * Optional emoji shown as a safety net if the PNG fails to load. Production
   * surfaces don't pass this any more — every id has a real sprite — but
   * leaving the prop available lets callers degrade gracefully during a
   * development cycle where art is in flight.
   */
  emoji?: string
  /**
   * Pixel size of the rendered sprite. Defaults to the kind's native size.
   * Scaling happens via CSS only; the underlying image is never resampled.
   */
  size?: number
  /**
   * Whether the sprite is a 2-frame horizontal strip and should play the idle
   * loop. Honoured only when the PNG loads; the emoji fallback is static.
   */
  animated?: boolean
  /** Optional aria-label for accessibility. Defaults to the id. */
  label?: string
  className?: string
}

type LoadState = 'pending' | 'loaded' | 'failed'

/**
 * Renders a pixel-art sprite. If the PNG is missing or fails to decode, swaps
 * to the emoji fallback so the UI never shows a broken image. Reduced motion
 * pins animated sprites to frame 0 via CSS.
 *
 * Stage 0: no real sprites ship yet — this component exists so screens can
 * migrate one surface at a time without touching every call site twice.
 */
export function Sprite({
  kind,
  id,
  emoji,
  size,
  animated = false,
  label,
  className,
}: SpriteProps) {
  const path = spritePath(kind, id)
  const [state, setState] = useState<LoadState>('pending')
  const [trackedPath, setTrackedPath] = useState(path)
  const renderedSize = size ?? NATIVE_SIZE[kind]

  // If the requested sprite changes, reset to pending before kicking off a
  // new load probe. Resetting during render (rather than in an effect)
  // avoids the cascading-render lint and matches the React 19 pattern for
  // syncing state to props.
  if (trackedPath !== path) {
    setTrackedPath(path)
    setState('pending')
  }

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (!cancelled) setState('loaded')
    }
    img.onerror = () => {
      if (!cancelled) setState('failed')
    }
    img.src = path
    return () => {
      cancelled = true
    }
  }, [path])

  if (state !== 'loaded') {
    // Pending and failed both render the (optional) emoji. Treating them the
    // same way avoids a layout flicker when the probe takes a moment to
    // resolve, and gives a graceful degradation path if a PNG goes missing.
    // When no emoji is supplied we render an empty slot of the same size so
    // surrounding layout doesn't reflow.
    return (
      <span
        role="img"
        aria-label={label ?? id}
        className={className}
        style={{
          fontSize: renderedSize,
          lineHeight: 1,
          display: 'inline-block',
          width: renderedSize,
          height: renderedSize,
          textAlign: 'center',
        }}
      >
        {emoji}
      </span>
    )
  }

  // Animated: render the 2-frame strip as a background-image with a CSS
  // keyframe that swaps `background-position` between frame 0 and frame 1.
  // The image is sized to 200% × 100% of the container so each frame fills
  // exactly half the strip — frame-size agnostic.
  if (animated) {
    return (
      <span
        role="img"
        aria-label={label ?? id}
        className={`sprite-frame sprite-idle ${className ?? ''}`}
        style={{
          width: renderedSize,
          height: renderedSize,
          backgroundImage: `url(${path})`,
        }}
      />
    )
  }

  return (
    <img
      src={path}
      alt=""
      aria-label={label ?? id}
      role="img"
      className={`sprite-img inline-block ${className ?? ''}`}
      style={{ width: renderedSize, height: renderedSize }}
    />
  )
}
