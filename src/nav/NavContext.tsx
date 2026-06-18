import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Role } from '../lib/types'

export type ScreenName =
  | 'sessions' | 'trainer' | 'checkout' | 'bookingConfirm'
  | 'events' | 'booked' | 'programDetail' | 'logMeal'
  | 'trainerHub' | 'profile'

export interface Screen { name: ScreenName; params?: Record<string, string> }
export type TabKey = 'sessions' | 'events' | 'booked' | 'logMeal'

const TAB_ROOT: Record<TabKey, ScreenName> = {
  sessions: 'sessions', events: 'events', booked: 'booked', logMeal: 'logMeal',
}

interface NavValue {
  current: Screen
  stack: Screen[]
  activeTab: TabKey
  role: Role
  push: (s: Screen) => void
  pop: () => void
  setTab: (t: TabKey) => void
  goRoot: (name: ScreenName) => void
  setRole: (r: Role) => void
}

const Ctx = createContext<NavValue | null>(null)

export function NavProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Screen[]>([{ name: 'sessions' }])
  const [activeTab, setActiveTab] = useState<TabKey>('sessions')
  const [role, setRole] = useState<Role>('client')

  const value = useMemo<NavValue>(() => ({
    current: stack[stack.length - 1],
    stack,
    activeTab,
    role,
    push: (s) => setStack((prev) => [...prev, s]),
    pop: () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
    setTab: (t) => { setActiveTab(t); setStack([{ name: TAB_ROOT[t] }]) },
    goRoot: (name) => setStack([{ name }]),
    setRole,
  }), [stack, activeTab, role])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useNav(): NavValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useNav must be used within NavProvider')
  return v
}
