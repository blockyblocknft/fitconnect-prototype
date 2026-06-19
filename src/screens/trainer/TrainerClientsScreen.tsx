import { useState } from 'react'
import { clientNutrition, STATUS_LABEL, type NutritionStatus } from '../../data/trainerView'
import { Icon } from '../../components/Icon'

type Filter = 'all' | NutritionStatus
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'nolog', label: 'No log' },
  { key: 'partial', label: 'Partial' },
  { key: 'ontrack', label: 'On track' },
  { key: 'over', label: 'Over' },
]

export function TrainerClientsScreen() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  // Comments the trainer has posted this session, keyed by `${clientId}:${mealIndex}`.
  const [comments, setComments] = useState<Record<string, string>>({})
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const visible = clientNutrition.filter((c) => filter === 'all' || c.status === filter)

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ marginBottom: 11 }}>
        <span className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>Client nutrition · today</span>
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
          textAlign: 'center', color: 'var(--fc-muted)', fontSize: 12 }}>No clients in this state.</div>
      )}

      {visible.map((c) => {
        const st = STATUS_LABEL[c.status]
        const expanded = openId === c.id
        const pct = c.goal > 0 ? Math.min(100, Math.round((c.calories / c.goal) * 100)) : 0
        return (
          <div key={c.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 10 }}>
            <div role="button" tabIndex={0}
              onClick={() => setOpenId(expanded ? null : c.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenId(expanded ? null : c.id) } }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--fc-coral)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{c.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 600, color: st.fg, background: st.bg, padding: '2px 7px', borderRadius: 999 }}>{st.label}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 2 }} className="fc-tabnum">
                  {c.calories} / {c.goal} kcal · {c.meals.length} meals
                </div>
              </div>
              <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={18} color="#C4C4CF" />
            </div>
            <div style={{ height: 5, borderRadius: 999, background: 'var(--fc-surface)', overflow: 'hidden', marginTop: 9 }}>
              <div style={{ width: `${pct}%`, height: '100%', background: c.status === 'over' ? '#E24B4A' : 'var(--fc-green)' }} />
            </div>

            {expanded && (
              <div style={{ marginTop: 11, borderTop: '0.5px solid rgba(20,20,43,0.08)', paddingTop: 10 }}>
                {c.meals.length === 0
                  ? <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>No meals logged today.</div>
                  : c.meals.map((m, i) => {
                    const key = `${c.id}:${i}`
                    const posted = comments[key] ?? m.comment
                    const send = () => {
                      const text = (drafts[key] ?? '').trim()
                      if (!text) return
                      setComments((cm) => ({ ...cm, [key]: text }))
                      setDrafts((d) => ({ ...d, [key]: '' }))
                    }
                    return (
                      <div key={i} style={{ marginBottom: 9 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{m.type} · {m.name}</span>
                          <span className="fc-tabnum" style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{m.cal} kcal</span>
                        </div>
                        {posted && (
                          <div style={{ fontSize: 11, color: 'var(--fc-indigo)', marginTop: 2 }}>
                            <b style={{ fontWeight: 600 }}>You:</b> {posted}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--fc-surface)', borderRadius: 9,
                          padding: '4px 9px', marginTop: 5 }}>
                          <Icon name="message-dots" size={13} color="var(--fc-muted)" />
                          <input value={drafts[key] ?? ''} onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === 'Enter') send() }}
                            placeholder={posted ? 'Edit comment…' : 'Add a comment…'}
                            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 11,
                              fontFamily: 'var(--fc-font-body)', padding: '4px 0' }} />
                          <button onClick={send} aria-label="Send comment" style={{ background: 'transparent', border: 'none', display: 'flex' }}>
                            <Icon name="send" size={14} color="var(--fc-indigo)" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
