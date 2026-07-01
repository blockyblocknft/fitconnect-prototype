import type { SessionType, Discipline } from '../lib/types'

export type Attendance = 'confirmed' | 'attended' | 'noshow'
export interface RosterClient { id: string; name: string; initials: string; attendance: Attendance }
export interface TrainerSession {
  id: string
  title: string
  time: string
  today: boolean
  mode: 'online' | 'inperson'
  place: string
  capacity: number
  clients: RosterClient[]
  kind?: SessionType         // 1:1 vs group
  discipline?: Discipline    // focus trained
  price?: number             // ₹ per client
  repeatWeeks?: number       // >1 if part of a recurring series
  // Structured scheduling used by the reconciled trainer calendar. Older screens
  // still read `time`/`today`; the calendar reads these.
  program?: string
  dayOffset?: number     // 0 = today … 6
  start?: number         // minutes from midnight
  durationMin?: number
}

let _cid = 100
const ppl = (names: [string, string][]): RosterClient[] =>
  names.map(([name, initials]) => ({ id: `c${++_cid}`, name, initials, attendance: 'confirmed' as Attendance }))

export const trainerSessions: TrainerSession[] = [
  { id: 'ts1', title: 'Morning HIIT', time: 'Today · 6:00 AM', today: true, mode: 'inperson', place: 'Indiranagar', capacity: 20,
    program: 'HIIT Bootcamp', dayOffset: 0, start: 360, durationMin: 60,
    clients: [
      { id: 'c1', name: 'Priya N.', initials: 'PN', attendance: 'attended' },
      { id: 'c2', name: 'Rahul K.', initials: 'RK', attendance: 'confirmed' },
      { id: 'c3', name: 'Meera S.', initials: 'MS', attendance: 'noshow' },
    ] },
  { id: 'ts2', title: '1:1 Strength · Prabu', time: 'Today · 6:00 PM', today: true, mode: 'online', place: 'Google Meet', capacity: 1,
    program: '1:1 Coaching', dayOffset: 0, start: 1080, durationMin: 60,
    clients: [{ id: 'c4', name: 'Prabu S.', initials: 'PS', attendance: 'confirmed' }] },
  // Deliberate clash with the 1:1 above (18:00–19:00 vs 18:30–19:30) — the calendar reconciles this.
  { id: 'ts9', title: 'Power Yoga', time: 'Today · 6:30 PM', today: true, mode: 'inperson', place: 'Indiranagar', capacity: 12,
    program: 'Yoga Flow', dayOffset: 0, start: 1110, durationMin: 60,
    clients: ppl([['Devi K.', 'DK'], ['Sam P.', 'SP'], ['Lia M.', 'LM']]) },
  { id: 'ts3', title: 'Mobility group', time: 'Tomorrow · 7:30 AM', today: false, mode: 'inperson', place: 'Koramangala', capacity: 15,
    program: 'Mobility', dayOffset: 1, start: 450, durationMin: 60,
    clients: [
      { id: 'c5', name: 'Anu R.', initials: 'AR', attendance: 'confirmed' },
      { id: 'c6', name: 'Vikram T.', initials: 'VT', attendance: 'confirmed' },
    ] },
  { id: 'ts4', title: '1:1 Strength · Anu', time: 'Sun · 7:00 AM', today: false, mode: 'online', place: 'Google Meet', capacity: 1,
    program: '1:1 Coaching', dayOffset: 2, start: 420, durationMin: 45, clients: ppl([['Anu R.', 'AR']]) },
  { id: 'ts5', title: 'Evening HIIT', time: 'Sun · 6:00 PM', today: false, mode: 'inperson', place: 'Indiranagar', capacity: 20,
    program: 'HIIT Bootcamp', dayOffset: 2, start: 1080, durationMin: 45, clients: ppl([['Ravi T.', 'RT'], ['Neha J.', 'NJ']]) },
  { id: 'ts6', title: 'Group Strength', time: 'Mon · 9:00 AM', today: false, mode: 'inperson', place: 'Koramangala', capacity: 16,
    program: 'Strength Club', dayOffset: 3, start: 540, durationMin: 60, clients: ppl([['Kiran B.', 'KB'], ['Mia D.', 'MD'], ['Joe L.', 'JL']]) },
  { id: 'ts7', title: '1:1 Strength · Vikram', time: 'Tue · 6:30 AM', today: false, mode: 'online', place: 'Google Meet', capacity: 1,
    program: '1:1 Coaching', dayOffset: 4, start: 390, durationMin: 45, clients: ppl([['Vikram T.', 'VT']]) },
  { id: 'ts8', title: 'Weekend Bootcamp', time: 'Wed · 8:00 AM', today: false, mode: 'inperson', place: 'Cubbon Park', capacity: 25,
    program: 'HIIT Bootcamp', dayOffset: 5, start: 480, durationMin: 90, clients: ppl([['Tara V.', 'TV'], ['Om P.', 'OP']]) },
]

