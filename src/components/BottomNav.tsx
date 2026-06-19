import { useNav } from '../nav/NavContext'
import { Icon } from './Icon'

export function BottomNav() {
  const nav = useNav()
  const trainer = nav.role === 'trainer'
  const onProfile = nav.current.name === 'profile'
  const onLogMeal = !onProfile && nav.activeTab === 'logMeal'
  const homeActive = !onProfile && !onLogMeal

  const item = (label: string, icon: string, active: boolean, onClick: () => void) => {
    const color = active ? 'var(--fc-indigo)' : 'var(--fc-muted)'
    return (
      <button onClick={onClick} aria-label={label}
        style={{ background: 'transparent', border: 'none', textAlign: 'center', color }}>
        <Icon name={icon} size={21} color={color} />
        <div style={{ fontSize: 11, fontWeight: active ? 600 : 400, color }}>{label}</div>
      </button>
    )
  }

  return (
    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      padding: '9px 14px 12px', background: 'var(--fc-white)', borderTop: '0.5px solid rgba(20,20,43,0.10)' }}>
      {trainer
        ? item('Today', 'calendar-event', homeActive, () => nav.setTab('trToday'))
        : item('Train', 'barbell', homeActive, () => nav.setTab('sessions'))}
      <button onClick={() => nav.setTab(trainer ? 'trSessions' : 'logMeal')} aria-label={trainer ? 'Create' : 'Log meal'}
        style={{ background: 'transparent', border: 'none', textAlign: 'center', marginTop: -14 }}>
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--fc-coral)', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: onLogMeal ? '0 0 0 3px var(--fc-coral-tint)' : 'none' }}>
          <Icon name={trainer ? 'plus' : 'camera'} size={24} color="#fff" />
        </div>
        <div style={{ fontSize: 11, fontWeight: onLogMeal ? 600 : 400,
          color: onLogMeal ? 'var(--fc-coral)' : 'var(--fc-muted)', marginTop: 3 }}>{trainer ? 'Create' : 'Log meal'}</div>
      </button>
      {item('Profile', 'user', onProfile, () => nav.push({ name: 'profile' }))}
    </div>
  )
}
