import type { Trainer } from '../lib/types'

// Single-trainer platform: one coach serves many clients. Every program,
// group class and event belongs to this trainer; the client app browses their
// offerings (by focus, 1:1 vs group, online vs outdoor) rather than a roster.
export const trainers: Trainer[] = [
  {
    id: 't1', name: 'Aanand R.', specialty: 'Strength · HIIT · Mobility', years: 8, rating: 4.9,
    type: ['1to1', 'group'], location: { kind: 'local', area: 'Indiranagar', km: 2.1 },
    fromPriceLabel: 'from ₹450 / session', verified: true,
    bio: 'Hi, I’m Aanand 👋 NASM-certified coach, 8 years getting busy people strong and pain-free. I run small live sessions — strength, HIIT and mobility — online or outdoors at Indiranagar, and write every plan around your body and schedule. Let’s build something that lasts.',
    trial: { priceLabel: '₹300' },
    disciplines: ['strengthening', 'hiit', 'hyrox', 'mobility', 'pilates', 'circuit'], modes: ['outdoor', 'online'],
    programs: [
      { id: 'p1', trainerId: 't1', name: '12-Week Strength Builder', category: 'Strength programs',
        cadence: 'multi', modes: ['outdoor', 'online'], scheduleLabel: '3x / week · live + plan', priceLabel: '₹7,200 / 12 wks',
        bestseller: true, advancePct: 25, feeTotal: 7200,
        benefits: ['36 live coached sessions', 'Custom workout + meal plan', 'Weekly check-in & chat'] },
      { id: 'p2', trainerId: 't1', name: 'Daily morning strength', category: 'Strength programs',
        cadence: 'daily', modes: ['outdoor'], scheduleLabel: 'Every day · 30 min', priceLabel: '₹600 / session',
        advancePct: 20, feeTotal: 600, benefits: ['Live 30-min session', 'Form correction', 'Daily streak'] },
      { id: 'p4', trainerId: 't1', name: '8-Week Shred', category: 'HIIT programs', cadence: 'multi',
        modes: ['outdoor', 'online'], scheduleLabel: '4x / week · live', priceLabel: '₹5,600 / 8 wks', advancePct: 25, feeTotal: 5600,
        benefits: ['32 live coached sessions', 'Conditioning + meal plan', 'Weekly check-in'] },
      { id: 'p3', trainerId: 't1', name: 'Daily mobility flow', category: 'Mobility programs',
        cadence: 'daily', modes: ['online'], scheduleLabel: 'Every day · 20 min', priceLabel: '₹450 / session',
        advancePct: 30, feeTotal: 4500, benefits: ['Guided mobility', 'Posture reset', 'Recovery focus'] },
    ],
    groupSessions: [
      { id: 'g1', title: 'Morning HIIT · on-ground', scheduleLabel: 'Mon/Wed/Fri', placeLabel: 'Indiranagar',
        priceLabel: '₹250', spotsTaken: 14, spotsMax: 20 },
      { id: 'g5', title: 'Hyrox prep · on-ground', scheduleLabel: 'Sat', placeLabel: 'Indiranagar',
        priceLabel: '₹320', spotsTaken: 8, spotsMax: 16 },
      { id: 'g7', title: 'Circuit blast · on-ground', scheduleLabel: 'Tue/Fri', placeLabel: 'Indiranagar',
        priceLabel: '₹230', spotsTaken: 11, spotsMax: 18 },
      { id: 'g2', title: 'Sunrise yoga · online', scheduleLabel: 'Tue/Thu', placeLabel: 'Online',
        priceLabel: '₹200', spotsTaken: 6, spotsMax: 25 },
      { id: 'g6', title: 'Reformer pilates · online', scheduleLabel: 'Mon/Wed', placeLabel: 'Online',
        priceLabel: '₹280', spotsTaken: 5, spotsMax: 12 },
      { id: 'g4', title: 'Evening unwind · online', scheduleLabel: 'Wed/Sun', placeLabel: 'Online',
        priceLabel: '₹260', spotsTaken: 8, spotsMax: 30 },
    ],
    events: [
      { id: 'te1', title: 'Strength bootcamp', dateLabel: 'Sat · 6 AM', placeLabel: 'Indiranagar',
        priceLabel: '₹400', spotsTaken: 9, spotsMax: 12 },
      { id: 'te2', title: 'Mobility workshop', dateLabel: 'Sun · 8 AM', placeLabel: 'Koramangala',
        priceLabel: '₹300', spotsTaken: 5, spotsMax: 20 },
    ],
  },
]

export function getTrainer(id: string) {
  return trainers.find((t) => t.id === id)
}
