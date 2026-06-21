import type { Trainer } from '../lib/types'

export const trainers: Trainer[] = [
  {
    id: 't1', name: 'Aanand R.', specialty: 'Strength · Fat loss', years: 8, rating: 4.9,
    type: ['1to1', 'group'], location: { kind: 'local', area: 'Indiranagar', km: 2.1 },
    fromPriceLabel: 'from ₹600 / session', verified: true, trial: { priceLabel: '₹300' },
    disciplines: ['strengthening', 'hiit', 'hyrox'], modes: ['outdoor'],
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
      { id: 'g5', title: 'Hyrox prep · on-ground', scheduleLabel: 'Sat', placeLabel: 'Indiranagar',
        priceLabel: '₹320', spotsTaken: 8, spotsMax: 16 },
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
    disciplines: ['mobility', 'pilates'], modes: ['online'],
    programs: [
      { id: 'p3', trainerId: 't2', name: 'Daily mobility flow', category: 'Mobility programs',
        cadence: 'daily', scheduleLabel: 'Every day · 20 min', priceLabel: '₹450 / session',
        advancePct: 30, feeTotal: 4500, benefits: ['Guided mobility', 'Posture reset', 'Recovery focus'] },
    ],
    groupSessions: [
      { id: 'g2', title: 'Sunrise yoga · online', scheduleLabel: 'Tue/Thu', placeLabel: 'Online',
        priceLabel: '₹200', spotsTaken: 6, spotsMax: 25 },
      { id: 'g6', title: 'Reformer pilates · online', scheduleLabel: 'Mon/Wed', placeLabel: 'Online',
        priceLabel: '₹280', spotsTaken: 5, spotsMax: 12 },
    ],
    events: [],
  },
  {
    id: 't3', name: 'Kiran V.', specialty: 'HIIT · Conditioning', years: 5, rating: 4.6,
    type: ['1to1', 'group'], location: { kind: 'local', area: 'Koramangala', km: 3.5 },
    fromPriceLabel: 'from ₹500 / session', verified: true, trial: { priceLabel: '₹200' },
    disciplines: ['hiit', 'strengthening', 'circuit'], modes: ['outdoor', 'online'],
    programs: [
      { id: 'p4', trainerId: 't3', name: '8-Week Shred', category: 'HIIT programs', cadence: 'multi',
        scheduleLabel: '4x / week · live', priceLabel: '₹5,600 / 8 wks', advancePct: 25, feeTotal: 5600,
        benefits: ['32 live coached sessions', 'Conditioning + meal plan', 'Weekly check-in'] },
    ],
    groupSessions: [
      { id: 'g3', title: 'Power HIIT · hybrid', scheduleLabel: 'Mon/Thu', placeLabel: 'Koramangala / Online',
        priceLabel: '₹220', spotsTaken: 10, spotsMax: 18 },
      { id: 'g7', title: 'Circuit blast · on-ground', scheduleLabel: 'Tue/Fri', placeLabel: 'Koramangala',
        priceLabel: '₹230', spotsTaken: 11, spotsMax: 18 },
    ],
    events: [],
  },
  {
    id: 't4', name: 'Meera D.', specialty: 'Mobility · Recovery', years: 9, rating: 4.95,
    type: ['1to1', 'group'], location: { kind: 'online', intl: false },
    fromPriceLabel: 'from ₹900 / session', verified: true, trial: { priceLabel: '₹350' },
    disciplines: ['mobility'], modes: ['online'],
    programs: [
      { id: 'p5', trainerId: 't4', name: 'Recovery & mobility reset', category: 'Mobility programs', cadence: 'daily',
        scheduleLabel: 'Every day · 25 min', priceLabel: '₹900 / session', advancePct: 30, feeTotal: 9000,
        benefits: ['Guided mobility', 'Injury-safe progressions', 'Recovery focus'] },
    ],
    groupSessions: [
      { id: 'g4', title: 'Evening unwind · online', scheduleLabel: 'Wed/Sun', placeLabel: 'Online',
        priceLabel: '₹260', spotsTaken: 8, spotsMax: 30 },
    ],
    events: [],
  },
]

export function getTrainer(id: string) {
  return trainers.find((t) => t.id === id)
}
