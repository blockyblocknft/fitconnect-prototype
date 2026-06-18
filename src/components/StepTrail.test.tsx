import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StepTrail } from './StepTrail'

describe('StepTrail', () => {
  it('renders done, current, and upcoming nodes', () => {
    render(<StepTrail done={3} total={4} />)
    expect(screen.getAllByTestId('step-done')).toHaveLength(3)
    expect(screen.getAllByTestId('step-current')).toHaveLength(1)
  })
})
