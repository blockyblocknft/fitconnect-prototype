import { useState } from 'react'
import { SlotPicker, type SlotSelection } from './SlotPicker'
import { Icon } from './Icon'

// Pick a free slot (within the trainer's working hours, not overlapping a busy
// session) to book a single session — used for trials / free consultations.
export function BookSlotModal(
  { title, trainerName, durationMin = 60, onClose, onConfirm }:
  { title: string; trainerName: string; durationMin?: number; onClose: () => void; onConfirm: (slot: SlotSelection) => void },
) {
  const [slot, setSlot] = useState<SlotSelection | null>(null)
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,43,0.45)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18,
        padding: 16, width: '100%', maxHeight: '92%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}>
            <Icon name="x" size={18} color="var(--fc-muted)" />
          </button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 12 }}>
          Pick a free slot in {trainerName}’s calendar — only open times are shown.
        </div>

        <SlotPicker durationMin={durationMin} value={slot} onChange={setSlot} />

        <button onClick={() => slot && onConfirm(slot)} disabled={!slot}
          style={{ width: '100%', marginTop: 14, background: slot ? 'var(--fc-indigo)' : 'rgba(90,74,227,0.4)', color: '#fff',
            border: 'none', borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>Confirm booking</button>
      </div>
    </div>
  )
}
