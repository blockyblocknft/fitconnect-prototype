import { useState } from 'react'
import { clientNutrition, STATUS_LABEL } from '../../data/trainerView'
import { AUDIT } from '../../data/auditNotes'
import { AuditButton } from '../../components/AuditButton'
import { Icon } from '../../components/Icon'

export function TrainerClientsScreen() {
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }}>
        <span className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>Client nutrition · today</span>
        <AuditButton note={AUDIT.nutritionReview} />
      </div>

      {clientNutrition.map((c) => {
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
                  : c.meals.map((m, i) => (
                    <div key={i} style={{ marginBottom: 9 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{m.type} · {m.name}</span>
                        <span className="fc-tabnum" style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{m.cal} kcal</span>
                      </div>
                      {m.comment && (
                        <div style={{ fontSize: 11, color: 'var(--fc-indigo)', marginTop: 2 }}>
                          <b style={{ fontWeight: 600 }}>You:</b> {m.comment}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--fc-surface)', borderRadius: 9,
                        padding: '6px 9px', marginTop: 5 }}>
                        <Icon name="message-dots" size={13} color="var(--fc-muted)" />
                        <span style={{ flex: 1, fontSize: 11, color: '#A0A0A8' }}>Add a comment…</span>
                        <Icon name="send" size={14} color="var(--fc-indigo)" />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
