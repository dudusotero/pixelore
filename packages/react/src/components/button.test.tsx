import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('<Button>', () => {
  it('renders as a real <button> by default', () => {
    render(<Button>Click</Button>)
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument()
  })

  it('forwards the ref to the underlying button', () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<Button ref={ref}>Click</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('fires onClick on keyboard activation (Enter and Space)', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={onClick}>Press</Button>)
    const btn = screen.getByRole('button')
    btn.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('sets aria-busy when loading', () => {
    render(<Button loading>Saving</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('disables the button while loading and prevents clicks', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    )
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    await user.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('exposes a loading status to screen readers', () => {
    render(<Button loading>Saving</Button>)
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })

  it('respects asChild — renders the child element instead of a button', () => {
    render(
      <Button asChild>
        <a href="/docs">Read</a>
      </Button>,
    )
    expect(screen.getByRole('link', { name: 'Read' })).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('applies the chosen variant class', () => {
    render(<Button variant="danger">Boom</Button>)
    expect(screen.getByRole('button').className).toContain('bg-po-danger')
  })

  it('has a displayName for devtools', () => {
    expect(Button.displayName).toBe('Button')
  })
})
