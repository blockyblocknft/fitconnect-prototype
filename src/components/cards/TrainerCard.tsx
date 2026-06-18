import type { Trainer } from '../../lib/types'
import { useNav } from '../../nav/NavContext'
import { Icon } from '../Icon'
import { RatingPill } from '../RatingPill'

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  const nav = useNav()
  const loc = trainer.location
  return (
    <div role="button" onClick={() => nav.push({ name: 'trainer', params: { id: trainer.id } })}
      style={{ display: 'flex', gap: 10, padding: 10, border: '0.5px solid rgba(20,20,43,0.12)',
        borderRadius: 14, background: '#fff', marginBottom: 10, cursor: 'pointer' }}>
      <div style={{ width: 62, height: 62, borderRadius: 12, flex: '0 0 auto', background: 'var(--fc-indigo-tint)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="user" size={26} color="var(--fc-indigo)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{trainer.name}</div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', margin: '1px 0 6px' }}>{trainer.specialty}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <RatingPill rating={trainer.rating} />
          <span style={{ fontSize: 11, color: 'var(--fc-muted)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            {loc.kind === 'local'
              ? <><Icon name="map-pin" size={11} color="var(--fc-muted)" />{loc.km} km</>
              : <><Icon name="world" size={11} color="var(--fc-muted)" />Online · Intl</>}
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fc-indigo)', fontWeight: 600, marginTop: 5 }}>{trainer.fromPriceLabel}</div>
      </div>
    </div>
  )
}
