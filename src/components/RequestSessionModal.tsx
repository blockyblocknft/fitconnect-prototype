import { useState } from 'react'
import { addCustomRequest, requestableTrainers } from '../data/sessionRequests'
import { SlotPicker, type SlotSelection } from './SlotPicker'
import { ModeSwitch } from './ModeSwitch'
import { Icon } from './Icon'

const inputStyle: React.CSSProperties = {
  width: '100%', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '8px 10px',
  fontSize: 12, fontFamily: 'var(--fc-font-body)', outline: 'none', background: '#fff',
}

export function RequestSessionModal(
  { onClose, onSubmit, trainerName: fixedTrainer }: { onClose: () => void; onSubmit: () => void; trainerName?: string },
) {
  const [trainerName, setTrainerName] = useState(fixedTrainer ?? requestableTrainers[0])
  const [focus, setFocus] = useState('')
  const [slot, setSlot] = useState<SlotSelection | null>(null)
  const [mode, setMode] = useState<'online' | 'inperson'>('online')
  const [note, setNote] = useState('')

  const ready = !!focus.trim() && !!slot

  const submit = () => {
    if (!ready || !slot) return
    const when = `${slot.dateLabel} · ${slot.timeLabel}`
    addCustomRequest({ trainerName, focus: focus.trim(), when, mode, note: note.trim() || undefined })
    onSubmit()
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>Request a session</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}>
            <Icon name="x" size={18} color="var(--fc-muted)" />
          </button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 12 }}>
          Ask a trainer for a custom slot outside their posted programs. They’ll confirm or decline.
        </div>

        {field('Trainer', fixedTrainer
          ? <div style={{ ...inputStyle, background: 'var(--fc-surface)', color: 'var(--fc-ink)', fontWeight: 600 }}>{fixedTrainer}</div>
          : (
            <select value={trainerName} onChange={(e) => setTrainerName(e.target.value)} style={inputStyle}>
              {requestableTrainers.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          ))}
        {field('What for', <input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="e.g. 1:1 mobility check-in" style={inputStyle} />)}
        {field('Open slot · within the trainer’s hours', <SlotPicker durationMin={60} value={slot} onChange={setSlot} />)}
        {field('Mode', <ModeSwitch mode={mode} onChange={setMode} />)}
        {field('Note (optional)', <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything the trainer should know…" style={inputStyle} />)}

        <button onClick={submit} disabled={!ready}
          style={{ width: '100%', marginTop: 5, background: ready ? 'var(--fc-indigo)' : 'rgba(90,74,227,0.4)', color: '#fff',
            border: 'none', borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>Send request</button>
      </div>
    </div>
  )
}
