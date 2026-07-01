import { useState } from 'react'
import { useNav } from '../../nav/NavContext'
import { clients, clientDue, attendancePct, needsAttention, rosterStats, addClient, PLAN_CATALOG, type Client } from '../../data/clients'
import { STATUS_LABEL } from '../../data/trainerView'
import { Icon } from '../../components/Icon'

const rupees = (n: number) => '₹' + n.toLocaleString('en-IN')
type Filter = 'all' | 'attention' | 'dues' | '1to1' | 'group'
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'attention', label: 'Needs attention' },
  { key: 'dues', label: 'Dues' },
  { key: '1to1', label: '1:1' },
  { key: 'group', label: 'Group' },
]

export function TrainerClientsScreen() {
  const nav = useNav()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [showAdd, setShowAdd] = useState(false)
  const stats = rosterStats()
  const query = q.trim().toLowerCase()

  const list = clients.filter((c) => {
    if (query && !c.name.toLowerCase().includes(query) && !c.plan.toLowerCase().includes(query)) return false
    if (filter === 'attention') return needsAttention(c)
    if (filter === 'dues') return clientDue(c) > 0
    if (filter === '1to1') return c.kind === '1to1'
    if (filter === 'group') return c.kind === 'group'
    return true
  })

  const stat = (value: string, label: string, accent?: string, onClick?: () => void) => (
    <div onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}
      style={{ flex: 1, background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '9px 6px', textAlign: 'center', cursor: onClick ? 'pointer' : 'default' }}>
      <div className="fc-display fc-tabnum" style={{ fontSize: 16, fontWeight: 700, color: accent ?? 'var(--fc-indigo)' }}>{value}</div>
      <div style={{ fontSize: 9.5, color: 'var(--fc-muted)' }}>{label}</div>
    </div>
  )

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 11 }}>
        {stat(`${stats.total}`, 'clients')}
        {stat(`${stats.attention}`, 'need attention', stats.attention ? 'var(--fc-coral)' : undefined)}
        {stat(rupees(stats.dues), 'dues open', stats.dues ? '#A32D2D' : undefined, () => nav.push({ name: 'trPayments' }))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, background: '#fff', borderRadius: 10,
          border: '0.5px solid rgba(20,20,43,0.12)', padding: '8px 11px' }}>
          <Icon name="search" size={15} color="var(--fc-muted)" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients, plans…"
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, fontFamily: 'var(--fc-font-body)' }} />
        </div>
        <button onClick={() => setShowAdd(true)} aria-label="Add client"
          style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 4, background: 'var(--fc-indigo)', color: '#fff',
            border: 'none', borderRadius: 10, padding: '9px 12px', fontSize: 12, fontWeight: 600 }}>
          <Icon name="plus" size={14} color="#fff" /> Add
        </button>
      </div>

      <div className="fc-noscrollbar" style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 12, paddingBottom: 1 }}>
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{ flex: '0 0 auto', border: 'none', borderRadius: 999, padding: '6px 13px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
              background: filter === f.key ? 'var(--fc-indigo)' : '#fff', color: filter === f.key ? '#fff' : 'var(--fc-muted)',
              boxShadow: filter === f.key ? 'none' : 'inset 0 0 0 0.5px rgba(20,20,43,0.14)' }}>{f.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {list.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center', padding: 22 }}>No clients match.</div>
        )}
        {list.map((c) => <ClientRow key={c.id} c={c} onOpen={() => nav.push({ name: 'trClientProfile', params: { id: c.id } })} />)}
      </div>

      {showAdd && (
        <AddClientModal onClose={() => setShowAdd(false)}
          onAdd={(c) => { setShowAdd(false); nav.push({ name: 'trClientProfile', params: { id: c.id } }) }} />
      )}
    </div>
  )
}

function AddClientModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Client) => void }) {
  const [name, setName] = useState('')
  const [plan, setPlan] = useState(PLAN_CATALOG[0].name)
  const [goal, setGoal] = useState('')
  const sel = PLAN_CATALOG.find((p) => p.name === plan)!
  const ready = name.trim().length > 1

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,43,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16, width: '100%', maxHeight: '92%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}>
          <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>Add a client</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}><Icon name="x" size={18} color="var(--fc-muted)" /></button>
        </div>

        <div style={{ fontSize: 10.5, color: 'var(--fc-muted)', marginBottom: 4 }}>Name</div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Karthik R." autoFocus
          style={{ width: '100%', boxSizing: 'border-box', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '9px 11px', fontSize: 13, fontFamily: 'var(--fc-font-body)', outline: 'none', marginBottom: 12 }} />

        <div style={{ fontSize: 10.5, color: 'var(--fc-muted)', marginBottom: 6 }}>Assign a plan</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
          {PLAN_CATALOG.map((p) => {
            const on = plan === p.name
            return (
              <button key={p.name} onClick={() => setPlan(p.name)}
                style={{ display: 'flex', alignItems: 'center', gap: 9, textAlign: 'left', cursor: 'pointer',
                  background: on ? 'var(--fc-indigo-tint)' : '#fff', border: on ? '1.5px solid var(--fc-indigo)' : '0.5px solid rgba(20,20,43,0.14)',
                  borderRadius: 11, padding: '9px 11px' }}>
                <Icon name={on ? 'circle-check' : 'circle'} size={16} color={on ? 'var(--fc-indigo)' : 'var(--fc-muted)'} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{p.kind === '1to1' ? '1:1' : 'Group'} · {p.mode === 'online' ? 'Online' : 'Outdoor'}</div>
                </div>
                <span className="fc-display fc-tabnum" style={{ fontSize: 12.5, fontWeight: 700 }}>₹{p.fee.toLocaleString('en-IN')}</span>
              </button>
            )
          })}
        </div>

        <div style={{ fontSize: 10.5, color: 'var(--fc-muted)', marginBottom: 4 }}>Goal (optional)</div>
        <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Fat loss"
          style={{ width: '100%', boxSizing: 'border-box', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '9px 11px', fontSize: 13, fontFamily: 'var(--fc-font-body)', outline: 'none', marginBottom: 14 }} />

        <button disabled={!ready} onClick={() => onAdd(addClient(name, plan, goal))}
          style={{ width: '100%', background: ready ? 'var(--fc-indigo)' : 'rgba(90,74,227,0.4)', color: '#fff', border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 600 }}>
          Add client · ₹{sel.fee.toLocaleString('en-IN')} plan
        </button>
      </div>
    </div>
  )
}

function ClientRow({ c, onOpen }: { c: Client; onOpen: () => void }) {
  const due = clientDue(c)
  const st = STATUS_LABEL[c.nutrition]
  return (
    <div role="button" tabIndex={0} onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}
      style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', cursor: 'pointer',
        border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 11, marginBottom: 9 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)', flex: '0 0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{c.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</span>
          {c.live && <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--fc-rating-green)', background: '#E4F3EA', padding: '1px 6px', borderRadius: 999 }}>● LIVE</span>}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--fc-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {c.plan} · {c.kind === '1to1' ? '1:1' : 'Group'} · {c.mode === 'online' ? 'Online' : 'Outdoor'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <span style={{ fontSize: 8.5, fontWeight: 600, color: st.fg, background: st.bg, padding: '2px 6px', borderRadius: 999 }}>{st.label}</span>
          <span style={{ fontSize: 9.5, color: 'var(--fc-muted)' }}>{attendancePct(c)}% attend</span>
          {due > 0 && <span style={{ fontSize: 8.5, fontWeight: 700, color: '#A32D2D', background: '#FCEBEB', padding: '2px 6px', borderRadius: 999 }}>₹{due.toLocaleString('en-IN')} due</span>}
        </div>
      </div>
      <Icon name="chevron-right" size={16} color="var(--fc-muted)" />
    </div>
  )
}
