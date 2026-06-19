import type { AuditNote } from '../components/AuditButton'

// Mismatches between the role-based requirements and the existing client design.
export const AUDIT: Record<string, AuditNote> = {
  dashboard: {
    title: 'Trainer dashboard has no analog in the client design',
    mismatch: 'The client app is a browse/feed experience — cards you scroll. There is no operational dashboard with live counts (sessions today, booked, open spots) anywhere in the client surfaces.',
    recommendation: 'Introduce a metric-tile dashboard reusing the client card + token system. Keep it operational: counts first, then a task list of today’s sessions. Do not reuse the marketing-style trainer browse cards here.',
  },
  bookingLifecycle: {
    title: 'Booking lifecycle: client books instantly; requirement needs confirmation',
    mismatch: 'Client flow is book → pay advance → confirmed in one step. Your requirement adds: request → awaiting trainer confirmation → booked / cancelled. No pending state or trainer confirm/decline action exists today.',
    recommendation: 'Add a booking status (requested → awaiting → confirmed/cancelled). Client sees “Requested — awaiting confirmation”; trainer gets Confirm / Decline per request. Hold the advance until confirmed.',
  },
  attendance: {
    title: 'Attendance + status vocabulary mismatch',
    mismatch: 'Client uses attended / missed / in-progress / upcoming. Your requirement uses confirmed / attended / no-show / cancelled. The client design also has no per-person row for marking attendance.',
    recommendation: 'Unify on the requirement enum (map client “missed” → “no-show”). Add a roster row with Attended / No-show toggles + capacity (booked vs open). New trainer-only pattern; reuse the SessionItem row styling.',
  },
  nutritionReview: {
    title: 'Meal logging depth & trainer review are not in the client design',
    mismatch: 'Client Log Meal is display-only (calorie ring + macro % + tracker chips). No real meal entry (type/time/macros/notes), no timeline, no edit/delete, no trainer comments. The trainer review surface does not exist at all.',
    recommendation: 'Client: add a meal entry modal + meal timeline + trainer-comment display. Trainer: client list with status chips (no log / partial / on track / over target), expandable to meals with a comment box per meal.',
  },
  createSession: {
    title: 'Session create/edit modal is undesigned',
    mismatch: 'The client design only consumes sessions (book/join). There is no create/edit/cancel session surface, capacity editor, or manual “book a client” modal.',
    recommendation: 'Add a create/edit session sheet (title, time, mode, location/link, capacity) and a “book client” picker. Reuse the checkout form/input patterns.',
  },
}
