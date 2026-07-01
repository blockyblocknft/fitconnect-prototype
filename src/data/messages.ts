// Per-client 1:1 chat threads between the coach and a client. Lazily seeded
// with a short starter thread the first time a client's chat is opened.

export interface Message { id: string; from: 'coach' | 'client'; text: string; time: string }

const store = new Map<string, Message[]>()
let _mid = 0

export function messagesFor(clientId: string): Message[] {
  let t = store.get(clientId)
  if (!t) {
    t = [
      { id: `m-${clientId}-1`, from: 'coach', text: 'Hey! Welcome aboard 💪 Ping me here anytime about your plan, form or meals.', time: 'Mon' },
      { id: `m-${clientId}-2`, from: 'client', text: 'Thanks coach — excited to get started!', time: 'Mon' },
    ]
    store.set(clientId, t)
  }
  return t
}

export function sendMessage(clientId: string, text: string, from: 'coach' | 'client' = 'coach') {
  const t = messagesFor(clientId)
  t.push({ id: `m-${++_mid}`, from, text, time: 'Now' })
}

export const lastMessage = (clientId: string) => {
  const t = store.get(clientId)
  return t && t.length ? t[t.length - 1] : undefined
}

export const hasThread = (clientId: string) => store.has(clientId)
// "Unread" for the coach = the client sent the most recent message.
export const unread = (clientId: string) => { const l = lastMessage(clientId); return !!l && l.from === 'client' }
export const waitingReplies = () => [...store.keys()].filter(unread)

// Pre-seed a few threads with a pending client message so the coach sees who's
// waiting without opening each chat first.
function seed(clientId: string, msgs: Omit<Message, 'id'>[]) {
  if (!store.has(clientId)) store.set(clientId, msgs.map((m, i) => ({ id: `s-${clientId}-${i}`, ...m })))
}
seed('cl3', [
  { from: 'coach', text: 'How did the intervals feel today?', time: 'Tue' },
  { from: 'client', text: 'Tough! My knee ached a bit on the landings.', time: 'Tue' },
])
seed('cl7', [{ from: 'client', text: 'Hi coach — can I swap Thursday for Friday this week?', time: 'Wed' }])
seed('cl10', [{ from: 'client', text: 'Not able to log meals lately, travelling 🙏', time: 'Mon' }])
