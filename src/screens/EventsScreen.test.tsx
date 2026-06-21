import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavProvider } from '../nav/NavContext'
import { EventsScreen } from './EventsScreen'

describe('EventsScreen', () => {
  it('renders global events with capacity', () => {
    render(<NavProvider><EventsScreen /></NavProvider>)
    expect(screen.getByText('Weekend trail run')).toBeInTheDocument()
    expect(screen.getByText('1 left')).toBeInTheDocument()
  })
})
