// The trainer's bookable window per weekday, indexed by JS getDay() (0 = Sun … 6 = Sat).
// Availability = these hours minus any session already on the calendar that day.
export interface WorkingDay { off: boolean; start: number; end: number } // start/end in minutes from midnight

export const workingHours: WorkingDay[] = [
  { off: true, start: 480, end: 720 },    // Sun — off
  { off: false, start: 360, end: 1200 },  // Mon 6:00 AM – 8:00 PM
  { off: false, start: 360, end: 1200 },  // Tue
  { off: false, start: 360, end: 1200 },  // Wed
  { off: false, start: 360, end: 1200 },  // Thu
  { off: false, start: 360, end: 1200 },  // Fri
  { off: false, start: 480, end: 720 },   // Sat 8:00 AM – 12:00 PM
]

export function setWorkingDay(dow: number, patch: Partial<WorkingDay>) {
  workingHours[dow] = { ...workingHours[dow], ...patch }
}
