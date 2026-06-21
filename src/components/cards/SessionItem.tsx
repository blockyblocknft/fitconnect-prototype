import { useState } from 'react'
import type { BookedSession, Discipline } from '../../lib/types'
import { SESSION_STATUS } from '../../lib/sessionStatus'
import { WORKOUTS } from '../../data/workouts'
import { WorkoutPlan } from '../WorkoutPlan'
import { Icon } from '../Icon'

export function SessionItem({ session, discipline, onReschedule }: { session: BookedSession; discipline: Discipline; onReschedule?: () => void }) {
  const [draft, setDraft] = useState('')
  const [rating, setRating] = useState(0)
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const s = SESSION_STATUS[session.status]
  const askable = session.status === 'confirmed'
  const w = WORKOUTS[discipline]
  return (
    <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: '11px 12px', marginBottom: 11 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: s.dot,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={s.icon} size={13} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>Session {session.index} · {session.title}</div>
          <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{session.date} · {session.time}</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, color: s.fg }}>{s.label}</span>
      </div>
      {/* Session plan — workout breakdown for this category */}
      <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
        <button onClick={() => setShowPlan((v) => !v)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 7, background: 'var(--fc-surface)', border: 'none',
            padding: '8px 10px', cursor: 'pointer', textAlign: 'left' }}>
          <Icon name="barbell" size={14} color="var(--fc-indigo)" />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600 }}>Session plan</span>
            <span style={{ display: 'block', fontSize: 9.5, color: 'var(--fc-muted)' }}>{w.focus}</span>
          </span>
          <Icon name={showPlan ? 'chevron-down' : 'chevron-right'} size={15} color="var(--fc-muted)" />
        </button>
        {showPlan && <div style={{ padding: '9px 11px' }}><WorkoutPlan discipline={discipline} /></div>}
      </div>
      {onReschedule && (
        <button onClick={onReschedule}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--fc-surface)', border: 'none',
            borderRadius: 8, padding: '5px 9px', fontSize: 11, fontWeight: 600, color: 'var(--fc-indigo)', marginBottom: 7 }}>
          <Icon name="calendar" size={13} color="var(--fc-indigo)" /> Reschedule
        </button>
      )}
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
      {session.status === 'attended' && (
        sent ? (
          <div style={{ background: '#F0FAF4', borderRadius: 10, padding: '7px 10px', marginTop: 7, fontSize: 11,
            color: 'var(--fc-rating-green)', fontWeight: 600 }}>Thanks — your rating was sent.</div>
        ) : (
          <div style={{ background: 'var(--fc-surface)', borderRadius: 10, padding: '8px 10px', marginTop: 7 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 5 }}>Rate this session</div>
            <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} aria-label={`${n} star`} onClick={() => setRating(n)}
                  style={{ background: 'transparent', border: 'none', padding: 0, lineHeight: 0 }}>
                  <Icon name="star" size={18} color={n <= rating ? '#EF9F27' : '#D3D1C7'} />
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note (optional)…"
                style={{ flex: 1, border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 8, padding: '6px 9px',
                  fontSize: 11, outline: 'none', background: '#fff' }} />
              <button onClick={() => rating > 0 && setSent(true)} disabled={rating === 0}
                style={{ background: rating > 0 ? 'var(--fc-indigo)' : 'rgba(90,74,227,0.4)', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 600 }}>Submit</button>
            </div>
          </div>
        )
      )}
    </div>
  )
}
