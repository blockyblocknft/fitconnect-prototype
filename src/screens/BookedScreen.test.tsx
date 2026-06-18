import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider, useNav } from '../nav/NavContext'
import { BookedScreen } from './BookedScreen'

function Peek() { const nav = useNav(); return <span data-testid="cur">{nav.current.name}:{nav.current.params?.id}</span> }

describe('BookedScreen', () => {
  it('shows overall progress and opens a program', async () => {
    render(<NavProvider><Peek /><BookedScreen /></NavProvider>)
    expect(screen.getByText('YOUR PROGRESS')).toBeInTheDocument()
    await userEvent.click(screen.getByText('12-Week Strength Builder'))
    expect(screen.getByTestId('cur').textContent).toBe('programDetail:b1')
  })
})
