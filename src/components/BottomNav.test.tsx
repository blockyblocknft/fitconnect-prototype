import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider, useNav } from '../nav/NavContext'
import { BottomNav } from './BottomNav'

function Peek() { const nav = useNav(); return <span data-testid="cur">{nav.current.name}</span> }

describe('BottomNav', () => {
  it('Log meal FAB navigates to logMeal', async () => {
    render(<NavProvider><Peek /><BottomNav /></NavProvider>)
    await userEvent.click(screen.getByRole('button', { name: /log meal/i }))
    expect(screen.getByTestId('cur').textContent).toBe('logMeal')
  })
})
