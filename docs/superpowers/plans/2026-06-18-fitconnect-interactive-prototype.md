# FitConnect Interactive Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully interactive, clickable React prototype of FitConnect covering the Sessions → trainer → checkout → Booked flow and the Log Meal flow end-to-end, styled with the FitConnect brand tokens.

**Architecture:** A single-column "phone" React app (Vite + TypeScript). Brand tokens live as CSS variables. Small presentational primitives compose into screens. Navigation is a lightweight in-memory stack (a `NavContext`) plus a role switch and active-tab state — no server, all data is mocked. Logic-bearing pieces (capacity %, calorie math, navigation, toggles) are covered by Vitest + React Testing Library tests (TDD); purely presentational screens get render/interaction smoke tests.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, @testing-library/react, @testing-library/user-event, @tabler/icons-react. Fonts: Sora + Inter via Google Fonts. No CSS framework — plain CSS modules + token variables.

---

## Reference

All visual/behavioral requirements come from the approved spec: `docs/superpowers/specs/2026-06-18-fitconnect-design-system-design.md`. Token values, screen layouts, and decisions are authoritative there. This plan implements §2 (tokens), §3 (shell), §4 (nav), §5–7 (Sessions/trainer/checkout), §8 (events), §9 (booked), §9.5 (log meal).

## File Structure

```
package.json, vite.config.ts, tsconfig.json, index.html, vitest.config.ts
src/
  main.tsx                      App entry, mounts <App/> in <PhoneFrame/>
  App.tsx                       Wires NavProvider + renders active screen
  styles/
    tokens.css                  Brand CSS variables (spec §2.2–2.4)
    global.css                  Resets, font wiring, base type
  lib/
    types.ts                    Domain types (Trainer, Program, Event, Booking, Session, Macro, Tracker)
    format.ts                   formatPrice, pct, calorieRemaining helpers (+tests)
  data/
    trainers.ts                 Mock trainers + programs + trainer events
    events.ts                   Mock global events
    bookings.ts                 Mock booked programs + sessions + feedback/Q&A
    meal.ts                     Mock day log: calories, macros, trackers
  nav/
    NavContext.tsx              Screen stack + role + activeTab (+tests)
  components/                   Primitives (each + colocated *.test.tsx where logic exists)
    Icon.tsx
    Button.tsx
    Badge.tsx
    RatingPill.tsx
    CapacityBar.tsx             (+test)
    StepTrail.tsx               (+test)
    SegmentedToggle.tsx         (+test)
    ContextHeader.tsx
    TopTabStrip.tsx
    BottomNav.tsx
    PhoneFrame.tsx
    Card.tsx
    cards/TrainerCard.tsx
    cards/ProgramCard.tsx
    cards/EventCard.tsx
    cards/SessionItem.tsx
    meal/CalorieRing.tsx        (+test)
    meal/MacroStat.tsx
    meal/TrackerChip.tsx
  screens/
    SessionsScreen.tsx
    TrainerScreen.tsx
    CheckoutScreen.tsx
    BookingConfirmScreen.tsx
    EventsScreen.tsx
    BookedScreen.tsx
    ProgramDetailScreen.tsx
    LogMealScreen.tsx
    TrainerHubScreen.tsx        (bottom-nav "Trainer": chat/your trainers — light)
    ProfileScreen.tsx           (bottom-nav "Profile" — light)
```

---

## Phase 0 — Project scaffold

### Task 1: Initialize Vite + React + TS project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `vitest.config.ts`, `src/setupTests.ts`

- [ ] **Step 1: Scaffold and install**

Run from the repo root (it already contains `docs/`):
```bash
npm create vite@latest . -- --template react-ts
# if prompted about non-empty dir, choose "Ignore files and continue"
npm install
npm install @tabler/icons-react
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Configure Vitest**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
})
```

Create `src/setupTests.ts`:
```ts
import '@testing-library/jest-dom'
```

Add to `package.json` `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Wire fonts**

Replace `index.html` `<head>` content's title and add before `</head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```
Set `<title>FitConnect</title>`.

- [ ] **Step 4: Minimal App + verify dev server**

Replace `src/App.tsx`:
```tsx
export default function App() {
  return <div>FitConnect</div>
}
```
Replace `src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
)
```
(Token/global CSS files are created in Task 2 — create empty placeholders now so imports resolve: `mkdir -p src/styles && touch src/styles/tokens.css src/styles/global.css`.)

Run: `npm run dev` → open the URL, expect "FitConnect" to render.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite React TS project with Vitest and fonts"
```

---

### Task 2: Brand tokens & global styles

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`

- [ ] **Step 1: Write tokens** (values from spec §2.2–2.4)

`src/styles/tokens.css`:
```css
:root {
  --fc-indigo: #5A4AE3;
  --fc-coral: #FF6B4A;
  --fc-green: #16B981;
  --fc-ink: #14142B;
  --fc-muted: #8A8A99;
  --fc-surface: #F6F6FB;
  --fc-white: #FFFFFF;
  --fc-indigo-tint: #ECEAFB;
  --fc-coral-tint: #FFE8E1;
  --fc-rating-green: #16864F;
  --fc-blue: #378ADD;
  --fc-mist: #9DBFC4;

  --fc-r-card: 16px;
  --fc-r-sub: 14px;
  --fc-r-btn: 12px;
  --fc-r-pill: 999px;

  --fc-font-display: 'Sora', system-ui, sans-serif;
  --fc-font-body: 'Inter', system-ui, sans-serif;
}
```

- [ ] **Step 2: Write global styles**

`src/styles/global.css`:
```css
* { box-sizing: border-box; }
html, body, #root { margin: 0; height: 100%; }
body {
  font-family: var(--fc-font-body);
  color: var(--fc-ink);
  background: #E9E9F2;
}
button { font-family: var(--fc-font-body); cursor: pointer; }
.fc-tabnum { font-variant-numeric: tabular-nums; }
.fc-display { font-family: var(--fc-font-display); }
```

- [ ] **Step 3: Commit**
```bash
git add src/styles
git commit -m "feat: add FitConnect brand tokens and global styles"
```

---

## Phase 1 — Domain types, helpers, mock data

### Task 3: Domain types

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Write types**
```ts
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
```

- [ ] **Step 2: Commit**
```bash
git add src/lib/types.ts
git commit -m "feat: add domain types"
```

---

### Task 4: Format helpers (TDD)

**Files:**
- Create: `src/lib/format.ts`, `src/lib/format.test.ts`

- [ ] **Step 1: Write failing tests**

`src/lib/format.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { capacityFill, isNearlyFull, caloriesRemaining } from './format'

describe('capacityFill', () => {
  it('returns a clamped 0..100 percentage', () => {
    expect(capacityFill(18, 30)).toBe(60)
    expect(capacityFill(0, 30)).toBe(0)
    expect(capacityFill(40, 30)).toBe(100)
  })
})

describe('isNearlyFull', () => {
  it('is true at or above 85% capacity', () => {
    expect(isNearlyFull(14, 15)).toBe(true)
    expect(isNearlyFull(18, 30)).toBe(false)
  })
})

