import { useState } from 'react'
import { fmtTime } from '../data/calendar'

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const PRESETS: { key: string; label: string; days: number[] }[] = [
  { key: '3x', label: '3× / week', days: [1, 3, 5] },
  { key: 'alt', label: 'Alternate days', days: [0, 2, 4, 6] },
  { key: 'wd', label: 'Weekdays', days: [1, 2, 3, 4, 5] },
]
const TIMES = Array.from({ length: 14 }, (_, i) => (6 + i) * 60) // 6:00 AM – 7:00 PM

export interface Schedule { days: number[]; timeLabel: string; summary: string }

const summaryOf = (days: number[], timeLabel: string, daily: boolean) => {
  if (daily) return `Every day · ${timeLabel}`
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return `${[...days].sort((a, b) => a - b).map((d) => names[d]).join(', ')} · ${timeLabel}`
}

export function ScheduleSelector({ cadence, onChange }: { cadence: 'daily' | 'multi'; onChange: (s: Schedule | null) => void }) {
  const daily = cadence === 'daily'
  const [days, setDays] = useState<number[]>(daily ? [0, 1, 2, 3, 4, 5, 6] : [1, 3, 5])
  const [preset, setPreset] = useState<string | null>(daily ? null : '3x')
  const [start, setStart] = useState<number | null>(null)

  const emit = (d: number[], st: number | null) =>
    onChange(st !== null && d.length ? { days: d, timeLabel: fmtTime(st), summary: summaryOf(d, fmtTime(st), daily) } : null)
  const pickPreset = (p: typeof PRESETS[number]) => { setPreset(p.key); setDays(p.days); emit(p.days, start) }
  const toggleDay = (i: number) => {
    const d = days.includes(i) ? days.filter((x) => x !== i) : [...days, i]
    setPreset(null); setDays(d); emit(d, start)
  }
  const pickTime = (t: number) => { setStart(t); emit(days, t) }

  const timeChip = (t: number) => (
    <button key={t} onClick={() => pickTime(t)}
      style={{ flex: '0 0 auto', border: start === t ? '1.5px solid var(--fc-indigo)' : '0.5px solid rgba(20,20,43,0.16)',
        borderRadius: 9, padding: '7px 11px', fontSize: 11.5, fontWeight: 600,
        background: start === t ? 'var(--fc-indigo-tint)' : '#fff', color: start === t ? 'var(--fc-indigo)' : 'var(--fc-ink)' }}>
      {fmtTime(t)}
    </button>
  )

  return (
    <div>
      {!daily && (
        <>
          <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 5 }}>Frequency</div>
          <div style={{ display: 'flex', gap: 7, marginBottom: 11 }}>
            {PRESETS.map((p) => (
              <button key={p.key} onClick={() => pickPreset(p)}
                style={{ flex: '0 0 auto', border: 'none', borderRadius: 999, padding: '6px 12px', fontSize: 11, fontWeight: 600,
                  background: preset === p.key ? 'var(--fc-indigo)' : '#fff', color: preset === p.key ? '#fff' : 'var(--fc-muted)',
                  boxShadow: preset === p.key ? 'none' : 'inset 0 0 0 0.5px rgba(20,20,43,0.16)' }}>{p.label}</button>
            ))}
          </div>
          <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 5 }}>Days</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {DOW.map((lbl, i) => {
              const on = days.includes(i)
              return (
                <button key={i} onClick={() => toggleDay(i)} aria-label={`day ${i}`}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    background: on ? 'var(--fc-indigo)' : 'var(--fc-surface)', color: on ? '#fff' : 'var(--fc-muted)' }}>{lbl}</button>
              )
            })}
          </div>
        </>
      )}
      {daily && <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 10 }}>Runs <b style={{ color: 'var(--fc-ink)' }}>every day</b> — pick your time.</div>}

      <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 5 }}>Time · applies to every session</div>
      <div className="fc-noscrollbar" style={{ display: 'flex', gap: 7, overflowX: 'auto' }}>
        {TIMES.map(timeChip)}
      </div>
    </div>
  )
}
