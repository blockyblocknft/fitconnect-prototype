export function SegmentedToggle<T extends string>(
  { options, value, onChange }:
  { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }
) {
  return (
    <div style={{ display: 'flex', background: 'var(--fc-indigo-tint)', borderRadius: 999, padding: 3 }}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button key={o.value} aria-pressed={active} onClick={() => onChange(o.value)}
            style={{ flex: 1, padding: 7, borderRadius: 999, border: 'none', fontSize: 12, fontWeight: 600,
              background: active ? 'var(--fc-indigo)' : 'transparent', color: active ? '#fff' : '#55555f' }}>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
