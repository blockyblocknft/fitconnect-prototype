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

export type Discipline = 'mobility' | 'strengthening' | 'hiit'
export type TrainingMode = 'online' | 'outdoor'

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
  disciplines: Discipline[]
  modes: TrainingMode[]
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
export type SessionStatus = 'attended' | 'missed' | 'inprogress' | 'upcoming'
export type SessionWhen = 'past' | 'today' | 'future'
export interface BookedSession {
  id: string
  index: number
  title: string
  date: string
  time: string
  when: SessionWhen
  status: SessionStatus
  feedback?: string
  qa: QA[]
}
export type BookingStatus = 'awaiting' | 'confirmed' | 'cancelled'
export interface Booking {
  id: string
  programName: string
  trainerName: string
  status: BookingStatus
  progressKind: 'weeks' | 'days'
  current: number
  total: number
  meetLink: string
  sessions: BookedSession[]
}

export interface Tracker { key: string; label: string; value: string; icon: string; color: string }

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
export interface LoggedMeal {
  id: string
  type: MealType
  time: string
  name: string
  cal: number
  protein: number
  carbs: number
  fats: number
  notes?: string
  trainerComment?: string
}
export interface NutritionTargets { calories: number; protein: number; carbs: number; fats: number }
export interface MealDay {
  targets: NutritionTargets
  trackers: Tracker[]
  meals: LoggedMeal[]
}
