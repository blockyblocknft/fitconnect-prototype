// The signed-in user's editable profile. Shared by the Profile header and the
// editable Account / Goals detail screens.
export interface UserProfile {
  name: string
  email: string
  phone: string
  city: string
  goal: string
  calories: number
  weeklySessions: number
}

export const profile: UserProfile = {
  name: 'Prabu S.',
  email: 'psprabu5990@gmail.com',
  phone: '+91 88700 88424',
  city: 'Bengaluru, India',
  goal: 'Strength + fat loss',
  calories: 1800,
  weeklySessions: 4,
}

export function updateProfile(patch: Partial<UserProfile>) {
  Object.assign(profile, patch)
}

export const initials = (name: string) =>
  name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
