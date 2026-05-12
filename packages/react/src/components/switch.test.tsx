import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Switch } from './switch'

describe('<Switch>', () => {
  it('exposes role="switch" rather than role="checkbox"', () => {
    render(<Switch aria-label="sound" />)
    expect(screen.getByRole('switch', { name: 'sound' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('toggles aria-checked on Space', async () => {
    const user = userEvent.setup()
    render(<Switch aria-label="sound" />)
    const sw = screen.getByRole('switch')
    sw.focus()
    await user.keyboard(' ')
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('reflects defaultChecked initial state', () => {
    render(<Switch aria-label="sound" defaultChecked />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('marks invalid via prop', () => {
    render(<Switch aria-label="sound" invalid />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true')
  })

  it('has a displayName', () => {
    expect(Switch.displayName).toBe('Switch')
  })
})
