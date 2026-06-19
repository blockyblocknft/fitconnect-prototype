import { bookings } from '../data/bookings'
import { SESSION_STATUS } from '../lib/sessionStatus'
import { Icon } from '../components/Icon'

export function HistoryScreen() {
  const rows = bookings.flatMap((b) =>
    b.sessions.filter((s) => s.when === 'past').map((s) => ({ ...s, programName: b.programName, trainerName: b.trainerName })),
  )
  const attended = rows.filter((r) => r.status === 'attended').length

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 13, marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="fc-display fc-tabnum" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fc-indigo)' }}>{attended}/{rows.length}</div>
        <div style={{ fontSize: 12, color: 'var(--fc-muted)' }}>past sessions attended</div>
      </div>

      {rows.length === 0
        ? <div style={{ fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center', padding: 20 }}>No past sessions yet.</div>
        : rows.map((r) => {
          const st = SESSION_STATUS[r.status]
          return (
            <div key={r.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12,
              padding: '10px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: st.dot, flex: '0 0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={st.icon} size={13} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>Session {r.index} · {r.title}</div>
                <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{r.programName} · {r.date} · {r.time}</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 600, color: st.fg, background: st.bg, padding: '3px 8px', borderRadius: 999 }}>{st.label}</span>
            </div>
          )
        })}
    </div>
  )
}