describe('caloriesRemaining', () => {
  it('never goes negative', () => {
    expect(caloriesRemaining(320, 500)).toBe(180)
    expect(caloriesRemaining(600, 500)).toBe(0)
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- format`
Expected: FAIL ("capacityFill is not a function").

- [ ] **Step 3: Implement**

`src/lib/format.ts`:
```ts
export function capacityFill(taken: number, max: number): number {
  if (max <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((taken / max) * 100)))
}
export function isNearlyFull(taken: number, max: number): boolean {
  return capacityFill(taken, max) >= 85
}
export function caloriesRemaining(eaten: number, goal: number): number {
  return Math.max(0, goal - eaten)
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- format`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**
```bash
git add src/lib/format.ts src/lib/format.test.ts
git commit -m "feat: add format/capacity/calorie helpers with tests"
```

---

### Task 5: Mock data

**Files:**
- Create: `src/data/trainers.ts`, `src/data/events.ts`, `src/data/bookings.ts`, `src/data/meal.ts`

- [ ] **Step 1: Trainers + programs + group + trainer events**

`src/data/trainers.ts`:
```ts
import type { Trainer } from '../lib/types'

export const trainers: Trainer[] = [
  {
    id: 't1', name: 'Aanand R.', specialty: 'Strength · Fat loss', years: 8, rating: 4.9,
    type: ['1to1', 'group'], location: { kind: 'local', area: 'Indiranagar', km: 2.1 },
    fromPriceLabel: 'from ₹600 / session', verified: true, trial: { priceLabel: '₹300' },
    programs: [
      { id: 'p1', trainerId: 't1', name: '12-Week Strength Builder', category: 'Strength programs',
        cadence: 'multi', scheduleLabel: '3x / week · live + plan', priceLabel: '₹7,200 / 12 wks',
        bestseller: true, advancePct: 25, feeTotal: 7200,
        benefits: ['36 live coached sessions', 'Custom workout + meal plan', 'Weekly check-in & chat'] },
      { id: 'p2', trainerId: 't1', name: 'Daily morning strength', category: 'Strength programs',
        cadence: 'daily', scheduleLabel: 'Every day · 30 min', priceLabel: '₹600 / session',
        advancePct: 20, feeTotal: 600, benefits: ['Live 30-min session', 'Form correction', 'Daily streak'] },
    ],
    groupSessions: [
      { id: 'g1', title: 'Morning HIIT · on-ground', scheduleLabel: 'Mon/Wed/Fri', placeLabel: 'Indiranagar',
        priceLabel: '₹250', spotsTaken: 14, spotsMax: 20 },
    ],
    events: [
      { id: 'te1', title: 'Strength bootcamp', dateLabel: 'Sat · 6 AM', placeLabel: 'Indiranagar',
        priceLabel: '₹400', spotsTaken: 9, spotsMax: 12 },
      { id: 'te2', title: 'Mobility workshop', dateLabel: 'Sun · 8 AM', placeLabel: 'Koramangala',
        priceLabel: '₹300', spotsTaken: 5, spotsMax: 20 },
    ],
  },
  {
    id: 't2', name: 'Sara M.', specialty: 'Yoga · Mobility', years: 6, rating: 4.8,
    type: ['1to1', 'group'], location: { kind: 'online', intl: true },
    fromPriceLabel: 'from ₹450 / session', verified: true, trial: { priceLabel: '₹250' },
    programs: [
      { id: 'p3', trainerId: 't2', name: 'Daily mobility flow', category: 'Mobility programs',
        cadence: 'daily', scheduleLabel: 'Every day · 20 min', priceLabel: '₹450 / session',
        advancePct: 30, feeTotal: 4500, benefits: ['Guided mobility', 'Posture reset', 'Recovery focus'] },
    ],
    groupSessions: [
      { id: 'g2', title: 'Sunrise yoga · online', scheduleLabel: 'Tue/Thu', placeLabel: 'Online',
        priceLabel: '₹200', spotsTaken: 6, spotsMax: 25 },
    ],
    events: [],
  },
]

export function getTrainer(id: string) {
  return trainers.find((t) => t.id === id)
}
```

- [ ] **Step 2: Global events**

`src/data/events.ts`:
```ts
import type { TrainerEvent } from '../lib/types'

export const globalEvents: TrainerEvent[] = [
  { id: 'e1', title: 'Weekend trail run', dateLabel: 'Sat · 7:00 AM', placeLabel: 'Cubbon Park',
    free: true, spotsTaken: 18, spotsMax: 30 },
  { id: 'e2', title: 'Sunrise yoga in the park', dateLabel: 'Sun · 6:30 AM', placeLabel: 'Lalbagh',
    priceLabel: '₹200', spotsTaken: 14, spotsMax: 15 },
]
```

- [ ] **Step 3: Bookings (with per-session feedback + Q&A)**

`src/data/bookings.ts`:
```ts
import type { Booking } from '../lib/types'

export const bookings: Booking[] = [
  {
    id: 'b1', programName: '12-Week Strength Builder', trainerName: 'Aanand R.',
    progressKind: 'weeks', current: 3, total: 12,
    sessions: [
      { id: 's7', index: 7, title: 'Lower body', dateLabel: 'Mon · done', status: 'done',
        feedback: 'Great squat depth — add tempo on the way down next time.',
        qa: [{ author: 'you', text: 'Should I ice my knee after?' },
             { author: 'coach', text: 'Only if swollen — otherwise just rest.' }] },
      { id: 's8', index: 8, title: 'Upper body', dateLabel: 'Today · 6:00 PM', status: 'upcoming', qa: [] },
    ],
  },
  {
    id: 'b2', programName: 'Daily mobility flow', trainerName: 'Sara M.',
    progressKind: 'days', current: 9, total: 30, sessions: [],
  },
]

export function getBooking(id: string) {
  return bookings.find((b) => b.id === id)
}
```

- [ ] **Step 4: Meal day**

`src/data/meal.ts`:
```ts
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
```

- [ ] **Step 5: Commit**
```bash
git add src/data
git commit -m "feat: add mock data for trainers, events, bookings, meal day"
```

---

## Phase 2 — Navigation (TDD)

### Task 6: NavContext

**Files:**
- Create: `src/nav/NavContext.tsx`, `src/nav/NavContext.test.tsx`

- [ ] **Step 1: Write failing test**

`src/nav/NavContext.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider, useNav } from './NavContext'

function Probe() {
  const nav = useNav()
  return (
    <div>
      <span data-testid="top">{nav.current.name}</span>
      <span data-testid="tab">{nav.activeTab}</span>
      <button onClick={() => nav.push({ name: 'trainer', params: { id: 't1' } })}>go</button>
      <button onClick={() => nav.pop()}>back</button>
      <button onClick={() => nav.setTab('events')}>events</button>
    </div>
  )
}

describe('NavContext', () => {
  it('pushes and pops the screen stack', async () => {
    render(<NavProvider><Probe /></NavProvider>)
    expect(screen.getByTestId('top').textContent).toBe('sessions')
    await userEvent.click(screen.getByText('go'))
    expect(screen.getByTestId('top').textContent).toBe('trainer')
    await userEvent.click(screen.getByText('back'))
    expect(screen.getByTestId('top').textContent).toBe('sessions')
  })

  it('switches active tab and resets the stack to that tab root', async () => {
    render(<NavProvider><Probe /></NavProvider>)
    await userEvent.click(screen.getByText('go'))
    await userEvent.click(screen.getByText('events'))
    expect(screen.getByTestId('tab').textContent).toBe('events')
    expect(screen.getByTestId('top').textContent).toBe('events')
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- NavContext`
Expected: FAIL ("Cannot find module './NavContext'").

- [ ] **Step 3: Implement**

`src/nav/NavContext.tsx`:
```tsx
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Role } from '../lib/types'

export type ScreenName =
  | 'sessions' | 'trainer' | 'checkout' | 'bookingConfirm'
  | 'events' | 'booked' | 'programDetail' | 'logMeal'
  | 'trainerHub' | 'profile'

export interface Screen { name: ScreenName; params?: Record<string, string> }
export type TabKey = 'sessions' | 'events' | 'booked' | 'logMeal'

const TAB_ROOT: Record<TabKey, ScreenName> = {
  sessions: 'sessions', events: 'events', booked: 'booked', logMeal: 'logMeal',
}

interface NavValue {
  current: Screen
  stack: Screen[]
  activeTab: TabKey
  role: Role
  push: (s: Screen) => void
  pop: () => void
  setTab: (t: TabKey) => void
  goRoot: (name: ScreenName) => void
  setRole: (r: Role) => void
}

const Ctx = createContext<NavValue | null>(null)

export function NavProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Screen[]>([{ name: 'sessions' }])
  const [activeTab, setActiveTab] = useState<TabKey>('sessions')
  const [role, setRole] = useState<Role>('client')

  const value = useMemo<NavValue>(() => ({
    current: stack[stack.length - 1],
    stack,
    activeTab,
    role,
    push: (s) => setStack((prev) => [...prev, s]),
    pop: () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
    setTab: (t) => { setActiveTab(t); setStack([{ name: TAB_ROOT[t] }]) },
    goRoot: (name) => setStack([{ name }]),
    setRole,
  }), [stack, activeTab, role])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useNav(): NavValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useNav must be used within NavProvider')
  return v
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- NavContext`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**
```bash
git add src/nav
git commit -m "feat: add navigation context with screen stack, tabs, role"
```

---

## Phase 3 — Primitives

### Task 7: Icon + Button + Badge + Card + RatingPill

**Files:**
- Create: `src/components/Icon.tsx`, `Button.tsx`, `Badge.tsx`, `Card.tsx`, `RatingPill.tsx`
- Create test: `src/components/Button.test.tsx`

- [ ] **Step 1: Icon wrapper**

`src/components/Icon.tsx`:
```tsx
import * as Tabler from '@tabler/icons-react'

export function Icon({ name, size = 20, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const key = 'Icon' + name.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('')
  const Cmp = (Tabler as Record<string, React.ComponentType<{ size?: number; color?: string; stroke?: number }>>)[key]
  if (!Cmp) return null
  return <Cmp size={size} color={color} stroke={1.8} />
}
```
(Icon names used in this plan, in Tabler kebab form: `bolt`, `barbell`, `salad`, `chart-line`, `clipboard-list`, `users`, `bookmark`, `confetti`, `user`, `user-heart`, `plus`, `home`, `calendar`, `message-circle`, `search`, `adjustments-horizontal`, `star`, `map-pin`, `world`, `device-laptop`, `rosette-discount-check`, `clock`, `video`, `check`, `clock`, `help-circle`, `send`, `message-dots`, `info-circle`, `message-2`, `camera`, `scale`, `walk`, `moon`, `droplet`, `run`, `chevron-right`, `chevron-down`, `arrow-left`, `sparkles`, `flame`, `calendar-event`, `stretching`, `yoga`.)

- [ ] **Step 2: Button (TDD)**

`src/components/Button.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders label and fires onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Book session</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Book session' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
```

Run: `npm test -- Button` → FAIL.

`src/components/Button.tsx`:
```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'energy' | 'secondary'
const styles: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--fc-indigo)', color: '#fff', border: 'none' },
  energy: { background: 'var(--fc-coral)', color: '#fff', border: 'none' },
  secondary: { background: 'var(--fc-white)', color: 'var(--fc-indigo)', border: '1.5px solid var(--fc-indigo)' },
}

export function Button(
  { variant = 'primary', full, children, style, ...rest }:
  { variant?: Variant; full?: boolean; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...rest}
      style={{
        ...styles[variant], borderRadius: 'var(--fc-r-btn)', padding: '10px 18px',
        fontSize: 13, fontWeight: 600, width: full ? '100%' : undefined,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, ...style,
      }}
    >
      {children}
    </button>
  )
}
```

Run: `npm test -- Button` → PASS.

- [ ] **Step 3: Badge, Card, RatingPill**

`src/components/Badge.tsx`:
```tsx
import type { ReactNode } from 'react'
type Tone = 'indigo' | 'coral' | 'green' | 'neutral'
const tones: Record<Tone, { bg: string; fg: string }> = {
  indigo: { bg: 'var(--fc-indigo-tint)', fg: 'var(--fc-indigo)' },
  coral: { bg: 'var(--fc-coral-tint)', fg: 'var(--fc-coral)' },
  green: { bg: '#E4F3EA', fg: 'var(--fc-rating-green)' },
  neutral: { bg: 'var(--fc-surface)', fg: 'var(--fc-muted)' },
}
export function Badge({ tone = 'indigo', children }: { tone?: Tone; children: ReactNode }) {
  const t = tones[tone]
  return <span style={{ background: t.bg, color: t.fg, fontSize: 10, fontWeight: 600,
    padding: '3px 9px', borderRadius: 'var(--fc-r-pill)' }}>{children}</span>
}
```

`src/components/Card.tsx`:
```tsx
import type { CSSProperties, ReactNode } from 'react'
export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ background: 'var(--fc-white)', border: '0.5px solid rgba(20,20,43,0.12)',
    borderRadius: 'var(--fc-r-card)', padding: '13px', ...style }}>{children}</div>
}
```

`src/components/RatingPill.tsx`:
```tsx
import { Icon } from './Icon'
export function RatingPill({ rating }: { rating: number }) {
  return <span className="fc-tabnum" style={{ display: 'inline-flex', alignItems: 'center', gap: 2,
    background: 'var(--fc-rating-green)', color: '#fff', fontSize: 11, fontWeight: 600,
    padding: '2px 6px', borderRadius: 6 }}>
    <Icon name="star" size={10} color="#fff" />{rating}
  </span>
}
```

- [ ] **Step 4: Commit**
```bash
git add src/components/Icon.tsx src/components/Button.tsx src/components/Button.test.tsx src/components/Badge.tsx src/components/Card.tsx src/components/RatingPill.tsx
git commit -m "feat: add Icon, Button, Badge, Card, RatingPill primitives"
```

---

### Task 8: CapacityBar (TDD)

**Files:**
- Create: `src/components/CapacityBar.tsx`, `src/components/CapacityBar.test.tsx`

- [ ] **Step 1: Failing test**
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CapacityBar } from './CapacityBar'

describe('CapacityBar', () => {
  it('shows taken/max and turns coral when nearly full', () => {
    const { rerender } = render(<CapacityBar taken={18} max={30} />)
    expect(screen.getByText('18 / 30 spots')).toBeInTheDocument()
    expect(screen.getByTestId('cap-fill')).toHaveStyle({ background: 'var(--fc-indigo)' })
    rerender(<CapacityBar taken={14} max={15} />)
    expect(screen.getByText('14 / 15 left')).toBeInTheDocument()
    expect(screen.getByTestId('cap-fill')).toHaveStyle({ background: 'var(--fc-coral)' })
  })
})
```
Run: `npm test -- CapacityBar` → FAIL.

- [ ] **Step 2: Implement**
```tsx
import { capacityFill, isNearlyFull } from '../lib/format'
export function CapacityBar({ taken, max }: { taken: number; max: number }) {
  const full = isNearlyFull(taken, max)
  const color = full ? 'var(--fc-coral)' : 'var(--fc-indigo)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{ flex: 1, height: 5, borderRadius: 999, background: 'var(--fc-indigo-tint)', overflow: 'hidden' }}>
        <div data-testid="cap-fill" style={{ width: `${capacityFill(taken, max)}%`, height: '100%', background: color }} />
      </div>
      <span className="fc-tabnum" style={{ fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
        color: full ? 'var(--fc-coral)' : 'var(--fc-muted)' }}>
        {full ? `${taken} / ${max} left` : `${taken} / ${max} spots`}
      </span>
    </div>
  )
}
```
Run: `npm test -- CapacityBar` → PASS.

- [ ] **Step 3: Commit**
```bash
git add src/components/CapacityBar.tsx src/components/CapacityBar.test.tsx
git commit -m "feat: add CapacityBar with nearly-full coral state"
```

---

### Task 9: StepTrail (TDD)

**Files:**
- Create: `src/components/StepTrail.tsx`, `src/components/StepTrail.test.tsx`

- [ ] **Step 1: Failing test**
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StepTrail } from './StepTrail'

