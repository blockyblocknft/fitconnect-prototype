import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CalorieRing } from './CalorieRing'

describe('CalorieRing', () => {
  it('shows eaten and goal', () => {
    render(<CalorieRing eaten={320} goal={500} />)
    expect(screen.getByText('320')).toBeInTheDocument()
    expect(screen.getByText('/ 500 cal')).toBeInTheDocument()
  })
})
