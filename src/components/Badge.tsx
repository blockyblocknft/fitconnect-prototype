import type { ReactNode } from 'react'
type Tone = 'indigo' | 'coral' | 'green' | 'neutral'
const tones: Record<Tone, { bg: string; fg: string }> = {
  indigo: { bg: 'var(--fc-indigo-tint)', fg: 'var(--fc-indigo)' },
  coral: { bg: 'var(--fc-coral-tint)', fg: 'var(--fc-coral)' },
  green: { bg: '#E4F3EA', fg: 'var(--fc-rating-green)' },
  neutral: { bg: 'var(--fc-surface)', fg: 'var(--fc-muted)' },
}
export function Badge({ tone = 'indigo', children }: { tone?: Tone; children: ReactNode }) {
  const t = tones[tone]
  return <span style={{ background: t.bg, color: t.fg, fontSize: 10, fontWeight: 600,
    padding: '3px 9px', borderRadius: 'var(--fc-r-pill)' }}>{children}</span>
}
