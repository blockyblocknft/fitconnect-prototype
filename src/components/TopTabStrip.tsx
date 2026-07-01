import { useEffect, useRef, useState } from 'react'
import { useNav, type TabKey } from '../nav/NavContext'
import { Icon } from './Icon'

const CLIENT_TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'sessions', label: 'Book sessions', icon: 'barbell' },
  { key: 'booked', label: 'Booked', icon: 'bookmark' },
  { key: 'logMeal', label: 'Log Meal', icon: 'salad' },
  { key: 'events', label: 'Events', icon: 'confetti' },
  { key: 'fittii', label: 'Fittii', icon: 'message-2' },
]
const TRAINER_TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'trToday', label: 'Today', icon: 'home' },
  { key: 'trClients', label: 'Clients', icon: 'users-group' },
  { key: 'trCalendar', label: 'Calendar', icon: 'calendar' },
  { key: 'trSessions', label: 'Create session', icon: 'circle-plus' },
  { key: 'trCoach', label: 'Coach', icon: 'school' },
  { key: 'fittii', label: 'Fittii', icon: 'message-2' },
]

export function TopTabStrip() {
  const nav = useNav()
  const tabs = nav.role === 'client' ? CLIENT_TABS : TRAINER_TABS
  const scRef = useRef<HTMLDivElement>(null)
  const [showArrow, setShowArrow] = useState(false)

  useEffect(() => {
    const el = scRef.current
    if (!el) return
    const check = () => setShowArrow(el.scrollWidth > el.clientWidth + 4 && el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    check()
    el.addEventListener('scroll', check)
    window.addEventListener('resize', check)
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check) }
  }, [tabs.length, nav.role, nav.activeTab])

  return (
    <div style={{ position: 'relative', borderBottom: '0.5px solid rgba(20,20,43,0.10)' }}>
      <div ref={scRef} className="fc-noscrollbar" style={{ display: 'flex', gap: 7, padding: '9px 12px 9px', overflowX: 'auto' }}>
        {tabs.map((t) => {
          const active = nav.activeTab === t.key
          const color = active ? 'var(--fc-indigo)' : 'var(--fc-muted)'
          return (
            <button key={t.key} onClick={() => nav.setTab(t.key)}
              style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                border: 'none', borderRadius: 13, padding: '7px 12px', cursor: 'pointer',
                background: active ? 'var(--fc-indigo-tint)' : 'transparent' }}>
              <Icon name={t.icon} size={19} color={color} />
              <div style={{ fontSize: 11, fontWeight: active ? 700 : 500, color }}>{t.label}</div>
            </button>
          )
        })}
      </div>
      {showArrow && (
        <button onClick={() => scRef.current?.scrollBy({ left: 150, behavior: 'smooth' })} aria-label="Scroll tabs"
          style={{ position: 'absolute', top: 0, bottom: 4, right: 0, width: 46, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 5,
            background: 'linear-gradient(to right, rgba(255,255,255,0), var(--fc-white) 58%)' }}>
          <Icon name="chevron-right" size={19} color="var(--fc-indigo)" />
        </button>
      )}
    </div>
  )
}
