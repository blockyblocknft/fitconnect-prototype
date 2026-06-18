import { useNav } from '../nav/NavContext'
export function ContextHeader({ title, subtitle, back }: { title: string; subtitle?: string; back?: boolean }) {
  const nav = useNav()
  return (
    <div style={{ background: 'var(--fc-indigo)', padding: '12px 14px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {back && <button onClick={() => nav.pop()} aria-label="Back"
          style={{ background: 'transparent', border: 'none', color: '#fff', display: 'flex' }}>‹</button>}
        <div>
          <div className="fc-display" style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999,
          background: 'rgba(255,255,255,0.18)', color: '#fff' }}>{nav.role === 'client' ? 'Client' : 'Trainer'}</span>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--fc-coral)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>PS</div>
      </div>
    </div>
  )
}
