import { Icon } from './Icon'

// Sliding switch for online / in-person. Knob shows a globe (online) or a person
// (in person). When `active` is false it reads "Any mode" and sits dimmed — used as
// an optional browse filter; the booking modal leaves it always active (binary).
export function ModeSwitch(
  { mode, active = true, onChange }:
  { mode: 'online' | 'inperson'; active?: boolean; onChange: (m: 'online' | 'inperson') => void },
) {
  const online = mode === 'online'
  const accent = active ? (online ? 'var(--fc-green)' : '#E24B4A') : 'var(--fc-muted)'
  const toggle = () => onChange(active ? (online ? 'inperson' : 'online') : mode)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button role="switch" aria-checked={active && online} aria-label="Toggle online or in person"
        onClick={toggle}
        style={{ position: 'relative', width: 56, height: 30, borderRadius: 999, border: 'none', padding: 0,
          background: 'var(--fc-surface)', cursor: 'pointer', flex: '0 0 auto', opacity: active ? 1 : 0.6 }}>
        <span style={{ position: 'absolute', top: 3, left: online ? 3 : 29, transition: 'left .18s ease',
          width: 24, height: 24, borderRadius: 8, background: '#fff', boxShadow: '0 1px 3px rgba(20,20,43,0.25)',
          border: `1.5px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={online ? 'world' : 'user'} size={13} color={accent} />
        </span>
      </button>
      <span style={{ fontSize: 12, fontWeight: 600, color: accent }}>
        {active ? (online ? 'Online' : 'In person') : 'Any mode'}
      </span>
    </div>
  )
}
