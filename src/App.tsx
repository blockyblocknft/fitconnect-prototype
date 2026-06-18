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
import { TrainerHubScreen } from './screens/TrainerHubScreen'
import { ProfileScreen } from './screens/ProfileScreen'

const TAB_SCREENS = new Set(['sessions', 'events', 'booked', 'logMeal'])
const TITLES: Record<string, string> = {
  sessions: 'Sessions', events: 'Events', booked: 'Booked', logMeal: 'Log Meal',
  trainer: 'Trainer', checkout: 'Confirm booking', bookingConfirm: 'Booking',
  programDetail: 'Program', trainerHub: 'Your trainers', profile: 'Profile',
}

function Shell() {
  const nav = useNav()
  const cur = nav.current
  const isTabRoot = TAB_SCREENS.has(cur.name)

  let body: React.ReactNode = null
  switch (cur.name) {
    case 'sessions': body = <SessionsScreen />; break
    case 'trainer': body = <TrainerScreen trainerId={cur.params!.id} />; break
    case 'checkout': body = <CheckoutScreen programId={cur.params!.programId} />; break
    case 'bookingConfirm': body = <BookingConfirmScreen />; break
    case 'events': body = <EventsScreen />; break
    case 'booked': body = <BookedScreen />; break
    case 'programDetail': body = <ProgramDetailScreen bookingId={cur.params!.id} />; break
    case 'logMeal': body = <LogMealScreen />; break
    case 'trainerHub': body = <TrainerHubScreen />; break
    case 'profile': body = <ProfileScreen />; break
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
