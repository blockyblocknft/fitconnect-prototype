import type { Trainer } from '../lib/types'

export const trainers: Trainer[] = [
  {
    id: 't1', name: 'Aanand R.', specialty: 'Strength · Fat loss', years: 8, rating: 4.9,
    type: ['1to1', 'group'], location: { kind: 'local', area: 'Indiranagar', km: 2.1 },
    fromPriceLabel: 'from ₹600 / session', verified: true, trial: { priceLabel: '₹300' },
    programs: [
      { id: 'p1', trainerId: 't1', name: '12-Week Strength Builder', category: 'Strength programs',
        cadence: 'multi', scheduleLabel: '3x / week · live + plan', priceLabel: '₹7,200 / 12 wks',
        bestseller: true, advancePct: 25, feeTotal: 7200,
        benefits: ['36 live coached sessions', 'Custom workout + meal plan', 'Weekly check-in & chat'] },
      { id: 'p2', trainerId: 't1', name: 'Daily morning strength', category: 'Strength programs',
        cadence: 'daily', scheduleLabel: 'Every day · 30 min', priceLabel: '₹600 / session',
        advancePct: 20, feeTotal: 600, benefits: ['Live 30-min session', 'Form correction', 'Daily streak'] },
    ],
    groupSessions: [
      { id: 'g1', title: 'Morning HIIT · on-ground', scheduleLabel: 'Mon/Wed/Fri', placeLabel: 'Indiranagar',
        priceLabel: '₹250', spotsTaken: 14, spotsMax: 20 },
    ],
    events: [
      { id: 'te1', title: 'Strength bootcamp', dateLabel: 'Sat · 6 AM', placeLabel: 'Indiranagar',
        priceLabel: '₹400', spotsTaken: 9, spotsMax: 12 },
      { id: 'te2', title: 'Mobility workshop', dateLabel: 'Sun · 8 AM', placeLabel: 'Koramangala',
        priceLabel: '₹300', spotsTaken: 5, spotsMax: 20 },
    ],
  },
  {
    id: 't2', name: 'Sara M.', specialty: 'Yoga · Mobility', years: 6, rating: 4.8,
    type: ['1to1', 'group'], location: { kind: 'online', intl: true },
    fromPriceLabel: 'from ₹450 / session', verified: true, trial: { priceLabel: '₹250' },
    programs: [
      { id: 'p3', trainerId: 't2', name: 'Daily mobility flow', category: 'Mobility programs',
        cadence: 'daily', scheduleLabel: 'Every day · 20 min', priceLabel: '₹450 / session',
        advancePct: 30, feeTotal: 4500, benefits: ['Guided mobility', 'Posture reset', 'Recovery focus'] },
    ],
    groupSessions: [
      { id: 'g2', title: 'Sunrise yoga · online', scheduleLabel: 'Tue/Thu', placeLabel: 'Online',
        priceLabel: '₹200', spotsTaken: 6, spotsMax: 25 },
    ],
    events: [],
  },
]

export function getTrainer(id: string) {
  return trainers.find((t) => t.id === id)
}
