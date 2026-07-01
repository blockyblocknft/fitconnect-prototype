import { useState } from 'react'
import type { SessionType, Discipline, TrainingMode } from '../lib/types'
import { trainers } from '../data/trainers'
import { discOfCategory, addSingleBooking } from '../data/bookings'
import { FOCUS_CATEGORIES } from '../data/disciplines'
import { groupClasses, type GroupClass, type GroupSlot } from '../data/groupClasses'
import { useNav } from '../nav/NavContext'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { OfferingCard, type Offering } from '../components/cards/OfferingCard'
import { GroupBookModal } from '../components/GroupBookModal'
import { RequestSessionModal } from '../components/RequestSessionModal'
import { clientRequests, type RequestStatus } from '../data/sessionRequests'
import { clients, clientDue, attendancePct, recordPayment } from '../data/clients'
import { lastMessage } from '../data/messages'
import { CapacityBar } from '../components/CapacityBar'
import { initials } from '../data/profile'
import { Icon } from '../components/Icon'
import { RatingPill } from '../components/RatingPill'

const CATEGORIES = FOCUS_CATEGORIES
const REQ_STATUS: Record<RequestStatus, { label: string; bg: string; fg: string }> = {
  awaiting: { label: 'Awaiting', bg: '#FAEEDA', fg: '#854F0B' },
  confirmed: { label: 'Confirmed', bg: '#E4F3EA', fg: 'var(--fc-rating-green)' },
  declined: { label: 'Declined', bg: '#FCEBEB', fg: '#A32D2D' },
}
const MODES: { key: TrainingMode; label: string; icon: string; accent: string }[] = [
  { key: 'online', label: 'Online', icon: 'world', accent: 'var(--fc-green)' },
  { key: 'outdoor', label: 'Outdoor', icon: 'tree', accent: '#E24B4A' },
]

