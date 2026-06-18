import type { MealDay } from '../lib/types'

export const mealDay: MealDay = {
  caloriesEaten: 320, caloriesGoal: 500,
  macros: [
    { label: 'Protein', pct: 28, color: 'var(--fc-indigo)' },
    { label: 'Fats', pct: 22, color: 'var(--fc-coral)' },
    { label: 'Carbs', pct: 45, color: 'var(--fc-green)' },
    { label: 'Fibre', pct: 5, color: 'var(--fc-mist)' },
  ],
  trackers: [
    { key: 'weight', label: 'Weight', value: '71 kg', icon: 'scale', color: 'var(--fc-indigo)' },
    { key: 'workout', label: 'Workout', value: '1 / 1', icon: 'barbell', color: 'var(--fc-coral)' },
    { key: 'steps', label: 'Steps', value: '8k', icon: 'walk', color: 'var(--fc-green)' },
    { key: 'sleep', label: 'Sleep', value: '6 hr', icon: 'moon', color: 'var(--fc-mist)' },
    { key: 'water', label: 'Water', value: '3.5 L', icon: 'droplet', color: 'var(--fc-blue)' },
  ],
}
