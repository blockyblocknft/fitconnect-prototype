import { useState } from 'react'
import type { NutritionStatus } from '../../data/trainerView'
import { STATUS_LABEL, type CoachPost } from '../../data/trainerView'
import { coachPrograms, type CoachClient, type CoachSession } from '../../data/coach'
import { mealDay } from '../../data/meal'
import { mealLogFor, setDayComment } from '../../data/progress'
import { SegmentedToggle } from '../../components/SegmentedToggle'
import { Icon } from '../../components/Icon'

type Tab = 'nutrition' | 'qa' | 'community'
type MealLike = { type: string; name: string; cal: number; comment?: string; trainerComment?: string }

// For the live client, nutrition comes from the same log they keep in the client app.
const liveCals = () => mealDay.meals.reduce((n, m) => n + m.cal, 0)
const statusOf = (c: CoachClient): NutritionStatus => {
  if (!c.live) return c.status
  if (mealDay.meals.length === 0) return 'nolog'
  const cals = liveCals(), goal = mealDay.targets.calories
  return cals > goal * 1.05 ? 'over' : cals < goal * 0.6 ? 'partial' : 'ontrack'
}
const behind = (c: CoachClient) => { const s = statusOf(c); return s === 'nolog' || s === 'partial' }

export function TrainerCoachScreen() {
  const [mode, setMode] = useState<'grid' | 'detail'>('grid')
  const [progId, setProgId] = useState(coachPrograms[0].id)
  const [tab, setTab] = useState<Tab>('nutrition')
  const [query, setQuery] = useState('')
  const [attn, setAttn] = useState(false)
  const [kindFilter, setKindFilter] = useState<'all' | '1to1' | 'group'>('all')
  const [modeFilter, setModeFilter] = useState<'all' | 'online' | 'outdoor'>('all')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  // nutrition
  const [openId, setOpenId] = useState<string | null>(null)
  const [nudged, setNudged] = useState<Record<string, boolean>>({})
  const [mealDrafts, setMealDrafts] = useState<Record<string, string>>({})
  const [, force] = useState(0)
  // q/a
  const [answered, setAnswered] = useState<Record<string, boolean>>({})
  const [qNudged, setQNudged] = useState<Record<string, boolean>>({})
  const [qDrafts, setQDrafts] = useState<Record<string, string>>({})
  // community
  const [communities, setCommunities] = useState<Record<string, CoachPost[]>>(
    () => Object.fromEntries(coachPrograms.map((p) => [p.id, p.community])))
  const [cDraft, setCDraft] = useState('')

  const prog = coachPrograms.find((p) => p.id === progId)!
  const q = query.trim().toLowerCase()
  const allClients = prog.sessions.flatMap((s) => s.clients)
  const totalBehind = allClients.filter(behind).length
  const pending = prog.sessions.flatMap((s) => s.questions).filter((x) => !(answered[x.id] ?? x.answered)).length
  const filtering = !!q || attn

  const matchClient = (c: CoachClient) => (!q || c.name.toLowerCase().includes(q)) && (!attn || behind(c))
  const toggleCollapse = (id: string) => setCollapsed((m) => ({ ...m, [id]: !m[id] }))

  // ── Tile overview: one square per training program ──
  if (mode === 'grid') {
    const tileRow = (icon: string, label: string, value: number, accent?: string) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
        <Icon name={icon} size={13} color={value > 0 && accent ? accent : 'var(--fc-muted)'} />
        <span className="fc-tabnum" style={{ fontSize: 12, fontWeight: 700, color: value > 0 && accent ? accent : 'var(--fc-ink)' }}>{value}</span>
        <span style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{label}</span>
      </div>
    )
    const visible = coachPrograms.filter((p) =>
      (kindFilter === 'all' || p.kind === kindFilter) && (modeFilter === 'all' || p.mode === modeFilter))
    const KIND_OPTS: { key: 'all' | '1to1' | 'group'; label: string }[] = [
      { key: 'all', label: 'All' }, { key: '1to1', label: '1:1' }, { key: 'group', label: 'Group' }]
    const MODE_OPTS: { key: 'all' | 'online' | 'outdoor'; label: string }[] = [
      { key: 'all', label: 'All' }, { key: 'online', label: 'Online' }, { key: 'outdoor', label: 'Outdoor' }]
    const seg = <T extends string>(opts: { key: T; label: string }[], val: T, set: (v: T) => void) => (
      <div style={{ display: 'inline-flex', background: '#fff', border: '0.5px solid rgba(20,20,43,0.14)', borderRadius: 999, padding: 3 }}>
        {opts.map((o) => {
          const on = val === o.key
          return (
            <button key={o.key} onClick={() => set(o.key)}
              style={{ border: 'none', borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: on ? 'var(--fc-indigo)' : 'transparent', color: on ? '#fff' : 'var(--fc-muted)' }}>{o.label}</button>
          )
        })}
      </div>
    )
    return (
      <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
        <div className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>Your programs</div>
        <div style={{ fontSize: 11, color: 'var(--fc-muted)', margin: '2px 0 11px' }}>Tap a program to coach its nutrition, Q/A &amp; community.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 13 }}>
          {seg(KIND_OPTS, kindFilter, setKindFilter)}
          {seg(MODE_OPTS, modeFilter, setModeFilter)}
        </div>
        {visible.length === 0
          ? <div style={{ fontSize: 12, color: 'var(--fc-muted)', textAlign: 'center', padding: 24 }}>No programs match this filter.</div>
          : <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {visible.map((p) => {
            const clients = p.sessions.flatMap((s) => s.clients)
            const needNudge = clients.filter(behind).length
            const pendingQ = p.sessions.flatMap((s) => s.questions).filter((x) => !x.answered).length
            return (
              <button key={p.id} onClick={() => { setProgId(p.id); setMode('detail') }}
                style={{ textAlign: 'left', background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 13, cursor: 'pointer' }}>
                <div className="fc-display" style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.25 }}>{p.name}</div>
                <div style={{ display: 'flex', gap: 5, margin: '5px 0 2px' }}>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: 'var(--fc-indigo)', background: 'var(--fc-indigo-tint)', padding: '2px 7px', borderRadius: 999 }}>{p.kind === '1to1' ? '1:1' : 'Group'}</span>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: p.mode === 'online' ? 'var(--fc-green)' : '#C2410C',
                    background: p.mode === 'online' ? '#E4F3EA' : '#FBE9DD', padding: '2px 7px', borderRadius: 999 }}>{p.mode === 'online' ? 'Online' : 'Outdoor'}</span>
                </div>
                {tileRow('users-group', 'clients', clients.length)}
                {tileRow('bell', 'need a nudge', needNudge, 'var(--fc-coral)')}
                {tileRow('help-circle', 'pending Q', pendingQ, '#854F0B')}
                {tileRow('message-2', 'posts', p.community.length)}
              </button>
            )
          })}
        </div>}
      </div>
    )
  }

  const sessionHeader = (s: CoachSession, count: number, attnCount: number, suffix: string) => (
    <button onClick={() => toggleCollapse(s.id)}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none',
        padding: '4px 0 8px', cursor: 'pointer', textAlign: 'left' }}>
      <Icon name={collapsed[s.id] ? 'chevron-right' : 'chevron-down'} size={14} color="var(--fc-muted)" />
      <Icon name="barbell" size={13} color="var(--fc-indigo)" />
      <span className="fc-display" style={{ fontSize: 12, fontWeight: 700 }}>{s.title}</span>
      <span style={{ fontSize: 10, color: 'var(--fc-muted)' }}>· {s.time}</span>
      <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--fc-muted)' }}>
        {count}{suffix}{attnCount > 0 && <span style={{ color: 'var(--fc-coral)', fontWeight: 600 }}> · {attnCount}!</span>}
      </span>
    </button>
  )

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <button onClick={() => setMode('grid')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 3, alignSelf: 'flex-start', background: 'transparent',
          border: 'none', color: 'var(--fc-indigo)', fontSize: 11, fontWeight: 600, padding: 0, marginBottom: 9 }}>
        <Icon name="chevron-left" size={14} color="var(--fc-indigo)" /> All programs
      </button>
      {/* program selector */}
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 10 }}>
        {coachPrograms.map((p) => {
          const on = p.id === progId
          return (
            <button key={p.id} onClick={() => { setProgId(p.id); setOpenId(null) }}
              style={{ flex: '0 0 auto', border: 'none', borderRadius: 999, padding: '6px 13px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                background: on ? 'var(--fc-indigo)' : '#fff', color: on ? '#fff' : 'var(--fc-muted)',
                boxShadow: on ? 'none' : 'inset 0 0 0 0.5px rgba(20,20,43,0.14)' }}>{p.name}</button>
          )
        })}
      </div>

      <SegmentedToggle
        options={[{ value: 'nutrition', label: 'Nutrition' }, { value: 'qa', label: 'Q/A' }, { value: 'community', label: 'Community' }]}
        value={tab} onChange={setTab} />

      {tab !== 'community' && (
        <div style={{ marginTop: 11 }}>
          <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 8 }}>
            {tab === 'nutrition'
              ? <><b style={{ color: 'var(--fc-ink)' }}>{allClients.length}</b> clients · <b style={{ color: totalBehind ? 'var(--fc-coral)' : 'var(--fc-ink)' }}>{totalBehind}</b> need a nudge</>
              : <><b style={{ color: pending ? '#854F0B' : 'var(--fc-ink)' }}>{pending}</b> pending questions</>}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, background: '#fff', borderRadius: 9,
              border: '0.5px solid rgba(20,20,43,0.12)', padding: '7px 10px' }}>
              <Icon name="search" size={13} color="var(--fc-muted)" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search client…"
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 11.5, fontFamily: 'var(--fc-font-body)' }} />
            </div>
            <button onClick={() => setAttn((v) => !v)}
              style={{ flex: '0 0 auto', border: 'none', borderRadius: 999, padding: '7px 13px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                background: attn ? 'var(--fc-coral)' : '#fff', color: attn ? '#fff' : 'var(--fc-muted)',
                boxShadow: attn ? 'none' : 'inset 0 0 0 0.5px rgba(20,20,43,0.14)' }}>Needs attention</button>
          </div>
        </div>
      )}

      <div style={{ height: 12 }} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* NUTRITION */}
        {tab === 'nutrition' && prog.sessions.map((s) => {
          const cls = s.clients.filter(matchClient)
          if (filtering && cls.length === 0) return null
          const attnCount = s.clients.filter(behind).length
          return (
            <div key={s.id} style={{ marginBottom: 12 }}>
              {sessionHeader(s, s.clients.length, attnCount, ' clients')}
              {!collapsed[s.id] && cls.map((c) => {
                const status = statusOf(c)
                const st = STATUS_LABEL[status]
                const expanded = openId === c.id
                const cals = c.live ? liveCals() : c.calories
                const goal = c.live ? mealDay.targets.calories : c.goal
                const rawMeals = (c.live ? mealDay.meals : c.meals) as MealLike[]
                const pct = goal > 0 ? Math.min(100, Math.round((cals / goal) * 100)) : 0
                const isNudged = nudged[c.id]
                return (
                  <div key={c.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 9 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div role="button" tabIndex={0} onClick={() => setOpenId(expanded ? null : c.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenId(expanded ? null : c.id) } }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', minWidth: 0 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--fc-coral)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{c.initials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span className="fc-display" style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</span>
                            <span style={{ fontSize: 8.5, fontWeight: 600, color: st.fg, background: st.bg, padding: '2px 6px', borderRadius: 999 }}>{st.label}</span>
                            {c.live && <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--fc-rating-green)', background: '#E4F3EA', padding: '2px 6px', borderRadius: 999 }}>● LIVE</span>}
                          </div>
                          <div style={{ fontSize: 10.5, color: 'var(--fc-muted)', marginTop: 1 }} className="fc-tabnum">{cals} / {goal} kcal · {rawMeals.length} meals</div>
                        </div>
                      </div>
                      <button onClick={() => setNudged((n) => ({ ...n, [c.id]: true }))} disabled={isNudged}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', borderRadius: 8, padding: '6px 9px',
                          fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
                          background: isNudged ? 'var(--fc-surface)' : behind(c) ? 'var(--fc-coral)' : 'var(--fc-indigo-tint)',
                          color: isNudged ? 'var(--fc-rating-green)' : behind(c) ? '#fff' : 'var(--fc-indigo)' }}>
                        <Icon name={isNudged ? 'check' : 'bell'} size={12} color={isNudged ? 'var(--fc-rating-green)' : behind(c) ? '#fff' : 'var(--fc-indigo)'} />
                        {isNudged ? 'Nudged' : 'Nudge'}
                      </button>
                    </div>
                    <div style={{ height: 5, borderRadius: 999, background: 'var(--fc-surface)', overflow: 'hidden', marginTop: 8 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: status === 'over' ? '#E24B4A' : 'var(--fc-green)' }} />
                    </div>
                    {expanded && (() => {
                      const log = mealLogFor(c.name)
                      const noted = log.filter((d) => d.trainerComment).length
                      return (
                        <div style={{ marginTop: 10, borderTop: '0.5px solid rgba(20,20,43,0.08)', paddingTop: 9 }}>
                          <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 8 }}>
                            DAILY MEAL LOG · 30 DAYS · {noted} notes — leave a note per day
                          </div>
                          <div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 2 }}>
                            {log.map((day) => {
                              const key = `${c.id}:${day.id}`
                              const send = () => {
                                const t = (mealDrafts[key] ?? '').trim()
                                if (!t) return
                                setDayComment(c.name, day.id, t); setMealDrafts((d) => ({ ...d, [key]: '' })); force((n) => n + 1)
                              }
                              return (
                                <div key={day.id} style={{ paddingBottom: 9, marginBottom: 9, borderBottom: '0.5px solid rgba(20,20,43,0.07)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11.5, fontWeight: 600 }}>
                                      Day {day.dayNum} · {day.date}{day.sessionTitle ? <span style={{ color: 'var(--fc-indigo)' }}> · {day.sessionTitle}</span> : ''}
                                    </span>
                                    <span className="fc-tabnum" style={{ fontSize: 10.5, color: day.total > day.target ? '#E24B4A' : 'var(--fc-muted)' }}>{day.total}/{day.target}</span>
                                  </div>
                                  <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginTop: 2 }}>{day.meals.map((m) => m.name).join(' · ')}</div>
                                  {day.trainerComment && <div style={{ fontSize: 10.5, color: 'var(--fc-indigo)', marginTop: 4 }}><b style={{ fontWeight: 600 }}>You:</b> {day.trainerComment}</div>}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--fc-surface)', borderRadius: 9, padding: '4px 9px', marginTop: 5 }}>
                                    <Icon name="message-dots" size={12} color="var(--fc-muted)" />
                                    <input value={mealDrafts[key] ?? ''} onChange={(e) => setMealDrafts((d) => ({ ...d, [key]: e.target.value }))}
                                      onKeyDown={(e) => { if (e.key === 'Enter') send() }} placeholder={day.trainerComment ? 'Edit day note…' : 'Add a note for this day…'}
                                      style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 10.5, fontFamily: 'var(--fc-font-body)', padding: '3px 0' }} />
                                    <button onClick={send} aria-label="Send day note" style={{ background: 'transparent', border: 'none', display: 'flex' }}>
                                      <Icon name="send" size={13} color="var(--fc-indigo)" />
                                    </button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )
              })}
            </div>
          )
        })}

        {/* Q/A */}
        {tab === 'qa' && prog.sessions.map((s) => {
          const qs = s.questions.filter((qq) => (!q || qq.client.toLowerCase().includes(q)) && (!attn || !(answered[qq.id] ?? qq.answered)))
          if (filtering && qs.length === 0) return null
          const pendingCount = s.questions.filter((x) => !(answered[x.id] ?? x.answered)).length
          return (
            <div key={s.id} style={{ marginBottom: 12 }}>
              {sessionHeader(s, s.questions.length, pendingCount, ' Qs')}
              {!collapsed[s.id] && (qs.length === 0
                ? <div style={{ fontSize: 11, color: 'var(--fc-muted)', padding: '2px 2px 6px' }}>No open questions.</div>
                : qs.map((qq) => {
                  const isAns = answered[qq.id] ?? qq.answered
                  const send = () => {
                    if (!(qDrafts[qq.id] ?? '').trim()) return
                    setAnswered((a) => ({ ...a, [qq.id]: true })); setQDrafts((d) => ({ ...d, [qq.id]: '' }))
                  }
                  return (
                    <div key={qq.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 9 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 600 }}>{qq.initials}</div>
                        <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{qq.client}</span>
                        <span style={{ fontSize: 8.5, fontWeight: 600, color: isAns ? 'var(--fc-rating-green)' : '#854F0B',
                          background: isAns ? '#E4F3EA' : '#FAEEDA', padding: '2px 8px', borderRadius: 999 }}>{isAns ? 'Answered' : 'Pending'}</span>
                      </div>
                      <div style={{ fontSize: 11.5, margin: '7px 0', lineHeight: 1.4 }}>“{qq.question}”</div>
                      {!isAns && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, background: 'var(--fc-surface)', borderRadius: 9, padding: '5px 9px' }}>
                            <input value={qDrafts[qq.id] ?? ''} onChange={(e) => setQDrafts((d) => ({ ...d, [qq.id]: e.target.value }))}
                              onKeyDown={(e) => { if (e.key === 'Enter') send() }} placeholder="Reply…"
                              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 10.5, fontFamily: 'var(--fc-font-body)', padding: '3px 0' }} />
                            <button onClick={send} aria-label="Send reply" style={{ background: 'transparent', border: 'none', display: 'flex' }}>
                              <Icon name="send" size={13} color="var(--fc-indigo)" />
                            </button>
                          </div>
                          <button onClick={() => setQNudged((n) => ({ ...n, [qq.id]: true }))} disabled={qNudged[qq.id]}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', borderRadius: 8, padding: '7px 10px',
                              fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
                              background: qNudged[qq.id] ? 'var(--fc-surface)' : 'var(--fc-indigo-tint)', color: qNudged[qq.id] ? 'var(--fc-rating-green)' : 'var(--fc-indigo)' }}>
                            <Icon name={qNudged[qq.id] ? 'check' : 'bell'} size={12} color={qNudged[qq.id] ? 'var(--fc-rating-green)' : 'var(--fc-indigo)'} />
                            {qNudged[qq.id] ? 'Nudged' : 'Nudge'}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                }))}
            </div>
          )
        })}

        {/* COMMUNITY */}
        {tab === 'community' && (
          <>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 10 }}>{prog.name} cohort — post updates to everyone in this program.</div>
            {communities[progId].map((m) => (
              <div key={m.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '9px 11px', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: m.coach ? 'var(--fc-indigo)' : 'var(--fc-ink)' }}>{m.author}{m.coach ? ' · coach' : ''}</div>
                <div style={{ fontSize: 12, marginTop: 2 }}>{m.text}</div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 10, padding: '7px 11px', marginTop: 4 }}>
              <input value={cDraft} onChange={(e) => setCDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && cDraft.trim()) { setCommunities((cm) => ({ ...cm, [progId]: [...cm[progId], { id: `c-${Date.now()}`, author: 'You', initials: 'AR', coach: true, text: cDraft.trim() }] })); setCDraft('') } }}
                placeholder={`Post to ${prog.name}…`}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 12, fontFamily: 'var(--fc-font-body)' }} />
              <button aria-label="Post"
                onClick={() => { if (!cDraft.trim()) return; setCommunities((cm) => ({ ...cm, [progId]: [...cm[progId], { id: `c-${Date.now()}`, author: 'You', initials: 'AR', coach: true, text: cDraft.trim() }] })); setCDraft('') }}
                style={{ background: 'transparent', border: 'none', display: 'flex' }}>
                <Icon name="send" size={15} color="var(--fc-indigo)" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
