import { useState } from 'react'
import { todayStats, trainerSessions } from '../../data/trainerView'
import { customRequests, resolveCustomRequest } from '../../data/sessionRequests'
import { clients, clientDue, rosterStats, getClient } from '../../data/clients'
import { waitingReplies, lastMessage } from '../../data/messages'
import { useNav } from '../../nav/NavContext'
import { Icon } from '../../components/Icon'

const rupees = (n: number) => '₹' + n.toLocaleString('en-IN')

// Trainer home — the "who needs me today" command centre. Pulls today's
// schedule, requests to confirm, dues to collect and clients who've stopped
// logging into one prioritised list, each routing to the client/roster.
export function TrainerTodayScreen() {
  const nav = useNav()
  const [pending, setPending] = useState(() => customRequests.filter((r) => r.status === 'awaiting'))
  const [resolved, setResolved] = useState(0)
  const [nudged, setNudged] = useState<Record<string, boolean>>({})

  const stats = todayStats()
  const rs = rosterStats()
  const today = trainerSessions.filter((s) => s.today)
  const dues = clients.filter((c) => clientDue(c) > 0)
  const notLogging = clients.filter((c) => c.nutrition === 'nolog')
  const replies = waitingReplies().map(getClient).filter((c): c is NonNullable<typeof c> => !!c)
  const needCount = pending.length + replies.length + dues.length + notLogging.length

  const resolve = (id: string, verb: 'confirmed' | 'declined') => {
    resolveCustomRequest(id, verb)
    setPending((p) => p.filter((r) => r.id !== id))
    setResolved((n) => n + 1)
  }
  const openByName = (name: string) => {
    const c = clients.find((x) => x.name === name)
    if (c) nav.push({ name: 'trClientProfile', params: { id: c.id } })
  }

  const stat = (value: string, label: string, accent?: string, onClick?: () => void) => (
    <div onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}
      style={{ flex: 1, background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '10px 6px', textAlign: 'center', cursor: onClick ? 'pointer' : 'default' }}>
      <div className="fc-display fc-tabnum" style={{ fontSize: 17, fontWeight: 700, color: accent ?? 'var(--fc-indigo)' }}>{value}</div>
      <div style={{ fontSize: 9.5, color: 'var(--fc-muted)' }}>{label}</div>
    </div>
  )
  const sectionTitle = (text: string, right?: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0 9px' }}>
      <span className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>{text}</span>
      {right && <span style={{ marginLeft: 'auto' }}>{right}</span>}
    </div>
  )
  const actionRow = (initials: string, title: string, sub: string, action: React.ReactNode, onClick?: () => void, tint = 'var(--fc-indigo-tint)', fg = 'var(--fc-indigo)') => (
    <div onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', cursor: onClick ? 'pointer' : 'default',
        border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 13, padding: 10, marginBottom: 8 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: tint, color: fg, flex: '0 0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 10, color: 'var(--fc-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
      {action}
    </div>
  )

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      <div className="fc-display" style={{ fontSize: 18, fontWeight: 700 }}>Hi Aanand 👋</div>
      <div style={{ fontSize: 11.5, color: 'var(--fc-muted)', margin: '2px 0 12px' }}>
        {stats.sessions} sessions today · {stats.booked} clients booked
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
        {stat(`${stats.sessions}`, 'sessions today')}
        {stat(`${pending.length}`, 'requests', pending.length ? 'var(--fc-coral)' : undefined)}
        {stat(rupees(rs.dues), 'dues open', rs.dues ? '#A32D2D' : undefined, () => nav.push({ name: 'trPayments' }))}
      </div>

      {/* Today's schedule */}
      {sectionTitle('Today’s schedule', <button onClick={() => nav.setTab('trCalendar')} style={{ background: 'transparent', border: 'none', color: 'var(--fc-indigo)', fontSize: 11, fontWeight: 600 }}>Calendar ›</button>)}
      {today.length === 0
        ? <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 14 }}>No sessions today.</div>
        : today.map((s) => {
          const attended = s.clients.filter((c) => c.attendance === 'attended').length
          const marked = s.clients.length > 0 && s.clients.every((c) => c.attendance !== 'confirmed')
          return (
            <div key={s.id} role="button" tabIndex={0} onClick={() => nav.push({ name: 'trRoster', params: { id: s.id } })}
              style={{ display: 'flex', alignItems: 'center', gap: 11, background: '#fff', cursor: 'pointer',
                border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 11, marginBottom: 8 }}>
              <div className="fc-display" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--fc-indigo)', flex: '0 0 auto', minWidth: 54, textAlign: 'center' }}>
                {s.time.replace('Today · ', '')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="fc-display" style={{ fontSize: 12.5, fontWeight: 700 }}>{s.title}</div>
                <div style={{ fontSize: 10.5, color: 'var(--fc-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name={s.mode === 'online' ? 'video' : 'map-pin'} size={11} color="var(--fc-muted)" />{s.place} · {s.clients.length} in
                </div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, borderRadius: 999, padding: '3px 9px',
                color: marked ? 'var(--fc-rating-green)' : 'var(--fc-indigo)', background: marked ? '#E4F3EA' : 'var(--fc-indigo-tint)' }}>
                {marked ? `${attended}/${s.clients.length} in` : 'Take attendance'}
              </span>
            </div>
          )
        })}

      {/* Needs you today */}
      <div style={{ height: 6 }} />
      {sectionTitle(`Needs you · ${needCount}`)}

      {needCount === 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: 'var(--fc-muted)', padding: '4px 0' }}>
          <Icon name="circle-check" size={15} color="var(--fc-green)" /> All caught up — nothing needs you right now.
        </div>
      )}

      {pending.map((r) => actionRow(r.initials, `${r.client} · ${r.focus}`, `${r.when} · ${r.mode === 'online' ? 'Online' : 'In person'}`,
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={(e) => { e.stopPropagation(); resolve(r.id, 'confirmed') }} style={{ background: 'var(--fc-green)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 9px', fontSize: 10.5, fontWeight: 600 }}>Confirm</button>
          <button onClick={(e) => { e.stopPropagation(); resolve(r.id, 'declined') }} style={{ background: 'transparent', color: '#A32D2D', border: '1px solid #F09595', borderRadius: 8, padding: '6px 9px', fontSize: 10.5, fontWeight: 600 }}>Decline</button>
        </div>, () => openByName(r.client)))}

      {replies.map((c) => actionRow(c.initials, c.name, lastMessage(c.id)?.text ?? 'Sent you a message',
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, fontWeight: 700, color: 'var(--fc-indigo)' }}>Reply <Icon name="chevron-right" size={13} color="var(--fc-indigo)" /></span>,
        () => nav.push({ name: 'trClientChat', params: { id: c.id } })))}

      {dues.map((c) => actionRow(c.initials, `${c.name} · ${rupees(clientDue(c))} due`, c.plan,
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, fontWeight: 700, color: '#A32D2D' }}>Collect <Icon name="chevron-right" size={13} color="#A32D2D" /></span>,
        () => nav.push({ name: 'trClientProfile', params: { id: c.id } }), '#FCEBEB', '#A32D2D'))}

      {notLogging.map((c) => actionRow(c.initials, `${c.name} · not logging meals`, c.plan,
        <button onClick={(e) => { e.stopPropagation(); setNudged((n) => ({ ...n, [c.id]: true })) }} disabled={nudged[c.id]}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 10.5, fontWeight: 600,
            background: nudged[c.id] ? 'var(--fc-surface)' : 'var(--fc-coral)', color: nudged[c.id] ? 'var(--fc-rating-green)' : '#fff' }}>
          <Icon name={nudged[c.id] ? 'check' : 'bell'} size={12} color={nudged[c.id] ? 'var(--fc-rating-green)' : '#fff'} /> {nudged[c.id] ? 'Nudged' : 'Nudge'}
        </button>, () => nav.push({ name: 'trClientProfile', params: { id: c.id } }), '#FBE9DD', '#C2410C'))}

      {resolved > 0 && pending.length === 0 && (
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', margin: '2px 0 6px' }}>Requests cleared — see Profile › history.</div>
      )}

      <div style={{ height: 4 }} />
      <button onClick={() => nav.setTab('trClients')}
        style={{ width: '100%', background: '#fff', border: '0.5px solid rgba(20,20,43,0.14)', borderRadius: 12,
          padding: 11, fontSize: 12, fontWeight: 600, color: 'var(--fc-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Icon name="users-group" size={15} color="var(--fc-indigo)" /> See all {rs.total} clients
      </button>
    </div>
  )
}
