import { useNav, type TabKey } from '../nav/NavContext'
import { Icon } from './Icon'

const CLIENT_TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { key: 'sessions', label: 'Sessions', icon: 'barbell' },
  { key: 'logMeal', label: 'Log Meal', icon: 'salad' },
  { key: 'events', label: 'Events', icon: 'confetti' },
  { key: 'booked', label: 'Booked', icon: 'bookmark' },
]
const TRAINER_TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'trToday', label: 'Dashboard', icon: 'layout-dashboard' },
  { key: 'trSessions', label: 'Sessions', icon: 'barbell' },
  { key: 'trClients', label: 'Clients', icon: 'users' },
]

export function TopTabStrip() {
  const nav = useNav()
  const tabs = nav.role === 'client' ? CLIENT_TABS : TRAINER_TABS
  return (
    <div style={{ display: 'flex', gap: 16, padding: '10px 14px 0', overflowX: 'auto',
      borderBottom: '0.5px solid rgba(20,20,43,0.10)' }}>
      {tabs.map((t) => {
        const active = nav.activeTab === t.key
        const color = active ? 'var(--fc-indigo)' : 'var(--fc-muted)'
        return (
          <button key={t.key} onClick={() => nav.setTab(t.key)}
            style={{ background: 'transparent', border: 'none', textAlign: 'center', flex: '0 0 auto',
              paddingBottom: 8, borderBottom: active ? '2.5px solid var(--fc-indigo)' : '2.5px solid transparent' }}>
            <Icon name={t.icon} size={19} color={color} />
            <div style={{ fontSize: 11, fontWeight: active ? 600 : 400, color, marginTop: 2 }}>{t.label}</div>
          </button>
        )
      })}
    </div>
  )
}
