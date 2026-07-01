import { useState } from 'react'
import { useNav } from '../../nav/NavContext'
import { buildWeek, weekStats, fmtTime, freeSlots } from '../../data/calendar'
import { updateTrainerSession, type TrainerSession } from '../../data/trainerView'
import { WorkingHoursModal } from '../../components/trainer/WorkingHoursModal'
import { SessionFormModal } from '../../components/trainer/SessionFormModal'
import { SessionTags } from '../../components/SessionTags'
import { Icon } from '../../components/Icon'

export function TrainerCalendarScreen() {
  const nav = useNav()
  const [, force] = useState(0)
  const [showHours, setShowHours] = useState(false)
  const [editSession, setEditSession] = useState<TrainerSession | null>(null)
  const week = buildWeek()
  const stats = weekStats(week)
  const [sel, setSel] = useState(0)
  const day = week.find((d) => d.offset === sel) ?? week[0]
  const openCount = freeSlots(sel, 60).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--fc-surface)' }}>
      <div style={{ padding: '12px 13px 10px', background: '#fff', borderBottom: '0.5px solid rgba(20,20,43,0.10)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <span className="fc-display" style={{ fontSize: 14, fontWeight: 700 }}>This week</span>
            <span style={{ fontSize: 11, color: 'var(--fc-muted)', marginLeft: 7 }}>
              <b style={{ color: 'var(--fc-ink)' }}>{stats.total}</b> sessions
              {stats.conflicts > 0 && <> · <b style={{ color: '#A32D2D' }}>{stats.conflicts} clash{stats.conflicts > 1 ? 'es' : ''}</b></>}
            </span>
          </div>
          <button onClick={() => setShowHours(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', borderRadius: 8, padding: '5px 9px',
              fontSize: 11, fontWeight: 600, background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)' }}>
            <Icon name="clock" size={13} color="var(--fc-indigo)" /> Hours
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {week.map((d) => {
            const active = d.offset === sel
            const hasConflict = d.conflictIds.size > 0
            return (
              <button key={d.offset} onClick={() => setSel(d.offset)}
                style={{ flex: '0 0 auto', width: 42, borderRadius: 12, border: 'none', padding: '7px 0', cursor: 'pointer',
                  background: active ? 'var(--fc-indigo)' : 'var(--fc-surface)', color: active ? '#fff' : 'var(--fc-ink)' }}>
                <div style={{ fontSize: 10, fontWeight: 600, opacity: active ? 0.85 : 0.6 }}>{d.isToday ? 'Now' : d.weekday}</div>
                <div className="fc-display fc-tabnum" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{d.dayNum}</div>
                <div style={{ height: 5, marginTop: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  {d.sessions.length > 0 && (
                    <span style={{ width: 5, height: 5, borderRadius: '50%',
                      background: hasConflict ? '#E24B4A' : active ? '#fff' : 'var(--fc-indigo)' }} />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
          <span className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)' }}>
            {day.isToday ? 'TODAY' : day.weekday.toUpperCase()} · {day.sessions.length} session{day.sessions.length === 1 ? '' : 's'}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: openCount > 0 ? 'var(--fc-rating-green)' : 'var(--fc-muted)' }}>
            {openCount > 0 ? `${openCount} open slots (30 min each)` : 'fully booked'}
          </span>
        </div>

        {day.sessions.length === 0 ? (
          <div style={{ background: '#fff', border: '0.5px dashed rgba(20,20,43,0.2)', borderRadius: 14, padding: 20,
            textAlign: 'center', color: 'var(--fc-muted)', fontSize: 12 }}>
            No sessions — a rest day. 🌿
          </div>
        ) : day.sessions.map((s) => {
          const conflict = day.conflictIds.has(s.id)
          return (
            <div key={s.id} role="button" tabIndex={0}
              onClick={() => nav.push({ name: 'trRoster', params: { id: s.id } })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav.push({ name: 'trRoster', params: { id: s.id } }) } }}
              style={{ display: 'flex', gap: 11, background: '#fff', borderRadius: 14, padding: 12, marginBottom: 9, cursor: 'pointer',
                border: conflict ? '1px solid #F0A8A2' : '0.5px solid rgba(20,20,43,0.12)',
                borderLeft: conflict ? '3px solid #E24B4A' : '3px solid var(--fc-indigo)' }}>
              <div style={{ flex: '0 0 58px' }}>
                <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700 }}>{fmtTime(s.start ?? 0)}</div>
                <div style={{ fontSize: 9, color: 'var(--fc-muted)' }}>{s.durationMin ?? 60} min</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{s.title}</span>
                  {conflict && (
                    <span style={{ fontSize: 9, fontWeight: 600, color: '#A32D2D', background: '#FCEBEB', padding: '2px 7px', borderRadius: 999 }}>Conflict</span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: 'var(--fc-indigo)', fontWeight: 600, marginTop: 1 }}>{s.program}</div>
                <div style={{ marginTop: 4 }}><SessionTags capacity={s.capacity} mode={s.mode} /></div>
                <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name={s.mode === 'online' ? 'video' : 'map-pin'} size={12} color="var(--fc-muted)" />
                  {s.place} · {s.clients.length}/{s.capacity} booked
                </div>
              </div>
              {conflict && (
                <button onClick={(e) => { e.stopPropagation(); setEditSession(s) }}
                  style={{ alignSelf: 'center', flex: '0 0 auto', border: 'none', borderRadius: 8, padding: '6px 10px',
                    fontSize: 10, fontWeight: 600, background: '#FCEBEB', color: '#A32D2D', whiteSpace: 'nowrap' }}>Reschedule</button>
              )}
            </div>
          )
        })}

        {day.conflictIds.size > 0 && (
          <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', background: '#FCEBEB', borderRadius: 10,
            padding: '9px 11px', marginTop: 4 }}>
            <Icon name="alert-triangle" size={14} color="#A32D2D" />
            <div style={{ fontSize: 11, color: '#A32D2D' }}>
              Overlapping sessions on this day — reschedule one to clear the clash.
            </div>
          </div>
        )}
      </div>

      {showHours && <WorkingHoursModal onClose={() => { setShowHours(false); force((n) => n + 1) }} />}
      {editSession && (
        <SessionFormModal session={editSession}
          onClose={() => setEditSession(null)}
          onSave={(list) => { updateTrainerSession(list[0].id, list[0]); setEditSession(null); force((n) => n + 1) }} />
      )}
    </div>
  )
}
