import { globalEvents } from '../data/events'
import { EventCard } from '../components/cards/EventCard'

export function EventsScreen() {
  return (
    <div style={{ padding: '12px 14px', background: 'var(--fc-surface)', flex: 1 }}>
      {globalEvents.map((e) => <EventCard key={e.id} event={e} />)}
    </div>
  )
}
