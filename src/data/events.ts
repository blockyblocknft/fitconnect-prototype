import type { TrainerEvent } from '../lib/types'

export const globalEvents: TrainerEvent[] = [
  { id: 'e1', title: 'Weekend trail run', dateLabel: 'Sat · 7:00 AM', placeLabel: 'Cubbon Park',
    free: true, spotsTaken: 18, spotsMax: 30 },
  { id: 'e2', title: 'Sunrise yoga in the park', dateLabel: 'Sun · 6:30 AM', placeLabel: 'Lalbagh',
    priceLabel: '₹200', spotsTaken: 14, spotsMax: 15 },
]
