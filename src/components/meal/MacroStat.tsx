import type { Macro } from '../../lib/types'
export function MacroStat({ macro }: { macro: Macro }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '10px 12px' }}>
      <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{macro.label}</div>
      <div className="fc-display fc-tabnum" style={{ fontSize: 15, fontWeight: 700, color: macro.color }}>{macro.pct}%</div>
    </div>
  )
}
