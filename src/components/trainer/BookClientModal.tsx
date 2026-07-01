import { useState } from 'react'
import { clients, addWalkIn } from '../../data/clients'
import { Icon } from '../Icon'

type Picked = { id: string; name: string; initials: string }

// Books a real client into a session from the unified roster, or captures a
// walk-in (name + optional phone) as a new drop-in client.
export function BookClientModal(
  { onClose, onPick, excludeNames }: { onClose: () => void; onPick: (c: Picked) => void; excludeNames: string[] },
) {
  const [q, setQ] = useState('')
  const [walkName, setWalkName] = useState('')
  const [walkPhone, setWalkPhone] = useState('')
  const query = q.trim().toLowerCase()
  const available = clients.filter((c) => !excludeNames.includes(c.name) && (!query || c.name.toLowerCase().includes(query)))

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--fc-surface)', borderRadius: 10, padding: '8px 11px', marginBottom: 11 }}>
          <Icon name="search" size={15} color="var(--fc-muted)" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your clients…"
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, fontFamily: 'var(--fc-font-body)' }} />
        </div>

        <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 12 }}>
          {available.length === 0
            ? <div style={{ fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center', padding: '10px 0' }}>No matching clients.</div>
            : available.map((c) => (
              <button key={c.id} onClick={() => onPick({ id: c.id, name: c.name, initials: c.initials })}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: '#fff',
                  border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '9px 11px', marginBottom: 8, textAlign: 'left' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }}>{c.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 9.5, color: 'var(--fc-muted)' }}>{c.plan}</div>
                </div>
                <Icon name="plus" size={16} color="var(--fc-indigo)" />
              </button>
            ))}
        </div>

        {/* Walk-in */}
        <div style={{ borderTop: '0.5px solid rgba(20,20,43,0.10)', paddingTop: 11 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 7 }}>ADD A WALK-IN</div>
          <input value={walkName} onChange={(e) => setWalkName(e.target.value)} placeholder="Name"
            style={{ width: '100%', boxSizing: 'border-box', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '9px 11px', fontSize: 12.5, fontFamily: 'var(--fc-font-body)', outline: 'none', marginBottom: 7 }} />
          <input value={walkPhone} onChange={(e) => setWalkPhone(e.target.value)} placeholder="Phone (optional)"
            style={{ width: '100%', boxSizing: 'border-box', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '9px 11px', fontSize: 12.5, fontFamily: 'var(--fc-font-body)', outline: 'none', marginBottom: 9 }} />
          <button disabled={walkName.trim().length < 2}
            onClick={() => { const c = addWalkIn(walkName, walkPhone); onPick({ id: c.id, name: c.name, initials: c.initials }) }}
            style={{ width: '100%', background: walkName.trim().length >= 2 ? 'var(--fc-indigo)' : 'rgba(90,74,227,0.4)', color: '#fff',
              border: 'none', borderRadius: 11, padding: 11, fontSize: 13, fontWeight: 600 }}>
            Add walk-in to session
          </button>
        </div>
      </div>
    </div>
  )
}
