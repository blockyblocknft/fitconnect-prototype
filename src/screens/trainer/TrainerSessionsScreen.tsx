import { useState } from 'react'
import { useNav } from '../../nav/NavContext'
import {
  trainerSessions, addTrainerSession, updateTrainerSession, removeTrainerSession, type TrainerSession,
} from '../../data/trainerView'
import { CapacityBar } from '../../components/CapacityBar'
import { SessionFormModal } from '../../components/trainer/SessionFormModal'
import { Icon } from '../../components/Icon'

type Filter = 'all' | 'today' | 'online' | 'inperson'
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'online', label: 'Online' },
  { key: 'inperson', label: 'In person' },
]

export function TrainerSessionsScreen() {
  const nav = useNav()
  const [form, setForm] = useState<{ mode: 'create' } | { mode: 'edit'; session: TrainerSession } | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [, force] = useState(0)
  const rerender = () => force((n) => n + 1)

  const visible = trainerSessions.filter((x) =>
    filter === 'all' ? true : filter === 'today' ? x.today : x.mode === filter)

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ marginBottom: 11 }}>
        <button onClick={() => setForm({ mode: 'create' })}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: 'var(--fc-indigo)', color: '#fff', border: 'none', borderRadius: 12, padding: 11, fontSize: 13, fontWeight: 600 }}>
          <Icon name="plus" size={16} color="#fff" /> Create session
        </button>
      </div>

      <div style={{ display: 'flex', gap: 7, marginBottom: 13, overflowX: 'auto' }}>
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{ border: 'none', borderRadius: 999, padding: '6px 13px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
              background: filter === f.key ? 'var(--fc-indigo)' : '#fff', color: filter === f.key ? '#fff' : 'var(--fc-muted)',
              boxShadow: filter === f.key ? 'none' : 'inset 0 0 0 0.5px rgba(20,20,43,0.14)' }}>{f.label}</button>
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ background: '#fff', border: '0.5px dashed rgba(20,20,43,0.2)', borderRadius: 14, padding: 18,
          textAlign: 'center', color: 'var(--fc-muted)', fontSize: 12 }}>No sessions match this filter.</div>
      )}

      {visible.map((x) => (
        <div key={x.id} role="button" tabIndex={0}
          onClick={() => nav.push({ name: 'trRoster', params: { id: x.id } })}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav.push({ name: 'trRoster', params: { id: x.id } }) } }}
          style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 10, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 9 }}>
            <div style={{ minWidth: 0 }}>
              <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{x.title}</div>
              <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name={x.mode === 'online' ? 'video' : 'map-pin'} size={12} color="var(--fc-muted)" />{x.time} · {x.place}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button aria-label="Edit session" onClick={(e) => { e.stopPropagation(); setForm({ mode: 'edit', session: x }) }}
                style={{ background: 'var(--fc-surface)', border: 'none', borderRadius: 8, padding: 6, display: 'flex' }}>
                <Icon name="pencil" size={15} color="var(--fc-muted)" />
              </button>
              <button aria-label="Cancel session" onClick={(e) => { e.stopPropagation(); removeTrainerSession(x.id); rerender() }}
                style={{ background: 'var(--fc-surface)', border: 'none', borderRadius: 8, padding: 6, display: 'flex' }}>
                <Icon name="trash" size={15} color="#C4655F" />
              </button>
            </div>
          </div>
          <CapacityBar taken={x.clients.length} max={x.capacity} />
        </div>
      ))}

      {form?.mode === 'create' && (
        <SessionFormModal onClose={() => setForm(null)}
          onSave={(s) => { addTrainerSession(s); setForm(null); rerender() }} />
      )}
      {form?.mode === 'edit' && (
        <SessionFormModal session={form.session} onClose={() => setForm(null)}
          onSave={(s) => { updateTrainerSession(s.id, s); setForm(null); rerender() }} />
      )}
    </div>
  )
}
