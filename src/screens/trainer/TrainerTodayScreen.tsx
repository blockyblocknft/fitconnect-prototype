import { useState } from 'react'
import { todayStats } from '../../data/trainerView'
import { freeSlots } from '../../data/calendar'
import { customRequests, resolveCustomRequest } from '../../data/sessionRequests'
import { Icon } from '../../components/Icon'

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ flex: 1, background: 'var(--fc-surface)', borderRadius: 10, padding: 11, textAlign: 'center' }}>
      <div className="fc-display fc-tabnum" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fc-indigo)' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{label}</div>
    </div>
  )
}

export function TrainerTodayScreen() {
  const s = todayStats()
  const openSlots = freeSlots(0, 30).length
  const [pending, setPending] = useState(() => customRequests.filter((r) => r.status === 'awaiting'))
  const [resolved, setResolved] = useState<{ id: string; verb: string } | null>(null)
  const resolve = (id: string, verb: 'confirmed' | 'declined') => {
    resolveCustomRequest(id, verb)
    setPending((p) => p.filter((r) => r.id !== id))
    setResolved({ id, verb })
  }

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 13, marginBottom: 12 }}>
        <div style={{ marginBottom: 11 }}>
          <span className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>Today session summary</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tile value={s.sessions} label="sessions" />
          <Tile value={s.booked} label="booked" />
          <Tile value={openSlots} label="open 30-min slots" />
        </div>
      </div>

      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 13 }}>
        <div style={{ marginBottom: 10 }}>
          <span className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>Requests · awaiting confirmation</span>
        </div>
        {pending.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'var(--fc-muted)', padding: '4px 0' }}>
            <Icon name="circle-check" size={15} color="var(--fc-green)" />
            {resolved ? `Request ${resolved.verb}. All caught up — see Profile › history.` : 'All caught up — no pending requests.'}
          </div>
        ) : pending.map((r) => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
            borderTop: '0.5px solid rgba(20,20,43,0.08)' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }}>{r.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{r.client} · <span style={{ fontWeight: 500, color: 'var(--fc-muted)' }}>{r.focus}</span></div>
              <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{r.when} · {r.mode === 'online' ? 'Online' : 'In person'}</div>
            </div>
            <button aria-label="Confirm" onClick={() => resolve(r.id, 'confirmed')} style={{ background: 'var(--fc-green)', color: '#fff', border: 'none', borderRadius: 9, padding: '6px 8px', fontSize: 11, fontWeight: 600 }}>Confirm</button>
            <button aria-label="Decline" onClick={() => resolve(r.id, 'declined')} style={{ background: 'transparent', color: '#A32D2D', border: '1px solid #F09595', borderRadius: 9, padding: '6px 8px', fontSize: 11, fontWeight: 600 }}>Decline</button>
          </div>
        ))}
      </div>
    </div>
  )
}
