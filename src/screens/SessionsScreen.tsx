import { useState } from 'react'
import type { SessionType } from '../lib/types'
import { trainers } from '../data/trainers'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { TrainerCard } from '../components/cards/TrainerCard'
import { Icon } from '../components/Icon'

type SessFilter = 'all' | 'online' | 'outdoor' | 'mobility' | 'strengthening' | 'hiit'
const FILTERS: { key: SessFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'online', label: 'Online' },
  { key: 'outdoor', label: 'Outdoor' },
  { key: 'mobility', label: 'Mobility' },
  { key: 'strengthening', label: 'Strengthening' },
  { key: 'hiit', label: 'HIIT' },
]
const labelOf = (k: SessFilter) => FILTERS.find((f) => f.key === k)!.label

export function SessionsScreen() {
  const [mode, setMode] = useState<SessionType>('1to1')
  const [filter, setFilter] = useState<SessFilter>('all')
  const [open, setOpen] = useState(false)

  const list = trainers
    .filter((t) => t.type.includes(mode))
    .filter((t) => {
      if (filter === 'all') return true
      if (filter === 'online' || filter === 'outdoor') return t.modes.includes(filter)
      return t.disciplines.includes(filter)
    })

  return (
    <div style={{ padding: '12px 14px', background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff',
        border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 11, padding: '9px 11px', marginBottom: 12 }}>
        <Icon name="search" size={16} color="var(--fc-muted)" />
        <span style={{ fontSize: 12, color: '#A0A0A8' }}>Search trainers, programs</span>
      </div>

      <SegmentedToggle options={[{ value: '1to1', label: '1-to-1' }, { value: 'group', label: 'Group' }]}
        value={mode} onChange={setMode} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '12px 0 13px' }}>
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <button aria-label="Filters" onClick={() => setOpen((o) => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: filter === 'all' ? '#fff' : 'var(--fc-indigo-tint)',
              border: filter === 'all' ? '0.5px solid rgba(20,20,43,0.18)' : '0.5px solid var(--fc-indigo)',
              color: filter === 'all' ? '#55555f' : 'var(--fc-indigo)', borderRadius: 999, padding: '7px 13px',
              fontSize: 12, fontWeight: 600 }}>
            <Icon name="filter" size={14} color={filter === 'all' ? '#55555f' : 'var(--fc-indigo)'} />
            {filter === 'all' ? 'Filter' : labelOf(filter)}
            <Icon name="chevron-down" size={13} color={filter === 'all' ? '#55555f' : 'var(--fc-indigo)'} />
          </button>
          {open && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, zIndex: 20, background: '#fff',
              border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 12, padding: 5, minWidth: 170,
              boxShadow: '0 8px 24px rgba(20,20,43,0.14)' }}>
              {FILTERS.map((f) => {
                const active = filter === f.key
                return (
                  <button key={f.key} onClick={() => { setFilter(f.key); setOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                      background: active ? 'var(--fc-indigo-tint)' : 'transparent', border: 'none', borderRadius: 8,
                      padding: '9px 11px', fontSize: 12, fontWeight: active ? 600 : 400,
                      color: active ? 'var(--fc-indigo)' : 'var(--fc-ink)' }}>
                    {f.label}{active && <Icon name="check" size={14} color="var(--fc-indigo)" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        {filter !== 'all' && (
          <button onClick={() => setFilter('all')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none',
              color: 'var(--fc-muted)', fontSize: 11 }}>
            Clear <Icon name="x" size={12} color="var(--fc-muted)" />
          </button>
        )}
      </div>

      {list.length === 0
        ? <div style={{ fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center', padding: 20 }}>No trainers match this filter.</div>
        : list.map((t) => <TrainerCard key={t.id} trainer={t} mode={mode} />)}
    </div>
  )
}