describe('StepTrail', () => {
  it('renders done, current, and upcoming nodes', () => {
    render(<StepTrail done={3} total={4} />)
    expect(screen.getAllByTestId('step-done')).toHaveLength(3)
    expect(screen.getAllByTestId('step-current')).toHaveLength(1)
  })
})
```
Run: `npm test -- StepTrail` → FAIL.

- [ ] **Step 2: Implement**
```tsx
import { Icon } from './Icon'
export function StepTrail({ done, total }: { done: number; total: number }) {
  const nodes = Array.from({ length: total }, (_, i) => {
    if (i < done) return 'done' as const
    if (i === done) return 'current' as const
    return 'upcoming' as const
  })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {nodes.map((kind, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {kind === 'done' && <span data-testid="step-done" style={{ width: 16, height: 16, borderRadius: '50%',
            background: 'var(--fc-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={10} color="#fff" /></span>}
          {kind === 'current' && <span data-testid="step-current" style={{ width: 18, height: 18, borderRadius: '50%',
            background: 'var(--fc-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={12} color="#fff" /></span>}
          {kind === 'upcoming' && <span style={{ width: 16, height: 16, borderRadius: '50%',
            border: '2px dashed #C4C4CF', boxSizing: 'border-box' }} />}
          {i < total - 1 && <span style={{ flex: 1, height: 2,
            background: i < done ? 'var(--fc-indigo)' : 'var(--fc-indigo-tint)' }} />}
        </span>
      ))}
    </div>
  )
}
```
Run: `npm test -- StepTrail` → PASS.

- [ ] **Step 3: Commit**
```bash
git add src/components/StepTrail.tsx src/components/StepTrail.test.tsx
git commit -m "feat: add StepTrail small-steps motif component"
```

---

### Task 10: SegmentedToggle (TDD)

**Files:**
- Create: `src/components/SegmentedToggle.tsx`, `src/components/SegmentedToggle.test.tsx`

- [ ] **Step 1: Failing test**
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentedToggle } from './SegmentedToggle'

describe('SegmentedToggle', () => {
  it('marks the active option and fires onChange', async () => {
    const onChange = vi.fn()
    render(<SegmentedToggle options={[{ value: '1to1', label: '1-to-1' }, { value: 'group', label: 'Group' }]}
      value="1to1" onChange={onChange} />)
    expect(screen.getByRole('button', { name: '1-to-1' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'Group' }))
    expect(onChange).toHaveBeenCalledWith('group')
  })
})
```
Run: `npm test -- SegmentedToggle` → FAIL.

- [ ] **Step 2: Implement**
```tsx
export function SegmentedToggle<T extends string>(
  { options, value, onChange }:
  { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }
) {
  return (
    <div style={{ display: 'flex', background: 'var(--fc-indigo-tint)', borderRadius: 999, padding: 3 }}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button key={o.value} aria-pressed={active} onClick={() => onChange(o.value)}
            style={{ flex: 1, padding: 7, borderRadius: 999, border: 'none', fontSize: 12, fontWeight: 600,
              background: active ? 'var(--fc-indigo)' : 'transparent', color: active ? '#fff' : '#55555f' }}>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
```
Run: `npm test -- SegmentedToggle` → PASS.

- [ ] **Step 3: Commit**
```bash
git add src/components/SegmentedToggle.tsx src/components/SegmentedToggle.test.tsx
git commit -m "feat: add SegmentedToggle primitive"
```

---

### Task 11: Shell chrome — PhoneFrame, ContextHeader, TopTabStrip, BottomNav

**Files:**
- Create: `src/components/PhoneFrame.tsx`, `ContextHeader.tsx`, `TopTabStrip.tsx`, `BottomNav.tsx`
- Create test: `src/components/BottomNav.test.tsx`

- [ ] **Step 1: PhoneFrame**
```tsx
import type { ReactNode } from 'react'
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 16 }}>
      <div style={{ width: 360, background: 'var(--fc-white)', borderRadius: 24, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', minHeight: 760, boxShadow: '0 8px 40px rgba(20,20,43,0.12)' }}>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: ContextHeader**
```tsx
import { useNav } from '../nav/NavContext'
export function ContextHeader({ title, subtitle, back }: { title: string; subtitle?: string; back?: boolean }) {
  const nav = useNav()
  return (
    <div style={{ background: 'var(--fc-indigo)', padding: '12px 14px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {back && <button onClick={() => nav.pop()} aria-label="Back"
          style={{ background: 'transparent', border: 'none', color: '#fff', display: 'flex' }}>‹</button>}
        <div>
          <div className="fc-display" style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999,
          background: 'rgba(255,255,255,0.18)', color: '#fff' }}>{nav.role === 'client' ? 'Client' : 'Trainer'}</span>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--fc-coral)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>PS</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: TopTabStrip**
```tsx
import { useNav, type TabKey } from '../nav/NavContext'
import { Icon } from './Icon'

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'sessions', label: 'Sessions', icon: 'barbell' },
  { key: 'events', label: 'Events', icon: 'confetti' },
  { key: 'booked', label: 'Booked', icon: 'bookmark' },
  { key: 'logMeal', label: 'Log Meal', icon: 'salad' },
]

export function TopTabStrip() {
  const nav = useNav()
  return (
    <div style={{ display: 'flex', gap: 16, padding: '10px 14px 0', overflowX: 'auto',
      borderBottom: '0.5px solid rgba(20,20,43,0.10)' }}>
      {TABS.map((t) => {
        const active = nav.activeTab === t.key
        const color = active ? 'var(--fc-indigo)' : 'var(--fc-muted)'
        return (
          <button key={t.key} onClick={() => nav.setTab(t.key)}
            style={{ background: 'transparent', border: 'none', textAlign: 'center', flex: '0 0 auto',
              paddingBottom: 8, borderBottom: active ? '2.5px solid var(--fc-indigo)' : '2.5px solid transparent' }}>
            <Icon name={t.icon} size={19} color={color} />
            <div style={{ fontSize: 11, fontWeight: active ? 600 : 400, color, marginTop: 2 }}>{t.label}</div>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: BottomNav (TDD)**

`src/components/BottomNav.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider, useNav } from '../nav/NavContext'
import { BottomNav } from './BottomNav'

function Peek() { const nav = useNav(); return <span data-testid="cur">{nav.current.name}</span> }

describe('BottomNav', () => {
  it('Log meal FAB navigates to logMeal', async () => {
    render(<NavProvider><Peek /><BottomNav /></NavProvider>)
    await userEvent.click(screen.getByRole('button', { name: /log meal/i }))
    expect(screen.getByTestId('cur').textContent).toBe('logMeal')
  })
})
```
Run: `npm test -- BottomNav` → FAIL.

`src/components/BottomNav.tsx`:
```tsx
import { useNav } from '../nav/NavContext'
import { Icon } from './Icon'

export function BottomNav() {
  const nav = useNav()
  const item = (label: string, icon: string, onClick: () => void) => (
    <button onClick={onClick} aria-label={label}
      style={{ background: 'transparent', border: 'none', textAlign: 'center', color: 'var(--fc-muted)' }}>
      <Icon name={icon} size={21} color="var(--fc-muted)" />
      <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{label}</div>
    </button>
  )
  return (
    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      padding: '9px 14px 12px', background: 'var(--fc-white)', borderTop: '0.5px solid rgba(20,20,43,0.10)' }}>
      {item('Trainer', 'user-heart', () => nav.push({ name: 'trainerHub' }))}
      <button onClick={() => nav.setTab('logMeal')} aria-label="Log meal"
        style={{ background: 'transparent', border: 'none', textAlign: 'center', marginTop: -14 }}>
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--fc-coral)', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={25} color="#fff" />
        </div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 3 }}>Log meal</div>
      </button>
      {item('Profile', 'user', () => nav.push({ name: 'profile' }))}
    </div>
  )
}
```
Run: `npm test -- BottomNav` → PASS.

- [ ] **Step 5: Commit**
```bash
git add src/components/PhoneFrame.tsx src/components/ContextHeader.tsx src/components/TopTabStrip.tsx src/components/BottomNav.tsx src/components/BottomNav.test.tsx
git commit -m "feat: add shell chrome — PhoneFrame, ContextHeader, TopTabStrip, BottomNav"
```

---

## Phase 4 — Card components

### Task 12: TrainerCard, ProgramCard, EventCard, SessionItem

**Files:**
- Create: `src/components/cards/TrainerCard.tsx`, `ProgramCard.tsx`, `EventCard.tsx`, `SessionItem.tsx`
- Create test: `src/components/cards/TrainerCard.test.tsx`

- [ ] **Step 1: TrainerCard (TDD — navigates to trainer)**

`src/components/cards/TrainerCard.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider, useNav } from '../../nav/NavContext'
import { TrainerCard } from './TrainerCard'
import { trainers } from '../../data/trainers'

