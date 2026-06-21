import { useState } from 'react'
import { bookings } from '../data/bookings'
import { useNav } from '../nav/NavContext'
import { SESSION_STATUS } from '../lib/sessionStatus'
import { Icon } from '../components/Icon'
import type { BookedSession, Booking, SessionType } from '../lib/types'

const SEG: Record<BookedSession['status'], string> = {
  confirmed: 'var(--fc-indigo-tint)',
  attended: 'var(--fc-green)',
  noshow: '#E24B4A',
  cancelled: 'var(--fc-muted)',
}
// Today's class stands out in blue everywhere it appears.
const segColor = (s: BookedSession) => (s.when === 'today' ? 'var(--fc-blue)' : SEG[s.status])
function tileColor(s: BookedSession) {
  if (s.when === 'today') return 'var(--fc-blue)'
  if (s.status === 'attended') return 'var(--fc-green)'
  if (s.status === 'noshow') return '#E24B4A'
  if (s.status === 'cancelled') return 'rgba(20,20,43,0.25)'
  return 'rgba(90,74,227,0.45)'
}

const BOOKING_STATUS = {
  awaiting: { label: 'Awaiting confirmation', bg: '#FAEEDA', fg: '#854F0B' },
  confirmed: { label: 'Confirmed', bg: '#E4F3EA', fg: 'var(--fc-rating-green)' },
  cancelled: { label: 'Cancelled', bg: '#FCEBEB', fg: '#A32D2D' },
} as const

type KindF = 'all' | SessionType
type ModeF = 'all' | 'online' | 'inperson'

export function BookedScreen() {
  const nav = useNav()
  const [view, setView] = useState<'programs' | 'calendar'>('programs')
  const [kindF, setKindF] = useState<KindF>('all')
  const [modeF, setModeF] = useState<ModeF>('all')
  const openProgram = (id: string) => nav.push({ name: 'programDetail', params: { id } })
  const openSession = (id: string, sessionId: string) => nav.push({ name: 'programDetail', params: { id, sessionId } })

  const filtered = bookings.filter((b) => (kindF === 'all' || b.kind === kindF) && (modeF === 'all' || b.mode === modeF))

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button onClick={onClick}
      style={{ flex: '0 0 auto', border: 'none', borderRadius: 999, padding: '6px 12px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
        background: active ? 'var(--fc-indigo)' : '#fff', color: active ? '#fff' : 'var(--fc-muted)',
        boxShadow: active ? 'none' : 'inset 0 0 0 0.5px rgba(20,20,43,0.16)' }}>{label}</button>
  )
  const viewBtn = (v: 'programs' | 'calendar', icon: string) => (
    <button onClick={() => setView(v)} aria-label={v}
      style={{ border: 'none', borderRadius: 8, padding: 6, display: 'flex',
        background: view === v ? 'var(--fc-indigo-tint)' : 'transparent' }}>
      <Icon name={icon} size={17} color={view === v ? 'var(--fc-indigo)' : 'var(--fc-muted)'} />
    </button>
  )

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)' }}>YOUR PROGRAMS</span>
        <div style={{ display: 'flex', gap: 3, background: '#fff', borderRadius: 10, padding: 2, border: '0.5px solid rgba(20,20,43,0.12)' }}>
          {viewBtn('programs', 'layout-list')}
          {viewBtn('calendar', 'calendar')}
        </div>
      </div>

      {/* filters: 1:1 / Group · Online / Outdoor */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 13, alignItems: 'center' }}>
        {chip('1:1', kindF === '1to1', () => setKindF(kindF === '1to1' ? 'all' : '1to1'))}
        {chip('Group', kindF === 'group', () => setKindF(kindF === 'group' ? 'all' : 'group'))}
        <span style={{ width: 1, height: 18, background: 'rgba(20,20,43,0.12)', flex: '0 0 auto' }} />
        {chip('Online', modeF === 'online', () => setModeF(modeF === 'online' ? 'all' : 'online'))}
        {chip('Outdoor', modeF === 'inperson', () => setModeF(modeF === 'inperson' ? 'all' : 'inperson'))}
      </div>

      {filtered.length === 0 && (
        <div style={{ background: '#fff', border: '0.5px dashed rgba(20,20,43,0.2)', borderRadius: 14, padding: 18,
          textAlign: 'center', color: 'var(--fc-muted)', fontSize: 12 }}>No programs match these filters.</div>
      )}

      {view === 'programs'
        ? filtered.map((b) => <ProgramCard key={b.id} b={b} openProgram={openProgram} openSession={openSession} />)
        : <CalendarView bookings={filtered} openSession={openSession} />}
    </div>
  )
}

