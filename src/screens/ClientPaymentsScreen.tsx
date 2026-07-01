import { useState } from 'react'
import { clients, clientDue, recordPayment, payments } from '../data/clients'
import { Icon } from '../components/Icon'

const rupees = (n: number) => '₹' + n.toLocaleString('en-IN')

// Client-side view of their own money: plan fee, paid, balance + the payment
// history recorded by them or the coach.
export function ClientPaymentsScreen() {
  const [, force] = useState(0)
  const me = clients.find((c) => c.live) ?? clients[0]
  const due = clientDue(me)
  const history = payments.filter((p) => p.name === me.name)

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 13, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>{me.plan}</span>
          <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, borderRadius: 999, padding: '2px 9px',
            color: due > 0 ? '#A32D2D' : 'var(--fc-rating-green)', background: due > 0 ? '#FCEBEB' : '#E4F3EA' }}>
            {due > 0 ? `${rupees(due)} due` : 'Paid up'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['Plan fee', me.feeTotal, 'var(--fc-ink)'], ['Paid', me.paid, 'var(--fc-rating-green)'], ['Balance', due, due > 0 ? '#A32D2D' : 'var(--fc-muted)']].map(([l, v, col]) => (
            <div key={l as string} style={{ flex: 1, background: 'var(--fc-surface)', borderRadius: 10, padding: '9px 6px', textAlign: 'center' }}>
              <div className="fc-display fc-tabnum" style={{ fontSize: 14, fontWeight: 700, color: col as string }}>{rupees(v as number)}</div>
              <div style={{ fontSize: 9.5, color: 'var(--fc-muted)' }}>{l as string}</div>
            </div>
          ))}
        </div>
        {due > 0 && (
          <button onClick={() => { recordPayment(me.id, due); force((n) => n + 1) }}
            style={{ width: '100%', marginTop: 11, background: 'var(--fc-green)', color: '#fff', border: 'none', borderRadius: 11, padding: 11, fontSize: 13, fontWeight: 600 }}>
            Pay balance · {rupees(due)}
          </button>
        )}
      </div>

      <div className="fc-display" style={{ fontSize: 12.5, fontWeight: 700, margin: '4px 0 9px' }}>Payment history</div>
      {history.length === 0
        ? <div style={{ fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center', padding: 18 }}>No payments recorded yet.</div>
        : history.map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '10px 12px', marginBottom: 8 }}>
            <Icon name="circle-check" size={16} color="var(--fc-rating-green)" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{me.plan}</div>
              <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{p.date}</div>
            </div>
            <span className="fc-display fc-tabnum" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--fc-rating-green)' }}>{rupees(p.amount)}</span>
          </div>
        ))}
    </div>
  )
}
