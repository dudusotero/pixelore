import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeartBar } from './heart-bar'

describe('<HeartBar>', () => {
  it('exposes role="progressbar" with aria-valuenow/max/min', () => {
    render(<HeartBar value={2} max={3} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '3')
    expect(bar).toHaveAttribute('aria-valuenow', '2')
  })

  it('announces a screen-reader-friendly label', () => {
    render(<HeartBar value={1} max={3} />)
    expect(
      screen.getByRole('progressbar', { name: 'Hearts: 1 of 3' }),
    ).toBeInTheDocument()
  })

  it('clamps value below 0 and above max', () => {
    const { rerender } = render(<HeartBar value={-5} max={3} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    rerender(<HeartBar value={9} max={3} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3')
  })

  it('renders one heart node per max', () => {
    const { container } = render(<HeartBar value={2} max={5} />)
    // SVGs are aria-hidden; count them directly
    expect(container.querySelectorAll('svg')).toHaveLength(5)
  })

  it('accepts a custom label', () => {
    render(<HeartBar value={2} max={3} label="Shields" />)
    expect(
      screen.getByRole('progressbar', { name: 'Shields: 2 of 3' }),
    ).toBeInTheDocument()
  })

  it('has a displayName', () => {
    expect(HeartBar.displayName).toBe('HeartBar')
  })
})
