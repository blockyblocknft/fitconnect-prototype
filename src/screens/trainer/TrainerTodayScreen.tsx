import { useNav } from '../../nav/NavContext'
import { trainerSessions, requests, todayStats } from '../../data/trainerView'
import { AUDIT } from '../../data/auditNotes'
import { AuditButton } from '../../components/AuditButton'
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
  const nav = useNav()
  const s = todayStats()
  const today = trainerSessions.filter((x) => x.today)
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 13, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }}>
          <span className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>Today’s workload</span>
          <AuditButton note={AUDIT.dashboard} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tile value={s.sessions} label="sessions" />
          <Tile value={s.booked} label="booked" />
          <Tile value={s.open} label="open spots" />
        </div>
      </div>

      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 13, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>Requests · awaiting confirmation</span>
          <AuditButton note={AUDIT.bookingLifecycle} />
        </div>
        {requests.map((r) => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
            borderTop: '0.5px solid rgba(20,20,43,0.08)' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }}>{r.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{r.client}</div>
              <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{r.session} · {r.time}</div>
            </div>
            <button aria-label="Confirm" style={{ background: 'var(--fc-green)', color: '#fff', border: 'none', borderRadius: 9, padding: '6px 8px', fontSize: 11, fontWeight: 600 }}>Confirm</button>
            <button aria-label="Decline" style={{ background: 'transparent', color: '#A32D2D', border: '1px solid #F09595', borderRadius: 9, padding: '6px 8px', fontSize: 11, fontWeight: 600 }}>Decline</button>
          </div>
        ))}
      </div>

      <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 9 }}>TODAY’S SESSIONS</div>
      {today.map((x) => (
        <div key={x.id} role="button" tabIndex={0}
          onClick={() => nav.push({ name: 'trRoster', params: { id: x.id } })}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav.push({ name: 'trRoster', params: { id: x.id } }) } }}
          style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 10, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{x.title}</div>
              <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name={x.mode === 'online' ? 'video' : 'map-pin'} size={12} color="var(--fc-muted)" />{x.time} · {x.place}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700, color: 'var(--fc-indigo)' }}>{x.clients.length}/{x.capacity}</div>
              <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>booked</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
