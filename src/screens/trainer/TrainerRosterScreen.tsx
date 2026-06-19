import { useState } from 'react'
import { getTrainerSession, type Attendance } from '../../data/trainerView'
import { AUDIT } from '../../data/auditNotes'
import { AuditButton } from '../../components/AuditButton'
import { Icon } from '../../components/Icon'

export function TrainerRosterScreen({ sessionId }: { sessionId: string }) {
  const session = getTrainerSession(sessionId)
  const [marks, setMarks] = useState<Record<string, Attendance>>(
    () => Object.fromEntries((session?.clients ?? []).map((c) => [c.id, c.attendance])),
  )
  if (!session) return <div style={{ padding: 16 }}>Session not found</div>

  const open = session.capacity - session.clients.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--fc-surface)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 13 }}>
        <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>{session.title}</div>
              <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name={session.mode === 'online' ? 'video' : 'map-pin'} size={12} color="var(--fc-muted)" />{session.time} · {session.place}
              </div>
            </div>
            <AuditButton note={AUDIT.attendance} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 9 }}>
            <b style={{ color: 'var(--fc-ink)' }}>{session.clients.length}</b> booked · <b style={{ color: 'var(--fc-ink)' }}>{open}</b> open
          </div>
        </div>

        <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 9 }}>ROSTER</div>
        {session.clients.map((c) => {
          const mark = marks[c.id]
          const set = (a: Attendance) => setMarks((m) => ({ ...m, [c.id]: a }))
          const pill = (a: Attendance, label: string, on: string) => (
            <button onClick={() => set(a)} style={{ border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 600,
              background: mark === a ? on : 'var(--fc-surface)', color: mark === a ? '#fff' : 'var(--fc-muted)' }}>{label}</button>
          )
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#fff',
              border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '9px 11px', marginBottom: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }}>{c.initials}</div>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{c.name}</div>
              {pill('attended', 'Attended', 'var(--fc-green)')}
              {pill('noshow', 'No-show', '#E24B4A')}
            </div>
          )
        })}
      </div>

      <div style={{ padding: '10px 13px', background: '#fff', borderTop: '0.5px solid rgba(20,20,43,0.10)' }}>
        <button style={{ width: '100%', background: 'var(--fc-indigo)', color: '#fff', border: 'none', borderRadius: 13,
          padding: 13, fontSize: 14, fontWeight: 600 }}>Mark session completed</button>
      </div>
    </div>
  )
}
