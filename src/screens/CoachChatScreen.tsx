import { useEffect, useRef, useState } from 'react'
import { trainers } from '../data/trainers'
import { clients } from '../data/clients'
import { messagesFor, sendMessage } from '../data/messages'
import { Icon } from '../components/Icon'

// Client-side view of the same coach↔client thread the trainer sees. The
// signed-in client is the live one (Prabu); their messages sit on the right.
const ME = clients.find((c) => c.live)?.id ?? clients[0].id

export function CoachChatScreen() {
  const [draft, setDraft] = useState('')
  const [, force] = useState(0)
  const endRef = useRef<HTMLDivElement>(null)
  const coach = trainers[0]
  const thread = messagesFor(ME)

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [thread.length])

  const send = () => {
    const t = draft.trim(); if (!t) return
    sendMessage(ME, t, 'client'); setDraft(''); force((n) => n + 1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--fc-surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', background: '#fff', borderBottom: '0.5px solid rgba(20,20,43,0.10)' }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--fc-coral)', color: '#fff', flex: '0 0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>AR</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>{coach.name}</div>
          <div style={{ fontSize: 10.5, color: 'var(--fc-muted)' }}>Your coach</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 13 }}>
        {thread.map((m) => {
          const mine = m.from === 'client'
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
              <div style={{ maxWidth: '78%' }}>
                <div style={{ fontSize: 12.5, lineHeight: 1.45, padding: '8px 12px', borderRadius: 14,
                  background: mine ? 'var(--fc-indigo)' : '#fff', color: mine ? '#fff' : 'var(--fc-ink)',
                  border: mine ? 'none' : '0.5px solid rgba(20,20,43,0.12)',
                  borderBottomRightRadius: mine ? 4 : 14, borderBottomLeftRadius: mine ? 14 : 4 }}>{m.text}</div>
                <div style={{ fontSize: 8.5, color: 'var(--fc-muted)', textAlign: mine ? 'right' : 'left', marginTop: 2 }}>
                  {m.from === 'coach' ? `${coach.name.split(' ')[0]} · ` : ''}{m.time}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 13px', background: '#fff', borderTop: '0.5px solid rgba(20,20,43,0.10)' }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          placeholder="Message your coach…"
          style={{ flex: 1, border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 999, padding: '10px 14px', fontSize: 12.5, fontFamily: 'var(--fc-font-body)', outline: 'none' }} />
        <button onClick={send} aria-label="Send" style={{ background: 'var(--fc-indigo)', border: 'none', borderRadius: '50%', width: 38, height: 38, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="send" size={16} color="#fff" />
        </button>
      </div>
    </div>
  )
}
