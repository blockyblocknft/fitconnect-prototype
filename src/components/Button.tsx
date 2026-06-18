import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'energy' | 'secondary'
const styles: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--fc-indigo)', color: '#fff', border: 'none' },
  energy: { background: 'var(--fc-coral)', color: '#fff', border: 'none' },
  secondary: { background: 'var(--fc-white)', color: 'var(--fc-indigo)', border: '1.5px solid var(--fc-indigo)' },
}

export function Button(
  { variant = 'primary', full, children, style, ...rest }:
  { variant?: Variant; full?: boolean; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...rest}
      style={{
        ...styles[variant], borderRadius: 'var(--fc-r-btn)', padding: '10px 18px',
        fontSize: 13, fontWeight: 600, width: full ? '100%' : undefined,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, ...style,
      }}
    >
      {children}
    </button>
  )
}
