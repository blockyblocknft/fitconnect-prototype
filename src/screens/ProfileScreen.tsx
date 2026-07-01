import { useNav } from '../nav/NavContext'
import { bookings } from '../data/bookings'
import { coachPrograms } from '../data/coach'
import { trainers } from '../data/trainers'
import { mealLogFor } from '../data/progress'
import { clients } from '../data/clients'
import { profile, initials } from '../data/profile'
import { Icon } from '../components/Icon'

// Consecutive days (from today back) with at least one meal logged.
function loggingStreak() {
  const me = clients.find((c) => c.live)
  if (!me) return 0
  const log = mealLogFor(me.name)
  let n = 0
  for (const d of log) { if (d.meals.length > 0) n++; else break }
  return n
}

interface MenuRow { key: string; label: string; icon: string }
const CLIENT_MENU: MenuRow[] = [
  { key: 'account', label: 'Account & personal info', icon: 'user' },
  { key: 'goals', label: 'My goals', icon: 'target-arrow' },
  { key: 'payments', label: 'Payments & advances', icon: 'credit-card' },
  { key: 'requests', label: 'Request history', icon: 'history' },
  { key: 'notifications', label: 'Notifications', icon: 'bell' },
  { key: 'help', label: 'Help & support', icon: 'help-circle' },
]
const TRAINER_MENU: MenuRow[] = [
  { key: 'account', label: 'Account & personal info', icon: 'user' },
  { key: 'payouts', label: 'Payouts & earnings', icon: 'cash' },
  { key: 'requests', label: 'Requests actioned', icon: 'history' },
  { key: 'verification', label: 'Verification', icon: 'rosette-discount-check' },
  { key: 'notifications', label: 'Notifications', icon: 'bell' },
  { key: 'help', label: 'Help & support', icon: 'help-circle' },
]

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div className="fc-display fc-tabnum" style={{ fontSize: 17, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{label}</div>
    </div>
  )
}

export function ProfileScreen() {
  const nav = useNav()
  const trainer = nav.role === 'trainer'
  const openDetail = (row: MenuRow) => {
    if (row.key === 'payouts') return nav.push({ name: 'trPayments' })         // trainer → real ledger
    if (row.key === 'payments') return nav.push({ name: 'clientPayments' })    // client → real payments
    if (row.key === 'notifications') return nav.push({ name: 'notifications' }) // real activity feed
    nav.push({ name: 'profileDetail', params: { section: row.key, title: row.label } })
  }

  const clientStats = {
    programs: bookings.length,
    sessions: bookings.reduce((n, b) => n + b.sessions.length, 0),
    streak: loggingStreak(),
  }
  const trainerStats = {
    clients: coachPrograms.reduce((n, p) => n + p.sessions.reduce((m, s) => m + s.clients.length, 0), 0),
    programs: coachPrograms.length,
    rating: trainers[0].rating,
  }
  const menu = trainer ? TRAINER_MENU : CLIENT_MENU

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      {/* identity + stats */}
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 15 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--fc-coral)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 16 }}>{initials(profile.name)}</div>
          <div style={{ minWidth: 0 }}>
            <div className="fc-display" style={{ fontSize: 16, fontWeight: 700 }}>{profile.name}</div>
            <div style={{ fontSize: 12, color: 'var(--fc-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
              {trainer
                ? <><Icon name="rosette-discount-check" size={13} color="var(--fc-indigo)" />Trainer · {trainerStats.rating}★</>
                : <>Client · {profile.city.split(',')[0]}</>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 14, paddingTop: 12, borderTop: '0.5px solid rgba(20,20,43,0.10)' }}>
          {trainer ? (
            <>
              <Stat value={trainerStats.clients} label="clients" />
              <Stat value={trainerStats.programs} label="programs" />
              <Stat value={`${trainerStats.rating}★`} label="rating" />
            </>
          ) : (
            <>
              <Stat value={clientStats.programs} label="programs" />
              <Stat value={clientStats.sessions} label="sessions" />
              <Stat value={`${clientStats.streak}🔥`} label="day streak" />
            </>
          )}
        </div>
      </div>

      {/* menu — every row drills into a detail screen */}
      <div style={{ marginTop: 12, background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, overflow: 'hidden' }}>
        {menu.map((row, i) => (
          <button key={row.key} onClick={() => openDetail(row)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '12px 13px', cursor: 'pointer',
              background: 'transparent', textAlign: 'left', border: 'none',
              borderTop: i === 0 ? 'none' : '0.5px solid rgba(20,20,43,0.08)' }}>
            <Icon name={row.icon} size={17} color="var(--fc-indigo)" />
            <span style={{ flex: 1, fontSize: 13 }}>{row.label}</span>
            <Icon name="chevron-right" size={17} color="#C4C4CF" />
          </button>
        ))}
      </div>

      <button style={{ width: '100%', marginTop: 14, background: 'transparent', border: '0.5px solid rgba(20,20,43,0.18)',
        color: 'var(--fc-muted)', borderRadius: 12, padding: 12, fontSize: 13, fontWeight: 600 }}>Log out</button>
    </div>
  )
}
