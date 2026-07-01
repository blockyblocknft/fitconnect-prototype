// Per-program progress extras shown inside a booked program: monthly posture
// assessments (before/after photos) and the full meal history logged across
// the program. The meal log is a shared, mutable store — the client logs meals
// here and the trainer leaves a per-day comment from their dashboard, so a note
// added on either side shows up on the other.

export interface Assessment {
  id: string
  label: string       // e.g. "Month 1"
  date: string
  hasBefore: boolean
  hasAfter: boolean
  note: string
}

export const assessments: Assessment[] = [
  { id: 'a1', label: 'Month 1', date: '9 Jun 2026', hasBefore: true, hasAfter: true,
    note: 'Baseline — rounded shoulders, slight anterior pelvic tilt. Start mobility daily.' },
  { id: 'a2', label: 'Month 2', date: '9 Jul 2026', hasBefore: true, hasAfter: false,
    note: 'Shoulders sitting squarer, posture more upright. After-photo due at month end.' },
]

export interface LoggedMeal { type: string; name: string; cal: number; comment?: string }
export interface MealLogDay {
  id: string
  dayNum: number          // day of the program (1 = start)
  date: string
  sessionTitle?: string   // training session that fell on this day, if any
  total: number
  target: number
  meals: LoggedMeal[]
  trainerComment?: string // coach's note on the whole day
}

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const TARGET = 1800
const SESSIONS = ['Lower body', 'Upper body', 'Core & conditioning'] // Mon / Wed / Fri

// A handful of realistic days, cycled across the month with small variations.
const TEMPLATES: LoggedMeal[][] = [
  [{ type: 'Breakfast', name: 'Oats + eggs', cal: 320, comment: 'Great protein start 👍' },
   { type: 'Lunch', name: 'Chicken + rice + salad', cal: 620 },
   { type: 'Snack', name: 'Greek yogurt + berries', cal: 180 },
   { type: 'Dinner', name: 'Paneer stir-fry', cal: 360 }],
  [{ type: 'Breakfast', name: 'Banana smoothie', cal: 300 },
   { type: 'Lunch', name: 'Rajma + brown rice', cal: 650, comment: 'Add a fist of greens here.' },
   { type: 'Snack', name: 'Peanuts', cal: 325 },
   { type: 'Dinner', name: 'Grilled fish + veg', cal: 480 }],
  [{ type: 'Breakfast', name: 'Poha + eggs', cal: 350 },
   { type: 'Lunch', name: 'Chicken wrap', cal: 540 },
   { type: 'Dinner', name: 'Dal + roti + sabzi', cal: 560 }],
  [{ type: 'Breakfast', name: 'Idli + sambar', cal: 280 },
   { type: 'Lunch', name: 'Fish curry + rice', cal: 700 },
   { type: 'Snack', name: 'Protein shake', cal: 160 },
   { type: 'Dinner', name: 'Veg soup + toast', cal: 320 }],
  [{ type: 'Breakfast', name: 'Paratha + curd', cal: 420 },
   { type: 'Lunch', name: 'Egg fried rice', cal: 640 },
   { type: 'Dinner', name: 'Tandoori chicken + salad', cal: 520 }],
  [{ type: 'Breakfast', name: 'Smoothie bowl', cal: 360 },
   { type: 'Lunch', name: 'Quinoa + chickpea bowl', cal: 560 },
   { type: 'Snack', name: 'Apple + almonds', cal: 210 },
   { type: 'Dinner', name: 'Chicken + sweet potato', cal: 540 }],
  [{ type: 'Breakfast', name: 'Eggs + toast', cal: 340 },
   { type: 'Lunch', name: 'Paneer roll', cal: 600 },
   { type: 'Dinner', name: 'Khichdi + curd', cal: 480 }],
]

const DAY_NOTES = [
  'Good protein spread today 👍 keep it up.',
  'A touch low on carbs — add a fruit before training.',
  'Nice — hit your target almost on the dot.',
  'Dinner a bit heavy; shift some calories to lunch.',
  'Solid logging streak. Hydration looked good too.',
  'Try a protein source at every meal, not just two.',
  'Great recovery day — light and balanced.',
]

// 30 days, newest first. "Today" is Thu 18 Jun 2026 (matches the live session).
// `seed` shifts the templates / notes so each client's log looks distinct but
// stays stable across renders.
function buildMealLog(seed = 0): MealLogDay[] {
  const base = new Date(2026, 5, 18)
  const out: MealLogDay[] = []
  for (let i = 0; i < 30; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() - i)
    const dayNum = 30 - i
    const wd = d.getDay()
    const meals = TEMPLATES[(i + seed) % TEMPLATES.length].map((m) => ({ ...m }))
    const total = meals.reduce((n, m) => n + m.cal, 0)
    const sessionTitle = wd === 1 || wd === 3 || wd === 5 ? SESSIONS[[1, 3, 5].indexOf(wd)] : undefined
    // Coach has reviewed older days (not the last 2), on a seed-varied cadence.
    const trainerComment = i >= 2 && (i + seed) % 3 === 0 ? DAY_NOTES[(i + seed) % DAY_NOTES.length] : undefined
    out.push({
      id: `ml${dayNum}`, dayNum, date: `${WD[wd]} ${d.getDate()} ${MON[d.getMonth()]}`,
      sessionTitle, total, target: TARGET, meals, trainerComment,
    })
  }
  return out
}

// The signed-in client's canonical log (also shown inside their own app).
export const mealLog: MealLogDay[] = buildMealLog(0)

// One log per client, keyed by name. The live client reuses `mealLog` so a
// coach note there flows straight back to the client's program tab.
const registry = new Map<string, MealLogDay[]>([['Prabu S.', mealLog]])
const seedOf = (key: string) => { let h = 0; for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0; return h % 7 }
export function mealLogFor(key: string): MealLogDay[] {
  let v = registry.get(key)
  if (!v) { v = buildMealLog(seedOf(key)); registry.set(key, v) }
  return v
}
export function setDayComment(key: string, id: string, text: string) {
  const day = mealLogFor(key).find((d) => d.id === id)
  if (day) day.trainerComment = text.trim() || undefined
}

export const mealLogStats = (key = 'Prabu S.') => {
  const log = mealLogFor(key)
  return {
    days: log.length,
    avg: Math.round(log.reduce((n, d) => n + d.total, 0) / log.length),
    notes: log.filter((d) => d.trainerComment).length,
  }
}
