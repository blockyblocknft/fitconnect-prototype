import { mealDay } from '../data/meal'
import { CalorieRing } from '../components/meal/CalorieRing'
import { MacroStat } from '../components/meal/MacroStat'
import { TrackerChip } from '../components/meal/TrackerChip'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'

export function LogMealScreen() {
  return (
    <div style={{ padding: '13px 14px', background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 13,
        marginBottom: 12, display: 'flex', alignItems: 'center', gap: 13 }}>
        <CalorieRing eaten={mealDay.caloriesEaten} goal={mealDay.caloriesGoal} />
        <div style={{ flex: 1 }}>
          <div className="fc-display" style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Today's food</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button full style={{ fontSize: 12, padding: 9 }}><Icon name="camera" size={14} color="#fff" /> Snap</Button>
            <Button variant="secondary" full style={{ fontSize: 12, padding: 9 }}><Icon name="plus" size={14} color="var(--fc-indigo)" /> Add</Button>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 14 }}>
        {mealDay.macros.map((m) => <MacroStat key={m.label} macro={m} />)}
      </div>
      <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 9 }}>TODAY'S TRACKERS</div>
      <div style={{ display: 'flex', gap: 9, overflowX: 'auto', paddingBottom: 2 }}>
        {mealDay.trackers.map((t) => <TrackerChip key={t.key} tracker={t} />)}
      </div>
    </div>
  )
}
