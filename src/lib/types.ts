export type Role = 'client' | 'trainer'
export type SessionType = '1to1' | 'group'
export type Location = { kind: 'local'; area: string; km: number } | { kind: 'online'; intl: boolean }

export interface Program {
  id: string
  trainerId: string
  name: string
  category: string
  cadence: 'daily' | 'multi'
  scheduleLabel: string
  priceLabel: string
  bestseller?: boolean
  advancePct: number
  benefits: string[]
  feeTotal: number
}

export interface TrainerEvent {
  id: string
  title: string
  dateLabel: string
  placeLabel: string
  online?: boolean
  free?: boolean
  priceLabel?: string
  spotsTaken: number
  spotsMax: number
}

export interface Trainer {
  id: string
  name: string
  specialty: string
  years: number
  rating: number
  type: SessionType[]
  location: Location
  fromPriceLabel: string
  verified: boolean
  trial: { priceLabel: string }
  programs: Program[]
  events: TrainerEvent[]
  groupSessions: GroupSession[]
}

export interface GroupSession {
  id: string
  title: string
  scheduleLabel: string
  placeLabel: string
  priceLabel: string
  spotsTaken: number
  spotsMax: number
}

export interface QA { author: 'you' | 'coach'; text: string }
export interface BookedSession {
  id: string
  index: number
  title: string
  dateLabel: string
  status: 'done' | 'upcoming'
  feedback?: string
  qa: QA[]
}
export interface Booking {
  id: string
  programName: string
  trainerName: string
  progressKind: 'weeks' | 'days'
  current: number
  total: number
  sessions: BookedSession[]
}

export interface Macro { label: string; pct: number; color: string }
export interface Tracker { key: string; label: string; value: string; icon: string; color: string }
export interface MealDay { caloriesEaten: number; caloriesGoal: number; macros: Macro[]; trackers: Tracker[] }
