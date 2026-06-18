import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CapacityBar } from './CapacityBar'

describe('CapacityBar', () => {
  it('shows taken/max and turns coral when nearly full', () => {
    const { rerender } = render(<CapacityBar taken={18} max={30} />)
    expect(screen.getByText('18 / 30 spots')).toBeInTheDocument()
    expect(screen.getByTestId('cap-fill')).toHaveStyle({ background: 'var(--fc-indigo)' })
    rerender(<CapacityBar taken={14} max={15} />)
    expect(screen.getByText('14 / 15 left')).toBeInTheDocument()
    expect(screen.getByTestId('cap-fill')).toHaveStyle({ background: 'var(--fc-coral)' })
  })
})
