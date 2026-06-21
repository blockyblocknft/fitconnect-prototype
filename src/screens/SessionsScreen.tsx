import { useState } from 'react'
import type { SessionType, Trainer, Discipline } from '../lib/types'
import { trainers } from '../data/trainers'
import { FOCUS_CATEGORIES } from '../data/disciplines'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { GroupShowtimes } from '../components/GroupShowtimes'
import { TrainerCard } from '../components/cards/TrainerCard'
import { Icon } from '../components/Icon'

type Sort = 'relevance' | 'rating' | 'priceLow' | 'priceHigh' | 'nearest'
const SORTS: { key: Sort; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'rating', label: 'Top rated' },
  { key: 'priceLow', label: 'Price: low to high' },
  { key: 'priceHigh', label: 'Price: high to low' },
  { key: 'nearest', label: 'Nearest' },
]

// "What's on your mind" style category strip — large icon tiles.
const CATEGORIES = FOCUS_CATEGORIES

const MODES: { key: 'online' | 'outdoor'; label: string; icon: string; accent: string }[] = [
  { key: 'online', label: 'Online', icon: 'world', accent: 'var(--fc-green)' },
  { key: 'outdoor', label: 'Outdoor', icon: 'tree', accent: '#E24B4A' },
]
type ModeFilter = 'all' | 'online' | 'outdoor'

const priceNum = (t: Trainer) => Number(t.fromPriceLabel.replace(/[^\d]/g, '')) || 0
const distNum = (t: Trainer) => (t.location.kind === 'local' ? t.location.km : Infinity)

