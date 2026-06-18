import { useState } from 'react'
import type { BookedSession } from '../../lib/types'
import { Icon } from '../Icon'

export function SessionItem({ session }: { session: BookedSession }) {
  const [draft, setDraft] = useState('')
  const done = session.status === 'done'
  return (
    <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: '11px 12px', marginBottom: 11 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: done ? 'var(--fc-green)' : 'var(--fc-coral)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={done ? 'check' : 'clock'} size={13} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>Session {session.index} · {session.title}</div>
          <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{session.dateLabel}</div>
        </div>
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
      {!done && (
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
