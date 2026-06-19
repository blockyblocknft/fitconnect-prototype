import { useNav } from '../../nav/NavContext'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { CapacityBar } from '../CapacityBar'

export type OfferingKind = 'trial' | 'daily' | 'weekly' | 'group' | 'event'

export interface Offering {
  id: string
  kind: OfferingKind
  name: string
  sub: string
  price: string
  programId?: string
  bestseller?: boolean
  spotsTaken?: number
  spotsMax?: number
}

const KIND_LABEL: Record<OfferingKind, string> = {
  trial: 'Trial', daily: 'Daily', weekly: 'Weekly', group: 'Group', event: 'Event',
}

export function OfferingCard({ offering }: { offering: Offering }) {
  const nav = useNav()
  const onBook = () =>
    offering.programId
      ? nav.push({ name: 'checkout', params: { programId: offering.programId } })
      : nav.push({ name: 'bookingConfirm' })

  return (
    <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: '11px 12px',
      marginBottom: 10, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <Badge tone="indigo">{KIND_LABEL[offering.kind]}</Badge>
            {offering.bestseller && <Badge tone="green">★ Bestseller</Badge>}
          </div>
          <div className="fc-display" style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{offering.name}</div>
          <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{offering.sub}</div>
          <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>{offering.price}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button variant="secondary" aria-label={`Book ${offering.name}`} style={{ padding: '7px 16px', fontSize: 12 }} onClick={onBook}>BOOK</Button>
        </div>
      </div>
      {offering.spotsTaken !== undefined && offering.spotsMax !== undefined && (
        <div style={{ marginTop: 9 }}><CapacityBar taken={offering.spotsTaken} max={offering.spotsMax} /></div>
      )}
    </div>
  )
}
