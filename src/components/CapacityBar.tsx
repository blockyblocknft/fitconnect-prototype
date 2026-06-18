import { capacityFill, isNearlyFull } from '../lib/format'
export function CapacityBar({ taken, max }: { taken: number; max: number }) {
  const full = isNearlyFull(taken, max)
  const color = full ? 'var(--fc-coral)' : 'var(--fc-indigo)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{ flex: 1, height: 5, borderRadius: 999, background: 'var(--fc-indigo-tint)', overflow: 'hidden' }}>
        <div data-testid="cap-fill" style={{ width: `${capacityFill(taken, max)}%`, height: '100%', background: color }} />
      </div>
      <span className="fc-tabnum" style={{ fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
        color: full ? 'var(--fc-coral)' : 'var(--fc-muted)' }}>
        {full ? `${taken} / ${max} left` : `${taken} / ${max} spots`}
      </span>
    </div>
  )
}
