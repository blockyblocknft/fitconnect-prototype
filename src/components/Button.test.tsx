import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders label and fires onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Book session</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Book session' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
