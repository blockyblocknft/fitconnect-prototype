import type { Booking, BookedSession } from '../../lib/types'
import { Icon } from '../Icon'

// Pick the one session that matters right now: the live one, else the next
// upcoming, else the most recent attended (to rate). Null when nothing's pending.
export function focalSession(b: Booking): BookedSession | null {
  return b.sessions.find((s) => s.when === 'today')
    ?? b.sessions.find((s) => s.when === 'future' && s.status === 'confirmed')
    ?? [...b.sessions].reverse().find((s) => s.status === 'attended')
    ?? null
}

export function NextUpHero(
  { booking, session, onJoin, onReschedule }:
  { booking: Booking; session: BookedSession | null; onJoin: () => void; onReschedule: () => void },
) {
  if (!session) {
    return (
      <div style={{ background: 'var(--fc-indigo-tint)', borderRadius: 16, padding: 14, marginBottom: 13 }}>
        <div className="fc-display" style={{ fontSize: 13, fontWeight: 700, color: 'var(--fc-indigo)' }}>Program complete 🎉</div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 3 }}>Every session is done — nice work.</div>
      </div>
    )
  }

  const awaiting = booking.status === 'awaiting'
  const live = session.when === 'today'
  const tag = awaiting ? 'AWAITING' : live ? 'LIVE TODAY' : session.when === 'future' ? 'UP NEXT' : 'LAST SESSION'

  return (
    <div style={{ background: 'linear-gradient(135deg, var(--fc-indigo) 0%, #6E5CF0 100%)', borderRadius: 16,
      padding: 14, marginBottom: 13, color: '#fff' }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, opacity: 0.85 }}>{tag}</div>
      <div className="fc-display" style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>
        Session {session.index} · {session.title}
      </div>
      <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Icon name="calendar" size={13} color="#fff" />{session.date} · {session.time}
      </div>

      {awaiting ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.18)', borderRadius: 10,
          padding: '9px 11px', marginTop: 12, fontSize: 12, fontWeight: 600 }}>
          <Icon name="clock" size={14} color="#fff" /> Awaiting {booking.trainerName}’s confirmation
        </div>
      ) : live ? (
        <button onClick={onJoin}
          style={{ width: '100%', marginTop: 12, background: '#fff', color: 'var(--fc-indigo)', border: 'none',
            borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8 }}>
          <Icon name="video" size={18} color="var(--fc-indigo)" /> Join on Google Meet
        </button>
      ) : session.when === 'future' ? (
        <button onClick={onReschedule}
          style={{ width: '100%', marginTop: 12, background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: 12, padding: 11, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 7 }}>
          <Icon name="calendar" size={16} color="#fff" /> Reschedule this session
        </button>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 10, padding: '9px 11px', marginTop: 12,
          fontSize: 12, fontWeight: 600 }}>Rate it below to help your coach 👇</div>
      )}
    </div>
  )
}
