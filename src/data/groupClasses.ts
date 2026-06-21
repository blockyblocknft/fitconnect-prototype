import { trainers } from './trainers'
import type { Discipline } from '../lib/types'

// Group classes presented BookMyShow-style: each class (a "venue") lists the
// available time slots for the chosen day.
export interface GroupSlot { time: string; format: string }
export interface GroupClass {
  id: string
  title: string
  trainerName: string
  place: string
  mode: 'online' | 'inperson'
  discipline: Discipline
  price: string
  spotsTaken: number
  spotsMax: number
  slots: GroupSlot[]
}

function discOf(title: string): Discipline {
  const t = title.toLowerCase()
  if (t.includes('pilates')) return 'pilates'
  if (t.includes('hyrox')) return 'hyrox'
  if (t.includes('circuit')) return 'circuit'
  if (t.includes('hiit')) return 'hiit'
  if (t.includes('strength')) return 'strengthening'
  return 'mobility'
}

function slotsFor(title: string, online: boolean): GroupSlot[] {
  const t = title.toLowerCase()
  const fmt = online ? 'Live online' : 'On-ground'
  if (t.includes('morning') || t.includes('sunrise')) return [{ time: '6:00 AM', format: fmt }, { time: '7:00 AM', format: fmt }, { time: '8:00 AM', format: fmt }]
  if (t.includes('evening') || t.includes('unwind')) return [{ time: '6:00 PM', format: fmt }, { time: '7:30 PM', format: fmt }]
  return [{ time: '7:00 AM', format: fmt }, { time: '6:00 PM', format: fmt }]
}

export const groupClasses: GroupClass[] = trainers.flatMap((t) =>
  t.groupSessions.map((g) => {
    const online = g.placeLabel.toLowerCase().includes('online')
    return {
      id: g.id, title: g.title, trainerName: t.name, place: g.placeLabel,
      mode: online ? 'online' : 'inperson', discipline: discOf(g.title), price: g.priceLabel,
      spotsTaken: g.spotsTaken, spotsMax: g.spotsMax, slots: slotsFor(g.title, online),
    } as GroupClass
  }),
)
