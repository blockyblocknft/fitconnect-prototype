import type { Booking } from '../lib/types'

export const bookings: Booking[] = [
  {
    id: 'b1', programName: '12-Week Strength Builder', trainerName: 'Aanand R.', status: 'confirmed',
    progressKind: 'weeks', current: 3, total: 12,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    sessions: [
      { id: 's1', index: 1, title: 'Lower body', date: 'Mon 9 Jun', time: '6:00 PM', when: 'past', status: 'attended',
        feedback: 'Great squat depth — add tempo on the way down next time.',
        qa: [{ author: 'you', text: 'Should I ice my knee after?' },
             { author: 'coach', text: 'Only if swollen — otherwise just rest.' }] },
      { id: 's2', index: 2, title: 'Upper body', date: 'Wed 11 Jun', time: '6:00 PM', when: 'past', status: 'attended',
        feedback: 'Solid bench form — keep the elbows tucked.', qa: [] },
      { id: 's3', index: 3, title: 'Core & conditioning', date: 'Fri 13 Jun', time: '6:00 PM', when: 'past', status: 'attended', qa: [] },
      { id: 's4', index: 4, title: 'Lower body', date: 'Mon 16 Jun', time: '6:00 PM', when: 'past', status: 'missed', qa: [] },
      { id: 's5', index: 5, title: 'Upper body', date: 'Thu 18 Jun', time: '6:00 PM', when: 'today', status: 'inprogress', qa: [] },
      { id: 's6', index: 6, title: 'Lower body', date: 'Sat 20 Jun', time: '6:00 PM', when: 'future', status: 'upcoming', qa: [] },
      { id: 's7', index: 7, title: 'Core & conditioning', date: 'Tue 23 Jun', time: '6:00 PM', when: 'future', status: 'upcoming', qa: [] },
      { id: 's8', index: 8, title: 'Deload', date: 'Thu 25 Jun', time: '6:00 PM', when: 'future', status: 'upcoming', qa: [] },
    ],
  },
  {
    id: 'b2', programName: 'Daily mobility flow', trainerName: 'Sara M.', status: 'awaiting',
    progressKind: 'days', current: 9, total: 30,
    meetLink: 'https://meet.google.com/xyz-mnop-qrs',
    sessions: [
      { id: 'm1', index: 1, title: 'Morning flow', date: 'Mon 16 Jun', time: '7:30 AM', when: 'past', status: 'attended', qa: [] },
      { id: 'm2', index: 2, title: 'Hip opener', date: 'Tue 17 Jun', time: '7:30 AM', when: 'past', status: 'missed', qa: [] },
      { id: 'm3', index: 3, title: 'Spine mobility', date: 'Thu 18 Jun', time: '7:30 AM', when: 'today', status: 'inprogress', qa: [] },
      { id: 'm4', index: 4, title: 'Shoulder flow', date: 'Fri 19 Jun', time: '7:30 AM', when: 'future', status: 'upcoming', qa: [] },
    ],
  },
]

export function getBooking(id: string) {
  return bookings.find((b) => b.id === id)
}
export function cancelBooking(id: string) {
  const b = bookings.find((x) => x.id === id)
  if (b) b.status = 'cancelled'
}
