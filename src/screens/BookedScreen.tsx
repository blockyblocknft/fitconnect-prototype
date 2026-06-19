import { bookings } from '../data/bookings'
import { useNav } from '../nav/NavContext'
import { Icon } from '../components/Icon'
import type { BookedSession } from '../lib/types'

const SEG: Record<BookedSession['status'], string> = {
  confirmed: 'var(--fc-indigo-tint)',
  attended: 'var(--fc-green)',
  noshow: '#E24B4A',
  cancelled: 'var(--fc-muted)',
}

const BOOKING_STATUS = {
  awaiting: { label: 'Awaiting confirmation', bg: '#FAEEDA', fg: '#854F0B' },
  confirmed: { label: 'Confirmed', bg: '#E4F3EA', fg: 'var(--fc-rating-green)' },
  cancelled: { label: 'Cancelled', bg: '#FCEBEB', fg: '#A32D2D' },
} as const

export function BookedScreen() {
  const nav = useNav()
  const openProgram = (id: string) => nav.push({ name: 'programDetail', params: { id } })
  const openSession = (id: string, sessionId: string) => nav.push({ name: 'programDetail', params: { id, sessionId } })

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)' }}>YOUR PROGRAMS</span>
        <button onClick={() => nav.push({ name: 'history' })}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none',
            color: 'var(--fc-indigo)', fontSize: 11, fontWeight: 600 }}>
          <Icon name="history" size={13} color="var(--fc-indigo)" /> History
        </button>
      </div>
      {bookings.map((b) => {
        const current = b.sessions.find((s) => s.when === 'today') ?? b.sessions.find((s) => s.status === 'confirmed')
        return (
          <div key={b.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16,
            padding: 13, marginBottom: 11 }}>
            <div role="button" tabIndex={0}
              onClick={() => openProgram(b.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProgram(b.id) } }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                  <span className="fc-display" style={{ fontSize: 14, fontWeight: 600 }}>{b.programName}</span>
                  <span style={{ fontSize: 9, fontWeight: 600, color: BOOKING_STATUS[b.status].fg,
                    background: BOOKING_STATUS[b.status].bg, padding: '2px 8px', borderRadius: 999 }}>{BOOKING_STATUS[b.status].label}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 1 }}>with {b.trainerName}</div>
              </div>
              <Icon name="chevron-right" size={18} color="#C4C4CF" />
            </div>

            <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', marginTop: 12 }}>
              {b.sessions.map((s) => (
                <button key={s.id} aria-label={`Session ${s.index} · ${s.status}`} title={`Session ${s.index} · ${s.title}`}
                  onClick={() => openSession(b.id, s.id)}
                  style={{ flex: 1, height: s.when === 'today' ? 11 : 6, borderRadius: 3, border: 'none',
                    background: SEG[s.status], cursor: 'pointer', padding: 0 }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 7 }}>
              {current
                ? <><span style={{ color: 'var(--fc-indigo)', fontWeight: 600 }}>● {current.when === 'today' ? 'Now' : 'Next'}</span> Session {current.index} · {current.title}</>
                : 'All sessions complete'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
