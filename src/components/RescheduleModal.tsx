import { useState } from 'react'
import type { BookedSession } from '../lib/types'
import { Icon } from './Icon'

// A few stand-in alternative slots the trainer "has open".
const SLOTS = [
  { date: 'Fri 20 Jun', time: '7:00 AM' },
  { date: 'Sat 21 Jun', time: '9:00 AM' },
  { date: 'Sun 22 Jun', time: '6:00 PM' },
  { date: 'Mon 23 Jun', time: '7:30 PM' },
]

export function RescheduleModal(
  { session, onClose, onPick }: { session: BookedSession; onClose: () => void; onPick: (date: string, time: string) => void },
) {
  const [sel, setSel] = useState<{ date: string; time: string } | null>(null)
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,43,0.45)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18,
        padding: 16, width: '100%', maxHeight: '92%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>Reschedule</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}>
            <Icon name="x" size={18} color="var(--fc-muted)" />
          </button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 12 }}>
          Session {session.index} · {session.title} — currently {session.date} · {session.time}. Pick a new slot:
        </div>

        {SLOTS.map((slot) => {
          const on = sel?.date === slot.date && sel?.time === slot.time
          return (
            <button key={slot.date + slot.time} onClick={() => setSel(slot)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                border: on ? '1.5px solid var(--fc-indigo)' : '0.5px solid rgba(20,20,43,0.14)', borderRadius: 12,
                padding: '11px 12px', marginBottom: 8, background: on ? 'var(--fc-indigo-tint)' : '#fff' }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{slot.date}</span>
              <span className="fc-tabnum" style={{ fontSize: 12, color: on ? 'var(--fc-indigo)' : 'var(--fc-muted)' }}>{slot.time}</span>
            </button>
          )
        })}

        <button onClick={() => sel && onPick(sel.date, sel.time)} disabled={!sel}
          style={{ width: '100%', marginTop: 5, background: sel ? 'var(--fc-indigo)' : 'rgba(90,74,227,0.4)', color: '#fff',
            border: 'none', borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>Confirm new time</button>
      </div>
    </div>
  )
}
