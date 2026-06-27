import { useNav } from '../nav/NavContext'
import { Icon } from './Icon'

// A single person in a double-biceps flex: head, short torso, upper arms out
// and forearms bent up 90° at the elbow with fists held clear of the head.
// The branded "Fit All" glyph for trainers. Thin lines.
function FlexGroupIcon({ size = 21, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12.6" r="2.6" />
      <path d="M12 15.2 L12 19.2" />
      <path d="M6.5 14.6 L6.5 19.2 L17.5 19.2 L17.5 14.6" />
    </svg>
  )
}

export function BottomNav() {
  const nav = useNav()
  const trainer = nav.role === 'trainer'
  const onProfile = nav.current.name === 'profile'
  const onLogMeal = !onProfile && nav.activeTab === 'logMeal'
  const homeActive = !onProfile && !onLogMeal

  const item = (label: string, icon: string, active: boolean, onClick: () => void, iconNode?: React.ReactNode) => {
    const color = active ? 'var(--fc-indigo)' : 'var(--fc-muted)'
    return (
      <button onClick={onClick} aria-label={label}
        style={{ background: 'transparent', border: 'none', textAlign: 'center', color }}>
        {iconNode ?? <Icon name={icon} size={21} color={color} />}
        <div style={{ fontSize: 11, fontWeight: active ? 600 : 400, color }}>{label}</div>
      </button>
    )
  }

  return (
    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      padding: '9px 14px 12px', background: 'var(--fc-white)', borderTop: '0.5px solid rgba(20,20,43,0.10)' }}>
      {trainer
        ? item('Fit All', 'inbox', homeActive, () => nav.setTab('trToday'),
            <FlexGroupIcon size={30} color={homeActive ? 'var(--fc-indigo)' : 'var(--fc-muted)'} />)
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
