import { useState } from 'react'
import type { TrainerSession } from '../../data/trainerView'
import { Icon } from '../Icon'

const inputStyle: React.CSSProperties = {
  width: '100%', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '8px 10px',
  fontSize: 12, fontFamily: 'var(--fc-font-body)', outline: 'none',
}
const num = (v: string, min: number) => Math.max(min, Math.round(Number(v) || min))

export function SessionFormModal(
  { onClose, onSave, session }: { onClose: () => void; onSave: (s: TrainerSession) => void; session?: TrainerSession },
) {
  const editing = !!session
  const booked = session?.clients.length ?? 0
  const [title, setTitle] = useState(session?.title ?? '')
  const [time, setTime] = useState(session?.time ?? 'Tomorrow · 6:00 AM')
  const [mode, setMode] = useState<'online' | 'inperson'>(session?.mode ?? 'inperson')
  const [place, setPlace] = useState(session?.place ?? '')
  const [capacity, setCapacity] = useState(String(session?.capacity ?? 10))

  // Capacity can never drop below the number of clients already booked.
  const minCap = Math.max(1, booked)

  const save = () => {
    if (!title.trim()) return
    onSave({
      id: session?.id ?? `ts-${Date.now()}`, title: title.trim(), time, today: time.startsWith('Today'),
      mode, place: place.trim() || (mode === 'online' ? 'Google Meet' : 'TBD'),
      capacity: num(capacity, minCap), clients: session?.clients ?? [],
    })
  }

  const field = (label: string, node: React.ReactNode) => (
    <div style={{ marginBottom: 9 }}>
      <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 3 }}>{label}</div>{node}
    </div>
  )

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,43,0.45)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18,
        padding: 16, width: '100%', maxHeight: '92%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>{editing ? 'Edit session' : 'Create session'}</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}>
            <Icon name="x" size={18} color="var(--fc-muted)" />
          </button>
        </div>

        {field('Title', <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Evening HIIT" style={inputStyle} />)}
        {field('When', <input value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />)}
        {field('Mode', (
          <div style={{ display: 'flex', gap: 8 }}>
            {(['inperson', 'online'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                style={{ flex: 1, border: 'none', borderRadius: 9, padding: '8px 0', fontSize: 12, fontWeight: 600,
                  background: mode === m ? 'var(--fc-indigo)' : 'var(--fc-surface)', color: mode === m ? '#fff' : 'var(--fc-muted)' }}>
                {m === 'inperson' ? 'In person' : 'Online'}</button>
            ))}
          </div>
        ))}
        {field(mode === 'online' ? 'Meeting link' : 'Location',
          <input value={place} onChange={(e) => setPlace(e.target.value)}
            placeholder={mode === 'online' ? 'Google Meet link' : 'e.g. Indiranagar studio'} style={inputStyle} />)}
        {field('Capacity', (
          <>
            <input value={capacity} onChange={(e) => setCapacity(e.target.value)} inputMode="numeric" style={inputStyle} />
            {editing && booked > 0 && (
              <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginTop: 3 }}>{booked} already booked · can’t go below this</div>
            )}
          </>
        ))}

        <button onClick={save} disabled={!title.trim()}
          style={{ width: '100%', marginTop: 5, background: title.trim() ? 'var(--fc-indigo)' : 'rgba(90,74,227,0.4)', color: '#fff',
            border: 'none', borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>
          {editing ? 'Save changes' : 'Create session'}</button>
      </div>
    </div>
  )
}