export type NutritionStatus = 'nolog' | 'partial' | 'ontrack' | 'over'
export interface ClientMeal { type: string; name: string; cal: number; comment?: string }
export interface ClientNutrition {
  id: string
  name: string
  initials: string
  status: NutritionStatus
  calories: number
  goal: number
  meals: ClientMeal[]
}
export const clientNutrition: ClientNutrition[] = [
  { id: 'n1', name: 'Prabu S.', initials: 'PS', status: 'ontrack', calories: 1450, goal: 1800,
    meals: [{ type: 'Breakfast', name: 'Oats + eggs', cal: 420, comment: 'Good protein start 👍' }, { type: 'Lunch', name: 'Chicken rice bowl', cal: 680 }] },
  { id: 'n2', name: 'Priya N.', initials: 'PN', status: 'over', calories: 2150, goal: 1700,
    meals: [{ type: 'Breakfast', name: 'Paratha x2', cal: 560 }, { type: 'Snack', name: 'Samosa', cal: 300, comment: 'Swap for fruit next time' }] },
  { id: 'n3', name: 'Rahul K.', initials: 'RK', status: 'partial', calories: 520, goal: 2000,
    meals: [{ type: 'Breakfast', name: 'Coffee + toast', cal: 520 }] },
  { id: 'n4', name: 'Meera S.', initials: 'MS', status: 'nolog', calories: 0, goal: 1600, meals: [] },
]

export const STATUS_LABEL: Record<NutritionStatus, { label: string; bg: string; fg: string }> = {
  nolog: { label: 'No log', bg: 'var(--fc-surface)', fg: 'var(--fc-muted)' },
  partial: { label: 'Partial', bg: '#FAEEDA', fg: '#854F0B' },
  ontrack: { label: 'On track', bg: '#E4F3EA', fg: 'var(--fc-rating-green)' },
  over: { label: 'Over target', bg: '#FCEBEB', fg: '#A32D2D' },
}

// Coach hub — client questions awaiting a reply.
export interface CoachQuestion { id: string; client: string; initials: string; session: string; question: string; answered: boolean }
export const coachQuestions: CoachQuestion[] = [
  { id: 'q1', client: 'Priya N.', initials: 'PN', session: 'Morning HIIT', question: 'Should I ice my knee after the session?', answered: false },
  { id: 'q2', client: 'Prabu S.', initials: 'PS', session: '1:1 Strength', question: 'Is it okay to train fasted in the morning?', answered: false },
  { id: 'q3', client: 'Rahul K.', initials: 'RK', session: 'Morning HIIT', question: 'Can you share the warm-up routine?', answered: true },
]

// Coach hub — cohort community feed.
export interface CoachPost { id: string; author: string; initials: string; coach: boolean; text: string }
export const coachCommunity: CoachPost[] = [
  { id: 'p1', author: 'You', initials: 'AR', coach: true, text: 'Welcome to the cohort 💪 Drop your week-3 wins here!' },
  { id: 'p2', author: 'Priya', initials: 'PN', coach: false, text: 'Hit a 60kg squat today, thanks coach!' },
  { id: 'p3', author: 'Rahul', initials: 'RK', coach: false, text: 'Anyone training tomorrow 6pm? Let’s buddy up.' },
]

export function todayStats() {
  const today = trainerSessions.filter((s) => s.today)
  const booked = today.reduce((n, s) => n + s.clients.length, 0)
  const open = today.reduce((n, s) => n + (s.capacity - s.clients.length), 0)
  return { sessions: today.length, booked, open }
}
export function getTrainerSession(id: string) {
  return trainerSessions.find((s) => s.id === id)
}
export function addTrainerSession(s: TrainerSession) {
  trainerSessions.unshift(s)
}
export function updateTrainerSession(id: string, patch: Partial<TrainerSession>) {
  const s = trainerSessions.find((x) => x.id === id)
  if (s) Object.assign(s, patch)
}
export function removeTrainerSession(id: string) {
  const i = trainerSessions.findIndex((x) => x.id === id)
  if (i >= 0) trainerSessions.splice(i, 1)
}

// Clients the trainer can manually book into a session.
export const clientPool: { id: string; name: string; initials: string }[] = [
  { id: 'p1', name: 'Sneha M.', initials: 'SM' },
  { id: 'p2', name: 'Arjun D.', initials: 'AD' },
  { id: 'p3', name: 'Kavya R.', initials: 'KR' },
  { id: 'p4', name: 'Rohan B.', initials: 'RB' },
  { id: 'p5', name: 'Divya P.', initials: 'DP' },
]
export function addClientToSession(sessionId: string, client: { id: string; name: string; initials: string }) {
  const s = getTrainerSession(sessionId)
  if (s && s.clients.length < s.capacity && !s.clients.some((c) => c.id === client.id)) {
    s.clients.push({ ...client, attendance: 'confirmed' })
  }
}
