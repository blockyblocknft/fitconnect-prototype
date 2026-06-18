import { Icon } from '../components/Icon'
export function ProfileScreen() {
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 16,
        display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--fc-coral)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>PS</div>
        <div>
          <div className="fc-display" style={{ fontSize: 16, fontWeight: 700 }}>Prabu S.</div>
          <div style={{ fontSize: 12, color: 'var(--fc-muted)' }}>Client · joined 2026</div>
        </div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {['Account', 'Goals', 'Payments', 'Help'].map((r) => (
          <div key={r} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', padding: '13px 14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
            {r}<Icon name="chevron-right" size={18} color="var(--fc-muted)" />
          </div>
        ))}
      </div>
    </div>
  )
}
