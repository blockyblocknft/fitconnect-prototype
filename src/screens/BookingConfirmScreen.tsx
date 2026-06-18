import { useNav } from '../nav/NavContext'
import { Icon } from '../components/Icon'
import { Button } from '../components/Button'

export function BookingConfirmScreen() {
  const nav = useNav()
  return (
    <div style={{ padding: 24, background: 'var(--fc-surface)', flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--fc-green)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="check" size={34} color="#fff" />
      </div>
      <div className="fc-display" style={{ fontSize: 18, fontWeight: 700 }}>You're booked!</div>
      <div style={{ fontSize: 13, color: 'var(--fc-muted)' }}>Advance paid. Find this program under Booked.</div>
      <Button onClick={() => nav.setTab('booked')}>Go to Booked</Button>
    </div>
  )
}
