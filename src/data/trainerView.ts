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
}

export const trainerSessions: TrainerSession[] = [
  { id: 'ts1', title: 'Morning HIIT', time: 'Today · 6:00 AM', today: true, mode: 'inperson', place: 'Indiranagar', capacity: 20,
    clients: [
      { id: 'c1', name: 'Priya N.', initials: 'PN', attendance: 'attended' },
      { id: 'c2', name: 'Rahul K.', initials: 'RK', attendance: 'confirmed' },
      { id: 'c3', name: 'Meera S.', initials: 'MS', attendance: 'noshow' },
    ] },
  { id: 'ts2', title: '1:1 Strength · Prabu', time: 'Today · 6:00 PM', today: true, mode: 'online', place: 'Google Meet', capacity: 1,
    clients: [{ id: 'c4', name: 'Prabu S.', initials: 'PS', attendance: 'confirmed' }] },
  { id: 'ts3', title: 'Mobility group', time: 'Tomorrow · 7:30 AM', today: false, mode: 'inperson', place: 'Koramangala', capacity: 15,
    clients: [
      { id: 'c5', name: 'Anu R.', initials: 'AR', attendance: 'confirmed' },
      { id: 'c6', name: 'Vikram T.', initials: 'VT', attendance: 'confirmed' },
    ] },
]

export interface SessionRequest { id: string; client: string; initials: string; session: string; time: string }
export const requests: SessionRequest[] = [
  { id: 'r1', client: 'Anu R.', initials: 'AR', session: '1:1 Strength', time: 'Fri · 6 PM' },
  { id: 'r2', client: 'Vikram T.', initials: 'VT', session: 'Morning HIIT', time: 'Sat · 6 AM' },
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
