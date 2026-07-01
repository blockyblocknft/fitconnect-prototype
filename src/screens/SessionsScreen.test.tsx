import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider } from '../nav/NavContext'
import { SessionsScreen } from './SessionsScreen'

describe('SessionsScreen', () => {
  it('opens on the coach profile with 1:1 programs, and switches to group classes', async () => {
    render(<NavProvider><SessionsScreen /></NavProvider>)
    expect(screen.getByText('Aanand R.')).toBeInTheDocument()
    expect(screen.getByText('12-Week Strength Builder')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Group' }))
    expect(screen.getByText('Morning HIIT · on-ground')).toBeInTheDocument()
    expect(screen.queryByText('12-Week Strength Builder')).not.toBeInTheDocument()
  })

  it('filters 1:1 programs by Online / Outdoor delivery', async () => {
    render(<NavProvider><SessionsScreen /></NavProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Online' }))
    expect(screen.getByText('Daily mobility flow')).toBeInTheDocument()           // online
    expect(screen.queryByText('Daily morning strength')).not.toBeInTheDocument()  // outdoor only
    await userEvent.click(screen.getByRole('button', { name: 'Outdoor' }))
    expect(screen.getByText('Daily morning strength')).toBeInTheDocument()
    expect(screen.queryByText('Daily mobility flow')).not.toBeInTheDocument()
  })

  it('filters by focus', async () => {
    render(<NavProvider><SessionsScreen /></NavProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Mobility' }))
    expect(screen.getByText('Daily mobility flow')).toBeInTheDocument()
    expect(screen.queryByText('12-Week Strength Builder')).not.toBeInTheDocument()
  })
})
