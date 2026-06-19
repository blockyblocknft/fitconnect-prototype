import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider } from '../nav/NavContext'
import { SessionsScreen } from './SessionsScreen'

describe('SessionsScreen', () => {
  it('lists trainers in both 1-to-1 and Group modes', async () => {
    render(<NavProvider><SessionsScreen /></NavProvider>)
    expect(screen.getByText('Aanand R.')).toBeInTheDocument()
    expect(screen.getByText('Sara M.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Group' }))
    expect(screen.getByText('Aanand R.')).toBeInTheDocument()
  })

  it('filters trainers by discipline via the funnel dropdown', async () => {
    render(<NavProvider><SessionsScreen /></NavProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }))
    await userEvent.click(screen.getByRole('button', { name: 'Mobility' }))
    expect(screen.getByText('Sara M.')).toBeInTheDocument()
    expect(screen.queryByText('Aanand R.')).not.toBeInTheDocument()
  })
})
