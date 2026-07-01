import { useEffect, useState } from 'react'
import type { LoggedMeal } from '../lib/types'
import { mealDay } from '../data/meal'
import { syncClientToday } from '../data/progress'
import { clients } from '../data/clients'
import { CalorieRing } from '../components/meal/CalorieRing'
import { TrackerChip } from '../components/meal/TrackerChip'
import { MealEntryModal } from '../components/meal/MealEntryModal'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{label}</span>
        <span className="fc-tabnum" style={{ fontSize: 11, color: 'var(--fc-muted)' }}>{value} / {target} g</span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: 'var(--fc-surface)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
      </div>
    </div>
  )
}

// The shared meal log is keyed by the client's name (same key the coach uses).
const LIVE_KEY = clients.find((c) => c.live)?.name ?? clients[0].name

export function LogMealScreen() {
  const [meals, setMeals] = useState<LoggedMeal[]>(mealDay.meals)
  const [showModal, setShowModal] = useState(false)
  const t = mealDay.targets

  // Mirror today's log into the shared store so the coach sees what's logged.
  useEffect(() => { syncClientToday(LIVE_KEY, meals) }, [meals])

  const eaten = meals.reduce((n, m) => n + m.cal, 0)
  const protein = meals.reduce((n, m) => n + m.protein, 0)
  const carbs = meals.reduce((n, m) => n + m.carbs, 0)
  const fats = meals.reduce((n, m) => n + m.fats, 0)

  return (
    <div style={{ padding: '13px 14px', background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 13, marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 13 }}>
        <CalorieRing eaten={eaten} goal={t.calories} />
        <div style={{ flex: 1 }}>
          <div className="fc-display" style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Today’s food</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button full style={{ fontSize: 12, padding: 9 }} onClick={() => setShowModal(true)}>
              <Icon name="plus" size={14} color="#fff" /> Log meal
            </Button>
            <Button variant="secondary" style={{ fontSize: 12, padding: '9px 12px' }} aria-label="Snap a photo" onClick={() => setShowModal(true)}>
              <Icon name="camera" size={14} color="var(--fc-indigo)" />
            </Button>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 13, marginBottom: 14 }}>
        <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 10 }}>MACROS vs PLAN</div>
        <MacroBar label="Protein" value={protein} target={t.protein} color="var(--fc-indigo)" />
        <MacroBar label="Carbs" value={carbs} target={t.carbs} color="var(--fc-green)" />
        <MacroBar label="Fats" value={fats} target={t.fats} color="var(--fc-coral)" />
      </div>

      <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 9 }}>TODAY’S MEALS</div>
      {meals.length === 0 ? (
        <div style={{ background: '#fff', border: '0.5px dashed rgba(20,20,43,0.2)', borderRadius: 14, padding: 18,
          textAlign: 'center', color: 'var(--fc-muted)', fontSize: 12, marginBottom: 14 }}>
          No meals logged yet. Tap <b>Log meal</b> to add your first.
        </div>
      ) : meals.map((m) => (
        <div key={m.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14,
          padding: '11px 12px', marginBottom: 9 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fc-indigo)' }}>{m.type} · {m.time}</div>
              <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700 }}>{m.cal}</span>
              <button aria-label="Delete meal"
                onClick={() => { const i = mealDay.meals.findIndex((x) => x.id === m.id); if (i >= 0) mealDay.meals.splice(i, 1); setMeals([...mealDay.meals]) }}
                style={{ background: 'transparent', border: 'none', display: 'flex' }}>
                <Icon name="trash" size={15} color="#C4C4CF" />
              </button>
            </div>
          </div>
          <div className="fc-tabnum" style={{ fontSize: 10, color: 'var(--fc-muted)', marginTop: 2 }}>
            P {m.protein}g · C {m.carbs}g · F {m.fats}g{m.notes ? ` · ${m.notes}` : ''}
          </div>
          {m.trainerComment && (
            <div style={{ background: '#F0FAF4', borderRadius: 9, padding: '6px 9px', marginTop: 7, fontSize: 11 }}>
              <b style={{ fontWeight: 600, color: 'var(--fc-rating-green)' }}>Coach:</b> {m.trainerComment}
            </div>
          )}
        </div>
      ))}

      <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', margin: '6px 0 9px' }}>TODAY’S TRACKERS</div>
      <div style={{ display: 'flex', gap: 9, overflowX: 'auto', paddingBottom: 2 }}>
        {mealDay.trackers.map((tr) => <TrackerChip key={tr.key} tracker={tr} />)}
      </div>

      {showModal && (
        <MealEntryModal onClose={() => setShowModal(false)}
          onSave={(meal) => { mealDay.meals.push(meal); setMeals([...mealDay.meals]); setShowModal(false) }} />
      )}
    </div>
  )
}
