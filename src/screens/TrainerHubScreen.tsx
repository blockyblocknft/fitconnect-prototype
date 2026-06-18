import { trainers } from '../data/trainers'
import { Icon } from '../components/Icon'

export function TrainerHubScreen() {
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1 }}>
      <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 9 }}>YOUR TRAINERS</div>
      {trainers.map((t) => (
        <div key={t.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14,
          padding: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--fc-indigo-tint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="user" size={20} color="var(--fc-indigo)" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>Tap to chat</div>
          </div>
          <Icon name="message-circle" size={20} color="var(--fc-indigo)" />
        </div>
      ))}
    </div>
  )
}
