import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavProvider } from '../nav/NavContext'
import { TrainerScreen } from './TrainerScreen'

describe('TrainerScreen', () => {
  it('shows the trial, programs, and trainer events', () => {
    render(<NavProvider><TrainerScreen trainerId="t1" /></NavProvider>)
    expect(screen.getByText('1-day trial')).toBeInTheDocument()
    expect(screen.getByText('12-Week Strength Builder')).toBeInTheDocument()
    expect(screen.getByText(/Events by Aanand/)).toBeInTheDocument()
    expect(screen.getByText('Strength bootcamp')).toBeInTheDocument()
  })
})
