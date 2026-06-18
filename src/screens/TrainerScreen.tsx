import { getTrainer } from '../data/trainers'
import { ProgramCard } from '../components/cards/ProgramCard'
import { Icon } from '../components/Icon'
import { RatingPill } from '../components/RatingPill'
import { CapacityBar } from '../components/CapacityBar'

export function TrainerScreen({ trainerId }: { trainerId: string }) {
  const t = getTrainer(trainerId)
  if (!t) return <div style={{ padding: 16 }}>Trainer not found</div>
  const firstName = t.name.split(' ')[0]
  const loc = t.location
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 13, background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {t.verified && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--fc-indigo)', marginBottom: 3 }}>
              <Icon name="rosette-discount-check" size={14} color="var(--fc-indigo)" />
              <span style={{ fontSize: 10, fontWeight: 600 }}>FitConnect Verified</span></div>}
            <div className="fc-display" style={{ fontSize: 16, fontWeight: 700 }}>{t.name}</div>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{t.specialty} · {t.years} yrs</div>
          </div>
          <RatingPill rating={t.rating} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 8 }}>
          {loc.kind === 'local' ? `${loc.area} · ${loc.km} km` : 'Online · Intl'} · {t.programs.length} programs
        </div>
      </div>

      <div style={{ border: '1.5px solid var(--fc-indigo)', borderRadius: 14, padding: 12, marginBottom: 14, background: '#F6F5FE' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--fc-indigo)', marginBottom: 9 }}>
          <Icon name="sparkles" size={14} color="var(--fc-indigo)" />
          <span className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>Try before you commit</span>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 11, padding: 10, width: 130 }}>
          <div className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>1-day trial</div>
          <div style={{ fontSize: 10, color: 'var(--fc-muted)', margin: '2px 0 6px' }}>Full session</div>
          <div className="fc-display fc-tabnum" style={{ fontSize: 12, fontWeight: 700 }}>{t.trial.priceLabel}</div>
        </div>
      </div>

      {t.programs.map((p) => <ProgramCard key={p.id} program={p} />)}

      {t.events.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, margin: '10px 0 9px' }}>
            <Icon name="confetti" size={14} color="var(--fc-green)" />
            <span className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>Events by {firstName}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
            {t.events.map((e) => (
              <div key={e.id} style={{ flex: '0 0 170px', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 13, padding: 11, background: '#fff' }}>
                <div className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>{e.title}</div>
                <div style={{ fontSize: 11, color: 'var(--fc-muted)', margin: '3px 0 7px' }}>{e.dateLabel}</div>
                <CapacityBar taken={e.spotsTaken} max={e.spotsMax} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
