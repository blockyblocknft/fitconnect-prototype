import { useNav } from '../nav/NavContext'
import { bookings } from '../data/bookings'
import { mealDay } from '../data/meal'
import { CalorieRing } from '../components/meal/CalorieRing'
import { Icon } from '../components/Icon'

export function DashboardScreen() {
  const nav = useNav()

  const upcoming = bookings
    .filter((b) => b.status !== 'cancelled')
    .flatMap((b) => b.sessions
      .filter((s) => s.when !== 'past' && s.status === 'confirmed')
      .map((s) => ({ ...s, programName: b.programName, meetLink: b.meetLink, bookingId: b.id })))
    .sort((a, b) => (a.when === 'today' ? 0 : 1) - (b.when === 'today' ? 0 : 1))
  const next = upcoming[0]
  const eaten = mealDay.meals.reduce((n, m) => n + m.cal, 0)

  const Section = ({ children }: { children: string }) => (
    <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', margin: '0 0 9px' }}>{children}</div>
  )

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      <Section>YOUR NEXT SESSION</Section>
      {next ? (
        <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 14, marginBottom: 16 }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: next.when === 'today' ? 'var(--fc-rating-green)' : 'var(--fc-indigo)',
            background: next.when === 'today' ? '#E4F3EA' : 'var(--fc-indigo-tint)', padding: '3px 9px', borderRadius: 999 }}>
            {next.when === 'today' ? 'TODAY' : 'UPCOMING'}
          </span>
          <div className="fc-display" style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>Session {next.index} · {next.title}</div>
          <div style={{ fontSize: 11, color: 'var(--fc-muted)', margin: '2px 0 12px' }}>{next.programName} · {next.date} · {next.time}</div>
          <a href={next.meetLink} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none',
              background: 'var(--fc-indigo)', color: '#fff', borderRadius: 12, padding: 11, fontSize: 13, fontWeight: 600 }}>
            <Icon name="video" size={16} color="#fff" /> Join session
          </a>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 16, marginBottom: 16,
          fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center' }}>No upcoming sessions — book one below.</div>
      )}

      <Section>TODAY’S NUTRITION</Section>
      <div role="button" tabIndex={0} onClick={() => nav.setTab('logMeal')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav.setTab('logMeal') } }}
        style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 13, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
        <CalorieRing eaten={eaten} goal={mealDay.targets.calories} />
        <div style={{ flex: 1 }}>
          <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{mealDay.meals.length} meals logged</div>
          <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 2 }}>Tap to log or review today’s food</div>
        </div>
        <Icon name="chevron-right" size={18} color="#C4C4CF" />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button onClick={() => nav.setTab('sessions')}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'var(--fc-indigo)',
            color: '#fff', border: 'none', borderRadius: 13, padding: 12, fontSize: 13, fontWeight: 600 }}>
          <Icon name="barbell" size={16} color="#fff" /> Book session
        </button>
        <button onClick={() => nav.setTab('logMeal')}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'var(--fc-coral)',
            color: '#fff', border: 'none', borderRadius: 13, padding: 12, fontSize: 13, fontWeight: 600 }}>
          <Icon name="camera" size={16} color="#fff" /> Log meal
        </button>
      </div>

      <Section>UPCOMING SESSIONS</Section>
      {upcoming.length === 0
        ? <div style={{ fontSize: 12, color: 'var(--fc-muted)' }}>Nothing scheduled.</div>
        : upcoming.slice(0, 4).map((s) => (
          <div key={s.bookingId + s.id} role="button" tabIndex={0}
            onClick={() => nav.push({ name: 'programDetail', params: { id: s.bookingId, sessionId: s.id } })}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav.push({ name: 'programDetail', params: { id: s.bookingId, sessionId: s.id } }) } }}
            style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '10px 12px',
              marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.when === 'today' ? 'var(--fc-green)' : 'var(--fc-coral)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>Session {s.index} · {s.title}</div>
              <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{s.programName} · {s.date} · {s.time}</div>
            </div>
            <Icon name="chevron-right" size={16} color="#C4C4CF" />
          </div>
        ))}
    </div>
  )
}
