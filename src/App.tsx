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
import { HistoryScreen } from './screens/HistoryScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ProfileDetailScreen } from './screens/ProfileDetailScreen'
import { FittiiScreen } from './screens/FittiiScreen'
import { FittiiFeatureScreen } from './screens/FittiiFeatureScreen'
import { TrainerTodayScreen } from './screens/trainer/TrainerTodayScreen'
import { TrainerSessionsScreen } from './screens/trainer/TrainerSessionsScreen'
import { TrainerRosterScreen } from './screens/trainer/TrainerRosterScreen'
import { TrainerCoachScreen } from './screens/trainer/TrainerCoachScreen'
import { TrainerCalendarScreen } from './screens/trainer/TrainerCalendarScreen'
import { TrainerHoursScreen } from './screens/trainer/TrainerHoursScreen'
import { TrainerClientsScreen } from './screens/trainer/TrainerClientsScreen'
import { TrainerClientProfileScreen } from './screens/trainer/TrainerClientProfileScreen'
import { TrainerPaymentsScreen } from './screens/trainer/TrainerPaymentsScreen'
import { TrainerClientChatScreen } from './screens/trainer/TrainerClientChatScreen'
import { CoachChatScreen } from './screens/CoachChatScreen'
import { TrainerMessagesScreen } from './screens/trainer/TrainerMessagesScreen'
import { ClientPaymentsScreen } from './screens/ClientPaymentsScreen'
import { NotificationsScreen } from './screens/NotificationsScreen'

const TAB_SCREENS = new Set(['sessions', 'events', 'booked', 'logMeal', 'fittii', 'trToday', 'trSessions', 'trCoach', 'trCalendar', 'trHours', 'trClients'])
const TITLES: Record<string, string> = {
  sessions: 'Book sessions', events: 'Events', booked: 'Booked', logMeal: 'Log Meal', fittii: 'Fittii Feedback',
  trainer: 'Trainer', checkout: 'Confirm booking', bookingConfirm: 'Booking',
  programDetail: 'Program', profile: 'Profile', history: 'Session history', fittiiFeature: 'Feedback thread', coachChat: 'Coach',
  trToday: 'Today', trSessions: 'Create session', trCoach: 'Coach', trRoster: 'Session roster', trCalendar: 'Calendar', trHours: 'Work hours',
  trClients: 'Clients', trClientProfile: 'Client', trPayments: 'Payments', trClientChat: 'Chat', trMessages: 'Messages', clientPayments: 'Payments & advances', notifications: 'Notifications',
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
    case 'history': body = <HistoryScreen />; break
    case 'profile': body = <ProfileScreen />; break
    case 'profileDetail': body = <ProfileDetailScreen section={cur.params!.section} />; break
    case 'coachChat': body = <CoachChatScreen />; break
    case 'fittii': body = <FittiiScreen />; break
    case 'fittiiFeature': body = <FittiiFeatureScreen moduleId={cur.params!.moduleId} featureId={cur.params!.featureId} />; break
    case 'trToday': body = <TrainerTodayScreen />; break
    case 'trSessions': body = <TrainerSessionsScreen />; break
    case 'trCoach': body = <TrainerCoachScreen />; break
    case 'trHours': body = <TrainerHoursScreen />; break
    case 'trCalendar': body = <TrainerCalendarScreen />; break
    case 'trRoster': body = <TrainerRosterScreen sessionId={cur.params!.id} />; break
    case 'trClients': body = <TrainerClientsScreen />; break
    case 'trClientProfile': body = <TrainerClientProfileScreen clientId={cur.params!.id} />; break
    case 'trPayments': body = <TrainerPaymentsScreen />; break
    case 'trClientChat': body = <TrainerClientChatScreen clientId={cur.params!.id} />; break
    case 'trMessages': body = <TrainerMessagesScreen />; break
    case 'clientPayments': body = <ClientPaymentsScreen />; break
    case 'notifications': body = <NotificationsScreen />; break
  }

  const title = cur.name === 'profileDetail' ? (cur.params?.title ?? 'Settings') : TITLES[cur.name]

  return (
    <PhoneFrame>
      <ContextHeader title={title} back={!isTabRoot} />
      {isTabRoot && <TopTabStrip />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>{body}</div>
      <BottomNav />
    </PhoneFrame>
  )
}

export default function App() {
  return <NavProvider><Shell /></NavProvider>
}
