import type { Program } from '../../lib/types'
import { useNav } from '../../nav/NavContext'
import { Badge } from '../Badge'
import { Button } from '../Button'

export function ProgramCard({ program }: { program: Program }) {
  const nav = useNav()
  return (
    <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: '11px 12px',
      marginBottom: 10, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1 }}>
          {program.bestseller && <Badge tone="green">★ Bestseller</Badge>}
          <div className="fc-display" style={{ fontSize: 13, fontWeight: 600, margin: '6px 0 2px' }}>{program.name}</div>
          <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{program.scheduleLabel}</div>
          <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>{program.priceLabel}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button variant="secondary" style={{ padding: '7px 16px', fontSize: 12 }}
            onClick={() => nav.push({ name: 'checkout', params: { programId: program.id } })}>BOOK</Button>
        </div>
      </div>
    </div>
  )
}
