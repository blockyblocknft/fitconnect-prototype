import { useNav } from '../nav/NavContext'
import { Icon } from './Icon'

export function BottomNav() {
  const nav = useNav()
  const item = (label: string, icon: string, onClick: () => void) => (
    <button onClick={onClick} aria-label={label}
      style={{ background: 'transparent', border: 'none', textAlign: 'center', color: 'var(--fc-muted)' }}>
      <Icon name={icon} size={21} color="var(--fc-muted)" />
      <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{label}</div>
    </button>
  )
  return (
    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      padding: '9px 14px 12px', background: 'var(--fc-white)', borderTop: '0.5px solid rgba(20,20,43,0.10)' }}>
      {item('Trainer', 'user-heart', () => nav.push({ name: 'trainerHub' }))}
      <button onClick={() => nav.setTab('logMeal')} aria-label="Log meal"
        style={{ background: 'transparent', border: 'none', textAlign: 'center', marginTop: -14 }}>
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--fc-coral)', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={25} color="#fff" />
        </div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 3 }}>Log meal</div>
      </button>
      {item('Profile', 'user', () => nav.push({ name: 'profile' }))}
    </div>
  )
}
