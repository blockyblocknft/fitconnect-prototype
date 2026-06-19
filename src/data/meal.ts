import type { MealDay } from '../lib/types'

export const mealDay: MealDay = {
  targets: { calories: 500, protein: 40, carbs: 50, fats: 20 },
  meals: [
    { id: 'lm1', type: 'Breakfast', time: '8:30 AM', name: 'Oats + eggs', cal: 220, protein: 18, carbs: 24, fats: 8,
      trainerComment: 'Great protein start 👍' },
    { id: 'lm2', type: 'Snack', time: '11:00 AM', name: 'Banana', cal: 100, protein: 1, carbs: 23, fats: 0 },
  ],
  trackers: [
    { key: 'weight', label: 'Weight', value: '71 kg', icon: 'scale', color: 'var(--fc-indigo)' },
    { key: 'workout', label: 'Workout', value: '1 / 1', icon: 'barbell', color: 'var(--fc-coral)' },
    { key: 'steps', label: 'Steps', value: '8k', icon: 'walk', color: 'var(--fc-green)' },
    { key: 'sleep', label: 'Sleep', value: '6 hr', icon: 'moon', color: 'var(--fc-mist)' },
    { key: 'water', label: 'Water', value: '3.5 L', icon: 'droplet', color: 'var(--fc-blue)' },
  ],
}
