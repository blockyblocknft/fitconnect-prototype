import { bookings } from '../data/bookings'
import { useNav } from '../nav/NavContext'
import { StepTrail } from '../components/StepTrail'

export function BookedScreen() {
  const nav = useNav()
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 12, marginBottom: 11 }}>
        <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 10 }}>YOUR PROGRESS</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['12', 'day streak'], ['28', 'sessions done'], ['2', 'programs']].map(([v, l]) => (
            <div key={l} style={{ flex: 1, background: 'var(--fc-surface)', borderRadius: 10, padding: 9, textAlign: 'center' }}>
              <div className="fc-display fc-tabnum" style={{ fontSize: 17, fontWeight: 700, color: 'var(--fc-indigo)' }}>{v}</div>
              <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {bookings.map((b) => (
        <div key={b.id} role="button" onClick={() => nav.push({ name: 'programDetail', params: { id: b.id } })}
          style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 12,
            marginBottom: 11, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
            <span className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{b.programName}</span>
            <span style={{ fontSize: 11, color: 'var(--fc-indigo)', fontWeight: 600 }}>
              {b.progressKind === 'weeks' ? `Wk ${b.current}/${b.total}` : `Day ${b.current}/${b.total}`}</span>
          </div>
          {b.progressKind === 'weeks'
            ? <StepTrail done={b.current} total={4} />
            : <div style={{ height: 5, borderRadius: 999, background: 'var(--fc-indigo-tint)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((b.current / b.total) * 100)}%`, height: '100%', background: 'var(--fc-green)' }} /></div>}
          <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 6 }}>with {b.trainerName}</div>
        </div>
      ))}
    </div>
  )
}
