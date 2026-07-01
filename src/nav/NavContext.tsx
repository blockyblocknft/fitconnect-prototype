import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Role } from '../lib/types'

export type ScreenName =
  | 'sessions' | 'trainer' | 'checkout' | 'bookingConfirm'
  | 'events' | 'booked' | 'programDetail' | 'logMeal' | 'history'
  | 'profile' | 'profileDetail' | 'fittii' | 'fittiiFeature' | 'coachChat' | 'clientPayments' | 'notifications'
  | 'trToday' | 'trSessions' | 'trCoach' | 'trRoster' | 'trCalendar' | 'trHours'
  | 'trClients' | 'trClientProfile' | 'trPayments' | 'trClientChat' | 'trMessages'

export interface Screen { name: ScreenName; params?: Record<string, string> }
export type TabKey = 'sessions' | 'events' | 'booked' | 'logMeal' | 'fittii' | 'trToday' | 'trSessions' | 'trCoach' | 'trCalendar' | 'trHours' | 'trClients'

const TAB_ROOT: Record<TabKey, ScreenName> = {
  sessions: 'sessions', events: 'events', booked: 'booked', logMeal: 'logMeal', fittii: 'fittii',
  trToday: 'trToday', trSessions: 'trSessions', trCoach: 'trCoach', trCalendar: 'trCalendar', trHours: 'trHours', trClients: 'trClients',
}
const HOME_TAB: Record<Role, TabKey> = { client: 'sessions', trainer: 'trToday' }

interface NavValue {
  current: Screen
  stack: Screen[]
  activeTab: TabKey
  lastTab: TabKey
  role: Role
  push: (s: Screen) => void
  pop: () => void
  setTab: (t: TabKey) => void
  goRoot: (name: ScreenName) => void
  switchRole: (r: Role) => void
}

const Ctx = createContext<NavValue | null>(null)

export function NavProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Screen[]>([{ name: 'sessions' }])
  const [activeTab, setActiveTab] = useState<TabKey>('sessions')
  const [lastTab, setLastTab] = useState<TabKey>('sessions')
  const [role, setRole] = useState<Role>('client')

  const value = useMemo<NavValue>(() => ({
    current: stack[stack.length - 1],
    stack,
    activeTab,
    lastTab,
    role,
    push: (s) => setStack((prev) => [...prev, s]),
    pop: () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
    setTab: (t) => {
      // Remember where we came from so Fittii Feedback can auto-detect the module.
      if (activeTab !== 'fittii' && activeTab !== t) setLastTab(activeTab)
      setActiveTab(t); setStack([{ name: TAB_ROOT[t] }])
    },
    goRoot: (name) => setStack([{ name }]),
    switchRole: (r) => { setRole(r); setActiveTab(HOME_TAB[r]); setLastTab(HOME_TAB[r]); setStack([{ name: TAB_ROOT[HOME_TAB[r]] }]) },
  }), [stack, activeTab, lastTab, role])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useNav(): NavValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useNav must be used within NavProvider')
  return v
}
