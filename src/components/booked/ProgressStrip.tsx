import type { Booking } from '../../lib/types'

export function ProgressStrip({ booking }: { booking: Booking }) {
  const sessions = booking.sessions
  const attended = sessions.filter((s) => s.status === 'attended').length
  const noshow = sessions.filter((s) => s.status === 'noshow').length
  const elapsed = sessions.filter((s) => s.when === 'past').length
  const adherence = elapsed > 0 ? Math.round((attended / elapsed) * 100) : 100
  const donePct = Math.round((attended / sessions.length) * 100)

  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>
          {attended}<span style={{ color: 'var(--fc-muted)', fontWeight: 600 }}> / {sessions.length} done</span>
        </span>
        <span className="fc-tabnum" style={{ fontSize: 11, color: 'var(--fc-muted)' }}>
          {noshow > 0 && <span style={{ color: '#A32D2D' }}>{noshow} no-show · </span>}{adherence}% adherence
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'var(--fc-surface)', overflow: 'hidden' }}>
        <div style={{ width: `${donePct}%`, height: '100%', background: 'var(--fc-green)' }} />
      </div>
    </div>
  )
}