// One coach, many clients. The two real axes a client picks are 1:1 vs Group
// and Online vs Outdoor; the focus icons narrow by discipline. The page opens
// straight onto the coach profile + their matching offerings — no roster, no
// search. (Trial / Daily / Weekly are just badges on the 1:1 cards.)
export function SessionsScreen() {
  const nav = useNav()
  const [kind, setKind] = useState<SessionType>('1to1')
  const [mode, setMode] = useState<TrainingMode | 'all'>('all')
  const [disc, setDisc] = useState<Discipline | null>(null)
  const [pending, setPending] = useState<{ cls: GroupClass; slot: GroupSlot } | null>(null)
  const [customReq, setCustomReq] = useState(false)
  const [reqSent, setReqSent] = useState(false)
  const [, force] = useState(0)
  const coach = trainers[0]
  const myRequests = clientRequests()
  const me = clients.find((c) => c.live) ?? clients[0]
  const myDue = clientDue(me)
  const nextUp = me.attendance.find((a) => a.status === 'upcoming')
  const coachUnread = lastMessage(me.id)?.from === 'coach'

  const focusOk = (d: Discipline | null) => !disc || d === disc

  // 1:1 — trial + programs, filtered by delivery mode + focus.
  const trial: Offering = { id: 'trial', kind: 'trial', name: '1-day trial', sub: 'Full session, any focus', price: coach.trial.priceLabel }
  const programOfferings: Offering[] = coach.programs
    .filter((p) => (mode === 'all' || p.modes.includes(mode)) && focusOk(discOfCategory(p.category)))
    .map((p) => ({ id: p.id, kind: p.cadence === 'daily' ? 'daily' : 'weekly',
      name: p.name, sub: p.scheduleLabel, price: p.priceLabel, programId: p.id, bestseller: p.bestseller }))
  const oneToOne: Offering[] = [...(disc ? [] : [trial]), ...programOfferings]

  // Group — classes, filtered by online/outdoor mode + focus.
  const groups = groupClasses.filter((c) =>
    (mode === 'all' || (mode === 'online' ? c.mode === 'online' : c.mode === 'inperson')) && focusOk(c.discipline))

  const list = kind === '1to1' ? oneToOne : groups
  const empty = list.length === 0

  return (
    <div style={{ padding: '12px 14px', background: 'var(--fc-surface)', flex: 1 }}>
      {/* Coach profile — first thing: a self-intro, not a rating card */}
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 13, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, flex: '0 0 auto', background: 'var(--fc-indigo-tint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="user" size={27} color="var(--fc-indigo)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>{coach.name}</span>
              <Icon name="rosette-discount-check" size={14} color="var(--fc-indigo)" />
            </div>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 1 }}>{coach.specialty} · {coach.years} yrs</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <RatingPill rating={coach.rating} />
              <span style={{ fontSize: 10.5, color: 'var(--fc-muted)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Icon name="map-pin" size={11} color="var(--fc-muted)" />
                {coach.location.kind === 'local' ? coach.location.area : 'Online'} · online & outdoor
              </span>
            </div>
          </div>
        </div>
        {coach.bio && <p style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--fc-ink)', margin: '11px 0 0' }}>{coach.bio}</p>}
        <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
          <button onClick={() => { setReqSent(false); setCustomReq(true) }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)', border: 'none', borderRadius: 11,
              padding: '10px 12px', fontSize: 12.5, fontWeight: 600 }}>
            <Icon name="calendar-plus" size={15} color="var(--fc-indigo)" /> Custom session
          </button>
          <button onClick={() => nav.push({ name: 'coachChat' })}
            style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'var(--fc-indigo)', color: '#fff', border: 'none', borderRadius: 11,
              padding: '10px 12px', fontSize: 12.5, fontWeight: 600 }}>
            <Icon name="message-circle" size={15} color="#fff" /> Message coach
            {coachUnread && <span style={{ position: 'absolute', top: 6, right: 8, width: 9, height: 9, borderRadius: '50%', background: 'var(--fc-coral)', border: '1.5px solid var(--fc-indigo)' }} />}
          </button>
        </div>
        {reqSent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--fc-rating-green)',
            fontWeight: 600, marginTop: 8 }}>
            <Icon name="circle-check" size={14} color="var(--fc-rating-green)" /> Request sent — {coach.name} will confirm in Booked › Requests.
          </div>
        )}
      </div>

      {/* Your plan — payment, attendance & next session, synced with the coach */}
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
          <span className="fc-display" style={{ fontSize: 12.5, fontWeight: 700 }}>{me.plan}</span>
          <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, borderRadius: 999, padding: '2px 9px',
            color: myDue > 0 ? '#A32D2D' : 'var(--fc-rating-green)', background: myDue > 0 ? '#FCEBEB' : '#E4F3EA' }}>
            {myDue > 0 ? `₹${myDue.toLocaleString('en-IN')} balance` : 'Paid up'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['Paid', `₹${me.paid.toLocaleString('en-IN')}`], ['Balance', `₹${myDue.toLocaleString('en-IN')}`], ['Attendance', `${attendancePct(me)}%`]].map(([l, v]) => (
            <div key={l} style={{ flex: 1, background: 'var(--fc-surface)', borderRadius: 10, padding: '8px 6px', textAlign: 'center' }}>
              <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700, color: 'var(--fc-indigo)' }}>{v}</div>
              <div style={{ fontSize: 9.5, color: 'var(--fc-muted)' }}>{l}</div>
            </div>
          ))}
        </div>
        {nextUp && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--fc-muted)', marginTop: 9 }}>
            <Icon name="calendar" size={13} color="var(--fc-indigo)" />
            Next: <b style={{ color: 'var(--fc-ink)', fontWeight: 600 }}>{nextUp.session}</b> · {nextUp.date}
          </div>
        )}
        {myDue > 0 && (
          <button onClick={() => { recordPayment(me.id, myDue); force((n) => n + 1) }}
            style={{ width: '100%', marginTop: 10, background: 'var(--fc-green)', color: '#fff', border: 'none', borderRadius: 10, padding: 10, fontSize: 12.5, fontWeight: 600 }}>
            Pay balance · ₹{myDue.toLocaleString('en-IN')}
          </button>
        )}
      </div>

      {/* Your custom requests — status updates as the coach confirms / declines */}
      {myRequests.length > 0 && (
        <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 12 }}>
          <div className="fc-display" style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Your requests to {coach.name}</div>
          {myRequests.map((r) => {
            const s = REQ_STATUS[r.status]
            return (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8,
                borderTop: r.id === myRequests[0].id ? 'none' : '0.5px solid rgba(20,20,43,0.07)', marginTop: r.id === myRequests[0].id ? 0 : 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{r.focus}</div>
                  <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{r.when} · {r.mode === 'online' ? 'Online' : 'In person'}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: s.fg, background: s.bg, padding: '2px 9px', borderRadius: 999 }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Primary axes: 1:1 vs Group, and Online vs Outdoor */}
      <SegmentedToggle options={[{ value: '1to1', label: '1-to-1' }, { value: 'group', label: 'Group' }]}
        value={kind} onChange={setKind} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '11px 0 4px' }}>
        {MODES.map((m) => {
          const on = mode === m.key
          return (
            <button key={m.key} onClick={() => setMode(on ? 'all' : m.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '7px 16px', fontSize: 12, fontWeight: 600,
                border: on ? `1.5px solid ${m.accent}` : '0.5px solid rgba(20,20,43,0.16)',
                background: on ? '#fff' : '#fff', color: on ? m.accent : 'var(--fc-muted)',
                boxShadow: on ? '0 1px 2px rgba(20,20,43,0.12)' : 'none' }}>
              <Icon name={m.icon} size={14} color={on ? m.accent : 'var(--fc-muted)'} /> {m.label}
            </button>
          )
        })}
      </div>

      {/* Browse by focus — large icon tiles */}
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fc-muted)', margin: '14px 0 8px' }}>Browse by focus</div>
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 2, marginBottom: 13 }}>
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

      {empty && (
        <div style={{ fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center', padding: 20 }}>Nothing matches these filters yet.</div>
      )}

      {kind === '1to1' && oneToOne.map((o) => <OfferingCard key={o.id} offering={o} trainerName={coach.name} />)}

      {kind === 'group' && groups.map((cls) => (
        <div key={cls.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--fc-coral)', color: '#fff', flex: '0 0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>{initials(cls.trainerName)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>{cls.title}</div>
              <div style={{ fontSize: 10.5, color: 'var(--fc-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name={cls.mode === 'online' ? 'video' : 'map-pin'} size={12} color="var(--fc-muted)" />{cls.place}
              </div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--fc-indigo)', background: 'var(--fc-indigo-tint)', padding: '2px 7px', borderRadius: 999 }}>Group</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {cls.slots.map((slot) => (
              <button key={slot.time} onClick={() => setPending({ cls, slot })}
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

      {pending && (
        <GroupBookModal cls={pending.cls} slot={pending.slot} dateLabel="Next class"
          onClose={() => setPending(null)}
          onConfirm={() => {
            addSingleBooking(pending.cls.title, pending.cls.trainerName,
              { dayOffset: 0, dateLabel: 'Next class', timeLabel: pending.slot.time }, 'group', pending.cls.mode, pending.cls.discipline)
            setPending(null)
            nav.push({ name: 'bookingConfirm' })
          }} />
      )}

      {customReq && (
        <RequestSessionModal trainerName={coach.name}
          onClose={() => setCustomReq(false)}
          onSubmit={() => { setCustomReq(false); setReqSent(true) }} />
      )}
    </div>
  )
}
