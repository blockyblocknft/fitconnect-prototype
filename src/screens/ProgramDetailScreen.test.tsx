import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider } from '../nav/NavContext'
import { ProgramDetailScreen } from './ProgramDetailScreen'

describe('ProgramDetailScreen', () => {
  it('shows sessions with feedback and switches to community', async () => {
    render(<NavProvider><ProgramDetailScreen bookingId="b1" /></NavProvider>)
    expect(screen.getByText(/Great squat depth/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Community' }))
    expect(screen.getByText(/general discussion/i)).toBeInTheDocument()
  })
})
