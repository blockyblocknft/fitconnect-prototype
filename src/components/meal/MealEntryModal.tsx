import { useState } from 'react'
import type { LoggedMeal, MealType } from '../../lib/types'
import { Icon } from '../Icon'

const TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
const num = (v: string) => Math.max(0, Math.round(Number(v) || 0))

const inputStyle: React.CSSProperties = {
  width: '100%', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '8px 10px',
  fontSize: 12, fontFamily: 'var(--fc-font-body)', outline: 'none',
}

export function MealEntryModal({ onClose, onSave }: { onClose: () => void; onSave: (m: LoggedMeal) => void }) {
  const [type, setType] = useState<MealType>('Breakfast')
  const [time, setTime] = useState('1:00 PM')
  const [name, setName] = useState('')
  const [cal, setCal] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fats, setFats] = useState('')
  const [notes, setNotes] = useState('')

  const save = () => {
    if (!name.trim()) return
    onSave({ id: `lm-${Date.now()}`, type, time, name: name.trim(),
      cal: num(cal), protein: num(protein), carbs: num(carbs), fats: num(fats), notes: notes.trim() || undefined })
  }

  const macro = (label: string, v: string, set: (s: string) => void) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 3 }}>{label}</div>
      <input value={v} onChange={(e) => set(e.target.value)} inputMode="numeric" placeholder="0" style={inputStyle} />
    </div>
  )

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,43,0.45)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18,
        padding: 16, width: '100%', maxHeight: '92%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>Log a meal</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}>
            <Icon name="x" size={18} color="var(--fc-muted)" />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 11 }}>
          {TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)}
              style={{ flex: 1, border: 'none', borderRadius: 9, padding: '7px 0', fontSize: 11, fontWeight: 600,
                background: type === t ? 'var(--fc-indigo)' : 'var(--fc-surface)', color: type === t ? '#fff' : 'var(--fc-muted)' }}>{t}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 9 }}>
          <div style={{ flex: 2 }}>
            <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 3 }}>Meal name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chicken rice bowl" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 3 }}>Time</div>
            <input value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 9 }}>
          <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 3 }}>Calories</div>
          <input value={cal} onChange={(e) => setCal(e.target.value)} inputMode="numeric" placeholder="0" style={inputStyle} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 9 }}>
          {macro('Protein (g)', protein, setProtein)}
          {macro('Carbs (g)', carbs, setCarbs)}
          {macro('Fats (g)', fats, setFats)}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 3 }}>Notes (appetite, energy, timing…)</div>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" style={inputStyle} />
        </div>

        <button onClick={save} disabled={!name.trim()}
          style={{ width: '100%', background: name.trim() ? 'var(--fc-indigo)' : 'rgba(90,74,227,0.4)', color: '#fff',
            border: 'none', borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>Save meal</button>
      </div>
    </div>
  )
}