function Peek() { const nav = useNav(); return <span data-testid="cur">{nav.current.name}:{nav.current.params?.id}</span> }

describe('TrainerCard', () => {
  it('opens the trainer screen on click', async () => {
    render(<NavProvider><Peek /><TrainerCard trainer={trainers[0]} /></NavProvider>)
    await userEvent.click(screen.getByText('Aanand R.'))
    expect(screen.getByTestId('cur').textContent).toBe('trainer:t1')
  })
})
```
Run: `npm test -- TrainerCard` → FAIL.

`src/components/cards/TrainerCard.tsx`:
```tsx
import type { Trainer } from '../../lib/types'
import { useNav } from '../../nav/NavContext'
import { Icon } from '../Icon'
import { RatingPill } from '../RatingPill'

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  const nav = useNav()
  const loc = trainer.location
  return (
    <div role="button" onClick={() => nav.push({ name: 'trainer', params: { id: trainer.id } })}
      style={{ display: 'flex', gap: 10, padding: 10, border: '0.5px solid rgba(20,20,43,0.12)',
        borderRadius: 14, background: '#fff', marginBottom: 10, cursor: 'pointer' }}>
      <div style={{ width: 62, height: 62, borderRadius: 12, flex: '0 0 auto', background: 'var(--fc-indigo-tint)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="user" size={26} color="var(--fc-indigo)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{trainer.name}</div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', margin: '1px 0 6px' }}>{trainer.specialty}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <RatingPill rating={trainer.rating} />
          <span style={{ fontSize: 11, color: 'var(--fc-muted)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            {loc.kind === 'local'
              ? <><Icon name="map-pin" size={11} color="var(--fc-muted)" />{loc.km} km</>
              : <><Icon name="world" size={11} color="var(--fc-muted)" />Online · Intl</>}
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fc-indigo)', fontWeight: 600, marginTop: 5 }}>{trainer.fromPriceLabel}</div>
      </div>
    </div>
  )
}
```
Run: `npm test -- TrainerCard` → PASS.

- [ ] **Step 2: ProgramCard**

`src/components/cards/ProgramCard.tsx`:
```tsx
import type { Program } from '../../lib/types'
import { useNav } from '../../nav/NavContext'
import { Badge } from '../Badge'
import { Button } from '../Button'

