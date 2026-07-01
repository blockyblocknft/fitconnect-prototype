import { useState } from 'react'
import type { SessionType, Discipline } from '../lib/types'
import { addCustomRequest, requestableTrainers } from '../data/sessionRequests'
import { FOCUS_CATEGORIES } from '../data/disciplines'
import { SlotPicker, type SlotSelection } from './SlotPicker'
import { ModeSwitch } from './ModeSwitch'
import { Icon } from './Icon'

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '8px 10px',
  fontSize: 12, fontFamily: 'var(--fc-font-body)', outline: 'none', background: '#fff',
}
const FOCI = FOCUS_CATEGORIES.filter((c) => c.key !== 'all') as { key: Discipline; label: string; icon: string }[]
const DURATIONS = [30, 45, 60]

export function RequestSessionModal(
  { onClose, onSubmit, trainerName: fixedTrainer }: { onClose: () => void; onSubmit: () => void; trainerName?: string },
) {
  const [trainerName, setTrainerName] = useState(fixedTrainer ?? requestableTrainers[0])
  const [kind, setKind] = useState<SessionType>('1to1')
  const [discipline, setDiscipline] = useState<Discipline | null>(null)
  const [duration, setDuration] = useState(60)
  const [slot, setSlot] = useState<SlotSelection | null>(null)
  const [mode, setMode] = useState<'online' | 'inperson'>('online')
  const [note, setNote] = useState('')

  const ready = !!discipline && !!slot

  const submit = () => {
    if (!ready || !slot || !discipline) return
    const label = FOCI.find((f) => f.key === discipline)!.label
    const focus = `${kind === '1to1' ? '1:1' : 'Group'} · ${label} · ${duration}m`
    const when = `${slot.dateLabel} · ${slot.timeLabel}`
    addCustomRequest({ trainerName, focus, when, mode, note: note.trim() || undefined })
    onSubmit()
  }

  const field = (label: string, node: React.ReactNode) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 4 }}>{label}</div>{node}
    </div>
  )

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,43,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16, width: '100%', maxHeight: '92%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>Request a session</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}><Icon name="x" size={18} color="var(--fc-muted)" /></button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 12 }}>
          Ask {fixedTrainer ?? 'a trainer'} for a custom slot outside their posted programs. They’ll confirm or decline.
        </div>

        {field('Trainer', fixedTrainer
          ? <div style={{ ...inputStyle, background: 'var(--fc-surface)', color: 'var(--fc-ink)', fontWeight: 600 }}>{fixedTrainer}</div>
          : <select value={trainerName} onChange={(e) => setTrainerName(e.target.value)} style={inputStyle}>{requestableTrainers.map((t) => <option key={t} value={t}>{t}</option>)}</select>)}

        {field('Type', (
          <div style={{ display: 'flex', gap: 8 }}>
            {([['1to1', '1:1'], ['group', 'Group']] as [SessionType, string][]).map(([v, l]) => (
              <button key={v} onClick={() => setKind(v)}
                style={{ flex: 1, border: 'none', borderRadius: 9, padding: '8px 0', fontSize: 12, fontWeight: 600, background: kind === v ? 'var(--fc-indigo)' : 'var(--fc-surface)', color: kind === v ? '#fff' : 'var(--fc-muted)' }}>{l}</button>
            ))}
          </div>
        ))}

        {field('Focus', (
          <div className="fc-noscrollbar" style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2 }}>
            {FOCI.map((f) => {
              const on = discipline === f.key
              return (
                <button key={f.key} onClick={() => setDiscipline(f.key)}
                  style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '6px 11px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                    border: on ? '1.5px solid var(--fc-indigo)' : '0.5px solid rgba(20,20,43,0.16)', background: on ? 'var(--fc-indigo-tint)' : '#fff', color: on ? 'var(--fc-indigo)' : 'var(--fc-muted)' }}>
                  <Icon name={f.icon} size={13} color={on ? 'var(--fc-indigo)' : 'var(--fc-muted)'} />{f.label}
                </button>
              )
            })}
          </div>
        ))}

        {field('Duration', (
          <div style={{ display: 'flex', gap: 7 }}>
            {DURATIONS.map((d) => (
              <button key={d} onClick={() => setDuration(d)}
                style={{ flex: 1, border: 'none', borderRadius: 9, padding: '7px 0', fontSize: 11, fontWeight: 600, background: duration === d ? 'var(--fc-indigo)' : 'var(--fc-surface)', color: duration === d ? '#fff' : 'var(--fc-muted)' }}>{d}m</button>
            ))}
          </div>
        ))}

        {field('Open slot · within the trainer’s hours', <SlotPicker durationMin={duration} value={slot} onChange={setSlot} />)}
        {field('Mode', <ModeSwitch mode={mode} onChange={setMode} />)}
        {field('Note (optional)', <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything the trainer should know…" style={inputStyle} />)}

        <button onClick={submit} disabled={!ready}
          style={{ width: '100%', marginTop: 5, background: ready ? 'var(--fc-indigo)' : 'rgba(90,74,227,0.4)', color: '#fff', border: 'none', borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>Send request</button>
      </div>
    </div>
  )
}
