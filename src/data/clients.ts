import type { SessionType, TrainingMode } from '../lib/types'
import type { NutritionStatus } from './trainerView'

// The unified client record — the "one page per client" a trainer keeps on
// paper. Sessions, attendance, nutrition, dues and notes all hang off a single
// client id, so tapping a name shows everything in one place.

export type ClientStatus = 'active' | 'paused'
export type AttendMark = 'attended' | 'noshow' | 'upcoming'
export interface AttendanceRow { date: string; session: string; status: AttendMark }

export interface Client {
  id: string
  name: string
  initials: string
  phone: string
  since: string
  plan: string
  kind: SessionType
  mode: TrainingMode
  goal: string
  status: ClientStatus
  feeTotal: number
  paid: number
  nutrition: NutritionStatus
  attendance: AttendanceRow[]
  note?: string
  live?: boolean        // links to the shared meal log + posture assessments
}

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const TODAY = new Date(2026, 5, 18)
const fmt = (d: Date) => `${WD[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`
const ago = (days: number) => { const d = new Date(TODAY); d.setDate(d.getDate() - days); return fmt(d) }

const SESS = ['Morning HIIT', '1:1 Strength', 'Power Yoga', 'Mobility group', 'Weekend Bootcamp']

// 5 recent sessions per client: next one upcoming, the rest mostly attended.
// Misses vary per client so attendance %s look real (0–2 no-shows each).
function attend(i: number): AttendanceRow[] {
  const rows: AttendanceRow[] = []
  for (let k = 0; k < 5; k++) {
    const status: AttendMark = k === 0 ? 'upcoming' : ((i * 7 + k * 13) % 9 < 2 ? 'noshow' : 'attended')
    rows.push({ date: k === 0 ? ago(-2) : ago((k - 1) * 2 + 1), session: SESS[(i + k) % SESS.length], status })
  }
  return rows
}

type Seed = [name: string, initials: string, plan: string, kind: SessionType, mode: TrainingMode,
  fee: number, paidFrac: number, nutrition: NutritionStatus, goal: string, sinceDays: number]

const SEEDS: Seed[] = [
  ['Prabu S.', 'PS', '12-Week Strength Builder', '1to1', 'outdoor', 7200, 0.25, 'ontrack', 'Strength', 21],
  ['Priya N.', 'PN', 'HIIT Bootcamp', 'group', 'outdoor', 2400, 1, 'over', 'Fat loss', 40],
  ['Rahul K.', 'RK', 'HIIT Bootcamp', 'group', 'outdoor', 2400, 0.5, 'partial', 'Endurance', 33],
  ['Meera S.', 'MS', 'Yoga Flow', 'group', 'online', 2000, 1, 'nolog', 'Mobility', 12],
  ['Anu R.', 'AR', '1:1 Coaching', '1to1', 'outdoor', 6000, 0.25, 'ontrack', 'Recomp', 18],
  ['Vikram T.', 'VT', '1:1 Coaching', '1to1', 'online', 6000, 1, 'ontrack', 'Strength', 60],
  ['Sneha M.', 'SM', 'HIIT Bootcamp', 'group', 'outdoor', 2400, 0.5, 'partial', 'Fat loss', 9],
  ['Arjun D.', 'AD', '8-Week Shred', 'group', 'outdoor', 5600, 1, 'ontrack', 'Recomp', 27],
  ['Kavya R.', 'KR', 'Daily mobility flow', '1to1', 'online', 4500, 1, 'ontrack', 'Mobility', 15],
  ['Rohan B.', 'RB', 'HIIT Bootcamp', 'group', 'outdoor', 2400, 0.25, 'nolog', 'Fat loss', 6],
  ['Divya P.', 'DP', 'Yoga Flow', 'group', 'online', 2000, 1, 'over', 'Posture', 22],
  ['Tara V.', 'TV', '8-Week Shred', 'group', 'outdoor', 5600, 0.5, 'ontrack', 'Endurance', 44],
  ['Om P.', 'OP', 'HIIT Bootcamp', 'group', 'outdoor', 2400, 1, 'nolog', 'Fat loss', 31],
  ['Ravi T.', 'RT', '12-Week Strength Builder', '1to1', 'outdoor', 7200, 0.25, 'partial', 'Strength', 5],
  ['Neha J.', 'NJ', 'Yoga Flow', 'group', 'online', 2000, 1, 'ontrack', 'Mobility', 50],
  ['Kiran B.', 'KB', '8-Week Shred', 'group', 'outdoor', 5600, 1, 'over', 'Fat loss', 19],
  ['Mia D.', 'MD', 'HIIT Bootcamp', 'group', 'outdoor', 2400, 0.5, 'ontrack', 'Endurance', 14],
  ['Devi K.', 'DK', 'Yoga Flow', 'group', 'online', 2000, 0.25, 'nolog', 'Posture', 4],
  ['Sam P.', 'SP', 'Daily mobility flow', '1to1', 'online', 4500, 1, 'partial', 'Mobility', 38],
  ['Joe L.', 'JL', '8-Week Shred', 'group', 'outdoor', 5600, 1, 'ontrack', 'Recomp', 25],
]

export const clients: Client[] = SEEDS.map(([name, initials, plan, kind, mode, fee, frac, nutrition, goal, sinceDays], i) => ({
  id: `cl${i + 1}`, name, initials, plan, kind, mode, goal,
  phone: `+91 9${(840000000 + i * 111111).toString().slice(0, 9)}`,
  since: ago(sinceDays), status: 'active', feeTotal: fee, paid: Math.round(fee * frac),
  nutrition, attendance: attend(i), live: i === 0,
}))

