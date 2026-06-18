import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavProvider } from '../nav/NavContext'
import { LogMealScreen } from './LogMealScreen'

describe('LogMealScreen', () => {
  it('shows calorie goal, macros, and trackers', () => {
    render(<NavProvider><LogMealScreen /></NavProvider>)
    expect(screen.getByText('/ 500 cal')).toBeInTheDocument()
    expect(screen.getByText('Protein')).toBeInTheDocument()
    expect(screen.getByText('Water')).toBeInTheDocument()
  })
})
