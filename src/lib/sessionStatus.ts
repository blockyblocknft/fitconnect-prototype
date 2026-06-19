import type { SessionStatus } from './types'

// Single source of truth for the unified session-status vocabulary,
// shared by client (SessionItem, schedule chips, history) and trainer (roster).
export const SESSION_STATUS: Record<SessionStatus, { label: string; icon: string; dot: string; fg: string; bg: string }> = {
  confirmed: { label: 'Confirmed', icon: 'clock', dot: 'var(--fc-coral)', fg: 'var(--fc-coral)', bg: 'var(--fc-coral-tint)' },
  attended: { label: 'Attended', icon: 'check', dot: 'var(--fc-green)', fg: 'var(--fc-rating-green)', bg: '#E4F3EA' },
  noshow: { label: 'No-show', icon: 'x', dot: '#E24B4A', fg: '#A32D2D', bg: '#FCEBEB' },
  cancelled: { label: 'Cancelled', icon: 'ban', dot: 'var(--fc-muted)', fg: 'var(--fc-muted)', bg: 'var(--fc-surface)' },
}
