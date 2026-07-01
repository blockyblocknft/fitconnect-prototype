import { useNav } from '../nav/NavContext'
import { clients, clientDue, payments } from '../data/clients'
import { messagesFor, waitingReplies, lastMessage } from '../data/messages'
import { clientRequests, customRequests } from '../data/sessionRequests'
import { mealLogFor } from '../data/progress'
import { Icon } from '../components/Icon'

const rupees = (n: number) => '₹' + n.toLocaleString('en-IN')

interface Note { icon: string; color: string; tint: string; title: string; sub: string; onClick?: () => void }

export function NotificationsScreen() {
  const nav = useNav()
  const trainer = nav.role === 'trainer'
  const notes: Note[] = []

  if (trainer) {
    waitingReplies().map((id) => clients.find((c) => c.id === id)).forEach((c) => {
      if (c) notes.push({ icon: 'message-2', color: 'var(--fc-indigo)', tint: 'var(--fc-indigo-tint)', title: `${c.name} messaged you`, sub: lastMessage(c.id)?.text ?? '', onClick: () => nav.push({ name: 'trClientChat', params: { id: c.id } }) })
    })
    customRequests.filter((r) => r.status === 'awaiting').forEach((r) => notes.push({ icon: 'calendar-plus', color: '#854F0B', tint: '#FAEEDA', title: `${r.client} requested a session`, sub: `${r.focus} · ${r.when}`, onClick: () => nav.setTab('trToday') }))
    clients.filter((c) => clientDue(c) > 0).forEach((c) => notes.push({ icon: 'cash', color: '#A32D2D', tint: '#FCEBEB', title: `${c.name} owes ${rupees(clientDue(c))}`, sub: c.plan, onClick: () => nav.push({ name: 'trClientProfile', params: { id: c.id } }) }))
    clients.filter((c) => c.nutrition === 'nolog').forEach((c) => notes.push({ icon: 'salad', color: '#C2410C', tint: '#FBE9DD', title: `${c.name} hasn’t logged meals`, sub: c.plan, onClick: () => nav.push({ name: 'trClientProfile', params: { id: c.id } }) }))
  } else {
    const me = clients.find((c) => c.live) ?? clients[0]
    messagesFor(me.id).filter((m) => m.from === 'coach').reverse().forEach((m) => notes.push({ icon: 'message-circle', color: 'var(--fc-indigo)', tint: 'var(--fc-indigo-tint)', title: 'Message from your coach', sub: m.text, onClick: () => nav.push({ name: 'coachChat' }) }))
    clientRequests().forEach((r) => {
      const done = r.status !== 'awaiting'
      notes.push({ icon: done ? 'circle-check' : 'clock', color: r.status === 'confirmed' ? 'var(--fc-rating-green)' : r.status === 'declined' ? '#A32D2D' : '#854F0B',
        tint: r.status === 'confirmed' ? '#E4F3EA' : r.status === 'declined' ? '#FCEBEB' : '#FAEEDA',
        title: `Request ${r.status === 'awaiting' ? 'pending' : r.status}`, sub: `${r.focus} · ${r.when}` })
    })
    payments.filter((p) => p.name === me.name).forEach((p) => notes.push({ icon: 'cash', color: 'var(--fc-rating-green)', tint: '#E4F3EA', title: `Payment recorded · ${rupees(p.amount)}`, sub: `${me.plan} · ${p.date}`, onClick: () => nav.push({ name: 'clientPayments' }) }))
    mealLogFor(me.name).filter((d) => d.trainerComment).slice(0, 3).forEach((d) => notes.push({ icon: 'message-dots', color: 'var(--fc-indigo)', tint: 'var(--fc-indigo-tint)', title: `Coach noted on ${d.date}`, sub: d.trainerComment! }))
  }

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--fc-muted)' }}>
          <Icon name="bell" size={28} color="var(--fc-muted)" />
          <div style={{ fontSize: 13, marginTop: 8 }}>You’re all caught up.</div>
        </div>
      ) : notes.map((n, i) => (
        <div key={i} onClick={n.onClick} role={n.onClick ? 'button' : undefined} tabIndex={n.onClick ? 0 : undefined}
          style={{ display: 'flex', alignItems: 'center', gap: 11, background: '#fff', cursor: n.onClick ? 'pointer' : 'default',
            border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 13, padding: 11, marginBottom: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: n.tint, flex: '0 0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={n.icon} size={16} color={n.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{n.title}</div>
            <div style={{ fontSize: 10.5, color: 'var(--fc-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.sub}</div>
          </div>
          {n.onClick && <Icon name="chevron-right" size={16} color="var(--fc-muted)" />}
        </div>
      ))}
    </div>
  )
}