export function ProgramCard({ program }: { program: Program }) {
  const nav = useNav()
  return (
    <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: '11px 12px',
      marginBottom: 10, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1 }}>
          {program.bestseller && <Badge tone="green">★ Bestseller</Badge>}
          <div className="fc-display" style={{ fontSize: 13, fontWeight: 600, margin: '6px 0 2px' }}>{program.name}</div>
          <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{program.scheduleLabel}</div>
          <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>{program.priceLabel}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button variant="secondary" style={{ padding: '7px 16px', fontSize: 12 }}
            onClick={() => nav.push({ name: 'checkout', params: { programId: program.id } })}>BOOK</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: EventCard**

`src/components/cards/EventCard.tsx`:
```tsx
import type { TrainerEvent } from '../../lib/types'
import { Icon } from '../Icon'
import { CapacityBar } from '../CapacityBar'
import { Button } from '../Button'

export function EventCard({ event }: { event: TrainerEvent }) {
  return (
    <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, background: '#fff',
      marginBottom: 11, overflow: 'hidden' }}>
      <div style={{ height: 70, background: event.free ? 'var(--fc-green)' : 'var(--fc-mist)', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="run" size={30} color="#fff" />
        <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 9, fontWeight: 600,
          color: event.free ? 'var(--fc-rating-green)' : 'var(--fc-ink)', background: '#fff',
          padding: '2px 8px', borderRadius: 999 }}>{event.free ? 'FREE' : event.priceLabel}</span>
      </div>
      <div style={{ padding: '11px 12px' }}>
        <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{event.title}</div>
        <div style={{ display: 'flex', gap: 12, margin: '5px 0 9px', fontSize: 11, color: 'var(--fc-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={12} color="var(--fc-muted)" />{event.dateLabel}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={12} color="var(--fc-muted)" />{event.placeLabel}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ flex: 1 }}><CapacityBar taken={event.spotsTaken} max={event.spotsMax} /></div>
          <Button style={{ padding: '8px 16px', fontSize: 12 }}>{event.free ? 'Join' : 'Book'}</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: SessionItem**

`src/components/cards/SessionItem.tsx`:
```tsx
import { useState } from 'react'
import type { BookedSession } from '../../lib/types'
import { Icon } from '../Icon'

export function SessionItem({ session }: { session: BookedSession }) {
  const [draft, setDraft] = useState('')
  const done = session.status === 'done'
  return (
    <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: '11px 12px', marginBottom: 11 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: done ? 'var(--fc-green)' : 'var(--fc-coral)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={done ? 'check' : 'clock'} size={13} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>Session {session.index} · {session.title}</div>
          <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{session.dateLabel}</div>
        </div>
      </div>
      {session.feedback && (
        <div style={{ background: '#F0FAF4', borderRadius: 10, padding: '8px 10px', marginBottom: 7 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fc-rating-green)', marginBottom: 2,
            display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="message-dots" size={11} color="var(--fc-rating-green)" />Coach feedback</div>
          <div style={{ fontSize: 11 }}>{session.feedback}</div>
        </div>
      )}
      {session.qa.map((q, i) => (
        <div key={i} style={{ fontSize: 11, color: q.author === 'coach' ? 'var(--fc-indigo)' : 'var(--fc-ink)' }}>
          <b style={{ fontWeight: 600 }}>{q.author === 'coach' ? 'Coach' : 'You'}:</b> {q.text}
        </div>
      ))}
      {!done && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--fc-surface)', borderRadius: 10,
          padding: '7px 10px', marginTop: 6 }}>
          <Icon name="help-circle" size={15} color="var(--fc-muted)" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask a question for this session…"
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 11, outline: 'none' }} />
          <button aria-label="Send" onClick={() => setDraft('')} style={{ background: 'transparent', border: 'none' }}>
            <Icon name="send" size={15} color="var(--fc-indigo)" />
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Commit**
```bash
git add src/components/cards
git commit -m "feat: add TrainerCard, ProgramCard, EventCard, SessionItem"
```

---

### Task 13: Log Meal pieces — CalorieRing (TDD), MacroStat, TrackerChip

**Files:**
- Create: `src/components/meal/CalorieRing.tsx`, `CalorieRing.test.tsx`, `MacroStat.tsx`, `TrackerChip.tsx`

- [ ] **Step 1: CalorieRing failing test**
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CalorieRing } from './CalorieRing'

describe('CalorieRing', () => {
  it('shows eaten and goal', () => {
    render(<CalorieRing eaten={320} goal={500} />)
    expect(screen.getByText('320')).toBeInTheDocument()
    expect(screen.getByText('/ 500 cal')).toBeInTheDocument()
  })
})
```
Run: `npm test -- CalorieRing` → FAIL.

- [ ] **Step 2: Implement CalorieRing**
```tsx
export function CalorieRing({ eaten, goal }: { eaten: number; goal: number }) {
  return (
    <div style={{ width: 72, height: 72, borderRadius: '50%', border: '5px solid var(--fc-indigo)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
      <div className="fc-display fc-tabnum" style={{ fontSize: 16, fontWeight: 700 }}>{eaten}</div>
      <div style={{ fontSize: 9, color: 'var(--fc-muted)' }}>/ {goal} cal</div>
    </div>
  )
}
```
Run: `npm test -- CalorieRing` → PASS.

- [ ] **Step 3: MacroStat + TrackerChip**

`src/components/meal/MacroStat.tsx`:
```tsx
import type { Macro } from '../../lib/types'
export function MacroStat({ macro }: { macro: Macro }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '10px 12px' }}>
      <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{macro.label}</div>
      <div className="fc-display fc-tabnum" style={{ fontSize: 15, fontWeight: 700, color: macro.color }}>{macro.pct}%</div>
    </div>
  )
}
```

`src/components/meal/TrackerChip.tsx`:
```tsx
import type { Tracker } from '../../lib/types'
import { Icon } from '../Icon'
export function TrackerChip({ tracker }: { tracker: Tracker }) {
  return (
    <div style={{ flex: '0 0 auto', width: 86, background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)',
      borderRadius: 13, padding: 10, textAlign: 'center' }}>
      <Icon name={tracker.icon} size={19} color={tracker.color} />
      <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700, marginTop: 3 }}>{tracker.value}</div>
      <div style={{ fontSize: 9, color: 'var(--fc-muted)' }}>{tracker.label}</div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**
```bash
git add src/components/meal
git commit -m "feat: add CalorieRing, MacroStat, TrackerChip"
```

---

## Phase 5 — Screens

### Task 14: SessionsScreen (browse)

**Files:**
- Create: `src/screens/SessionsScreen.tsx`
- Create test: `src/screens/SessionsScreen.test.tsx`

- [ ] **Step 1: Failing test (toggle filters list)**
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider } from '../nav/NavContext'
import { SessionsScreen } from './SessionsScreen'

describe('SessionsScreen', () => {
  it('lists trainers and shows group spots when toggled to Group', async () => {
    render(<NavProvider><SessionsScreen /></NavProvider>)
    expect(screen.getByText('Aanand R.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Group' }))
    expect(screen.getByText(/Morning HIIT/)).toBeInTheDocument()
  })
})
```
Run: `npm test -- SessionsScreen` → FAIL.

- [ ] **Step 2: Implement**
```tsx
import { useState } from 'react'
import type { SessionType } from '../lib/types'
import { trainers } from '../data/trainers'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { TrainerCard } from '../components/cards/TrainerCard'
import { CapacityBar } from '../components/CapacityBar'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'

