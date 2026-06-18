# FitConnect — Design System & App Shell Spec

**Date:** 2026-06-18
**Status:** Approved for planning
**Scope of this spec:** Brand/token foundation, the app shell, role-switch behavior, and the full **Sessions / Events / Booked / Community** experience. Other top tabs (Log Meal, Progress, Plans) are named here so navigation is complete, but their internals are **out of scope** and will be detailed in follow-up brainstorming.

---

## 1. Product overview

FitConnect connects **fitness trainers** with **clients**. Clients discover trainers (local or international), try them via a low-commitment trial, book single sessions or multi-week programs, attend group classes and events, log meals, and track progress. Trainers publish programs, host group sessions and events, give per-session feedback, and answer client questions.

The consumer experience is modeled on Swiggy's anatomy: a persistent shell (context header, scrollable top tabs, card-based content feed, bottom nav), a browse-list → detail → checkout flow, and segmented toggles for sub-views.

### Roles
One app, **role-switched**. The navigation skeleton is identical for both roles; only the tab labels and content swap based on whether the user is signed in as **Client** or **Trainer**. This spec details the **Client** experience end to end; the Trainer experience reuses the same shell and is sketched in §11.

---

## 2. Brand & design tokens

### 2.1 Identity
- **Name treatment:** `FitConnect` wordmark — "Fit" in bold indigo, "Connect" in ink. Paired with a **bolt mark** (energy + the trainer↔client connection).
- **Personality:** energetic, motivating, premium — not corporate, not a hard gym app.
- **Signature motif — "small steps":** progress is rendered as a **trail of stepping stones**: completed steps filled indigo with checks, the *next* step a single reachable coral `+` dot. Used on the home/Sessions "Today's small steps" card and on every program's progress view. The principle: never show a giant bar to fill — always show the next single reachable step.

### 2.2 Color tokens
| Token | Hex | Role |
|---|---|---|
| `--fc-indigo` | `#5A4AE3` | Primary brand. Header fill, active tab/underline, primary buttons, completed steps. |
| `--fc-coral` | `#FF6B4A` | Energy accent. "Log" FAB, next-step dot, urgent/near-full states, secondary CTAs. |
| `--fc-green` | `#16B981` | Progress / success / "on track" / free badges. |
| `--fc-ink` | `#14142B` | Primary text (near-black with violet undertone). |
| `--fc-muted` | `#8A8A99` | Secondary text, inactive icons/labels. |
| `--fc-surface` | `#F6F6FB` | Page/content background behind cards. |
| `--fc-white` | `#FFFFFF` | Card surface. |
| `--fc-indigo-tint` | `#ECEAFB` | Indigo wash (badges, icon chips, step track). |
| `--fc-coral-tint` | `#FFE8E1` | Coral wash (icon chips). |
| `--fc-rating-green` | `#16864F` | Rating pill background. |

### 2.3 Typography
- **Display / headings / numbers:** **Sora** (600/700). Geometric, athletic, confident. Numbers run **tabular** (`font-variant-numeric: tabular-nums`) so weights/calories/reps/prices align.
- **Body / UI:** **Inter** (400/500/600). Workhorse legibility at small sizes.
- Both via Google Fonts.

### 2.4 Shape & spacing
- **Radius:** cards 16px; mode/sub-cards 14px; buttons & inputs 11–13px; pills/badges 999px; icon chips 9–10px.
- **Buttons:** filled primary = indigo bg / white text; energy = coral bg / white text; secondary = transparent / indigo text / indigo or sage border.
- **Capacity bar:** 5px rounded track on `--fc-indigo-tint`; fill indigo normally, **coral when ≥~85% full** with the count also flipping coral.
- **Cards:** white bg, `0.5px` border, generous internal padding, ample whitespace.

---

## 3. App shell (4 fixed zones)

Every screen inherits this skeleton; only content swaps.

1. **Context header (top):** indigo-filled bar. Left = context (client: *"Today · Coach Aanand · Week 3"* or the current screen title; trainer: roster/client context). Right = **role pill** (Client/Trainer) + profile avatar (coral with initials).
2. **Top tab strip:** horizontally scrollable, emoji/icon + label. Active tab = indigo icon + label + 2.5px indigo underline; inactive = muted. **Swaps by role** (§4).
3. **Content area:** scrollable, card-based feed on `--fc-surface`. Each top tab renders its own cards here.
4. **Bottom nav:** global actions, always present, **swaps by role** (§4). Center **Log** action is a raised coral FAB.

---

## 4. Navigation

### 4.1 Top tabs
| Role | Top tabs |
|---|---|
| **Client** | Sessions · Events · Booked · Log Meal · Progress · Plans · Community |
| **Trainer** | Clients · Sessions · Events · Reviews · Plans · Earnings |

### 4.2 Bottom nav
| Role | Bottom nav |
|---|---|
| **Client** | Home · Schedule · **Log** (FAB) · Chat · Profile |
| **Trainer** | Home · Roster · **+** (FAB: new session/program) · Chat · Profile |

---

## 5. Sessions tab (client)

Modeled on Swiggy's restaurant browse. **Trainers are the "restaurants."**

