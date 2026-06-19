import { useState } from 'react'
import { Icon } from './Icon'

export interface AuditNote {
  title: string
  mismatch: string
  recommendation: string
}

export function AuditButton({ note }: { note: AuditNote }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Design audit detail"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--fc-indigo-tint)',
          color: 'var(--fc-indigo)', border: 'none', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>
        <Icon name="info-circle" size={13} color="var(--fc-indigo)" /> Detail
      </button>
      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,43,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, padding: 16, width: '100%', maxHeight: '82%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className="fc-display" style={{ fontSize: 14, fontWeight: 700 }}>Design audit</span>
              <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: 'transparent', border: 'none' }}>
                <Icon name="x" size={18} color="var(--fc-muted)" />
              </button>
            </div>
            <div className="fc-display" style={{ fontSize: 13, fontWeight: 600, marginBottom: 9 }}>{note.title}</div>
            <div style={{ background: '#FCEBEB', borderRadius: 10, padding: '9px 11px', marginBottom: 9 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#A32D2D', marginBottom: 3 }}>MISMATCH</div>
              <div style={{ fontSize: 12, lineHeight: 1.5 }}>{note.mismatch}</div>
            </div>
            <div style={{ background: '#E4F3EA', borderRadius: 10, padding: '9px 11px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fc-rating-green)', marginBottom: 3 }}>RECOMMENDED</div>
              <div style={{ fontSize: 12, lineHeight: 1.5 }}>{note.recommendation}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
