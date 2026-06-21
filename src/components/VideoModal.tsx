import { useState } from 'react'
import { Icon } from './Icon'

// Mock educational-video player for a technique walkthrough.
export function VideoModal({ title, onClose }: { title: string; onClose: () => void }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 70, background: 'rgba(20,20,43,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 13px' }}>
          <span className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none' }}>
            <Icon name="x" size={18} color="var(--fc-muted)" />
          </button>
        </div>
        <button onClick={() => setPlaying((v) => !v)} aria-label={playing ? 'Pause' : 'Play'}
          style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #2A2A40, #14142B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={playing ? 'player-pause' : 'player-play'} size={26} color="var(--fc-indigo)" />
          </span>
          <span style={{ position: 'absolute', bottom: 8, left: 10, right: 10, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.25)' }}>
            <span style={{ display: 'block', width: playing ? '38%' : '0%', height: '100%', borderRadius: 999, background: 'var(--fc-coral)', transition: 'width .4s' }} />
          </span>
        </button>
        <div style={{ padding: '11px 13px' }}>
          <div style={{ fontSize: 11, color: 'var(--fc-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="school" size={13} color="var(--fc-indigo)" /> Technique walkthrough · demo video
          </div>
        </div>
      </div>
    </div>
  )
}
