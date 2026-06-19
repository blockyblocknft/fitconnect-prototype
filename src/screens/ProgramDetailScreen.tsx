import { useEffect, useState } from 'react'
import { getBooking, cancelBooking } from '../data/bookings'
import { useNav } from '../nav/NavContext'
import type { BookedSession } from '../lib/types'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { SessionItem } from '../components/cards/SessionItem'
import { Icon } from '../components/Icon'

const DISCUSSION = [
  { who: 'Aanand R.', role: 'coach', text: 'Welcome to the cohort 💪 Drop your week-3 wins here!' },
  { who: 'Priya', role: 'member', text: 'Hit a 60kg squat today, thanks coach!' },
  { who: 'Rahul', role: 'member', text: 'Anyone training tomorrow 6pm? Let’s buddy up.' },
]

const WHEN_BORDER: Record<BookedSession['when'], string> = {
  past: 'rgba(20,20,43,0.18)', today: 'var(--fc-green)', future: '#E24B4A',
}
const TAG: Record<BookedSession['status'], { label: string; bg: string; fg: string }> = {
  attended: { label: 'Attended', bg: '#E4F3EA', fg: 'var(--fc-rating-green)' },
  missed: { label: 'Missed', bg: '#FCEBEB', fg: '#A32D2D' },
  inprogress: { label: 'In progress', bg: '#FAEEDA', fg: '#854F0B' },
  upcoming: { label: 'Upcoming', bg: 'var(--fc-indigo-tint)', fg: 'var(--fc-indigo)' },
}

function ScheduleChip({ s }: { s: BookedSession }) {
  const disabled = s.when === 'past'
  const tag = TAG[s.status]
  return (
    <div style={{ border: `1.5px solid ${WHEN_BORDER[s.when]}`, borderRadius: 8, padding: '6px 4px', textAlign: 'center',
      background: disabled ? 'var(--fc-surface)' : '#fff', opacity: disabled ? 0.5 : 1 }}>
      <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.15 }}>{s.time}</div>
      <div style={{ fontSize: 9, color: 'var(--fc-muted)' }}>{s.date}</div>
      <div style={{ fontSize: 8.5, fontWeight: 600, color: tag.fg, marginTop: 2 }}>{tag.label}</div>
    </div>
  )
}

export function ProgramDetailScreen({ bookingId, focusSessionId }: { bookingId: string; focusSessionId?: string }) {
  const nav = useNav()
  const [view, setView] = useState<'qa' | 'community'>('qa')
  const [, force] = useState(0)
  const b = getBooking(bookingId)

  useEffect(() => {
    if (focusSessionId) document.getElementById(`sess-${focusSessionId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [focusSessionId])

  if (!b) return <div style={{ padding: 16 }}>Not found</div>

  const cancelled = b.status === 'cancelled'
  const onCancel = () => {
    if (window.confirm('Cancel this booking? Free before the 24h cutoff; your advance is refunded.')) {
      cancelBooking(b.id)
      force((n) => n + 1)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--fc-surface)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 13 }}>
        {b.status === 'awaiting' && (
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', background: '#FAEEDA', borderRadius: 10,
            padding: '9px 11px', marginBottom: 12 }}>
            <Icon name="clock" size={14} color="#854F0B" />
            <div style={{ fontSize: 11, color: '#854F0B' }}>Awaiting {b.trainerName}’s confirmation — advance held.</div>
          </div>
        )}
        {cancelled && (
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', background: '#FCEBEB', borderRadius: 10,
            padding: '9px 11px', marginBottom: 12 }}>
            <Icon name="x" size={14} color="#A32D2D" />
            <div style={{ fontSize: 11, color: '#A32D2D' }}>Booking cancelled — advance refunded.</div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
          <span className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)' }}>SESSIONS</span>
          <span style={{ fontSize: 10, color: 'var(--fc-muted)', display: 'flex', gap: 9 }}>
            <span style={{ color: 'var(--fc-rating-green)' }}>● today</span>
            <span style={{ color: '#E24B4A' }}>● future</span>
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginBottom: 14 }}>
          {b.sessions.map((s) => <ScheduleChip key={s.id} s={s} />)}
        </div>

        <SegmentedToggle options={[{ value: 'qa', label: 'Q/A' }, { value: 'community', label: 'Community' }]}
          value={view} onChange={setView} />
        <div style={{ height: 13 }} />

        {view === 'qa'
          ? b.sessions.map((s) => (
              <div key={s.id} id={`sess-${s.id}`}
                style={focusSessionId === s.id ? { outline: '2px solid var(--fc-indigo)', borderRadius: 14 } : undefined}>
                <SessionItem session={s} />
              </div>
            ))
          : (
            <>
              <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 10 }}>
                Cohort general discussion — everyone in {b.programName}.
              </div>
              {DISCUSSION.map((m, i) => (
                <div key={i} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12,
                  padding: '9px 11px', marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600,
                    color: m.role === 'coach' ? 'var(--fc-indigo)' : 'var(--fc-ink)' }}>
                    {m.who}{m.role === 'coach' ? ' · coach' : ''}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 2 }}>{m.text}</div>
                </div>
              ))}
            </>
          )}
      </div>

      <div style={{ padding: '10px 13px', background: '#fff', borderTop: '0.5px solid rgba(20,20,43,0.10)' }}>
        {cancelled ? (
          <button onClick={() => nav.pop()}
            style={{ width: '100%', background: 'var(--fc-surface)', color: 'var(--fc-muted)', border: 'none',
              borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>Back to Booked</button>
        ) : (
          <>
            <a href={b.meetLink} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none',
                background: 'var(--fc-indigo)', color: '#fff', borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>
              <Icon name="video" size={18} color="#fff" /> Join on Google Meet
            </a>
            <button onClick={onCancel}
              style={{ width: '100%', background: 'transparent', color: '#A32D2D', border: 'none', marginTop: 7,
                fontSize: 12, fontWeight: 600 }}>Cancel booking · free before cutoff</button>
          </>
        )}
      </div>
    </div>
  )
}
