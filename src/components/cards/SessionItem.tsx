import { useState } from 'react'
import type { BookedSession } from '../../lib/types'
import { Icon } from '../Icon'

const STATUS = {
  attended: { bg: 'var(--fc-green)', icon: 'check', label: 'Attended', color: 'var(--fc-rating-green)' },
  missed: { bg: '#E24B4A', icon: 'x', label: 'Missed', color: '#A32D2D' },
  inprogress: { bg: '#EF9F27', icon: 'player-play', label: 'In progress', color: '#854F0B' },
  upcoming: { bg: 'var(--fc-coral)', icon: 'clock', label: 'Upcoming', color: 'var(--fc-coral)' },
} as const

export function SessionItem({ session }: { session: BookedSession }) {
  const [draft, setDraft] = useState('')
  const s = STATUS[session.status]
  const askable = session.status === 'upcoming' || session.status === 'inprogress'
  return (
    <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: '11px 12px', marginBottom: 11 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: s.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={s.icon} size={13} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>Session {session.index} · {session.title}</div>
          <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{session.date} · {session.time}</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, color: s.color }}>{s.label}</span>
      </div>
      {session.feedback && (
        <div style={{ background: '#F0FAF4', borderRadius: 10, padding: '8px 10px', marginBottom: 7 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fc-rating-green)', marginBottom: 2,
            display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="message-dots" size={11} color="var(--fc-rating-green)" />Coach feedback</div>
          <div style={{ fontSize: 11 }}>{session.feedback}</div>
        </div>
      )}
      {session.qa.map((q, i) => (
        <div key={i} style={{ fontSize: 11, color: q.author === 'coach' ? 'var(--fc-indigo)' : 'var(--fc-ink)' }}>
          <b style={{ fontWeight: 600 }}>{q.author === 'coach' ? 'Coach' : 'You'}:</b> {q.text}
        </div>
      ))}
      {askable && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--fc-surface)', borderRadius: 10,
          padding: '7px 10px', marginTop: 6 }}>
          <Icon name="help-circle" size={15} color="var(--fc-muted)" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask a question for this session…"
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 11, outline: 'none' }} />
          <button aria-label="Send" onClick={() => setDraft('')} style={{ background: 'transparent', border: 'none' }}>
            <Icon name="send" size={15} color="var(--fc-indigo)" />
          </button>
        </div>
      )}
    </div>
  )
}
