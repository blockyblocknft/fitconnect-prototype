import type { ReactNode } from 'react'
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <div style={{ position: 'relative', width: 360, height: 760, maxHeight: '100%', background: 'var(--fc-white)', borderRadius: 24,
        overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(20,20,43,0.12)' }}>
        {children}
      </div>
    </div>
  )
}