export function SessionsScreen() {
  const [kind, setKind] = useState<SessionType>('1to1')
  const [sort, setSort] = useState<Sort>('relevance')
  const [sortOpen, setSortOpen] = useState(false)
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all')
  const [disc, setDisc] = useState<Discipline | null>(null)
  const [topRated, setTopRated] = useState(false)
  const [nearMe, setNearMe] = useState(false)

  // Distance options apply to outdoor + all (located trainers); only online has no distance.
  const nearAvailable = modeFilter !== 'online'
  const chooseMode = (next: ModeFilter) => {
    setModeFilter(next)
    if (next === 'online') {
      setNearMe(false)
      setSort((s) => (s === 'nearest' ? 'relevance' : s))
    }
  }
  const sorts = nearAvailable ? SORTS : SORTS.filter((s) => s.key !== 'nearest')

  let list = trainers.filter((t) => t.type.includes(kind))
  if (modeFilter !== 'all') list = list.filter((t) => t.modes.includes(modeFilter))
  if (disc) list = list.filter((t) => t.disciplines.includes(disc))
  if (topRated) list = list.filter((t) => t.rating >= 4.8)
  if (nearMe) list = list.filter((t) => distNum(t) <= 3)

  const sorted = [...list].sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating
    if (sort === 'priceLow') return priceNum(a) - priceNum(b)
    if (sort === 'priceHigh') return priceNum(b) - priceNum(a)
    if (sort === 'nearest') return distNum(a) - distNum(b)
    return 0
  })

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button key={label} onClick={onClick}
      style={{ flex: '0 0 auto', border: 'none', borderRadius: 999, padding: '7px 13px', fontSize: 12, fontWeight: 600,
        whiteSpace: 'nowrap', background: active ? 'var(--fc-indigo)' : '#fff', color: active ? '#fff' : 'var(--fc-muted)',
        boxShadow: active ? 'none' : 'inset 0 0 0 0.5px rgba(20,20,43,0.16)' }}>{label}</button>
  )
  const sortLabel = SORTS.find((s) => s.key === sort)!.label

  return (
    <div style={{ padding: '12px 14px', background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff',
        border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 11, padding: '9px 11px', marginBottom: 12 }}>
        <Icon name="search" size={16} color="var(--fc-muted)" />
        <span style={{ fontSize: 12, color: '#A0A0A8' }}>Search trainers, programs</span>
      </div>

      <SegmentedToggle options={[{ value: '1to1', label: '1-to-1' }, { value: 'group', label: 'Group' }]}
        value={kind} onChange={setKind} />

      {kind === 'group' ? (
        <div style={{ marginTop: 14 }}><GroupShowtimes /></div>
      ) : (
        <>
      {/* Workout-type categories — large icon tiles */}
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fc-muted)', margin: '14px 0 8px' }}>Browse by focus</div>
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 2, marginBottom: 6 }}>
        {CATEGORIES.map((c) => {
          const active = c.key === 'all' ? disc === null : disc === c.key
          const accent = active ? 'var(--fc-coral)' : 'var(--fc-indigo)'
          return (
            <button key={c.key} onClick={() => setDisc(c.key === 'all' ? null : (disc === c.key ? null : c.key))}
              style={{ flex: '0 0 auto', background: 'transparent', border: 'none', textAlign: 'center', cursor: 'pointer', width: 58 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', margin: '0 auto',
                background: active ? 'var(--fc-coral-tint)' : '#fff',
                border: active ? '2px solid var(--fc-coral)' : '0.5px solid rgba(20,20,43,0.14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={c.icon} size={26} color={accent} />
              </div>
              <div style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? 'var(--fc-coral)' : 'var(--fc-ink)', marginTop: 5 }}>{c.label}</div>
            </button>
          )
        })}
      </div>

      {/* Sort + online/outdoor toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 9, margin: '8px 0 10px' }}>
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <button aria-label="Sort by" onClick={() => setSortOpen((o) => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: sort === 'relevance' ? '#fff' : 'var(--fc-indigo-tint)',
              border: sort === 'relevance' ? '0.5px solid rgba(20,20,43,0.18)' : '0.5px solid var(--fc-indigo)',
              color: sort === 'relevance' ? '#55555f' : 'var(--fc-indigo)', borderRadius: 999, padding: '7px 13px',
              fontSize: 12, fontWeight: 600 }}>
            <Icon name="arrows-sort" size={14} color={sort === 'relevance' ? '#55555f' : 'var(--fc-indigo)'} />
            {sort === 'relevance' ? 'Sort by' : sortLabel}
            <Icon name="chevron-down" size={13} color={sort === 'relevance' ? '#55555f' : 'var(--fc-indigo)'} />
          </button>
          {sortOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, zIndex: 20, background: '#fff',
              border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 12, padding: 5, minWidth: 190,
              boxShadow: '0 8px 24px rgba(20,20,43,0.14)' }}>
              {sorts.map((s) => {
                const active = sort === s.key
                return (
                  <button key={s.key} onClick={() => { setSort(s.key); setSortOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                      background: active ? 'var(--fc-indigo-tint)' : 'transparent', border: 'none', borderRadius: 8,
                      padding: '9px 11px', fontSize: 12, fontWeight: active ? 600 : 400,
                      color: active ? 'var(--fc-indigo)' : 'var(--fc-ink)' }}>
                    {s.label}{active && <Icon name="check" size={14} color="var(--fc-indigo)" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Online / Outdoor — named segmented toggle, both labels always shown */}
        <div style={{ display: 'inline-flex', background: 'var(--fc-surface)', borderRadius: 999, padding: 3, flex: '0 0 auto' }}>
          {MODES.map((m) => {
            const on = modeFilter === m.key
            return (
              <button key={m.key} onClick={() => chooseMode(on ? 'all' : m.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', borderRadius: 999, padding: '6px 11px',
                  fontSize: 11, fontWeight: 600, background: on ? '#fff' : 'transparent', color: on ? m.accent : 'var(--fc-muted)',
                  boxShadow: on ? '0 1px 2px rgba(20,20,43,0.14)' : 'none' }}>
                <Icon name={m.icon} size={13} color={on ? m.accent : 'var(--fc-muted)'} /> {m.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Quick filter chips */}
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 13, paddingBottom: 1 }}>
        {chip('Top rated', topRated, () => setTopRated((v) => !v))}
        {nearAvailable && chip('Near me', nearMe, () => setNearMe((v) => !v))}
      </div>

      {sorted.length === 0
        ? <div style={{ fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center', padding: 20 }}>No trainers match these filters.</div>
        : sorted.map((t) => <TrainerCard key={t.id} trainer={t} mode={kind} />)}
        </>
      )}
    </div>
  )
}
