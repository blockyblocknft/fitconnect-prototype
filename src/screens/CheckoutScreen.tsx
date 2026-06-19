import { trainers } from '../data/trainers'
import { useNav } from '../nav/NavContext'
import { Icon } from '../components/Icon'
import { Button } from '../components/Button'

function findProgram(id: string) {
  for (const t of trainers) { const p = t.programs.find((x) => x.id === id); if (p) return { p, t } }
  return null
}
const rupees = (n: number) => '₹' + n.toLocaleString('en-IN')

export function CheckoutScreen({ programId }: { programId: string }) {
  const nav = useNav()
  const found = findProgram(programId)
  if (!found) return <div style={{ padding: 16 }}>Program not found</div>
  const { p, t } = found
  const advance = Math.round(p.feeTotal * (p.advancePct / 100))
  const balance = p.feeTotal - advance
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 12 }}>
        <div className="fc-display" style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', margin: '2px 0 10px' }}>with {t.name} · {p.scheduleLabel}</div>
        <div className="fc-display" style={{ fontSize: 11, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 6 }}>WHAT YOU GET</div>
        {p.benefits.map((b) => (
          <div key={b} style={{ fontSize: 12, lineHeight: 1.9, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="check" size={14} color="var(--fc-green)" />{b}
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 12 }}>
        <Row label="Program fee" value={rupees(p.feeTotal)} />
        <Row label={`Pay advance now (${p.advancePct}%)`} value={rupees(advance)} strong />
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(20,20,43,0.12)', paddingTop: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--fc-muted)' }}>Balance before start</span>
          <span className="fc-tabnum" style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{rupees(balance)}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', background: '#FAEEDA', borderRadius: 10,
        padding: '9px 11px', marginBottom: 11 }}>
        <Icon name="clock" size={14} color="#854F0B" />
        <div style={{ fontSize: 11, color: '#854F0B', lineHeight: 1.5 }}>
          This sends a <b>request</b> to {t.name}. Your advance is <b>held</b> until they confirm — you’ll be notified.
        </div>
      </div>
      <Button full style={{ padding: 12, fontSize: 14 }}
        onClick={() => nav.push({ name: 'bookingConfirm', params: { programId } })}>
        Pay advance {rupees(advance)}
      </Button>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 12, color: strong ? 'var(--fc-ink)' : 'var(--fc-muted)', fontWeight: strong ? 600 : 400 }}>{label}</span>
      <span className="fc-display fc-tabnum" style={{ fontSize: strong ? 13 : 12,
        color: strong ? 'var(--fc-indigo)' : 'var(--fc-ink)', fontWeight: strong ? 700 : 400 }}>{value}</span>
    </div>
  )
}
