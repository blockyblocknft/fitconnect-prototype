import { useState } from 'react'
import type { Discipline } from '../lib/types'
import { WORKOUTS } from '../data/workouts'
import { VideoModal } from './VideoModal'
import { Icon } from './Icon'

// Workout breakdown for a category, with an educational video per block.
export function WorkoutPlan({ discipline }: { discipline: Discipline }) {
  const w = WORKOUTS[discipline]
  const [video, setVideo] = useState<string | null>(null)
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {[w.duration, w.intensity, w.equipment].map((m) => (
          <span key={m} style={{ fontSize: 9, fontWeight: 600, color: 'var(--fc-indigo)', background: 'var(--fc-indigo-tint)', padding: '2px 8px', borderRadius: 999 }}>{m}</span>
        ))}
      </div>
      {w.blocks.map((block) => (
        <div key={block.name} style={{ marginBottom: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <span className="fc-display" style={{ fontSize: 11.5, fontWeight: 700 }}>{block.name}</span>
            <button onClick={() => setVideo(block.name)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', borderRadius: 7, padding: '4px 9px',
                fontSize: 10, fontWeight: 600, background: 'var(--fc-coral-tint)', color: 'var(--fc-coral)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
              <Icon name="player-play" size={12} color="var(--fc-coral)" /> Watch
            </button>
          </div>
          {block.items.map((it) => (
            <div key={it} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11, color: 'var(--fc-ink)', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--fc-green)', flex: '0 0 auto', marginTop: 1 }}>•</span>{it}
            </div>
          ))}
        </div>
      ))}
      {video && <VideoModal title={video} onClose={() => setVideo(null)} />}
    </div>
  )
}
