import { useState } from 'react'
import type { TrainerSession } from '../../data/trainerView'
import type { SessionType, Discipline } from '../../lib/types'
import { SlotPicker, type SlotSelection } from '../SlotPicker'
import { FOCUS_CATEGORIES } from '../../data/disciplines'
import { fmtTime, dayLabel } from '../../data/calendar'
import { Icon } from '../Icon'

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '8px 10px',
  fontSize: 12, fontFamily: 'var(--fc-font-body)', outline: 'none',
}
const num = (v: string, min: number) => Math.max(min, Math.round(Number(v) || min))
const DURATIONS = [30, 45, 60, 90]
const FOCI = FOCUS_CATEGORIES.filter((c) => c.key !== 'all') as { key: Discipline; label: string; icon: string }[]
const WD = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

// Generate recurrence occurrences (dayOffset from today) for the chosen weekdays × weeks.
function occurrences(weekdays: number[], weeks: number): number[] {
  const dow = new Date().getDay()
  const out: number[] = []
  for (let w = 0; w < weeks; w++) for (const wd of weekdays) out.push(((wd - dow + 7) % 7) + w * 7)
  return [...new Set(out)].sort((a, b) => a - b)
}

export function SessionFormModal(
  { onClose, onSave, session }: { onClose: () => void; onSave: (s: TrainerSession[]) => void; session?: TrainerSession },
) {
  const editing = !!session
  const booked = session?.clients.length ?? 0
  const [kind, setKind] = useState<SessionType>(session?.kind ?? (session && session.capacity === 1 ? '1to1' : 'group'))
  const [title, setTitle] = useState(session?.title ?? '')
  const [discipline, setDiscipline] = useState<Discipline>(session?.discipline ?? 'strengthening')
  const [mode, setMode] = useState<'online' | 'inperson'>(session?.mode ?? 'inperson')
  const [place, setPlace] = useState(session?.place ?? '')
  const [capacity, setCapacity] = useState(String(session?.capacity ?? 10))
  const [price, setPrice] = useState(String(session?.price ?? ''))
  const [duration, setDuration] = useState(session?.durationMin ?? 60)
  const [slot, setSlot] = useState<SlotSelection | null>(
    session?.dayOffset != null && session.start != null
      ? { dayOffset: session.dayOffset, start: session.start, dateLabel: '', timeLabel: '' } : null,
  )
  const [repeat, setRepeat] = useState(false)
  const [weekdays, setWeekdays] = useState<number[]>([])
  const [weeks, setWeeks] = useState(8)

  const minCap = Math.max(1, booked)
  const ready = !!title.trim() && !!slot && (!repeat || weekdays.length > 0)
  const cap = kind === '1to1' ? 1 : num(capacity, minCap)

  const save = () => {
    if (!slot) return
    const base = {
      title: title.trim(), kind, discipline, mode,
      place: place.trim() || (mode === 'online' ? 'Google Meet' : 'TBD'),
      capacity: cap, price: price.trim() ? num(price, 0) : undefined,
      program: session?.program ?? 'Custom session', durationMin: duration,
    }
    if (editing) {
      onSave([{ ...session!, ...base, time: `${dayLabel(slot.dayOffset)} · ${fmtTime(slot.start)}`, today: slot.dayOffset === 0, dayOffset: slot.dayOffset, start: slot.start }])
      return
    }
    const offs = repeat ? occurrences(weekdays, weeks) : [slot.dayOffset]
    const list: TrainerSession[] = offs.map((off, i) => ({
      ...base, id: `ts-${Date.now()}-${i}`, clients: [],
      time: `${dayLabel(off)} · ${fmtTime(slot.start)}`, today: off === 0,
      dayOffset: off, start: slot.start, repeatWeeks: repeat ? weeks : undefined,
    }))
    onSave(list)
  }

  const field = (label: string, node: React.ReactNode) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 4 }}>{label}</div>{node}
    </div>
  )
  const seg = <T,>(opts: { v: T; label: string }[], val: T, set: (v: T) => void) => (
    <div style={{ display: 'flex', gap: 8 }}>
      {opts.map((o, i) => (
        <button key={i} onClick={() => set(o.v)}
          style={{ flex: 1, border: 'none', borderRadius: 9, padding: '8px 0', fontSize: 12, fontWeight: 600,
            background: val === o.v ? 'var(--fc-indigo)' : 'var(--fc-surface)', color: val === o.v ? '#fff' : 'var(--fc-muted)' }}>{o.label}</button>
      ))}
    </div>
  )

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,43,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16, width: '100%', maxHeight: '92%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>{editing ? 'Edit session' : 'Create session'}</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}><Icon name="x" size={18} color="var(--fc-muted)" /></button>
        </div>

        {field('Type', seg([{ v: '1to1' as SessionType, label: '1:1' }, { v: 'group' as SessionType, label: 'Group' }], kind, setKind))}
        {field('Title', <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Evening HIIT" style={inputStyle} />)}
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
        {field('Open slot · within your working hours', <SlotPicker durationMin={duration} value={slot} excludeId={session?.id} onChange={setSlot} />)}

        {!editing && field('Repeat', (
          <>
            {seg([{ v: false, label: 'One-off' }, { v: true, label: 'Weekly' }], repeat, setRepeat)}
            {repeat && (
              <div style={{ marginTop: 9 }}>
                <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                  {WD.map((d, i) => {
                    const on = weekdays.includes(i)
                    return (
                      <button key={i} onClick={() => setWeekdays((w) => on ? w.filter((x) => x !== i) : [...w, i])}
                        style={{ flex: 1, border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 11, fontWeight: 700, background: on ? 'var(--fc-indigo)' : 'var(--fc-surface)', color: on ? '#fff' : 'var(--fc-muted)' }}>{d}</button>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 11, color: 'var(--fc-muted)' }}>for</span>
                  {[4, 8, 12].map((n) => (
                    <button key={n} onClick={() => setWeeks(n)}
                      style={{ border: 'none', borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 600, background: weeks === n ? 'var(--fc-indigo)' : 'var(--fc-surface)', color: weeks === n ? '#fff' : 'var(--fc-muted)' }}>{n} wks</button>
                  ))}
                  {weekdays.length > 0 && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--fc-muted)' }}>{weekdays.length * weeks} sessions</span>}
                </div>
              </div>
            )}
          </>
        ))}

        {field('Mode', seg([{ v: 'inperson' as const, label: 'In person' }, { v: 'online' as const, label: 'Online' }], mode, setMode))}
        {field(mode === 'online' ? 'Meeting link' : 'Location',
          <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder={mode === 'online' ? 'Google Meet link' : 'e.g. Indiranagar studio'} style={inputStyle} />)}
        <div style={{ display: 'flex', gap: 9 }}>
          <div style={{ flex: 1 }}>{field('Price / client (₹)', <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))} inputMode="numeric" placeholder="e.g. 300" style={inputStyle} />)}</div>
          {kind === 'group' && <div style={{ flex: 1 }}>{field('Capacity', <input value={capacity} onChange={(e) => setCapacity(e.target.value.replace(/[^\d]/g, ''))} inputMode="numeric" style={inputStyle} />)}</div>}
        </div>
        {editing && booked > 0 && kind === 'group' && <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginTop: -4, marginBottom: 8 }}>{booked} already booked · can’t go below this</div>}

        <button onClick={save} disabled={!ready}
          style={{ width: '100%', marginTop: 5, background: ready ? 'var(--fc-indigo)' : 'rgba(90,74,227,0.4)', color: '#fff', border: 'none', borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>
          {editing ? 'Save changes' : repeat && weekdays.length > 0 ? `Create ${weekdays.length * weeks} sessions` : 'Create session'}</button>
      </div>
    </div>
  )
}
