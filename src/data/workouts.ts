import type { Discipline } from '../lib/types'

export interface WorkoutBlock { name: string; items: string[] }
export interface Workout {
  focus: string
  duration: string
  intensity: string
  equipment: string
  blocks: WorkoutBlock[]
}

// Representative session plan for every focus category — shown on each booked session.
export const WORKOUTS: Record<Discipline, Workout> = {
  strengthening: {
    focus: 'Progressive overload · compound lifts', duration: '50 min', intensity: 'RPE 7–8', equipment: 'Barbell, dumbbells, rack',
    blocks: [
      { name: 'Warm-up · 8 min', items: ['Dynamic mobility flow', 'Band shoulder + hip activation', '2 light ramp-up sets'] },
      { name: 'Main lift', items: ['Back squat — 4 × 6', 'Bench press — 4 × 6', 'Rest 90–120s between sets'] },
      { name: 'Accessory', items: ['Romanian deadlift — 3 × 10', 'Single-arm row — 3 × 12', 'Walking lunge — 3 × 10/leg'] },
      { name: 'Finisher', items: ['Core circuit — 3 rounds (plank, hollow hold, dead bug)'] },
    ],
  },
  circuit: {
    focus: 'Full-body stations · minimal rest', duration: '40 min', intensity: 'High', equipment: 'Kettlebell, box, rope',
    blocks: [
      { name: 'Warm-up · 6 min', items: ['Jumping jacks + arm circles', 'Bodyweight squats × 15', 'Inchworms × 8'] },
      { name: 'Stations · 4 rounds (45s on / 15s off)', items: ['Kettlebell swings', 'Box step-ups', 'Battle ropes', 'Goblet squats', 'Push-ups'] },
      { name: 'Finisher', items: ['Plank hold — 3 × 45s', 'Mountain climbers — 2 × 30s'] },
    ],
  },
  pilates: {
    focus: 'Core control · stability · breath', duration: '45 min', intensity: 'Low–moderate', equipment: 'Reformer / mat',
    blocks: [
      { name: 'Centering · 6 min', items: ['Diaphragmatic breathing', 'Pelvic tilts', 'Spine articulation'] },
      { name: 'Mat / reformer flow', items: ['The hundred', 'Roll-up', 'Single-leg circles', 'Teaser progression', 'Side-lying leg series'] },
      { name: 'Cool-down', items: ['Spine stretch forward', 'Mermaid side stretch'] },
    ],
  },
  mobility: {
    focus: 'Joint range · recovery', duration: '25 min', intensity: 'Low', equipment: 'Mat, band',
    blocks: [
      { name: 'Flow', items: ['Cat–cow × 8', 'World’s greatest stretch — 5/side', 'Hip 90/90 transitions'] },
      { name: 'Targeted', items: ['Thoracic rotations', 'Ankle dorsiflexion drills', 'Banded shoulder openers'] },
      { name: 'Down-regulate', items: ['Box breathing — 3 min', 'Supine twist hold'] },
    ],
  },
  hiit: {
    focus: 'Intervals · conditioning', duration: '30 min', intensity: 'Very high', equipment: 'Bodyweight / dumbbells',
    blocks: [
      { name: 'Warm-up · 5 min', items: ['High knees + butt kicks', 'Air squats × 20', 'Arm + leg swings'] },
      { name: 'Intervals · 5 rounds (30s on / 30s off)', items: ['Burpees', 'Mountain climbers', 'Jump squats', 'Push-up to shoulder tap', 'Skater hops'] },
      { name: 'Cool-down', items: ['Easy walk 2 min', 'Full-body static stretch'] },
    ],
  },
  hyrox: {
    focus: 'Run + functional stations', duration: '60 min', intensity: 'High', equipment: 'Sled, rower, wall ball',
    blocks: [
      { name: 'Run 1', items: ['1 km easy–moderate pace'] },
      { name: 'Functional stations', items: ['Sled push — 25m × 2', 'Row — 500m', 'Wall balls — 30 reps', 'Burpee broad jumps — 20'] },
      { name: 'Run 2', items: ['1 km at threshold'] },
      { name: 'Finisher', items: ['Farmers carry — 2 × 40m', 'Sandbag lunges — 20'] },
    ],
  },
}
