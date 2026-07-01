import { useState } from 'react'
import type { TrainerEvent } from '../../lib/types'
import { Icon } from '../Icon'
import { CapacityBar } from '../CapacityBar'
import { Button } from '../Button'

export function EventCard({ event }: { event: TrainerEvent }) {
  const [going, setGoing] = useState(false)
  const [taken, setTaken] = useState(event.spotsTaken)
  const full = taken >= event.spotsMax && !going

  const toggle = () => {
    if (going) { setGoing(false); setTaken((n) => n - 1); event.spotsTaken -= 1 }
    else if (!full) { setGoing(true); setTaken((n) => n + 1); event.spotsTaken += 1 }
  }

  return (
    <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, background: '#fff',
      marginBottom: 11, overflow: 'hidden' }}>
      <div style={{ height: 70, background: event.free ? 'var(--fc-green)' : 'var(--fc-mist)', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="run" size={30} color="#fff" />
        <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 9, fontWeight: 600,
          color: event.free ? 'var(--fc-rating-green)' : 'var(--fc-ink)', background: '#fff',
          padding: '2px 8px', borderRadius: 999 }}>{event.free ? 'FREE' : event.priceLabel}</span>
        {going && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700, color: '#fff',
          background: 'rgba(20,20,43,0.4)', padding: '2px 8px', borderRadius: 999 }}>● You’re going</span>}
      </div>
      <div style={{ padding: '11px 12px' }}>
        <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{event.title}</div>
        <div style={{ display: 'flex', gap: 12, margin: '5px 0 9px', fontSize: 11, color: 'var(--fc-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={12} color="var(--fc-muted)" />{event.dateLabel}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={12} color="var(--fc-muted)" />{event.placeLabel}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ flex: 1 }}><CapacityBar taken={taken} max={event.spotsMax} /></div>
          {going ? (
            <Button variant="secondary" style={{ padding: '8px 14px', fontSize: 12 }} onClick={toggle}>Cancel</Button>
          ) : (
            <Button style={{ padding: '8px 16px', fontSize: 12, opacity: full ? 0.5 : 1 }} disabled={full} onClick={toggle}>
              {full ? 'Full' : event.free ? 'Join' : 'Book'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