export function SessionsScreen() {
  const [mode, setMode] = useState<SessionType>('1to1')
  const list = trainers.filter((t) => t.type.includes(mode))
  return (
    <div style={{ padding: '12px 14px', background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff',
        border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 11, padding: '9px 11px', marginBottom: 12 }}>
        <Icon name="search" size={16} color="var(--fc-muted)" />
        <span style={{ fontSize: 12, color: '#A0A0A8' }}>Search trainers, programs</span>
      </div>
      <SegmentedToggle options={[{ value: '1to1', label: '1-to-1' }, { value: 'group', label: 'Group' }]}
        value={mode} onChange={setMode} />
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', margin: '12px 0 13px' }}>
        {['Filter', 'Near me', 'Online', 'International'].map((c) => (
          <span key={c} style={{ flex: '0 0 auto', fontSize: 11, fontWeight: 500, color: '#55555f',
            border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 999, padding: '5px 11px', background: '#fff' }}>{c}</span>
        ))}
      </div>
      {mode === '1to1'
        ? list.map((t) => <TrainerCard key={t.id} trainer={t} />)
        : list.map((t) => (
          <div key={t.id} style={{ marginBottom: 14 }}>
            <TrainerCard trainer={t} />
            {t.groupSessions.map((g) => (
              <div key={g.id} style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14,
                padding: '11px 12px', background: '#fff', marginTop: -4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{g.title}</div>
                  <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700 }}>{g.priceLabel}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fc-muted)', margin: '4px 0 9px' }}>{g.scheduleLabel} · {g.placeLabel}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ flex: 1 }}><CapacityBar taken={g.spotsTaken} max={g.spotsMax} /></div>
                  <Button style={{ padding: '8px 16px', fontSize: 12 }}>Book</Button>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  )
}
```
Run: `npm test -- SessionsScreen` → PASS.

- [ ] **Step 3: Commit**
```bash
git add src/screens/SessionsScreen.tsx src/screens/SessionsScreen.test.tsx
git commit -m "feat: add SessionsScreen browse with 1to1/Group toggle"
```

---

### Task 15: TrainerScreen (trial + programs + events)

**Files:**
- Create: `src/screens/TrainerScreen.tsx`
- Create test: `src/screens/TrainerScreen.test.tsx`

- [ ] **Step 1: Failing test**
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavProvider } from '../nav/NavContext'
import { TrainerScreen } from './TrainerScreen'

describe('TrainerScreen', () => {
  it('shows the trial, programs, and trainer events', () => {
    render(<NavProvider><TrainerScreen trainerId="t1" /></NavProvider>)
    expect(screen.getByText('1-day trial')).toBeInTheDocument()
    expect(screen.getByText('12-Week Strength Builder')).toBeInTheDocument()
    expect(screen.getByText(/Events by Aanand/)).toBeInTheDocument()
    expect(screen.getByText('Strength bootcamp')).toBeInTheDocument()
  })
})
```
Run: `npm test -- TrainerScreen` → FAIL.

- [ ] **Step 2: Implement**
```tsx
import { getTrainer } from '../data/trainers'
import { ProgramCard } from '../components/cards/ProgramCard'
import { Icon } from '../components/Icon'
import { RatingPill } from '../components/RatingPill'
import { CapacityBar } from '../components/CapacityBar'

export function TrainerScreen({ trainerId }: { trainerId: string }) {
  const t = getTrainer(trainerId)
  if (!t) return <div style={{ padding: 16 }}>Trainer not found</div>
  const firstName = t.name.split(' ')[0]
  const loc = t.location
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 13, background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {t.verified && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--fc-indigo)', marginBottom: 3 }}>
              <Icon name="rosette-discount-check" size={14} color="var(--fc-indigo)" />
              <span style={{ fontSize: 10, fontWeight: 600 }}>FitConnect Verified</span></div>}
            <div className="fc-display" style={{ fontSize: 16, fontWeight: 700 }}>{t.name}</div>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{t.specialty} · {t.years} yrs</div>
          </div>
          <RatingPill rating={t.rating} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 8 }}>
          {loc.kind === 'local' ? `${loc.area} · ${loc.km} km` : 'Online · Intl'} · {t.programs.length} programs
        </div>
      </div>

      <div style={{ border: '1.5px solid var(--fc-indigo)', borderRadius: 14, padding: 12, marginBottom: 14, background: '#F6F5FE' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--fc-indigo)', marginBottom: 9 }}>
          <Icon name="sparkles" size={14} color="var(--fc-indigo)" />
          <span className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>Try before you commit</span>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 11, padding: 10, width: 130 }}>
          <div className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>1-day trial</div>
          <div style={{ fontSize: 10, color: 'var(--fc-muted)', margin: '2px 0 6px' }}>Full session</div>
          <div className="fc-display fc-tabnum" style={{ fontSize: 12, fontWeight: 700 }}>{t.trial.priceLabel}</div>
        </div>
      </div>

      {t.programs.map((p) => <ProgramCard key={p.id} program={p} />)}

      {t.events.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, margin: '10px 0 9px' }}>
            <Icon name="confetti" size={14} color="var(--fc-green)" />
            <span className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>Events by {firstName}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
            {t.events.map((e) => (
              <div key={e.id} style={{ flex: '0 0 170px', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 13, padding: 11, background: '#fff' }}>
                <div className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>{e.title}</div>
                <div style={{ fontSize: 11, color: 'var(--fc-muted)', margin: '3px 0 7px' }}>{e.dateLabel}</div>
                <CapacityBar taken={e.spotsTaken} max={e.spotsMax} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
```
Run: `npm test -- TrainerScreen` → PASS.

- [ ] **Step 3: Commit**
```bash
git add src/screens/TrainerScreen.tsx src/screens/TrainerScreen.test.tsx
git commit -m "feat: add TrainerScreen with trial, programs, trainer events"
```

---

### Task 16: CheckoutScreen (advance) + BookingConfirmScreen

**Files:**
- Create: `src/screens/CheckoutScreen.tsx`, `src/screens/BookingConfirmScreen.tsx`
- Create test: `src/screens/CheckoutScreen.test.tsx`

- [ ] **Step 1: Failing test (advance computed from trainer-set %)**
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider, useNav } from '../nav/NavContext'
import { CheckoutScreen } from './CheckoutScreen'

function Peek() { const nav = useNav(); return <span data-testid="cur">{nav.current.name}</span> }

describe('CheckoutScreen', () => {
  it('shows the 25% advance for program p1 and confirms on pay', async () => {
    render(<NavProvider><Peek /><CheckoutScreen programId="p1" /></NavProvider>)
    expect(screen.getByText('Pay advance ₹1,800')).toBeInTheDocument()
    expect(screen.getByText('36 live coached sessions')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Pay advance/ }))
    expect(screen.getByTestId('cur').textContent).toBe('bookingConfirm')
  })
})
```
Run: `npm test -- CheckoutScreen` → FAIL.

- [ ] **Step 2: Implement CheckoutScreen**
```tsx
import { trainers } from '../data/trainers'
import { useNav } from '../nav/NavContext'
import { Icon } from '../components/Icon'
import { Button } from '../components/Button'

function findProgram(id: string) {
  for (const t of trainers) { const p = t.programs.find((x) => x.id === id); if (p) return { p, t } }
  return null
}
const rupees = (n: number) => '₹' + n.toLocaleString('en-IN')

export function CheckoutScreen({ programId }: { programId: string }) {
  const nav = useNav()
  const found = findProgram(programId)
  if (!found) return <div style={{ padding: 16 }}>Program not found</div>
  const { p, t } = found
  const advance = Math.round(p.feeTotal * (p.advancePct / 100))
  const balance = p.feeTotal - advance
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 12 }}>
        <div className="fc-display" style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', margin: '2px 0 10px' }}>with {t.name} · {p.scheduleLabel}</div>
        <div className="fc-display" style={{ fontSize: 11, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 6 }}>WHAT YOU GET</div>
        {p.benefits.map((b) => (
          <div key={b} style={{ fontSize: 12, lineHeight: 1.9, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="check" size={14} color="var(--fc-green)" />{b}
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 12 }}>
        <Row label="Program fee" value={rupees(p.feeTotal)} />
        <Row label={`Pay advance now (${p.advancePct}%)`} value={rupees(advance)} strong />
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(20,20,43,0.12)', paddingTop: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--fc-muted)' }}>Balance before start</span>
          <span className="fc-tabnum" style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{rupees(balance)}</span>
        </div>
      </div>
      <Button full style={{ padding: 12, fontSize: 14 }}
        onClick={() => nav.push({ name: 'bookingConfirm', params: { programId } })}>
        Pay advance {rupees(advance)}
      </Button>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 12, color: strong ? 'var(--fc-ink)' : 'var(--fc-muted)', fontWeight: strong ? 600 : 400 }}>{label}</span>
      <span className="fc-display fc-tabnum" style={{ fontSize: strong ? 13 : 12,
        color: strong ? 'var(--fc-indigo)' : 'var(--fc-ink)', fontWeight: strong ? 700 : 400 }}>{value}</span>
    </div>
  )
}
```
Run: `npm test -- CheckoutScreen` → PASS.

- [ ] **Step 3: BookingConfirmScreen**
```tsx
import { useNav } from '../nav/NavContext'
import { Icon } from '../components/Icon'
import { Button } from '../components/Button'

