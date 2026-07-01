import { useNav } from '../../nav/NavContext'
import { getClient } from '../../data/clients'
import { threadClientIds, lastMessage, unread } from '../../data/messages'
import { Icon } from '../../components/Icon'

// All coach ↔ client threads in one place; unread (client sent last) float up.
export function TrainerMessagesScreen() {
  const nav = useNav()
  const rows = threadClientIds()
    .map((id) => ({ c: getClient(id), last: lastMessage(id), un: unread(id) }))
    .filter((r): r is { c: NonNullable<ReturnType<typeof getClient>>; last: ReturnType<typeof lastMessage>; un: boolean } => !!r.c)
    .sort((a, b) => Number(b.un) - Number(a.un))
  const unreadCount = rows.filter((r) => r.un).length

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 11 }}>
        <b style={{ color: unreadCount ? 'var(--fc-coral)' : 'var(--fc-ink)' }}>{unreadCount}</b> waiting on your reply
      </div>
      {rows.length === 0 && <div style={{ fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center', padding: 22 }}>No conversations yet.</div>}
      {rows.map(({ c, last, un }) => (
        <div key={c.id} role="button" tabIndex={0} onClick={() => nav.push({ name: 'trClientChat', params: { id: c.id } })}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', cursor: 'pointer',
            border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 11, marginBottom: 8 }}>
          <div style={{ position: 'relative', flex: '0 0 auto' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{c.initials}</div>
            {un && <span style={{ position: 'absolute', top: -1, right: -1, width: 11, height: 11, borderRadius: '50%', background: 'var(--fc-coral)', border: '2px solid #fff' }} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="fc-display" style={{ fontSize: 13, fontWeight: un ? 700 : 600 }}>{c.name}</span>
              <span style={{ marginLeft: 'auto', fontSize: 9.5, color: 'var(--fc-muted)' }}>{last?.time}</span>
            </div>
            <div style={{ fontSize: 11, color: un ? 'var(--fc-ink)' : 'var(--fc-muted)', fontWeight: un ? 600 : 400,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {last?.from === 'coach' ? 'You: ' : ''}{last?.text}
            </div>
          </div>
          <Icon name="chevron-right" size={16} color="var(--fc-muted)" />
        </div>
      ))}
    </div>
  )
}
