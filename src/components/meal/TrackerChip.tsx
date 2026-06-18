import type { Tracker } from '../../lib/types'
import { Icon } from '../Icon'
export function TrackerChip({ tracker }: { tracker: Tracker }) {
  return (
    <div style={{ flex: '0 0 auto', width: 86, background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)',
      borderRadius: 13, padding: 10, textAlign: 'center' }}>
      <Icon name={tracker.icon} size={19} color={tracker.color} />
      <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700, marginTop: 3 }}>{tracker.value}</div>
      <div style={{ fontSize: 9, color: 'var(--fc-muted)' }}>{tracker.label}</div>
    </div>
  )
}
