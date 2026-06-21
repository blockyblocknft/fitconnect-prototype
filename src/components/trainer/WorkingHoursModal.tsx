import { WorkingHoursEditor } from './WorkingHoursEditor'
import { Icon } from '../Icon'

export function WorkingHoursModal({ onClose }: { onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,43,0.45)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18,
        padding: 16, width: '100%', maxHeight: '92%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>Working hours</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}>
            <Icon name="x" size={18} color="var(--fc-muted)" />
          </button>
        </div>

        <WorkingHoursEditor />

        <button onClick={onClose}
          style={{ width: '100%', marginTop: 14, background: 'var(--fc-indigo)', color: '#fff', border: 'none',
            borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>Done</button>
      </div>
    </div>
  )
}
