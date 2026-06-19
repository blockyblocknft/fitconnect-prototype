import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider } from '../nav/NavContext'
import { TrainerScreen } from './TrainerScreen'

describe('TrainerScreen', () => {
  it('shows trial, programs, and events as unified offerings', () => {
    render(<NavProvider><TrainerScreen trainerId="t1" /></NavProvider>)
    expect(screen.getByText('1-day trial')).toBeInTheDocument()
    expect(screen.getByText('12-Week Strength Builder')).toBeInTheDocument()
    expect(screen.getByText('Strength bootcamp')).toBeInTheDocument()
  })

  it('filters offerings by type', async () => {
    render(<NavProvider><TrainerScreen trainerId="t1" /></NavProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Trial' }))
    expect(screen.getByText('1-day trial')).toBeInTheDocument()
    expect(screen.queryByText('12-Week Strength Builder')).not.toBeInTheDocument()
    expect(screen.queryByText('Strength bootcamp')).not.toBeInTheDocument()
  })
})
