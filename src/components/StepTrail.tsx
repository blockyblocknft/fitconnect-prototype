import { Icon } from './Icon'
export function StepTrail({ done, total }: { done: number; total: number }) {
  const nodes = Array.from({ length: total }, (_, i) => {
    if (i < done) return 'done' as const
    if (i === done) return 'current' as const
    return 'upcoming' as const
  })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {nodes.map((kind, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {kind === 'done' && <span data-testid="step-done" style={{ width: 16, height: 16, borderRadius: '50%',
            background: 'var(--fc-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={10} color="#fff" /></span>}
          {kind === 'current' && <span data-testid="step-current" style={{ width: 18, height: 18, borderRadius: '50%',
            background: 'var(--fc-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={12} color="#fff" /></span>}
          {kind === 'upcoming' && <span style={{ width: 16, height: 16, borderRadius: '50%',
            border: '2px dashed #C4C4CF', boxSizing: 'border-box' }} />}
          {i < total - 1 && <span style={{ flex: 1, height: 2,
            background: i < done ? 'var(--fc-indigo)' : 'var(--fc-indigo-tint)' }} />}
        </span>
      ))}
    </div>
  )
}
