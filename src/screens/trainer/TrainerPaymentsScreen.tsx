import { useState } from 'react'
import { useNav } from '../../nav/NavContext'
import { clients, clientDue, collectedTotal, rosterStats, markFullyPaid, payments, type Client } from '../../data/clients'
import { Icon } from '../../components/Icon'

const rupees = (n: number) => '₹' + n.toLocaleString('en-IN')
type Filter = 'outstanding' | 'paid' | 'all'
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'outstanding', label: 'Outstanding' },
  { key: 'paid', label: 'Paid up' },
  { key: 'all', label: 'All' },
]

export function TrainerPaymentsScreen() {
  const nav = useNav()
  const [filter, setFilter] = useState<Filter>('outstanding')
  const [, force] = useState(0)
  const rs = rosterStats()
  const owing = clients.filter((c) => clientDue(c) > 0).length

  const list = clients.filter((c) => filter === 'all' ? true : filter === 'paid' ? clientDue(c) === 0 : clientDue(c) > 0)
    .sort((a, b) => clientDue(b) - clientDue(a))

  const stat = (value: string, label: string, accent?: string) => (
    <div style={{ flex: 1, background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
      <div className="fc-display fc-tabnum" style={{ fontSize: 15, fontWeight: 700, color: accent ?? 'var(--fc-indigo)' }}>{value}</div>
      <div style={{ fontSize: 9.5, color: 'var(--fc-muted)' }}>{label}</div>
    </div>
  )

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 13 }}>
        {stat(rupees(collectedTotal()), 'collected', 'var(--fc-rating-green)')}
        {stat(rupees(rs.dues), 'outstanding', rs.dues ? '#A32D2D' : undefined)}
        {stat(`${owing}`, 'owing', owing ? 'var(--fc-coral)' : undefined)}
      </div>

      <div style={{ display: 'flex', gap: 7, marginBottom: 12 }}>
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{ flex: '0 0 auto', border: 'none', borderRadius: 999, padding: '6px 13px', fontSize: 11, fontWeight: 600,
              background: filter === f.key ? 'var(--fc-indigo)' : '#fff', color: filter === f.key ? '#fff' : 'var(--fc-muted)',
              boxShadow: filter === f.key ? 'none' : 'inset 0 0 0 0.5px rgba(20,20,43,0.14)' }}>{f.label}</button>
        ))}
      </div>

      {list.map((c) => <PayRow key={c.id} c={c} onOpen={() => nav.push({ name: 'trClientProfile', params: { id: c.id } })}
        onCollect={() => { markFullyPaid(c.id); force((n) => n + 1) }} />)}
      {list.length === 0 && <div style={{ fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center', padding: 20 }}>No clients here.</div>}

      <div className="fc-display" style={{ fontSize: 12.5, fontWeight: 700, margin: '14px 0 9px' }}>Recent payments</div>
      {payments.slice(0, 8).map((p) => (
        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '9px 11px', marginBottom: 7 }}>
          <Icon name="circle-check" size={16} color="var(--fc-rating-green)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{p.date}</div>
          </div>
          <span className="fc-display fc-tabnum" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--fc-rating-green)' }}>+{rupees(p.amount)}</span>
        </div>
      ))}
    </div>
  )
}

function PayRow({ c, onOpen, onCollect }: { c: Client; onOpen: () => void; onCollect: () => void }) {
  const due = clientDue(c)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 13, padding: 10, marginBottom: 8 }}>
      <div role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => { if (e.key === 'Enter') onOpen() }}
        style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', minWidth: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)', flex: '0 0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{c.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.name}</div>
          <div className="fc-tabnum" style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{rupees(c.paid)} / {rupees(c.feeTotal)} · {c.plan}</div>
        </div>
      </div>
      {due > 0
        ? <button onClick={onCollect} style={{ flex: '0 0 auto', background: 'var(--fc-green)', color: '#fff', border: 'none', borderRadius: 9, padding: '7px 11px', fontSize: 11, fontWeight: 600 }}>
            Collect {rupees(due)}
          </button>
        : <span style={{ flex: '0 0 auto', fontSize: 9.5, fontWeight: 700, color: 'var(--fc-rating-green)', background: '#E4F3EA', padding: '4px 9px', borderRadius: 999 }}>Paid up</span>}
    </div>
  )
}
