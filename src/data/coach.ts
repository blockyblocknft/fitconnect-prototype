import type { NutritionStatus, ClientMeal, CoachPost } from './trainerView'

// Coach hub organised the way a trainer actually works: by program, then by each
// session inside it. Nutrition, Q/A and community all hang off this tree.
// `live: true` marks the signed-in client whose nutrition is the SAME data they
// log in the client app (data/meal.ts) — the trainer sees their real log and any
// coach comment flows straight back to the client's Log Meal screen.
export interface CoachClient { id: string; name: string; initials: string; status: NutritionStatus; calories: number; goal: number; meals: ClientMeal[]; live?: boolean }
export interface CoachQ { id: string; client: string; initials: string; question: string; answered: boolean }
export interface CoachSession { id: string; title: string; time: string; clients: CoachClient[]; questions: CoachQ[] }
export interface CoachProgram { id: string; name: string; sessions: CoachSession[]; community: CoachPost[] }

let _n = 0
const c = (name: string, initials: string, status: NutritionStatus, calories: number, goal: number, meals: ClientMeal[] = []): CoachClient =>
  ({ id: `cc${++_n}`, name, initials, status, calories, goal, meals })

export const coachPrograms: CoachProgram[] = [
  {
    id: 'hiit', name: 'HIIT Bootcamp',
    sessions: [
      { id: 'hiit-m', title: 'Morning HIIT', time: 'Today · 6:00 AM',
        clients: [
          c('Priya N.', 'PN', 'over', 2150, 1700, [{ type: 'Breakfast', name: 'Paratha x2', cal: 560 }, { type: 'Snack', name: 'Samosa', cal: 300, comment: 'Swap for fruit next time' }]),
          c('Rahul K.', 'RK', 'partial', 520, 2000, [{ type: 'Breakfast', name: 'Coffee + toast', cal: 520 }]),
          c('Meera S.', 'MS', 'nolog', 0, 1600, []),
          c('Arjun D.', 'AD', 'ontrack', 1620, 2000, [{ type: 'Lunch', name: 'Chicken bowl', cal: 700 }]),
          c('Sneha M.', 'SM', 'partial', 480, 1700, [{ type: 'Breakfast', name: 'Idli x2', cal: 320 }]),
          c('Kavya R.', 'KR', 'ontrack', 1450, 1800, []),
          c('Rohan B.', 'RB', 'nolog', 0, 2100, []),
          c('Divya P.', 'DP', 'over', 2300, 1750, [{ type: 'Dinner', name: 'Biryani', cal: 900 }]),
          c('Vikram T.', 'VT', 'ontrack', 1700, 2000, []),
          c('Anu R.', 'AR', 'partial', 600, 1650, [{ type: 'Breakfast', name: 'Banana', cal: 110 }]),
        ],
        questions: [
          { id: 'q-hiit-1', client: 'Priya N.', initials: 'PN', question: 'Should I ice my knee after the session?', answered: false },
          { id: 'q-hiit-2', client: 'Rohan B.', initials: 'RB', question: 'What should I eat pre-workout?', answered: false },
        ] },
      { id: 'hiit-w', title: 'Weekend Bootcamp', time: 'Wed · 8:00 AM',
        clients: [
          c('Tara V.', 'TV', 'ontrack', 1500, 1900, [{ type: 'Lunch', name: 'Rice + dal', cal: 600 }]),
          c('Om P.', 'OP', 'nolog', 0, 2000, []),
          c('Ravi T.', 'RT', 'partial', 540, 1800, [{ type: 'Breakfast', name: 'Toast', cal: 240 }]),
          c('Neha J.', 'NJ', 'ontrack', 1480, 1700, []),
          c('Kiran B.', 'KB', 'over', 2200, 1750, [{ type: 'Dinner', name: 'Pizza', cal: 1000 }]),
          c('Mia D.', 'MD', 'ontrack', 1550, 1900, []),
        ],
        questions: [{ id: 'q-hiit-3', client: 'Kiran B.', initials: 'KB', question: 'How do I cut back on late dinners?', answered: false }] },
    ],
    community: [
      { id: 'c-hiit-1', author: 'You', initials: 'AR', coach: true, text: 'Bootcamp crew — bring water tomorrow, it’ll be intense 🔥' },
      { id: 'c-hiit-2', author: 'Priya', initials: 'PN', coach: false, text: 'Loved today’s circuit!' },
    ],
  },
  {
    id: '1to1', name: '1:1 Coaching',
    sessions: [
      { id: '1to1-prabu', title: '1:1 Strength · Prabu', time: 'Today · 6:00 PM',
        clients: [{ ...c('Prabu S.', 'PS', 'ontrack', 1450, 1800, []), live: true }],
        questions: [{ id: 'q-1to1-1', client: 'Prabu S.', initials: 'PS', question: 'Is it okay to train fasted in the morning?', answered: false }] },
    ],
    community: [{ id: 'c-1to1-1', author: 'You', initials: 'AR', coach: true, text: 'Prabu — your progress pics are looking great this week.' }],
  },
  {
    id: 'yoga', name: 'Yoga Flow',
    sessions: [
      { id: 'yoga-power', title: 'Power Yoga', time: 'Today · 6:30 PM',
        clients: [
          c('Devi K.', 'DK', 'nolog', 0, 1600, []),
          c('Sam P.', 'SP', 'partial', 600, 1800, [{ type: 'Breakfast', name: 'Fruit smoothie', cal: 300 }]),
          c('Lia M.', 'LM', 'ontrack', 1400, 1700, []),
          c('Joe L.', 'JL', 'ontrack', 1550, 1900, []),
          c('Manu G.', 'MG', 'partial', 500, 1650, []),
        ],
        questions: [{ id: 'q-yoga-1', client: 'Sam P.', initials: 'SP', question: 'Can we add more hip mobility next class?', answered: false }] },
    ],
    community: [{ id: 'c-yoga-1', author: 'You', initials: 'AR', coach: true, text: 'Welcome to Yoga Flow 🧘 breathe and enjoy.' }],
  },
]