function ProgramCard({ b, openProgram, openSession }: { b: Booking; openProgram: (id: string) => void; openSession: (id: string, sid: string) => void }) {
  const awaiting = b.status === 'awaiting'
  const done = b.sessions.filter((s) => s.status === 'attended').length
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 13, marginBottom: 11 }}>
      <div role="button" tabIndex={0} onClick={() => openProgram(b.id)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProgram(b.id) } }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <span className="fc-display" style={{ fontSize: 14, fontWeight: 600 }}>{b.programName}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: BOOKING_STATUS[b.status].fg,
              background: BOOKING_STATUS[b.status].bg, padding: '2px 8px', borderRadius: 999 }}>{BOOKING_STATUS[b.status].label}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 1 }}>
            with {b.trainerName} · {b.kind === 'group' ? 'Group' : '1:1'} · {b.mode === 'online' ? 'Online' : 'Outdoor'}
          </div>
        </div>
        <Icon name="chevron-right" size={18} color="#C4C4CF" />
      </div>

      {awaiting ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 11, fontSize: 11, color: '#854F0B',
          background: '#FAEEDA', borderRadius: 9, padding: '8px 10px' }}>
          <Icon name="clock" size={13} color="#854F0B" />
          Sessions unlock once {b.trainerName} confirms.
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0 6px' }}>
            <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', flex: 1 }}>
              {b.sessions.map((s) => (
                <div key={s.id} title={`Session ${s.index} · ${s.title}`}
                  style={{ flex: 1, height: s.when === 'today' ? 11 : 6, borderRadius: 3, background: segColor(s) }} />
              ))}
            </div>
            <span className="fc-tabnum" style={{ fontSize: 10, color: 'var(--fc-muted)', marginLeft: 9 }}>{done}/{b.sessions.length}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 8 }}>
            {b.sessions.map((s) => {
              const c = tileColor(s)
              return (
                <button key={s.id} onClick={() => openSession(b.id, s.id)}
                  style={{ border: `1.5px solid ${c}`, borderRadius: 9, padding: '6px 3px', background: '#fff', textAlign: 'center', cursor: 'pointer' }}>
                  <div className="fc-display fc-tabnum" style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.15 }}>{s.time}</div>
                  <div style={{ fontSize: 8.5, color: 'var(--fc-muted)' }}>{s.date}</div>
                  <div style={{ fontSize: 8.5, fontWeight: 600, color: c, marginTop: 1 }}>{s.when === 'today' ? 'Now' : SESSION_STATUS[s.status].label}</div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function CalendarView({ bookings: bs, openSession }: { bookings: Booking[]; openSession: (id: string, sid: string) => void }) {
  const all = bs.filter((b) => b.status !== 'awaiting').flatMap((b) => b.sessions.map((s) => ({ s, b })))
  const today = all.filter((x) => x.s.when === 'today')
  const future = all.filter((x) => x.s.when === 'future')
  const past = all.filter((x) => x.s.when === 'past')

  const Row = ({ s, b }: { s: BookedSession; b: Booking }) => {
    const c = tileColor(s)
    return (
      <button onClick={() => openSession(b.id, s.id)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, background: '#fff', borderRadius: 12, padding: '10px 12px',
          marginBottom: 8, cursor: 'pointer', textAlign: 'left',
          border: '0.5px solid rgba(20,20,43,0.12)', borderLeft: `3px solid ${c}` }}>
        <div style={{ flex: '0 0 58px' }}>
          <div className="fc-display fc-tabnum" style={{ fontSize: 12.5, fontWeight: 700 }}>{s.time}</div>
          <div style={{ fontSize: 9, color: 'var(--fc-muted)' }}>{s.date}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{b.programName}</div>
          <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{b.trainerName} · {b.kind === 'group' ? 'Group' : '1:1'}</div>
        </div>
        <span style={{ fontSize: 8.5, fontWeight: 700, color: c }}>{s.when === 'today' ? 'NOW' : SESSION_STATUS[s.status].label}</span>
      </button>
    )
  }
  const Section = ({ title, items, color }: { title: string; items: { s: BookedSession; b: Booking }[]; color: string }) => (
    items.length === 0 ? null : (
      <div style={{ marginBottom: 14 }}>
        <div className="fc-display" style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 8 }}>{title}</div>
        {items.map(({ s, b }) => <Row key={`${b.id}-${s.id}`} s={s} b={b} />)}
      </div>
    )
  )

  if (all.length === 0) {
    return <div style={{ background: '#fff', border: '0.5px dashed rgba(20,20,43,0.2)', borderRadius: 14, padding: 18,
      textAlign: 'center', color: 'var(--fc-muted)', fontSize: 12 }}>No scheduled sessions yet — confirmed programs show here.</div>
  }
  return (
    <>
      <Section title="TODAY" items={today} color="var(--fc-blue)" />
      <Section title="UPCOMING" items={future} color="var(--fc-indigo)" />
      <Section title="COMPLETED" items={past} color="var(--fc-muted)" />
    </>
  )
}
