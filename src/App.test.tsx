import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App end-to-end Sessions→Booked', () => {
  it('navigates from browse to a booked program', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('Aanand R.'))           // trainer
    await userEvent.click(screen.getAllByRole('button', { name: 'BOOK' })[0]) // checkout
    await userEvent.click(screen.getByRole('button', { name: /Pay advance/ })) // confirm
    await userEvent.click(screen.getByRole('button', { name: 'Go to Booked' }))
    expect(screen.getByText('YOUR PROGRESS')).toBeInTheDocument()
  })

  it('reaches Log Meal from the bottom nav FAB', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /log meal/i }))
    expect(screen.getByText('/ 500 cal')).toBeInTheDocument()
  })
})
