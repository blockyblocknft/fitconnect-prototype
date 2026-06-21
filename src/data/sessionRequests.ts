// Custom session requests a client raises directly with a trainer — distinct from
// booking one of the trainer's pre-posted programs. The same store feeds both the
// client's "Booked → Requests" list and the trainer's "Requests" lane on the
// dashboard, so a Confirm/Decline on one side reflects on the other.

export type RequestStatus = 'awaiting' | 'confirmed' | 'declined'

export interface CustomRequest {
  id: string
  client: string
  initials: string
  trainerName: string
  focus: string
  when: string
  mode: 'online' | 'inperson'
  note?: string
  status: RequestStatus
}

// The signed-in client in this prototype.
export const CLIENT = { name: 'Prabu S.', initials: 'PS' }

export const customRequests: CustomRequest[] = [
  { id: 'cr1', client: 'Anu R.', initials: 'AR', trainerName: 'Aanand R.', focus: '1:1 Strength tune-up',
    when: 'Fri · 6:00 PM', mode: 'online', note: 'Want to fix my deadlift setup.', status: 'awaiting' },
  { id: 'cr2', client: 'Vikram T.', initials: 'VT', trainerName: 'Aanand R.', focus: 'Extra HIIT slot',
    when: 'Sat · 6:00 AM', mode: 'inperson', status: 'awaiting' },
]

export function addCustomRequest(r: { trainerName: string; focus: string; when: string; mode: 'online' | 'inperson'; note?: string }) {
  customRequests.unshift({ id: `cr-${Date.now()}`, client: CLIENT.name, initials: CLIENT.initials, status: 'awaiting', ...r })
}
export function resolveCustomRequest(id: string, status: 'confirmed' | 'declined') {
  const r = customRequests.find((x) => x.id === id)
  if (r) r.status = status
}
export function clientRequests() {
  return customRequests.filter((r) => r.client === CLIENT.name)
}

// Trainers a client can address a custom request to.
export const requestableTrainers = ['Aanand R.', 'Sara M.', 'Kiran V.']
