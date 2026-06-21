import { useState } from 'react'
import type { Discipline } from '../lib/types'
import { useNav } from '../nav/NavContext'
import { weekMeta } from '../data/calendar'
import { FOCUS_CATEGORIES } from '../data/disciplines'
import { groupClasses, type GroupClass, type GroupSlot } from '../data/groupClasses'
import { addSingleBooking } from '../data/bookings'
import { CapacityBar } from './CapacityBar'
import { Icon } from './Icon'

const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const monthOf = (offset: number) => { const d = new Date(); d.setDate(d.getDate() + offset); return MON[d.getMonth()] }

const CATEGORIES = FOCUS_CATEGORIES
const MODES: { key: 'online' | 'outdoor'; label: string; icon: string; accent: string }[] = [
  { key: 'online', label: 'Online', icon: 'world', accent: 'var(--fc-green)' },
  { key: 'outdoor', label: 'Outdoor', icon: 'tree', accent: '#E24B4A' },
]
type ModeFilter = 'all' | 'online' | 'outdoor'
type Sort = 'earliest' | 'latest'
const SORTS: { key: Sort; label: string }[] = [
  { key: 'earliest', label: 'Earliest first' },
  { key: 'latest', label: 'Latest first' },
]

const toMin = (t: string) => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 0
  let h = +m[1] % 12
  if (/pm/i.test(m[3])) h += 12
  return h * 60 + +m[2]
}

export function GroupShowtimes() {
  const nav = useNav()
  const days = weekMeta()
  const [sel, setSel] = useState(0)
  const [disc, setDisc] = useState<Discipline | null>(null)
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all')
  const [sort, setSort] = useState<Sort>('earliest')
  const [sortOpen, setSortOpen] = useState(false)

  const meta = days.find((d) => d.offset === sel)!
  const dateLabel = meta.isToday ? 'Today' : `${meta.weekday} ${meta.dayNum}`

  let list = groupClasses.filter((c) => (!disc || c.discipline === disc)
    && (modeFilter === 'all' || (modeFilter === 'online' ? c.mode === 'online' : c.mode === 'inperson')))
  list = [...list].sort((a, b) => {
    const av = toMin(a.slots[0].time), bv = toMin(b.slots[0].time)
    return sort === 'earliest' ? av - bv : bv - av
  })

  const book = (cls: GroupClass, slot: GroupSlot) => {
    addSingleBooking(cls.title, cls.trainerName, { dayOffset: sel, dateLabel, timeLabel: slot.time }, 'group', cls.mode, cls.discipline)
    nav.push({ name: 'bookingConfirm' })
  }
  const sortLabel = SORTS.find((s) => s.key === sort)!.label

  return (
    <div>
      {/* Browse by focus */}
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fc-muted)', margin: '14px 0 8px' }}>Browse by focus</div>
      <div className="fc-noscrollbar" style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 2, marginBottom: 8 }}>
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

      {/* Sort + Online/Outdoor */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 9, margin: '6px 0 11px' }}>
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <button aria-label="Sort by" onClick={() => setSortOpen((o) => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--fc-indigo-tint)', border: '0.5px solid var(--fc-indigo)',
              color: 'var(--fc-indigo)', borderRadius: 999, padding: '7px 13px', fontSize: 12, fontWeight: 600 }}>
            <Icon name="arrows-sort" size={14} color="var(--fc-indigo)" />{sortLabel}
            <Icon name="chevron-down" size={13} color="var(--fc-indigo)" />
          </button>
          {sortOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, zIndex: 20, background: '#fff',
              border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 12, padding: 5, minWidth: 160, boxShadow: '0 8px 24px rgba(20,20,43,0.14)' }}>
              {SORTS.map((s) => {
                const on = sort === s.key
                return (
                  <button key={s.key} onClick={() => { setSort(s.key); setSortOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                      background: on ? 'var(--fc-indigo-tint)' : 'transparent', border: 'none', borderRadius: 8, padding: '9px 11px',
                      fontSize: 12, fontWeight: on ? 600 : 400, color: on ? 'var(--fc-indigo)' : 'var(--fc-ink)' }}>
                    {s.label}{on && <Icon name="check" size={14} color="var(--fc-indigo)" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ display: 'inline-flex', background: 'var(--fc-surface)', borderRadius: 999, padding: 3, flex: '0 0 auto' }}>
          {MODES.map((m) => {
            const on = modeFilter === m.key
            return (
              <button key={m.key} onClick={() => setModeFilter(on ? 'all' : m.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', borderRadius: 999, padding: '6px 11px',
                  fontSize: 11, fontWeight: 600, background: on ? '#fff' : 'transparent', color: on ? m.accent : 'var(--fc-muted)',
                  boxShadow: on ? '0 1px 2px rgba(20,20,43,0.14)' : 'none' }}>
                <Icon name={m.icon} size={13} color={on ? m.accent : 'var(--fc-muted)'} /> {m.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* date strip */}
      <div className="fc-noscrollbar" style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 13 }}>
        {days.map((d) => {
          const on = d.offset === sel
          return (
            <button key={d.offset} onClick={() => setSel(d.offset)}
              style={{ flex: '0 0 auto', width: 50, borderRadius: 12, border: 'none', padding: '7px 0', cursor: 'pointer',
                background: on ? 'var(--fc-coral)' : '#fff', color: on ? '#fff' : 'var(--fc-ink)',
                boxShadow: on ? 'none' : 'inset 0 0 0 0.5px rgba(20,20,43,0.14)' }}>
              <div style={{ fontSize: 9, fontWeight: 600, opacity: 0.8 }}>{d.isToday ? 'TODAY' : d.weekday.toUpperCase()}</div>
              <div className="fc-display fc-tabnum" style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.15 }}>{d.dayNum}</div>
              <div style={{ fontSize: 8.5, opacity: 0.7 }}>{monthOf(d.offset)}</div>
            </button>
          )
        })}
      </div>

      {list.length === 0 && (
        <div style={{ background: '#fff', border: '0.5px dashed rgba(20,20,43,0.2)', borderRadius: 14, padding: 18,
          textAlign: 'center', color: 'var(--fc-muted)', fontSize: 12 }}>No group classes match these filters.</div>
      )}

      {list.map((cls) => (
        <div key={cls.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <Icon name={cls.mode === 'online' ? 'video' : 'map-pin'} size={17} color="var(--fc-indigo)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>{cls.title}</div>
              <div style={{ fontSize: 10.5, color: 'var(--fc-muted)' }}>{cls.trainerName} · {cls.place}</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--fc-indigo)', background: 'var(--fc-indigo-tint)', padding: '2px 7px', borderRadius: 999 }}>Group</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {cls.slots.map((slot) => (
              <button key={slot.time} onClick={() => book(cls, slot)}
                style={{ border: '1.5px solid var(--fc-green)', borderRadius: 8, padding: '7px 11px', background: '#fff',
                  textAlign: 'center', cursor: 'pointer', minWidth: 84 }}>
                <div className="fc-display" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--fc-rating-green)' }}>{slot.time}</div>
                <div style={{ fontSize: 8.5, color: 'var(--fc-muted)', marginTop: 1 }}>{slot.format}</div>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <div style={{ flex: 1 }}><CapacityBar taken={cls.spotsTaken} max={cls.spotsMax} /></div>
            <span className="fc-display" style={{ fontSize: 12, fontWeight: 700 }}>{cls.price}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
