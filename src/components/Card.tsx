import type { CSSProperties, ReactNode } from 'react'
export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ background: 'var(--fc-white)', border: '0.5px solid rgba(20,20,43,0.12)',
    borderRadius: 'var(--fc-r-card)', padding: '13px', ...style }}>{children}</div>
}
