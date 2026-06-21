# FitConnect — Prototype → Product Roadmap

This repo today is a **high-fidelity front-end prototype**: React + Vite + TypeScript, a complete design system, screens, navigation, and UX flows — but **all data is in-memory mock** (`src/data/*.ts`) that resets on reload. There is no backend, database, auth, or payments yet.

The good news: the front-end, design system, and `src/lib/types.ts` carry into the real product almost intact. Each `src/data/*.ts` file is a clean **seam** — a fake "repository." Productizing = swapping each file's internals from in-memory to real API calls, one phase at a time, while the UI mostly stays.

**Recommended stack:** keep the React/Vite/TS front-end. Fastest path to real = **Supabase** (Postgres + Auth + Realtime + Storage). Move to a custom Node/NestJS API + Postgres + Razorpay + Mux when you outgrow it.

---

## Phase 0 — Foundation (a few days)
Rails before product.
- Push to **GitHub**; connect the repo to **Vercel** (auto-deploy + preview URLs); disable the deployment-protection wall.
- **GitHub Actions CI**: run `tsc -b` + the test suite on every PR.
- Stand up **Supabase** (Postgres + Auth + Storage + Realtime), free tier.
- Add `.env` + a thin `src/lib/api.ts`. Keep `src/data/*.ts` as the seam; swap their internals to the API one file at a time.
- **Exit:** every push deploys; tests gate merges; an empty DB + auth exists.

## Phase 1 — MVP: the booking transaction
**Goal:** a real client books a real trainer's program and pays an advance; the trainer confirms. That single loop = a real marketplace.

**Build:**
- **Auth & roles** — email/phone OTP; `client` vs `trainer` (replaces the role-switch toggle). New + repurpose `data/profile.ts`.
- **Trainers & programs** — DB tables; seed ~5 real trainers. `data/trainers.ts` → API reads.
- **Browse → trainer → checkout** — keep UI; back with real data. Ship 1:1 programs first; defer group showtimes.
- **Booking lifecycle** — `request → awaiting → confirmed/declined`. `data/bookings.ts` + `data/sessionRequests.ts` → real tables + endpoints; trainer Requests tab confirms for real.
- **Payments** — **Razorpay** advance hold; balance captured before start (the "advance held until confirm" becomes real escrow).
- **Basic availability** — server-side `working hours − booked = free slots` (simpler `calendar.ts`/`workingHours.ts`) so slot/schedule pickers are real.
- **Booked tab + session list** — real persisted bookings (the programs/calendar views work as-is).
- **Transactional email/SMS** on confirm/decline (Resend/Twilio).

**Defer:** nutrition/coach hub, group showtimes, recurring edge cases, videos, community, Fittii, calendar sync, nudges.

**Exit:** a stranger signs up, books a trainer, pays an advance, the trainer confirms, both see it persisted after refresh. This is the demoable, fundable MVP.

## Phase 2 — Coaching loop
Make the trainer↔client relationship real.
- **Nutrition** (`data/meal.ts` + `data/coach.ts`) as a shared store — client logs, trainer sees it, comments flow back.
- **Session Q&A + coach feedback + ratings** persisted (`components/cards/SessionItem.tsx`).
- **Workout plans** (`data/workouts.ts`) become trainer-editable per program.
- **Exit:** a trainer can coach an enrolled client day-to-day.

## Phase 3 — Scheduling engine + calendar
- Full availability: per-trainer working hours, conflict reconciliation, **recurring programs** (the `ScheduleSelector` logic) server-side.
- **Google Calendar two-way sync** per trainer — the biggest "feels real" upgrade.
- **Exit:** no double-bookings system-wide; trainers manage from their own calendar.

## Phase 4 — Realtime & notifications
- Websockets for live booking/request updates, Q&A, community.
- **Push notifications** + the **nudge** system (Coach nudges become real reminders).
- **Exit:** the app feels alive without refreshing.

## Phase 5 — Media & live sessions
- Real **educational videos** (Mux / Cloudflare Stream) replacing the mock player (`components/VideoModal.tsx`).
- **Live sessions** — Google Meet / Zoom / Daily ("Join" becomes real); optional Fittii/Zoom-transcription idea.
- **Exit:** training content and live delivery are real.

## Phase 6 — Marketplace scale & polish
- **Group classes** (the BookMyShow showtimes) with capacity + waitlists.
- Search/discovery, reviews & ratings, trainer payouts/ledger, **admin panel**, analytics, observability.
- **Exit:** ready to onboard trainers at volume.

---

## File → backend mapping (the seam)
| Prototype file | Becomes |
|---|---|
| `data/trainers.ts` | trainers + programs tables (Phase 1) |
| `data/bookings.ts`, `data/sessionRequests.ts` | bookings/sessions + lifecycle API + payments (Phase 1) |
| `data/workingHours.ts`, `data/calendar.ts` | availability service + calendar sync (Phase 1 basic → Phase 3 full) |
| `data/profile.ts` | users/auth (Phase 1) |
| `data/meal.ts`, `data/coach.ts`, `data/workouts.ts` | coaching/nutrition store (Phase 2) |
| `data/groupClasses.ts` | group classes + capacity (Phase 6) |
| `data/fittii.ts` | feedback/observability tooling (Phase 5+, optional) |

**Throughline:** the front-end and `lib/types.ts` survive almost intact. Phase 1 is ~3–5 weeks with one full-stack dev (faster on Supabase); everything after is incremental and independently shippable.

## Suggested next artifact
A detailed **Phase-1 MVP spec**: data model (tables + relations), API endpoints, the Razorpay escrow flow, and the exact file-by-file swap list.
