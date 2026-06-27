import { useState } from 'react'
import type { GroupClass, GroupSlot } from '../data/groupClasses'
import { initials } from '../data/profile'
import { WorkoutPlan } from './WorkoutPlan'
import { Icon } from './Icon'

// Group-class booking with the same lifecycle as 1:1: preview the session
// (details + videos) before sending the request.
export function GroupBookModal(
  { cls, slot, dateLabel, onClose, onConfirm }:
  { cls: GroupClass; slot: GroupSlot; dateLabel: string; onClose: () => void; onConfirm: () => void },
) {
  const [showPlan, setShowPlan] = useState(true)
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,43,0.45)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18,
        padding: 16, width: '100%', maxHeight: '92%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }}>
          <span className="fc-display" style={{ fontSize: 15, fontWeight: 700 }}>{cls.title}</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}>
            <Icon name="x" size={18} color="var(--fc-muted)" />
          </button>
        </div>

        {/* trainer photo + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--fc-coral)', color: '#fff', flex: '0 0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{initials(cls.trainerName)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{cls.trainerName}</div>
            <div style={{ fontSize: 10.5, color: 'var(--fc-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name={cls.mode === 'online' ? 'video' : 'map-pin'} size={12} color="var(--fc-muted)" />{cls.place}
            </div>
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--fc-indigo)', background: 'var(--fc-indigo-tint)', padding: '2px 8px', borderRadius: 999 }}>Group</span>
        </div>

        {/* chosen slot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--fc-indigo-tint)', borderRadius: 10, padding: '9px 11px', marginBottom: 12 }}>
          <Icon name="calendar" size={15} color="var(--fc-indigo)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-indigo)' }}>{dateLabel} · {slot.time}</span>
          <span style={{ fontSize: 10, color: 'var(--fc-indigo)', opacity: 0.8 }}>· {slot.format}</span>
        </div>

        {/* session details — workout plan with videos */}
        <div style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
          <button onClick={() => setShowPlan((v) => !v)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, background: 'var(--fc-surface)', border: 'none', padding: '9px 11px', cursor: 'pointer', textAlign: 'left' }}>
            <Icon name="player-play" size={15} color="var(--fc-coral)" />
            <span style={{ flex: 1 }}>
              <span className="fc-display" style={{ fontSize: 12.5, fontWeight: 700 }}>Session details</span>
              <span style={{ display: 'block', fontSize: 10, color: 'var(--fc-muted)' }}>What you’ll do · video for each part</span>
            </span>
            <Icon name={showPlan ? 'chevron-down' : 'chevron-right'} size={16} color="var(--fc-muted)" />
          </button>
          {showPlan && <div style={{ padding: '10px 11px' }}><WorkoutPlan discipline={cls.discipline} /></div>}
        </div>

        <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', background: '#FAEEDA', borderRadius: 10, padding: '9px 11px', marginBottom: 11 }}>
          <Icon name="clock" size={14} color="#854F0B" />
          <div style={{ fontSize: 11, color: '#854F0B', lineHeight: 1.5 }}>
            Sends a <b>request</b> to {cls.trainerName} for this slot — held until they confirm.
          </div>
        </div>

        <button onClick={onConfirm}
          style={{ width: '100%', background: 'var(--fc-indigo)', color: '#fff', border: 'none', borderRadius: 13,
            padding: 13, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          Request to book · {cls.price}
        </button>
      </div>
    </div>
  )
}
