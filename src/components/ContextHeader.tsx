import { useNav } from '../nav/NavContext'
import { Icon } from './Icon'
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
        <button onClick={() => nav.switchRole(nav.role === 'client' ? 'trainer' : 'client')}
          aria-label="Switch role"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, padding: '3px 9px', borderRadius: 999,
            background: 'rgba(255,255,255,0.18)', color: '#fff', border: 'none' }}>
          {nav.role === 'client' ? 'Client' : 'Trainer'}
          <Icon name="switch-horizontal" size={11} color="#fff" />
        </button>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--fc-coral)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>PS</div>
      </div>
    </div>
  )
}
