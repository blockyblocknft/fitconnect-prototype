import type { Discipline } from '../lib/types'

// "Browse by focus" categories, shared by the 1-to-1 browse and the Group showtimes.
export const FOCUS_CATEGORIES: { key: Discipline | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: 'sparkles' },
  { key: 'strengthening', label: 'Strength', icon: 'barbell' },
  { key: 'circuit', label: 'Circuit', icon: 'rotate' },
  { key: 'pilates', label: 'Pilates', icon: 'stretching' },
  { key: 'mobility', label: 'Mobility', icon: 'yoga' },
  { key: 'hiit', label: 'HIIT', icon: 'flame' },
  { key: 'hyrox', label: 'Hyrox', icon: 'run' },
]
