export function CalorieRing({ eaten, goal }: { eaten: number; goal: number }) {
  return (
    <div style={{ width: 72, height: 72, borderRadius: '50%', border: '5px solid var(--fc-indigo)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
      <div className="fc-display fc-tabnum" style={{ fontSize: 16, fontWeight: 700 }}>{eaten}</div>
      <div style={{ fontSize: 9, color: 'var(--fc-muted)' }}>/ {goal} cal</div>
    </div>
  )
}
