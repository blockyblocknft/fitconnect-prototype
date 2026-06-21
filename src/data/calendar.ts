import { trainerSessions, type TrainerSession } from './trainerView'
import { workingHours } from './workingHours'

export function fmtTime(min: number) {
  const h = Math.floor(min / 60), m = min % 60
  const ap = h < 12 ? 'AM' : 'PM'
  const hh = ((h + 11) % 12) + 1
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`
}

const offOf = (s: TrainerSession) => s.dayOffset ?? (s.today ? 0 : 1)
const startOf = (s: TrainerSession) => s.start ?? 0
const endOf = (s: TrainerSession) => startOf(s) + (s.durationMin ?? 60)

export interface CalDay {
  offset: number
  weekday: string
  dayNum: number
  isToday: boolean
  sessions: TrainerSession[]
  conflictIds: Set<string>
  conflictPairs: number
}

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Reconcile every program's sessions onto one rolling 7-day timeline, flagging
// any two whose times overlap on the same day.
export function buildWeek(): CalDay[] {
  const base = new Date()
  const days: CalDay[] = []
  for (let offset = 0; offset < 7; offset++) {
    const d = new Date(base)
    d.setDate(base.getDate() + offset)
    const sessions = trainerSessions.filter((s) => offOf(s) === offset).sort((a, b) => startOf(a) - startOf(b))
    const conflictIds = new Set<string>()
    let conflictPairs = 0
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        const a = sessions[i], b = sessions[j]
        if (startOf(a) < endOf(b) && startOf(b) < endOf(a)) {
          conflictIds.add(a.id); conflictIds.add(b.id); conflictPairs++
        }
      }
    }
    days.push({ offset, weekday: WD[d.getDay()], dayNum: d.getDate(), isToday: offset === 0, sessions, conflictIds, conflictPairs })
  }
  return days
}

export function weekStats(week: CalDay[]) {
  return {
    total: week.reduce((n, d) => n + d.sessions.length, 0),
    conflicts: week.reduce((n, d) => n + d.conflictPairs, 0),
  }
}

export interface DayMeta { offset: number; weekday: string; dayNum: number; isToday: boolean; off: boolean }

export function weekMeta(): DayMeta[] {
  const base = new Date()
  const out: DayMeta[] = []
  for (let offset = 0; offset < 7; offset++) {
    const d = new Date(base)
    d.setDate(base.getDate() + offset)
    out.push({ offset, weekday: WD[d.getDay()], dayNum: d.getDate(), isToday: offset === 0, off: workingHours[d.getDay()].off })
  }
  return out
}

export function dayLabel(offset: number) {
  if (offset === 0) return 'Today'
  if (offset === 1) return 'Tomorrow'
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${WD[d.getDay()]} ${d.getDate()}`
}

// Bookable start times (minutes) for a day: inside working hours and not overlapping
// any existing session. `excludeId` lets an edited session ignore its own slot.
export function freeSlots(dayOffset: number, durationMin: number, excludeId?: string, slot = 30): number[] {
  const d = new Date()
  d.setDate(d.getDate() + dayOffset)
  const wh = workingHours[d.getDay()]
  if (wh.off) return []
  const busy = trainerSessions
    .filter((s) => offOf(s) === dayOffset && s.id !== excludeId)
    .map((s) => [startOf(s), endOf(s)] as const)
  const out: number[] = []
  for (let t = wh.start; t + durationMin <= wh.end; t += slot) {
    if (!busy.some(([bs, be]) => t < be && bs < t + durationMin)) out.push(t)
  }
  return out
}
