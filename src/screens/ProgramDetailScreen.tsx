import { useState } from 'react'
import { getBooking } from '../data/bookings'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { SessionItem } from '../components/cards/SessionItem'

export function ProgramDetailScreen({ bookingId }: { bookingId: string }) {
  const [view, setView] = useState<'sessions' | 'community'>('sessions')
  const b = getBooking(bookingId)
  if (!b) return <div style={{ padding: 16 }}>Not found</div>
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      <SegmentedToggle options={[{ value: 'sessions', label: 'Sessions' }, { value: 'community', label: 'Community' }]}
        value={view} onChange={setView} />
      <div style={{ height: 13 }} />
      {view === 'sessions'
        ? b.sessions.map((s) => <SessionItem key={s.id} session={s} />)
        : <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 14,
            fontSize: 12, color: 'var(--fc-muted)' }}>
            Your cohort's general discussion — chat with everyone in {b.programName}.
          </div>}
    </div>
  )
}
