import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider, useNav } from '../../nav/NavContext'
import { TrainerCard } from './TrainerCard'
import { trainers } from '../../data/trainers'

function Peek() { const nav = useNav(); return <span data-testid="cur">{nav.current.name}:{nav.current.params?.id}</span> }

describe('TrainerCard', () => {
  it('opens the trainer screen on click', async () => {
    render(<NavProvider><Peek /><TrainerCard trainer={trainers[0]} /></NavProvider>)
    await userEvent.click(screen.getByText('Aanand R.'))
    expect(screen.getByTestId('cur').textContent).toBe('trainer:t1')
  })
})
