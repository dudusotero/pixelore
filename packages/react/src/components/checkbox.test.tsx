import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './checkbox'

describe('<Checkbox>', () => {
  it('exposes role="checkbox" with proper aria-checked', () => {
    render(<Checkbox aria-label="agree" />)
    const cb = screen.getByRole('checkbox', { name: 'agree' })
    expect(cb).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles aria-checked on click', async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label="agree" />)
    const cb = screen.getByRole('checkbox')
    await user.click(cb)
    expect(cb).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles via Space key', async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label="agree" />)
    const cb = screen.getByRole('checkbox')
    cb.focus()
    await user.keyboard(' ')
    expect(cb).toHaveAttribute('aria-checked', 'true')
  })

  it('reports aria-checked="mixed" when indeterminate', () => {
    render(<Checkbox aria-label="all" checked="indeterminate" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed')
  })

  it('fires onCheckedChange with the new value', async () => {
    const onCheckedChange = vi.fn()
    const user = userEvent.setup()
    render(<Checkbox aria-label="agree" onCheckedChange={onCheckedChange} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('sets aria-invalid via the invalid prop', () => {
    render(<Checkbox aria-label="agree" invalid />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('cannot be clicked when disabled', async () => {
    const onCheckedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Checkbox aria-label="agree" disabled onCheckedChange={onCheckedChange} />,
    )
    await user.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('has a displayName', () => {
    expect(Checkbox.displayName).toBe('Checkbox')
  })
})