// Plans a trainer can put a client on (name → type / mode / fee).
export interface Plan { name: string; kind: SessionType; mode: TrainingMode; fee: number }
export const PLAN_CATALOG: Plan[] = [
  { name: '12-Week Strength Builder', kind: '1to1', mode: 'outdoor', fee: 7200 },
  { name: '8-Week Shred', kind: 'group', mode: 'outdoor', fee: 5600 },
  { name: '1:1 Coaching', kind: '1to1', mode: 'outdoor', fee: 6000 },
  { name: 'Daily mobility flow', kind: '1to1', mode: 'online', fee: 4500 },
  { name: 'HIIT Bootcamp', kind: 'group', mode: 'outdoor', fee: 2400 },
  { name: 'Yoga Flow', kind: 'group', mode: 'online', fee: 2000 },
]

export function addPlan(p: Plan) {
  if (!PLAN_CATALOG.some((x) => x.name === p.name)) PLAN_CATALOG.unshift(p)
}

const initialsOf = (name: string) => name.trim().split(/\s+/).map((w) => w[0] ?? '').slice(0, 2).join('').toUpperCase() || '?'
let _seq = clients.length
export function addClient(name: string, planName: string, goal: string, phone = ''): Client {
  const plan = PLAN_CATALOG.find((p) => p.name === planName) ?? PLAN_CATALOG[0]
  const c: Client = {
    id: `cl${++_seq}`, name: name.trim(), initials: initialsOf(name), phone: phone.trim() || '+91 90000 00000', since: 'Today',
    plan: plan.name, kind: plan.kind, mode: plan.mode, goal: goal.trim() || 'General fitness',
    status: 'active', feeTotal: plan.fee, paid: 0, nutrition: 'nolog',
    attendance: [{ date: ago(-2), session: plan.name, status: 'upcoming' }],
  }
  clients.unshift(c)
  return c
}

// A walk-in / drop-in — added straight from a session roster, no plan yet.
export function addWalkIn(name: string, phone = ''): Client {
  const c: Client = {
    id: `cl${++_seq}`, name: name.trim(), initials: initialsOf(name), phone: phone.trim() || '—', since: 'Today',
    plan: 'Drop-in', kind: '1to1', mode: 'outdoor', goal: 'Drop-in', status: 'active',
    feeTotal: 0, paid: 0, nutrition: 'nolog', attendance: [{ date: 'Today', session: 'Drop-in', status: 'upcoming' }],
  }
  clients.unshift(c)
  return c
}

export const getClient = (id: string) => clients.find((c) => c.id === id)
export const clientDue = (c: Client) => Math.max(0, c.feeTotal - c.paid)
export const attendancePct = (c: Client) => {
  const done = c.attendance.filter((a) => a.status !== 'upcoming')
  const attended = done.filter((a) => a.status === 'attended').length
  return done.length ? Math.round((attended / done.length) * 100) : 0
}
// A client needs attention if they aren't logging meals or owe money.
export const needsAttention = (c: Client) =>
  c.nutrition === 'nolog' || clientDue(c) > 0

// Money ledger — every payment recorded, newest first. Seeded with a few
// already-collected entries so the history isn't empty on first open.
export interface PaymentEntry { id: string; clientId: string; name: string; amount: number; date: string }
export const payments: PaymentEntry[] = [
  { id: 'pay1', clientId: 'cl6', name: 'Vikram T.', amount: 6000, date: 'Tue 16 Jun' },
  { id: 'pay2', clientId: 'cl8', name: 'Arjun D.', amount: 5600, date: 'Mon 15 Jun' },
  { id: 'pay3', clientId: 'cl16', name: 'Kiran B.', amount: 5600, date: 'Sat 13 Jun' },
  { id: 'pay4', clientId: 'cl2', name: 'Priya N.', amount: 2400, date: 'Fri 12 Jun' },
]
let _pid = 100
function logPayment(c: Client, amount: number) {
  payments.unshift({ id: `pay-${++_pid}`, clientId: c.id, name: c.name, amount, date: 'Today' })
}

export function recordPayment(id: string, amount: number) {
  const c = getClient(id); if (!c) return
  const add = Math.min(amount, clientDue(c))
  if (add > 0) { c.paid += add; logPayment(c, add) }
}
export function markFullyPaid(id: string) {
  const c = getClient(id); if (!c) return
  const due = clientDue(c)
  if (due > 0) { c.paid = c.feeTotal; logPayment(c, due) }
}
export function setClientNote(id: string, text: string) {
  const c = getClient(id); if (c) c.note = text.trim() || undefined
}

// Bridge from the session roster: marking a client attended / no-show records
// it on their profile so the attendance % stays true. Reuses the next
// upcoming slot, else prepends a fresh row (most recent first).
export function markClientAttendance(name: string, session: string, status: 'attended' | 'noshow') {
  const c = clients.find((x) => x.name === name)
  if (!c) return
  const up = c.attendance.find((a) => a.status === 'upcoming')
  if (up) { up.status = status; up.session = session; up.date = 'Today' }
  else c.attendance = [{ date: 'Today', session, status }, ...c.attendance].slice(0, 6)
}

export const collectedTotal = () => clients.reduce((n, c) => n + c.paid, 0)

export const rosterStats = () => ({
  total: clients.length,
  active: clients.filter((c) => c.status === 'active').length,
  dues: clients.reduce((n, c) => n + clientDue(c), 0),
  attention: clients.filter(needsAttention).length,
})
