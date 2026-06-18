import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider } from '../nav/NavContext'
import { SessionsScreen } from './SessionsScreen'

describe('SessionsScreen', () => {
  it('lists trainers and shows group spots when toggled to Group', async () => {
    render(<NavProvider><SessionsScreen /></NavProvider>)
    expect(screen.getByText('Aanand R.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Group' }))
    expect(screen.getByText(/Morning HIIT/)).toBeInTheDocument()
  })
})
