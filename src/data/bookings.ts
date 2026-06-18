import type { Booking } from '../lib/types'

export const bookings: Booking[] = [
  {
    id: 'b1', programName: '12-Week Strength Builder', trainerName: 'Aanand R.',
    progressKind: 'weeks', current: 3, total: 12,
    sessions: [
      { id: 's7', index: 7, title: 'Lower body', dateLabel: 'Mon · done', status: 'done',
        feedback: 'Great squat depth — add tempo on the way down next time.',
        qa: [{ author: 'you', text: 'Should I ice my knee after?' },
             { author: 'coach', text: 'Only if swollen — otherwise just rest.' }] },
      { id: 's8', index: 8, title: 'Upper body', dateLabel: 'Today · 6:00 PM', status: 'upcoming', qa: [] },
    ],
  },
  {
    id: 'b2', programName: 'Daily mobility flow', trainerName: 'Sara M.',
    progressKind: 'days', current: 9, total: 30, sessions: [],
  },
]

export function getBooking(id: string) {
  return bookings.find((b) => b.id === id)
}
