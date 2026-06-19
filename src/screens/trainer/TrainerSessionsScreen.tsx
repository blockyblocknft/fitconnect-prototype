import { useState } from 'react'
import { useNav } from '../../nav/NavContext'
import { trainerSessions, addTrainerSession } from '../../data/trainerView'
import { AUDIT } from '../../data/auditNotes'
import { AuditButton } from '../../components/AuditButton'
import { CapacityBar } from '../../components/CapacityBar'
import { SessionFormModal } from '../../components/trainer/SessionFormModal'
import { Icon } from '../../components/Icon'

export function TrainerSessionsScreen() {
  const nav = useNav()
  const [showCreate, setShowCreate] = useState(false)
  const [, force] = useState(0)
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}>
        <button onClick={() => setShowCreate(true)}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: 'var(--fc-indigo)', color: '#fff', border: 'none', borderRadius: 12, padding: 11, fontSize: 13, fontWeight: 600 }}>
          <Icon name="plus" size={16} color="#fff" /> Create session
        </button>
        <AuditButton note={AUDIT.createSession} />
      </div>

      {trainerSessions.map((x) => (
        <div key={x.id} role="button" tabIndex={0}
          onClick={() => nav.push({ name: 'trRoster', params: { id: x.id } })}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav.push({ name: 'trRoster', params: { id: x.id } }) } }}
          style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 10, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 9 }}>
            <div>
              <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{x.title}</div>
              <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name={x.mode === 'online' ? 'video' : 'map-pin'} size={12} color="var(--fc-muted)" />{x.time} · {x.place}
              </div>
            </div>
            <Icon name="chevron-right" size={18} color="#C4C4CF" />
          </div>
          <CapacityBar taken={x.clients.length} max={x.capacity} />
        </div>
      ))}

      {showCreate && (
        <SessionFormModal onClose={() => setShowCreate(false)}
          onSave={(s) => { addTrainerSession(s); setShowCreate(false); force((n) => n + 1) }} />
      )}
    </div>
  )
}
