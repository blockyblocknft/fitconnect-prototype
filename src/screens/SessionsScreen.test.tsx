import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider } from '../nav/NavContext'
import { SessionsScreen } from './SessionsScreen'

describe('SessionsScreen', () => {
  it('lists 1-to-1 trainers, and group classes with showtimes in Group mode', async () => {
    render(<NavProvider><SessionsScreen /></NavProvider>)
    expect(screen.getByText('Aanand R.')).toBeInTheDocument()
    expect(screen.getByText('Sara M.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Group' }))
    // Group mode switches to the BookMyShow-style showtimes view.
    expect(screen.getByText('Morning HIIT · on-ground')).toBeInTheDocument()
    expect(screen.getAllByText('6:00 AM').length).toBeGreaterThan(0) // an available slot
  })

  it('filters trainers by discipline via the chip row', async () => {
    render(<NavProvider><SessionsScreen /></NavProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Mobility' }))
    expect(screen.getByText('Sara M.')).toBeInTheDocument()       // mobility
    expect(screen.queryByText('Aanand R.')).not.toBeInTheDocument() // strength/hiit
  })

  it('sorts trainers by price low to high', async () => {
    render(<NavProvider><SessionsScreen /></NavProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Sort by' }))
    await userEvent.click(screen.getByRole('button', { name: 'Price: low to high' }))
    const names = screen.getAllByText(/^(Aanand|Sara|Kiran|Meera) /).map((n) => n.textContent)
    expect(names[0]).toBe('Sara M.') // ₹450, the cheapest
  })
})