- **Search bar:** "Search trainers, programs."
- **Segmented toggle** (Swiggy's Gourmet/Spotlight pattern): **`1-to-1`** / **`Group`**.
  - `1-to-1` → list of trainers offering one-to-one coaching.
  - `Group` → list of trainers offering group sessions; group session cards show a **capacity bar + "X / N spots"**.
- **Filter row (chips):** Filter · Near me · Online · International. (Trainers are local — shown with distance in km — or **Online · Intl**.)
- **Trainer cards** (the browse list): avatar/photo, name, specialty, **rating pill** (green), location (km) or *Online · Intl*, and a **"from ₹X / session"** price hint.

Tapping a trainer card → **Trainer page** (§6).

---

## 6. Trainer page

The trainer's "menu," like opening a restaurant. Top-to-bottom:

1. **Trainer header card:** **FitConnect Verified** badge (the "Swiggy Seal" equivalent), name, specialty + years, rating pill, location · distance, program count.
2. **Try before you commit:** a highlighted entry card with the **1-day trial session** (paid, e.g. ₹300 — a full session to sample the trainer). *(No free consultation — dropped per decision.)*
3. **Filter chips:** All · Daily · Multi-day · Bestseller.
4. **Programs (the menu):** grouped into sections (e.g. "Strength programs"). Each **program card** = name, schedule descriptor (**Daily** or **Multi-day**, e.g. "3x/week", "Every day · 30 min"), Bestseller badge where applicable, price (per session or per program), and a **BOOK** button.
5. **Events by this trainer:** horizontal-scroll section ("Events by Aanand") listing the trainer's own events, each with date + **spots** capacity. (Same events also appear in the global Events tab — §8.)

Tapping **BOOK** on a program → **Checkout** (§7).

---

## 7. Checkout (book with advance)

Swiggy-checkout style. Contents:

1. **Program summary card:** program name, trainer, schedule, start.
2. **"What you get" (benefits):** checklist (e.g. "36 live coached sessions", "Custom workout + meal plan", "Weekly check-in & chat").
3. **Price breakdown:**
   - Program fee (total).
   - **Pay advance now** — highlighted; the advance amount is a **percentage set by the trainer per program** (not a global fixed rate).
   - Balance before start.
4. **Primary CTA:** **"Pay advance ₹X."**

---

## 8. Events tab (client)

A board of one-off happenings (group runs, bootcamps, workshops, challenges). Sourced both globally and from individual trainers.

- **Event cards:** banner (icon/color), **price or FREE badge**, title, **date/time**, **location pin** (or Online), and a **capacity bar + "X / N spots"** that flips to **coral** ("14 / 15 left") when nearly full. CTA: **Join** (free) / **Book** (paid).

---

## 9. Booked tab (client)

Where active commitments live.

1. **Your progress (overall):** summary card spanning everything — day streak, sessions done, active program count.
2. **Booked program cards:** one per active program, each with **its own progress** — the small-steps trail for week-based programs (e.g. "Wk 3/12") or a day-counter bar for day-based programs (e.g. "Day 9/30") — plus the trainer's name.

Tapping a booked program → **Program detail** with a segmented toggle:

- **`Sessions`:** the full session list. Each session:
  - **Completed** → **coach feedback** (green bubble) + a **per-session Q&A thread** (client question, coach reply).
  - **Upcoming** → an **"Ask a question for this session…"** input (ask ahead), plus Join when live.
- **`Community`:** the **per-program cohort's general discussion** — a private feed/chat for just the people in that program.

---

## 10. Community tab (client)

App-wide community — the public, everyone-can-see feed/discussion. Distinct from the **per-program** community inside Booked (§9), which is private to a cohort. Internals (feed format, posting, moderation) to be detailed in follow-up brainstorming.

---

## 11. Trainer-role views (sketch)

Reuses the same shell; top tabs become **Clients · Sessions · Events · Reviews · Plans · Earnings**. Trainers publish programs (with per-program advance %), host group sessions (with max spots) and events, give per-session feedback, and answer the client questions surfaced in §9. Full detailing is **out of scope** for this spec.

---

## 12. Out of scope (this spec) / next specs

These are named for navigation completeness but deliberately **not** detailed here; each gets its own brainstorming → spec cycle:

- **Log Meal** tab (and the bottom-nav Log FAB flow).
- **Progress** tab.
- **Plans** tab.
- **Community** tab internals.
- **Trainer-role** screens in full.
- Auth / onboarding / role selection.
- Payments integration specifics (gateway, refunds on advance).

---

## 13. Decisions log

- **Roles:** one app, role-switched (Client/Trainer share the shell). *Decided.*
- **Brand:** indigo `#5A4AE3` + coral `#FF6B4A`, Sora + Inter, small-steps trail motif. *Decided.*
- **Sessions split:** `1-to-1` / `Group` segmented toggle; trainers are the browse units. *Decided.*
- **Trial:** paid **1-day trial** only; **no free consultation**. *Decided.*
- **Advance:** **trainer sets the advance % per program.** *Decided.*
- **Capacity:** group sessions and events show **max spots**; bar/count turn coral when nearly full. *Decided.*
- **Community:** **both** — app-wide `Community` top tab **and** a private per-program community inside Booked. *Decided.*
- **Booked detail:** per-session **feedback + Q&A**, plus a per-program **general discussion** (Community sub-tab). *Decided.*
- **Events:** surface in **both** the global Events tab and under each trainer. *Decided.*
