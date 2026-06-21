import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider, useNav } from '../nav/NavContext'
import { CheckoutScreen } from './CheckoutScreen'

function Peek() { const nav = useNav(); return <span data-testid="cur">{nav.current.name}</span> }

describe('CheckoutScreen', () => {
  it('shows the 25% advance for program p1 and confirms on pay', async () => {
    render(<NavProvider><Peek /><CheckoutScreen programId="p1" /></NavProvider>)
    expect(screen.getByText('36 live coached sessions')).toBeInTheDocument()
    // Booking is slot-gated: pick a free slot before the advance can be paid.
    await userEvent.click(screen.getAllByRole('button', { name: /^\d{1,2}:\d{2} (AM|PM)$/ })[0])
    expect(screen.getByText('Pay advance ₹1,800')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Pay advance/ }))
    expect(screen.getByTestId('cur').textContent).toBe('bookingConfirm')
  })
})
