import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider, useNav } from './NavContext'

function Probe() {
  const nav = useNav()
  return (
    <div>
      <span data-testid="top">{nav.current.name}</span>
      <span data-testid="tab">{nav.activeTab}</span>
      <button onClick={() => nav.push({ name: 'trainer', params: { id: 't1' } })}>go</button>
      <button onClick={() => nav.pop()}>back</button>
      <button onClick={() => nav.setTab('events')}>events</button>
    </div>
  )
}

describe('NavContext', () => {
  it('pushes and pops the screen stack', async () => {
    render(<NavProvider><Probe /></NavProvider>)
    expect(screen.getByTestId('top').textContent).toBe('sessions')
    await userEvent.click(screen.getByText('go'))
    expect(screen.getByTestId('top').textContent).toBe('trainer')
    await userEvent.click(screen.getByText('back'))
    expect(screen.getByTestId('top').textContent).toBe('sessions')
  })

  it('switches active tab and resets the stack to that tab root', async () => {
    render(<NavProvider><Probe /></NavProvider>)
    await userEvent.click(screen.getByText('go'))
    await userEvent.click(screen.getByText('events'))
    expect(screen.getByTestId('tab').textContent).toBe('events')
    expect(screen.getByTestId('top').textContent).toBe('events')
  })
})
