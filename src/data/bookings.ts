import type { Booking, BookedSession, Program, Discipline } from '../lib/types'

export function discOfCategory(category: string): Discipline {
  const c = category.toLowerCase()
  if (c.includes('mobility')) return 'mobility'
  if (c.includes('hiit')) return 'hiit'
  if (c.includes('pilates')) return 'pilates'
  if (c.includes('circuit')) return 'circuit'
  if (c.includes('hyrox')) return 'hyrox'
  return 'strengthening'
}

export const bookings: Booking[] = [
  {
    id: 'b1', programName: '12-Week Strength Builder', trainerName: 'Aanand R.', status: 'confirmed',
    kind: '1to1', mode: 'inperson', discipline: 'strengthening', progressKind: 'weeks', current: 3, total: 12,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    sessions: [
      { id: 's1', index: 1, title: 'Lower body', date: 'Mon 9 Jun', time: '6:00 PM', when: 'past', status: 'attended',
        feedback: 'Great squat depth — add tempo on the way down next time.',
        qa: [{ author: 'you', text: 'Should I ice my knee after?' },
             { author: 'coach', text: 'Only if swollen — otherwise just rest.' }] },
      { id: 's2', index: 2, title: 'Upper body', date: 'Wed 11 Jun', time: '6:00 PM', when: 'past', status: 'attended',
        feedback: 'Solid bench form — keep the elbows tucked.', qa: [] },
      { id: 's3', index: 3, title: 'Core & conditioning', date: 'Fri 13 Jun', time: '6:00 PM', when: 'past', status: 'attended', qa: [] },
      { id: 's4', index: 4, title: 'Lower body', date: 'Mon 16 Jun', time: '6:00 PM', when: 'past', status: 'noshow', qa: [] },
      { id: 's5', index: 5, title: 'Upper body', date: 'Thu 18 Jun', time: '6:00 PM', when: 'today', status: 'confirmed', qa: [] },
      { id: 's6', index: 6, title: 'Lower body', date: 'Sat 20 Jun', time: '6:00 PM', when: 'future', status: 'confirmed', qa: [] },
      { id: 's7', index: 7, title: 'Core & conditioning', date: 'Tue 23 Jun', time: '6:00 PM', when: 'future', status: 'confirmed', qa: [] },
      { id: 's8', index: 8, title: 'Deload', date: 'Thu 25 Jun', time: '6:00 PM', when: 'future', status: 'confirmed', qa: [] },
    ],
  },
  {
    id: 'b2', programName: 'Daily mobility flow', trainerName: 'Aanand R.', status: 'awaiting',
    kind: 'group', mode: 'online', discipline: 'mobility', progressKind: 'days', current: 9, total: 30,
    meetLink: 'https://meet.google.com/xyz-mnop-qrs',
    sessions: [
      { id: 'm1', index: 1, title: 'Morning flow', date: 'Mon 16 Jun', time: '7:30 AM', when: 'past', status: 'attended', qa: [] },
      { id: 'm2', index: 2, title: 'Hip opener', date: 'Tue 17 Jun', time: '7:30 AM', when: 'past', status: 'noshow', qa: [] },
      { id: 'm3', index: 3, title: 'Spine mobility', date: 'Thu 18 Jun', time: '7:30 AM', when: 'today', status: 'confirmed', qa: [] },
      { id: 'm4', index: 4, title: 'Shoulder flow', date: 'Fri 19 Jun', time: '7:30 AM', when: 'future', status: 'confirmed', qa: [] },
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
export function rescheduleSession(bookingId: string, sessionId: string, date: string, time: string) {
  const s = bookings.find((b) => b.id === bookingId)?.sessions.find((x) => x.id === sessionId)
  if (s) { s.date = date; s.time = time }
}

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export interface SlotChoice { dayOffset: number; dateLabel: string; timeLabel: string }

export interface Recurrence { days: number[]; timeLabel: string }

// Generate the program's sessions on the chosen recurring weekdays at the set time.
function buildRecurringSessions(program: Program, rec: Recurrence): BookedSession[] {
  const count = program.cadence === 'daily' ? 6 : 8
  const out: BookedSession[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1) // start tomorrow
  let guard = 0
  while (out.length < count && guard++ < 200) {
    if (rec.days.length === 0 || rec.days.includes(d.getDay())) {
      const i = out.length + 1
      out.push({ id: `${program.id}-s${i}`, index: i, title: `Session ${i}`,
        date: `${WD[d.getDay()]} ${d.getDate()}`, time: rec.timeLabel, when: 'future', status: 'confirmed', qa: [] })
    }
    d.setDate(d.getDate() + 1)
  }
  return out
}

// Create a real booking from a program checkout with its recurring schedule.
// Dedups by program name so re-booking the same program doesn't add a duplicate card.
export function addBooking(program: Program, trainerName: string, rec: Recurrence, mode: 'online' | 'inperson' = 'inperson'): string {
  const existing = bookings.find((b) => b.programName === program.name)
  if (existing) return existing.id
  const booking: Booking = {
    id: `bk-${program.id}`, programName: program.name, trainerName, status: 'awaiting',
    kind: '1to1', mode, discipline: discOfCategory(program.category), progressKind: program.cadence === 'daily' ? 'days' : 'weeks', current: 0,
    total: program.cadence === 'daily' ? 30 : 12, meetLink: 'https://meet.google.com/new',
    sessions: buildRecurringSessions(program, rec),
  }
  bookings.unshift(booking)
  return booking.id
}

// A one-off booking (trial / group class) on a single chosen slot.
export function addSingleBooking(
  name: string, trainerName: string, slot: SlotChoice,
  kind: 'group' | '1to1' = '1to1', mode: 'online' | 'inperson' = 'inperson', discipline: Discipline = 'strengthening',
): string {
  const id = `bk-${Date.now()}`
  bookings.unshift({
    id, programName: name, trainerName, status: 'awaiting', kind, mode, discipline, progressKind: 'days', current: 0, total: 1,
    meetLink: 'https://meet.google.com/new',
    sessions: [{ id: `${id}-s1`, index: 1, title: name, date: slot.dateLabel, time: slot.timeLabel, when: 'future', status: 'confirmed', qa: [] }],
  })
  return id
}