export function BookingConfirmScreen() {
  const nav = useNav()
  return (
    <div style={{ padding: 24, background: 'var(--fc-surface)', flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--fc-green)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="check" size={34} color="#fff" />
      </div>
      <div className="fc-display" style={{ fontSize: 18, fontWeight: 700 }}>You're booked!</div>
      <div style={{ fontSize: 13, color: 'var(--fc-muted)' }}>Advance paid. Find this program under Booked.</div>
      <Button onClick={() => nav.setTab('booked')}>Go to Booked</Button>
    </div>
  )
}
```

- [ ] **Step 4: Commit**
```bash
git add src/screens/CheckoutScreen.tsx src/screens/BookingConfirmScreen.tsx src/screens/CheckoutScreen.test.tsx
git commit -m "feat: add CheckoutScreen with trainer-set advance and confirmation"
```

---

### Task 17: EventsScreen

**Files:**
- Create: `src/screens/EventsScreen.tsx`
- Create test: `src/screens/EventsScreen.test.tsx`

- [ ] **Step 1: Failing test**
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavProvider } from '../nav/NavContext'
import { EventsScreen } from './EventsScreen'

describe('EventsScreen', () => {
  it('renders global events with capacity', () => {
    render(<NavProvider><EventsScreen /></NavProvider>)
    expect(screen.getByText('Weekend trail run')).toBeInTheDocument()
    expect(screen.getByText('14 / 15 left')).toBeInTheDocument()
  })
})
```
Run: `npm test -- EventsScreen` → FAIL.

- [ ] **Step 2: Implement**
```tsx
import { globalEvents } from '../data/events'
import { EventCard } from '../components/cards/EventCard'

export function EventsScreen() {
  return (
    <div style={{ padding: '12px 14px', background: 'var(--fc-surface)', flex: 1 }}>
      {globalEvents.map((e) => <EventCard key={e.id} event={e} />)}
    </div>
  )
}
```
Run: `npm test -- EventsScreen` → PASS.

- [ ] **Step 3: Commit**
```bash
git add src/screens/EventsScreen.tsx src/screens/EventsScreen.test.tsx
git commit -m "feat: add EventsScreen"
```

---

### Task 18: BookedScreen + ProgramDetailScreen

**Files:**
- Create: `src/screens/BookedScreen.tsx`, `src/screens/ProgramDetailScreen.tsx`
- Create test: `src/screens/BookedScreen.test.tsx`, `src/screens/ProgramDetailScreen.test.tsx`

- [ ] **Step 1: BookedScreen failing test**
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider, useNav } from '../nav/NavContext'
import { BookedScreen } from './BookedScreen'

function Peek() { const nav = useNav(); return <span data-testid="cur">{nav.current.name}:{nav.current.params?.id}</span> }

describe('BookedScreen', () => {
  it('shows overall progress and opens a program', async () => {
    render(<NavProvider><Peek /><BookedScreen /></NavProvider>)
    expect(screen.getByText('YOUR PROGRESS')).toBeInTheDocument()
    await userEvent.click(screen.getByText('12-Week Strength Builder'))
    expect(screen.getByTestId('cur').textContent).toBe('programDetail:b1')
  })
})
```
Run: `npm test -- BookedScreen` → FAIL.

- [ ] **Step 2: Implement BookedScreen**
```tsx
import { bookings } from '../data/bookings'
import { useNav } from '../nav/NavContext'
import { StepTrail } from '../components/StepTrail'

export function BookedScreen() {
  const nav = useNav()
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 12, marginBottom: 11 }}>
        <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 10 }}>YOUR PROGRESS</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['12', 'day streak'], ['28', 'sessions done'], ['2', 'programs']].map(([v, l]) => (
            <div key={l} style={{ flex: 1, background: 'var(--fc-surface)', borderRadius: 10, padding: 9, textAlign: 'center' }}>
              <div className="fc-display fc-tabnum" style={{ fontSize: 17, fontWeight: 700, color: 'var(--fc-indigo)' }}>{v}</div>
              <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {bookings.map((b) => (
        <div key={b.id} role="button" onClick={() => nav.push({ name: 'programDetail', params: { id: b.id } })}
          style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 12,
            marginBottom: 11, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
            <span className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{b.programName}</span>
            <span style={{ fontSize: 11, color: 'var(--fc-indigo)', fontWeight: 600 }}>
              {b.progressKind === 'weeks' ? `Wk ${b.current}/${b.total}` : `Day ${b.current}/${b.total}`}</span>
          </div>
          {b.progressKind === 'weeks'
            ? <StepTrail done={b.current} total={4} />
            : <div style={{ height: 5, borderRadius: 999, background: 'var(--fc-indigo-tint)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((b.current / b.total) * 100)}%`, height: '100%', background: 'var(--fc-green)' }} /></div>}
          <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 6 }}>with {b.trainerName}</div>
        </div>
      ))}
    </div>
  )
}
```
Run: `npm test -- BookedScreen` → PASS.

- [ ] **Step 3: ProgramDetailScreen failing test**
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavProvider } from '../nav/NavContext'
import { ProgramDetailScreen } from './ProgramDetailScreen'

describe('ProgramDetailScreen', () => {
  it('shows sessions with feedback and switches to community', async () => {
    render(<NavProvider><ProgramDetailScreen bookingId="b1" /></NavProvider>)
    expect(screen.getByText(/Great squat depth/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Community' }))
    expect(screen.getByText(/general discussion/i)).toBeInTheDocument()
  })
})
```
Run: `npm test -- ProgramDetailScreen` → FAIL.

- [ ] **Step 4: Implement ProgramDetailScreen**
```tsx
import { useState } from 'react'
import { getBooking } from '../data/bookings'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { SessionItem } from '../components/cards/SessionItem'

export function ProgramDetailScreen({ bookingId }: { bookingId: string }) {
  const [view, setView] = useState<'sessions' | 'community'>('sessions')
  const b = getBooking(bookingId)
  if (!b) return <div style={{ padding: 16 }}>Not found</div>
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      <SegmentedToggle options={[{ value: 'sessions', label: 'Sessions' }, { value: 'community', label: 'Community' }]}
        value={view} onChange={setView} />
      <div style={{ height: 13 }} />
      {view === 'sessions'
        ? b.sessions.map((s) => <SessionItem key={s.id} session={s} />)
        : <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 14,
            fontSize: 12, color: 'var(--fc-muted)' }}>
            Your cohort's general discussion — chat with everyone in {b.programName}.
          </div>}
    </div>
  )
}
```
Run: `npm test -- ProgramDetailScreen` → PASS.

- [ ] **Step 5: Commit**
```bash
git add src/screens/BookedScreen.tsx src/screens/ProgramDetailScreen.tsx src/screens/BookedScreen.test.tsx src/screens/ProgramDetailScreen.test.tsx
git commit -m "feat: add BookedScreen and ProgramDetailScreen with feedback/Q&A/community"
```

---

### Task 19: LogMealScreen

**Files:**
- Create: `src/screens/LogMealScreen.tsx`
- Create test: `src/screens/LogMealScreen.test.tsx`

- [ ] **Step 1: Failing test**
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavProvider } from '../nav/NavContext'
import { LogMealScreen } from './LogMealScreen'

describe('LogMealScreen', () => {
  it('shows calorie goal, macros, and trackers', () => {
    render(<NavProvider><LogMealScreen /></NavProvider>)
    expect(screen.getByText('/ 500 cal')).toBeInTheDocument()
    expect(screen.getByText('Protein')).toBeInTheDocument()
    expect(screen.getByText('Water')).toBeInTheDocument()
  })
})
```
Run: `npm test -- LogMealScreen` → FAIL.

- [ ] **Step 2: Implement**
```tsx
import { mealDay } from '../data/meal'
import { CalorieRing } from '../components/meal/CalorieRing'
import { MacroStat } from '../components/meal/MacroStat'
import { TrackerChip } from '../components/meal/TrackerChip'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'

