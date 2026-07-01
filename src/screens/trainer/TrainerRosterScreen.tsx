import { useState } from 'react'
import { getTrainerSession, addClientToSession, type Attendance } from '../../data/trainerView'
import { markClientAttendance } from '../../data/clients'
import { BookClientModal } from '../../components/trainer/BookClientModal'
import { Icon } from '../../components/Icon'

export function TrainerRosterScreen({ sessionId }: { sessionId: string }) {
  const session = getTrainerSession(sessionId)
  const [marks, setMarks] = useState<Record<string, Attendance>>(
    () => Object.fromEntries((session?.clients ?? []).map((c) => [c.id, c.attendance])),
  )
  const [showBook, setShowBook] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [, force] = useState(0)
  if (!session) return <div style={{ padding: 16 }}>Session not found</div>

  const open = session.capacity - session.clients.length

  const markAll = () => {
    setMarks((m) => {
      const n = { ...m }
      session.clients.forEach((c) => { n[c.id] = 'attended'; c.attendance = 'attended'; markClientAttendance(c.name, session.title, 'attended') })
      return n
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--fc-surface)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 13 }}>
        <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 12 }}>
          <div>
            <div className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>{session.title}</div>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name={session.mode === 'online' ? 'video' : 'map-pin'} size={12} color="var(--fc-muted)" />{session.time} · {session.place}
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 9 }}>
            <b style={{ color: 'var(--fc-ink)' }}>{session.clients.length}</b> booked · <b style={{ color: 'var(--fc-ink)' }}>{open}</b> open
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
          <span className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)' }}>ROSTER</span>
          <div style={{ display: 'flex', gap: 7 }}>
            <button onClick={markAll}
              style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', borderRadius: 8, padding: '5px 9px',
                fontSize: 11, fontWeight: 600, background: 'var(--fc-green)', color: '#fff' }}>
              <Icon name="checks" size={13} color="#fff" /> All present
            </button>
            <button onClick={() => setShowBook(true)} disabled={open <= 0}
              style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', borderRadius: 8, padding: '5px 9px',
                fontSize: 11, fontWeight: 600, background: open > 0 ? 'var(--fc-indigo-tint)' : 'var(--fc-surface)',
                color: open > 0 ? 'var(--fc-indigo)' : '#B5B5BE' }}>
              <Icon name="plus" size={13} color={open > 0 ? 'var(--fc-indigo)' : '#B5B5BE'} /> Book
            </button>
          </div>
        </div>

        {session.clients.map((c) => {
          const mark = marks[c.id]
          const set = (a: Attendance) => {
            setMarks((m) => ({ ...m, [c.id]: a }))
            c.attendance = a // persist on the session roster (Today reads this)
            if (a === 'attended' || a === 'noshow') markClientAttendance(c.name, session.title, a)
          }
          const cycle = () => set(mark === 'attended' ? 'noshow' : mark === 'noshow' ? 'confirmed' : 'attended')
          const pill = (a: Attendance, label: string, on: string) => (
            <button onClick={() => set(a)} style={{ border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 600,
              background: mark === a ? on : 'var(--fc-surface)', color: mark === a ? '#fff' : 'var(--fc-muted)' }}>{label}</button>
          )
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#fff',
              border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '9px 11px', marginBottom: 8 }}>
              <div role="button" tabIndex={0} onClick={cycle} onKeyDown={(e) => { if (e.key === 'Enter') cycle() }}
                style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, minWidth: 0, cursor: 'pointer' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', flex: '0 0 auto',
                  background: mark === 'attended' ? 'var(--fc-green)' : mark === 'noshow' ? '#E24B4A' : 'var(--fc-indigo-tint)',
                  color: mark === 'confirmed' ? 'var(--fc-indigo)' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }}>{c.initials}</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
              </div>
              {pill('attended', 'Attended', 'var(--fc-green)')}
              {pill('noshow', 'No-show', '#E24B4A')}
            </div>
          )
        })}
      </div>

      <div style={{ padding: '10px 13px', background: '#fff', borderTop: '0.5px solid rgba(20,20,43,0.10)' }}>
        <button onClick={() => setCompleted(true)} disabled={completed}
          style={{ width: '100%', background: completed ? 'var(--fc-surface)' : 'var(--fc-indigo)', color: completed ? 'var(--fc-green)' : '#fff',
            border: 'none', borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {completed && <Icon name="circle-check" size={17} color="var(--fc-green)" />}
          {completed ? 'Session completed' : 'Mark session completed'}
        </button>
      </div>

      {showBook && (
        <BookClientModal excludeNames={session.clients.map((c) => c.name)}
          onClose={() => setShowBook(false)}
          onPick={(c) => { addClientToSession(session.id, c); setMarks((m) => ({ ...m, [c.id]: 'confirmed' })); setShowBook(false); force((n) => n + 1) }} />
      )}
    </div>
  )
}
