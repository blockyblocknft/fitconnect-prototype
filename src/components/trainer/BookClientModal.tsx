import { clientPool } from '../../data/trainerView'
import { Icon } from '../Icon'

export function BookClientModal(
  { onClose, onPick, excludeIds }: { onClose: () => void; onPick: (c: typeof clientPool[number]) => void; excludeIds: string[] },
) {
  const available = clientPool.filter((c) => !excludeIds.includes(c.id))
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,43,0.45)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18,
        padding: 16, width: '100%', maxHeight: '92%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>Book a client</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}>
            <Icon name="x" size={18} color="var(--fc-muted)" />
          </button>
        </div>

        {available.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center', padding: '14px 0' }}>
            Everyone in your roster is already booked into this session.
          </div>
        ) : available.map((c) => (
          <button key={c.id} onClick={() => onPick(c)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: '#fff',
              border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '9px 11px', marginBottom: 8, textAlign: 'left' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }}>{c.initials}</div>
            <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{c.name}</span>
            <Icon name="plus" size={16} color="var(--fc-indigo)" />
          </button>
        ))}
      </div>
    </div>
  )
}
