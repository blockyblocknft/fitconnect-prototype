import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App end-to-end Sessions→Booked', () => {
  it('navigates from browse to a booked program', async () => {
    render(<App />)
    // App now lands on the Book-sessions browse screen by default.
    await userEvent.click(screen.getByText('Aanand R.'))           // trainer
    await userEvent.click(screen.getByRole('button', { name: 'Book 12-Week Strength Builder' })) // checkout
    await userEvent.click(screen.getAllByRole('button', { name: /^\d{1,2}:\d{2} (AM|PM)$/ })[0]) // pick a free slot
    await userEvent.click(screen.getByRole('button', { name: /Pay advance/ })) // confirm
    await userEvent.click(screen.getByRole('button', { name: 'Go to Booked' }))
    expect(screen.getByText('YOUR PROGRAMS')).toBeInTheDocument()
  })

  it('reaches Log Meal from the bottom nav FAB', async () => {
    render(<App />)
    const logButtons = screen.getAllByRole('button', { name: 'Log meal' }) // the bottom FAB
    await userEvent.click(logButtons[logButtons.length - 1])
    expect(screen.getByText('/ 500 cal')).toBeInTheDocument()
  })
})
