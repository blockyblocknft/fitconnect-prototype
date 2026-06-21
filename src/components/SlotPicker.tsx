import { useState } from 'react'
import { weekMeta, freeSlots, fmtTime, dayLabel } from '../data/calendar'

export interface SlotSelection { dayOffset: number; start: number; dateLabel: string; timeLabel: string }

// Day strip + free-slot chips. Only shows slots inside the trainer's working hours
// that don't overlap an existing session, so a picked slot is conflict-free by design.
export function SlotPicker(
  { durationMin, value, excludeId, onChange }:
  { durationMin: number; value?: { dayOffset: number; start: number } | null; excludeId?: string; onChange: (s: SlotSelection) => void },
) {
  const days = weekMeta()
  const [day, setDay] = useState(value?.dayOffset ?? days.find((d) => !d.off)?.offset ?? 0)
  const meta = days.find((d) => d.offset === day)!
  const slots = freeSlots(day, durationMin, excludeId)

  const empty = (text: string) => (
    <div style={{ fontSize: 11, color: 'var(--fc-muted)', padding: '8px 0' }}>{text}</div>
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 10 }}>
        {days.map((d) => {
          const active = d.offset === day
          return (
            <button key={d.offset} onClick={() => !d.off && setDay(d.offset)} disabled={d.off}
              style={{ flex: '0 0 auto', width: 40, borderRadius: 10, border: 'none', padding: '6px 0',
                cursor: d.off ? 'default' : 'pointer', opacity: d.off ? 0.45 : 1,
                background: active ? 'var(--fc-indigo)' : 'var(--fc-surface)', color: active ? '#fff' : 'var(--fc-ink)' }}>
              <div style={{ fontSize: 9, fontWeight: 600, opacity: 0.7 }}>{d.isToday ? 'Now' : d.weekday}</div>
              <div className="fc-display fc-tabnum" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{d.dayNum}</div>
            </button>
          )
        })}
      </div>

      {meta.off
        ? empty('Day off — not bookable.')
        : slots.length === 0
          ? empty('No open slots this day — fully booked.')
          : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {slots.map((s) => {
                const on = value?.dayOffset === day && value?.start === s
                return (
                  <button key={s} onClick={() => onChange({ dayOffset: day, start: s, dateLabel: dayLabel(day), timeLabel: fmtTime(s) })}
                    style={{ border: on ? '1.5px solid var(--fc-indigo)' : '0.5px solid rgba(20,20,43,0.16)', borderRadius: 9,
                      padding: '7px 11px', fontSize: 11, fontWeight: 600,
                      background: on ? 'var(--fc-indigo-tint)' : '#fff', color: on ? 'var(--fc-indigo)' : 'var(--fc-ink)' }}>
                    {fmtTime(s)}
                  </button>
                )
              })}
            </div>
          )}
    </div>
  )
}
