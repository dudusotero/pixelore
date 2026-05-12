import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Alert, AlertDescription, AlertTitle } from './alert'

describe('<Alert>', () => {
  it('renders with role="alert"', () => {
    render(
      <Alert>
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>Press X to confirm.</AlertDescription>
      </Alert>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('uses aria-live="polite" by default', () => {
    render(<Alert>Heads up</Alert>)
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite')
  })

  it('escalates to aria-live="assertive" for warning and danger variants', () => {
    const { rerender } = render(<Alert variant="warning">Low HP</Alert>)
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
    rerender(<Alert variant="danger">Game Over</Alert>)
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
  })

  it('has displayNames for all parts', () => {
    expect(Alert.displayName).toBe('Alert')
    expect(AlertTitle.displayName).toBe('AlertTitle')
    expect(AlertDescription.displayName).toBe('AlertDescription')
  })
})