export function LogMealScreen() {
  return (
    <div style={{ padding: '13px 14px', background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 13,
        marginBottom: 12, display: 'flex', alignItems: 'center', gap: 13 }}>
        <CalorieRing eaten={mealDay.caloriesEaten} goal={mealDay.caloriesGoal} />
        <div style={{ flex: 1 }}>
          <div className="fc-display" style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Today's food</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button full style={{ fontSize: 12, padding: 9 }}><Icon name="camera" size={14} color="#fff" /> Snap</Button>
            <Button variant="secondary" full style={{ fontSize: 12, padding: 9 }}><Icon name="plus" size={14} color="var(--fc-indigo)" /> Add</Button>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 14 }}>
        {mealDay.macros.map((m) => <MacroStat key={m.label} macro={m} />)}
      </div>
      <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 9 }}>TODAY'S TRACKERS</div>
      <div style={{ display: 'flex', gap: 9, overflowX: 'auto', paddingBottom: 2 }}>
        {mealDay.trackers.map((t) => <TrackerChip key={t.key} tracker={t} />)}
      </div>
    </div>
  )
}
```
Run: `npm test -- LogMealScreen` → PASS.

- [ ] **Step 3: Commit**
```bash
git add src/screens/LogMealScreen.tsx src/screens/LogMealScreen.test.tsx
git commit -m "feat: add LogMealScreen"
```

---

### Task 20: Light screens — TrainerHubScreen, ProfileScreen

**Files:**
- Create: `src/screens/TrainerHubScreen.tsx`, `src/screens/ProfileScreen.tsx`

- [ ] **Step 1: TrainerHubScreen (chat lives here)**
```tsx
import { trainers } from '../data/trainers'
import { Icon } from '../components/Icon'

export function TrainerHubScreen() {
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 9 }}>YOUR TRAINERS</div>
      {trainers.map((t) => (
        <div key={t.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14,
          padding: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--fc-indigo-tint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="user" size={20} color="var(--fc-indigo)" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>Tap to chat</div>
          </div>
          <Icon name="message-circle" size={20} color="var(--fc-indigo)" />
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: ProfileScreen**
```tsx
import { Icon } from '../components/Icon'
export function ProfileScreen() {
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 16,
        display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--fc-coral)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>PS</div>
        <div>
          <div className="fc-display" style={{ fontSize: 16, fontWeight: 700 }}>Prabu S.</div>
          <div style={{ fontSize: 12, color: 'var(--fc-muted)' }}>Client · joined 2026</div>
        </div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {['Account', 'Goals', 'Payments', 'Help'].map((r) => (
          <div key={r} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', padding: '13px 14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
            {r}<Icon name="chevron-right" size={18} color="var(--fc-muted)" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**
```bash
git add src/screens/TrainerHubScreen.tsx src/screens/ProfileScreen.tsx
git commit -m "feat: add TrainerHub (chat) and Profile light screens"
```

---

## Phase 6 — Wire it together

### Task 21: App router + header logic

**Files:**
- Modify: `src/App.tsx`
- Create test: `src/App.test.tsx`

- [ ] **Step 1: Failing end-to-end test (browse → trainer → checkout → confirm → booked)**

`src/App.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App end-to-end Sessions→Booked', () => {
  it('navigates from browse to a booked program', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('Aanand R.'))           // trainer
    await userEvent.click(screen.getAllByRole('button', { name: 'BOOK' })[0]) // checkout
    await userEvent.click(screen.getByRole('button', { name: /Pay advance/ })) // confirm
    await userEvent.click(screen.getByRole('button', { name: 'Go to Booked' }))
    expect(screen.getByText('YOUR PROGRESS')).toBeInTheDocument()
  })

  it('reaches Log Meal from the bottom nav FAB', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /log meal/i }))
    expect(screen.getByText('/ 500 cal')).toBeInTheDocument()
  })
})
```
Run: `npm test -- App` → FAIL.

- [ ] **Step 2: Implement App**

`src/App.tsx`:
```tsx
import { NavProvider, useNav } from './nav/NavContext'
import { PhoneFrame } from './components/PhoneFrame'
import { ContextHeader } from './components/ContextHeader'
import { TopTabStrip } from './components/TopTabStrip'
import { BottomNav } from './components/BottomNav'
import { SessionsScreen } from './screens/SessionsScreen'
import { TrainerScreen } from './screens/TrainerScreen'
import { CheckoutScreen } from './screens/CheckoutScreen'
import { BookingConfirmScreen } from './screens/BookingConfirmScreen'
import { EventsScreen } from './screens/EventsScreen'
import { BookedScreen } from './screens/BookedScreen'
import { ProgramDetailScreen } from './screens/ProgramDetailScreen'
import { LogMealScreen } from './screens/LogMealScreen'
import { TrainerHubScreen } from './screens/TrainerHubScreen'
import { ProfileScreen } from './screens/ProfileScreen'

const TAB_SCREENS = new Set(['sessions', 'events', 'booked', 'logMeal'])
const TITLES: Record<string, string> = {
  sessions: 'Sessions', events: 'Events', booked: 'Booked', logMeal: 'Log Meal',
  trainer: 'Trainer', checkout: 'Confirm booking', bookingConfirm: 'Booking',
  programDetail: 'Program', trainerHub: 'Your trainers', profile: 'Profile',
}

function Shell() {
  const nav = useNav()
  const cur = nav.current
  const isTabRoot = TAB_SCREENS.has(cur.name)

  let body: React.ReactNode = null
  switch (cur.name) {
    case 'sessions': body = <SessionsScreen />; break
    case 'trainer': body = <TrainerScreen trainerId={cur.params!.id} />; break
    case 'checkout': body = <CheckoutScreen programId={cur.params!.programId} />; break
    case 'bookingConfirm': body = <BookingConfirmScreen />; break
    case 'events': body = <EventsScreen />; break
    case 'booked': body = <BookedScreen />; break
    case 'programDetail': body = <ProgramDetailScreen bookingId={cur.params!.id} />; break
    case 'logMeal': body = <LogMealScreen />; break
    case 'trainerHub': body = <TrainerHubScreen />; break
    case 'profile': body = <ProfileScreen />; break
  }

  return (
    <PhoneFrame>
      <ContextHeader title={TITLES[cur.name]} back={!isTabRoot} />
      {isTabRoot && <TopTabStrip />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>{body}</div>
      <BottomNav />
    </PhoneFrame>
  )
}

export default function App() {
  return <NavProvider><Shell /></NavProvider>
}
```
Run: `npm test -- App` → PASS.

- [ ] **Step 3: Full suite + dev smoke**

Run: `npm test`
Expected: all suites PASS.
Run: `npm run dev` → click through Sessions → trainer → BOOK → Pay advance → Go to Booked → open program → Community; switch top tabs; tap Log meal FAB. Everything should navigate.

- [ ] **Step 4: Commit**
```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: wire App router, header, and end-to-end navigation"
```

---

### Task 22: Production build check

- [ ] **Step 1: Type-check + build**

Run: `npm run build`
Expected: `tsc` passes, Vite emits `dist/` with no errors.

- [ ] **Step 2: Commit any config fixes**
```bash
git add -A
git commit -m "chore: ensure clean production build" || echo "nothing to commit"
```

---

## Self-Review (completed during authoring)

**Spec coverage:**
- §2 tokens → Task 2 ✓ · §3 shell (4 zones) → Tasks 11, 21 ✓ · §4 nav (top tabs + 3-item bottom) → Tasks 11, 6 ✓
- §5 Sessions browse (1to1/Group, filters, trainer cards, group spots) → Tasks 12, 14 ✓
- §6 Trainer page (verified header, paid 1-day trial, programs, their events) → Task 15 ✓
- §7 Checkout (benefits, trainer-set advance %) → Task 16 ✓
- §8 Events (capacity/max-spots, pins, FREE/price) → Tasks 12, 17 ✓
- §9 Booked (overall progress, per-program progress, per-session feedback+Q&A, per-program community) → Tasks 12, 18 ✓
- §9.5 Log Meal (camera/manual add, calorie ring, macros, trackers) → Tasks 13, 19 ✓
- Role pill shown (§3); full role-switched trainer tabs are out of scope for this prototype slice (spec §11) — header shows the pill, client tabs implemented.

**Placeholder scan:** No TBDs; every code step contains complete code. Light screens (TrainerHub/Profile) are intentionally simple but fully implemented, not placeholders.

**Type consistency:** `ScreenName`/`TabKey` used consistently across NavContext, BottomNav, TopTabStrip, App. Param keys match: `trainer`→`id`, `checkout`→`programId`, `programDetail`→`id`. Data accessors `getTrainer`/`getBooking`/`findProgram` match data shapes in Task 5. Advance math (`p1`: 7200×25% = 1800) matches the Task 16 test assertion.

---

## Out of scope (future plans)
- Full trainer-role screens (Clients/Reviews/Earnings) — spec §11.
- App-wide Community tab internals — spec §10.
- Progress and Plans tabs — spec §12.
- Real data/persistence, auth/onboarding, payment gateway.
- Camera capture, live video sessions, push notifications.
