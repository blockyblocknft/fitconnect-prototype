// Small pills shown on every session: 1:1 vs Group (derived from capacity) + the
// delivery mode (Online / In person).
export function SessionTags({ capacity, mode }: { capacity: number; mode: 'online' | 'inperson' }) {
  const kind = capacity <= 1 ? '1:1' : 'Group'
  const online = mode === 'online'
  const pill = (label: string, fg: string, bg: string) => (
    <span style={{ fontSize: 8.5, fontWeight: 700, color: fg, background: bg, padding: '2px 7px', borderRadius: 999 }}>{label}</span>
  )
  return (
    <span style={{ display: 'inline-flex', gap: 5, flexWrap: 'wrap' }}>
      {pill(kind, 'var(--fc-indigo)', 'var(--fc-indigo-tint)')}
      {pill(online ? 'Online' : 'In person', online ? 'var(--fc-rating-green)' : '#A32D2D', online ? '#E4F3EA' : '#FCEBEB')}
    </span>
  )
}
