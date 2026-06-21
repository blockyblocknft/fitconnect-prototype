import type { TabKey } from '../nav/NavContext'

export interface FbMessage { id: string; author: string; initial: string; color: string; time: string; text: string; reaction?: string }
export interface FbFeature {
  id: string
  name: string
  blurb: string
  capture: string       // what the highlighted screen capture shows
  messages: FbMessage[]
  aiPrompt: string       // Fittii-AI consolidated improvement prompt
}
export interface FbModule { id: string; tab: TabKey; label: string; features: FbFeature[]; role?: 'client' | 'trainer' }

const sathya = { author: 'Sathya', initial: 'S', color: '#9B6CF0' }
const karthick = { author: 'Karthick', initial: 'K', color: '#E8923B' }
const uma = { author: 'Uma', initial: 'U', color: '#3BA55D' }
const m = (who: typeof sathya, id: string, time: string, text: string, reaction?: string): FbMessage => ({ id, ...who, time, text, reaction })

export const fbModules: FbModule[] = [
  {
    id: 'book-sessions', tab: 'sessions', label: 'BOOK SESSIONS',
    features: [
      { id: 'filters', name: 'search-and-filters', blurb: 'Sort, mode toggle & category strip',
        capture: 'Book sessions › filter row + “Browse by focus” strip',
        messages: [
          m(sathya, 'f1', '10:02 AM', 'The Online/Outdoor toggle reads way better now that it’s named. 🙌', '👍 2'),
          m(karthick, 'f2', '10:09 AM', 'Can “Near me” show the actual radius? Right now it’s hard-coded to 3km.'),
          m(uma, 'f3', '10:14 AM', 'Category icons could be a touch bigger on small phones, but solid.'),
        ],
        aiPrompt: 'Improve the Book-sessions filter row: make the “Near me” radius user-adjustable (e.g. a 1–10km stepper) instead of a fixed 3km, and bump the category-tile icon size ~10% on viewports under 380px. Keep the named Online/Outdoor toggle as-is.' },
      { id: 'slot-picker', name: 'slot-picker', blurb: 'Availability-gated time slots',
        capture: 'Checkout › “Pick your start slot” (busy + off-hours hidden)',
        messages: [
          m(karthick, 's1', '11:20 AM', 'Past times on *today* still show — should grey them out.'),
          m(sathya, 's2', '11:23 AM', 'Agree. Also a “next available” quick-jump would be 🔥'),
        ],
        aiPrompt: 'In SlotPicker, hide or disable start times earlier than the current time on today’s column, and add a “Next available” shortcut that jumps to the first open slot across the week.' },
      { id: 'checkout', name: 'checkout', blurb: 'Advance pay + request lifecycle',
        capture: 'Checkout › advance breakdown + Pay advance CTA',
        messages: [
          m(uma, 'c1', '12:01 PM', 'Love that Pay advance is disabled until a slot is picked.'),
          m(sathya, 'c2', '12:05 PM', 'Show the picked slot in the summary before paying?'),
        ],
        aiPrompt: 'On the checkout summary, surface the chosen start slot (date + time) above the Pay-advance button so the user can confirm it before committing.' },
    ],
  },
  {
    id: 'booked', tab: 'booked', label: 'BOOKED',
    features: [
      { id: 'program-card', name: 'program-progress', blurb: 'Progress bar + session tiles',
        capture: 'Booked › program card (bar + 3-up session tiles)',
        messages: [
          m(sathya, 'b1', '9:40 AM', 'Both the bar and the tiles together is exactly what I wanted. ✅', '🎉 3'),
          m(karthick, 'b2', '9:44 AM', 'Tile date font is tiny — maybe 9.5px.'),
        ],
        aiPrompt: 'Keep the program progress bar + 3-up session tiles. Nudge the tile date label up to ~9.5px for legibility and ensure the “Now” tile has a clear focus ring.' },
      { id: 'custom-request', name: 'custom-request', blurb: 'Per-trainer request lifecycle',
        capture: 'Trainer page › “Need a custom slot?” + request status',
        messages: [
          m(uma, 'r1', '2:10 PM', 'Moving requests onto each trainer page makes way more sense.'),
        ],
        aiPrompt: 'Confirm per-trainer custom-request placement is working; add a subtle toast when a request flips from Awaiting → Confirmed so the client notices without reopening the trainer page.' },
    ],
  },
  {
    id: 'log-meal', tab: 'logMeal', label: 'LOG MEAL',
    features: [
      { id: 'calorie-ring', name: 'calorie-ring', blurb: 'Daily calories + macros',
        capture: 'Log Meal › calorie ring + macros vs plan',
        messages: [
          m(karthick, 'l1', '8:30 AM', 'Ring animation on add would be a nice touch.'),
          m(sathya, 'l2', '8:33 AM', 'And colour the ring red when over target.'),
        ],
        aiPrompt: 'Animate the calorie ring when a meal is logged, and switch the ring colour to the over-target red once eaten exceeds the goal.' },
      { id: 'meal-entry', name: 'meal-entry', blurb: 'Add meal modal',
        capture: 'Log Meal › meal entry modal',
        messages: [
          m(uma, 'me1', '8:50 AM', 'Could we add a photo/scan path next to manual entry?'),
        ],
        aiPrompt: 'Add a “Scan a photo” path to the meal entry modal that pre-fills name/calories (mock AI estimate for now), alongside manual entry.' },
    ],
  },
  {
    id: 'events', tab: 'events', label: 'EVENTS',
    features: [
      { id: 'event-card', name: 'event-card', blurb: 'Event listing + capacity',
        capture: 'Events › event card with capacity bar',
        messages: [
          m(sathya, 'e1', '4:12 PM', 'Capacity bar is clear. Add a “3 spots left” nudge when nearly full?'),
        ],
        aiPrompt: 'On event cards near capacity (≥80% full), show an urgency nudge like “Only N spots left” next to the capacity bar.' },
    ],
  },

  // ── Trainer-side modules ──
  {
    id: 'tr-coach', tab: 'trCoach', label: 'COACH', role: 'trainer',
    features: [
      { id: 'nutrition-nudge', name: 'nutrition-nudge', blurb: 'Per-client follow-up nudges',
        capture: 'Coach › Nutrition › client behind on logging + Nudge',
        messages: [
          m(sathya, 'tn1', '9:10 AM', 'The coral Nudge on no-log clients is 👌 — exactly the prompt a coach needs.'),
          m(karthick, 'tn2', '9:15 AM', 'With 10+ clients the list gets long — the search + “Needs attention” really help.'),
        ],
        aiPrompt: 'Keep the attention-first Coach nutrition list. Add a bulk “Nudge all who haven’t logged” action per session, and a daily auto-summary of who’s behind.' },
      { id: 'qa-threads', name: 'qa-threads', blurb: 'Per-session Q/A + nudge',
        capture: 'Coach › Q/A grouped under each session',
        messages: [m(uma, 'tq1', '10:02 AM', 'Grouping questions by session is much clearer than a flat inbox.')],
        aiPrompt: 'Add canned-reply suggestions to the Coach Q/A composer and let the trainer mark a question as “answered for the whole cohort”.' },
    ],
  },
  {
    id: 'tr-calendar', tab: 'trCalendar', label: 'CALENDAR', role: 'trainer',
    features: [
      { id: 'conflict-flags', name: 'conflict-flags', blurb: 'Overlap reconciliation',
        capture: 'Calendar › today with two overlapping sessions flagged',
        messages: [m(karthick, 'tc1', '11:40 AM', 'Could a one-tap “reschedule the clash” button live right on the conflict banner?')],
        aiPrompt: 'On the Calendar conflict banner, add a one-tap action that opens the reschedule flow for the later of the two clashing sessions.' },
    ],
  },
  {
    id: 'tr-hours', tab: 'trHours', label: 'WORK HOURS', role: 'trainer',
    features: [
      { id: 'hours-editor', name: 'hours-editor', blurb: 'Per-day bookable windows',
        capture: 'Work hours › per-weekday on/off + start–end',
        messages: [m(sathya, 'th1', '12:20 PM', 'Add a “copy Monday to all weekdays” shortcut so setup is faster.')],
        aiPrompt: 'In the Work-hours editor add a “copy this day to all weekdays” shortcut and support split shifts (a morning and an evening window per day).' },
    ],
  },
  {
    id: 'tr-create', tab: 'trSessions', label: 'CREATE SESSION', role: 'trainer',
    features: [
      { id: 'session-form', name: 'session-form', blurb: 'Slot-gated create / edit',
        capture: 'Create session › duration + open-slot picker',
        messages: [m(uma, 'ts1', '1:05 PM', 'Capacity floor on edit (can’t go below booked) is a nice guard rail.')],
        aiPrompt: 'In Create-session, default the duration to the trainer’s most-used length and warn before creating a session outside working hours.' },
    ],
  },
]

export function moduleForTab(tab: TabKey) {
  return fbModules.find((mod) => mod.tab === tab)
}
export function getFeature(moduleId: string, featureId: string) {
  const mod = fbModules.find((x) => x.id === moduleId)
  return mod ? { mod, feature: mod.features.find((f) => f.id === featureId) } : null
}
