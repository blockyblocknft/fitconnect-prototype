import { useState } from 'react'
import type { SessionType } from '../lib/types'
import { getTrainer } from '../data/trainers'
import { clientRequests, type RequestStatus } from '../data/sessionRequests'
import { OfferingCard, type Offering, type OfferingKind } from '../components/cards/OfferingCard'
import { RequestSessionModal } from '../components/RequestSessionModal'
import { Icon } from '../components/Icon'
import { RatingPill } from '../components/RatingPill'

const REQ_STATUS: Record<RequestStatus, { label: string; bg: string; fg: string }> = {
  awaiting: { label: 'Awaiting', bg: '#FAEEDA', fg: '#854F0B' },
  confirmed: { label: 'Confirmed', bg: '#E4F3EA', fg: 'var(--fc-rating-green)' },
  declined: { label: 'Declined', bg: '#FCEBEB', fg: '#A32D2D' },
}

type FilterKey = 'all' | OfferingKind
const ALL_FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'trial', label: 'Trial' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'group', label: 'Group' },
  { key: 'event', label: 'Events' },
]

// Which offering kinds belong to each browse mode.
const MODE_KINDS: Record<SessionType, OfferingKind[]> = {
  '1to1': ['trial', 'daily', 'weekly'],
  group: ['group', 'event'],
}

export function TrainerScreen({ trainerId, mode }: { trainerId: string; mode?: SessionType }) {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [showRequest, setShowRequest] = useState(false)
  const [, force] = useState(0)
  const t = getTrainer(trainerId)
  if (!t) return <div style={{ padding: 16 }}>Trainer not found</div>
  const loc = t.location
  const myRequests = clientRequests().filter((r) => r.trainerName === t.name)

  const allOfferings: Offering[] = [
    { id: 'trial', kind: 'trial', name: '1-day trial', sub: 'Full session', price: t.trial.priceLabel },
    ...t.programs.map<Offering>((p) => ({
      id: p.id, kind: p.cadence === 'daily' ? 'daily' : 'weekly',
      name: p.name, sub: p.scheduleLabel, price: p.priceLabel, programId: p.id, bestseller: p.bestseller,
    })),
    ...t.groupSessions.map<Offering>((g) => ({
      id: g.id, kind: 'group', name: g.title,
      sub: `${g.scheduleLabel} · ${g.placeLabel}`, price: g.priceLabel,
      spotsTaken: g.spotsTaken, spotsMax: g.spotsMax,
    })),
    ...t.events.map<Offering>((e) => ({
      id: e.id, kind: 'event', name: e.title,
      sub: `${e.dateLabel} · ${e.placeLabel}`, price: e.free ? 'Free' : e.priceLabel ?? '',
      spotsTaken: e.spotsTaken, spotsMax: e.spotsMax,
    })),
  ]

  // Scope to the browse mode the client came from (1:1 vs group); fall back to everything.
  const modeKinds = mode ? MODE_KINDS[mode] : null
  const offerings = modeKinds ? allOfferings.filter((o) => modeKinds.includes(o.kind)) : allOfferings
  const filters = modeKinds ? ALL_FILTERS.filter((f) => f.key === 'all' || modeKinds.includes(f.key)) : ALL_FILTERS
  const shown = filter === 'all' ? offerings : offerings.filter((o) => o.kind === filter)

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
          {loc.kind === 'local' ? `${loc.area} · ${loc.km} km` : 'Online · Intl'} · {offerings.length} offerings
        </div>
      </div>

      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', margin: '0 0 13px' }}>
        {filters.map((f) => {
          const active = filter === f.key
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ flex: '0 0 auto', fontSize: 11, fontWeight: 600, borderRadius: 999, padding: '6px 13px',
                border: active ? '0.5px solid var(--fc-indigo)' : '0.5px solid rgba(20,20,43,0.18)',
                color: active ? 'var(--fc-indigo)' : '#55555f',
                background: active ? 'var(--fc-indigo-tint)' : '#fff' }}>{f.label}</button>
          )
        })}
      </div>

      {shown.map((o) => <OfferingCard key={o.id} offering={o} trainerName={t.name} />)}

      {/* Custom session request — scoped to this trainer */}
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginTop: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>Need a custom slot?</div>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 1 }}>Request a time outside {t.name}’s programs.</div>
          </div>
          <button onClick={() => setShowRequest(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--fc-indigo)', color: '#fff',
              border: 'none', borderRadius: 10, padding: '8px 11px', fontSize: 12, fontWeight: 600 }}>
            <Icon name="plus" size={14} color="#fff" /> Request
          </button>
        </div>
        {myRequests.map((r) => {
          const st = REQ_STATUS[r.status]
          return (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: '0.5px solid rgba(20,20,43,0.08)', marginTop: 9, paddingTop: 9 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{r.focus}</div>
                <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{r.when} · {r.mode === 'online' ? 'Online' : 'In person'}</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 600, color: st.fg, background: st.bg, padding: '2px 8px', borderRadius: 999 }}>{st.label}</span>
            </div>
          )
        })}
      </div>

      {showRequest && (
        <RequestSessionModal trainerName={t.name} onClose={() => setShowRequest(false)}
          onSubmit={() => { setShowRequest(false); force((n) => n + 1) }} />
      )}
    </div>
  )
}
