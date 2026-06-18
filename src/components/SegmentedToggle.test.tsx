import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentedToggle } from './SegmentedToggle'

describe('SegmentedToggle', () => {
  it('marks the active option and fires onChange', async () => {
    const onChange = vi.fn()
    render(<SegmentedToggle options={[{ value: '1to1', label: '1-to-1' }, { value: 'group', label: 'Group' }]}
      value="1to1" onChange={onChange} />)
    expect(screen.getByRole('button', { name: '1-to-1' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'Group' }))
    expect(onChange).toHaveBeenCalledWith('group')
  })
})
