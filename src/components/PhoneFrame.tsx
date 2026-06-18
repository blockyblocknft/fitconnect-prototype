import type { ReactNode } from 'react'
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 16 }}>
      <div style={{ width: 360, background: 'var(--fc-white)', borderRadius: 24, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', minHeight: 760, boxShadow: '0 8px 40px rgba(20,20,43,0.12)' }}>
        {children}
      </div>
    </div>
  )
}
