import { NavProvider, useNav } from './nav/NavContext'
import { PhoneFrame } from './components/PhoneFrame'
import { ContextHeader } from './components/ContextHeader'
import { TopTabStrip } from './components/TopTabStrip'
import { BottomNav } from './components/BottomNav'
import { SessionsScreen } from './screens/SessionsScreen'
import { TrainerScreen } from './screens/TrainerScreen'
import { CheckoutScreen } from './screens/CheckoutScreen'
import { BookingConfirmScreen } from './screens/BookingConfirmScreen'
import { EventsScreen } from './screens/EventsScreen'
import { BookedScreen } from './screens/BookedScreen'
import { ProgramDetailScreen } from './screens/ProgramDetailScreen'
import { LogMealScreen } from './screens/LogMealScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { TrainerTodayScreen } from './screens/trainer/TrainerTodayScreen'
import { TrainerSessionsScreen } from './screens/trainer/TrainerSessionsScreen'
import { TrainerRosterScreen } from './screens/trainer/TrainerRosterScreen'
import { TrainerClientsScreen } from './screens/trainer/TrainerClientsScreen'

const TAB_SCREENS = new Set(['sessions', 'events', 'booked', 'logMeal', 'trToday', 'trSessions', 'trClients'])
const TITLES: Record<string, string> = {
  sessions: 'Sessions', events: 'Events', booked: 'Booked', logMeal: 'Log Meal',
  trainer: 'Trainer', checkout: 'Confirm booking', bookingConfirm: 'Booking',
  programDetail: 'Program', profile: 'Profile',
  trToday: 'Today', trSessions: 'Sessions', trClients: 'Clients', trRoster: 'Session roster',
}

function Shell() {
  const nav = useNav()
  const cur = nav.current
  const isTabRoot = TAB_SCREENS.has(cur.name)

  let body: React.ReactNode = null
  switch (cur.name) {
    case 'sessions': body = <SessionsScreen />; break
    case 'trainer': body = <TrainerScreen trainerId={cur.params!.id} mode={cur.params?.mode as '1to1' | 'group' | undefined} />; break
    case 'checkout': body = <CheckoutScreen programId={cur.params!.programId} />; break
    case 'bookingConfirm': body = <BookingConfirmScreen />; break
    case 'events': body = <EventsScreen />; break
    case 'booked': body = <BookedScreen />; break
    case 'programDetail': body = <ProgramDetailScreen bookingId={cur.params!.id} focusSessionId={cur.params?.sessionId} />; break
    case 'logMeal': body = <LogMealScreen />; break
    case 'profile': body = <ProfileScreen />; break
    case 'trToday': body = <TrainerTodayScreen />; break
    case 'trSessions': body = <TrainerSessionsScreen />; break
    case 'trClients': body = <TrainerClientsScreen />; break
    case 'trRoster': body = <TrainerRosterScreen sessionId={cur.params!.id} />; break
  }

  return (
    <PhoneFrame>
      <ContextHeader title={TITLES[cur.name]} back={!isTabRoot} />
      {isTabRoot && <TopTabStrip />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>{body}</div>
      <BottomNav />
    </PhoneFrame>
  )
}

export default function App() {
  return <NavProvider><Shell /></NavProvider>
}
