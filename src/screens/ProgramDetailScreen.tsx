import { useEffect, useState } from 'react'
import { getBooking, cancelBooking, rescheduleSession } from '../data/bookings'
import { assessments, mealLog, mealLogStats } from '../data/progress'
import { useNav } from '../nav/NavContext'
import { SessionItem } from '../components/cards/SessionItem'
import { ProgressStrip } from '../components/booked/ProgressStrip'
import { NextUpHero, focalSession } from '../components/booked/NextUpHero'
import { RescheduleModal } from '../components/RescheduleModal'
import { Icon } from '../components/Icon'

const DISCUSSION = [
  { who: 'Aanand R.', role: 'coach', text: 'Welcome to the cohort 💪 Drop your week-3 wins here!' },
  { who: 'Priya', role: 'member', text: 'Hit a 60kg squat today, thanks coach!' },
  { who: 'Rahul', role: 'member', text: 'Anyone training tomorrow 6pm? Let’s buddy up.' },
]

type Tab = 'schedule' | 'qa' | 'community' | 'assessment' | 'meallog'
const TILES: { key: Tab; label: string; icon: string }[] = [
  { key: 'schedule', label: 'Schedule', icon: 'calendar-event' },
  { key: 'qa', label: 'Q&A', icon: 'message-circle' },
  { key: 'community', label: 'Community', icon: 'users-group' },
  { key: 'assessment', label: 'Assessment', icon: 'camera' },
  { key: 'meallog', label: 'Meal log', icon: 'salad' },
]

export function ProgramDetailScreen({ bookingId, focusSessionId }: { bookingId: string; focusSessionId?: string }) {
  const nav = useNav()
  const [tab, setTab] = useState<Tab>('schedule')
  const [reschedule, setReschedule] = useState<string | null>(null) // sessionId being rescheduled
  const [qaFor, setQaFor] = useState<string>('')
  const [qaDraft, setQaDraft] = useState('')
  const [chat, setChat] = useState('')
  const [chatSent, setChatSent] = useState('')
  const [qaSent, setQaSent] = useState(false)
  const [, force] = useState(0)
  const b = getBooking(bookingId)

  useEffect(() => {
    if (focusSessionId) document.getElementById(`sess-${focusSessionId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [focusSessionId])

  if (!b) return <div style={{ padding: 16 }}>Not found</div>

  const cancelled = b.status === 'cancelled'
  const focal = focalSession(b)
  const reschedSession = b.sessions.find((s) => s.id === reschedule)

  const onCancel = () => {
    if (window.confirm('Cancel this booking? Free before the 24h cutoff; your advance is refunded.')) {
      cancelBooking(b.id); force((n) => n + 1)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--fc-surface)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 13 }}>
        {cancelled ? (
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', background: '#FCEBEB', borderRadius: 10,
            padding: '9px 11px', marginBottom: 12 }}>
            <Icon name="x" size={14} color="#A32D2D" />
            <div style={{ fontSize: 11, color: '#A32D2D' }}>Booking cancelled — advance refunded.</div>
          </div>
        ) : (
          <>
            <ProgressStrip booking={b} />
            <NextUpHero booking={b} session={focal}
              onJoin={() => window.open(b.meetLink, '_blank')}
              onReschedule={() => focal && setReschedule(focal.id)} />
          </>
        )}

        {/* Section tiles */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 13 }}>
          {TILES.map((t) => {
            const active = tab === t.key
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: active ? 'var(--fc-indigo-tint)' : '#fff', cursor: 'pointer',
                  border: active ? '1.5px solid var(--fc-indigo)' : '0.5px solid rgba(20,20,43,0.14)',
                  borderRadius: 12, padding: '10px 3px' }}>
                <Icon name={t.icon} size={19} color={active ? 'var(--fc-indigo)' : 'var(--fc-muted)'} />
                <span style={{ fontSize: 9.5, fontWeight: active ? 700 : 500, lineHeight: 1.15, textAlign: 'center',
                  color: active ? 'var(--fc-indigo)' : 'var(--fc-ink)' }}>{t.label}</span>
              </button>
            )
          })}
        </div>

        {tab === 'schedule' && b.sessions.map((s) => (
          <div key={s.id} id={`sess-${s.id}`}
            style={focusSessionId === s.id ? { outline: '2px solid var(--fc-indigo)', borderRadius: 14 } : undefined}>
            <SessionItem session={s} discipline={b.discipline} onReschedule={s.when === 'future' && !cancelled ? () => setReschedule(s.id) : undefined} />
          </div>
        ))}

        {tab === 'qa' && (
          <>
            <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 7 }}>Ask your coach about a session</div>
              <select value={qaFor} onChange={(e) => { setQaFor(e.target.value); setQaSent(false) }}
                style={{ width: '100%', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '8px 10px',
                  fontSize: 12, fontFamily: 'var(--fc-font-body)', outline: 'none', background: '#fff', marginBottom: 8 }}>
                <option value="">Select a session…</option>
                {b.sessions.map((s) => <option key={s.id} value={s.id}>Session {s.index} · {s.title}</option>)}
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <input value={qaDraft} onChange={(e) => setQaDraft(e.target.value)} placeholder="Type your question…" disabled={!qaFor}
                  style={{ flex: 1, border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 8, padding: '7px 10px', fontSize: 11, outline: 'none' }} />
                <button onClick={() => { if (qaFor && qaDraft.trim()) { setQaDraft(''); setQaSent(true) } }} disabled={!qaFor || !qaDraft.trim()}
                  style={{ background: qaFor && qaDraft.trim() ? 'var(--fc-indigo)' : 'rgba(90,74,227,0.4)', color: '#fff',
                    border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 11, fontWeight: 600 }}>Send</button>
              </div>
              {qaSent && <div style={{ fontSize: 11, color: 'var(--fc-rating-green)', fontWeight: 600, marginTop: 7 }}>Sent — your coach will reply here.</div>}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fc-muted)', marginBottom: 8 }}>RECENT THREADS</div>
            {b.sessions.filter((s) => s.qa.length > 0).map((s) => (
              <div key={s.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '10px 12px', marginBottom: 8 }}>
                <div className="fc-display" style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Session {s.index} · {s.title}</div>
                {s.qa.map((q, i) => (
                  <div key={i} style={{ fontSize: 11, color: q.author === 'coach' ? 'var(--fc-indigo)' : 'var(--fc-ink)', marginTop: 2 }}>
                    <b style={{ fontWeight: 600 }}>{q.author === 'coach' ? 'Coach' : 'You'}:</b> {q.text}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {tab === 'community' && (
          <>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 10 }}>
              Cohort general discussion — everyone in {b.programName}.
            </div>
            {DISCUSSION.map((m, i) => (
              <div key={i} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '9px 11px', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: m.role === 'coach' ? 'var(--fc-indigo)' : 'var(--fc-ink)' }}>
                  {m.who}{m.role === 'coach' ? ' · coach' : ''}
                </div>
                <div style={{ fontSize: 12, marginTop: 2 }}>{m.text}</div>
              </div>
            ))}
            {chatSent && (
              <div style={{ background: '#F0FAF4', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '9px 11px', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fc-ink)' }}>You</div>
                <div style={{ fontSize: 12, marginTop: 2 }}>{chatSent}</div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
              <input value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Message the cohort…"
                style={{ flex: 1, border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 999, padding: '9px 13px', fontSize: 12, outline: 'none', background: '#fff' }} />
              <button onClick={() => { if (chat.trim()) { setChatSent(chat.trim()); setChat('') } }} aria-label="Send message"
                style={{ background: 'var(--fc-indigo)', border: 'none', borderRadius: '50%', width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="send" size={16} color="#fff" />
              </button>
            </div>
          </>
        )}

        {tab === 'assessment' && (
          <>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 11, lineHeight: 1.5 }}>
              Monthly posture check — your coach compares before / after photos to track correction.
            </div>
            {assessments.map((a) => (
              <div key={a.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
                  <span className="fc-display" style={{ fontSize: 13, fontWeight: 700 }}>{a.label}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--fc-muted)' }}>{a.date}</span>
                </div>
                <div style={{ display: 'flex', gap: 9 }}>
                  {[{ label: 'Before', has: a.hasBefore }, { label: 'After', has: a.hasAfter }].map((ph) => (
                    <div key={ph.label} style={{ flex: 1 }}>
                      <div style={{ aspectRatio: '3 / 4', borderRadius: 11, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 5,
                        background: ph.has ? 'var(--fc-indigo-tint)' : 'var(--fc-surface)',
                        border: ph.has ? 'none' : '1px dashed rgba(20,20,43,0.22)' }}>
                        <Icon name={ph.has ? 'user-scan' : 'camera-plus'} size={26} color={ph.has ? 'var(--fc-indigo)' : 'var(--fc-muted)'} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: ph.has ? 'var(--fc-indigo)' : 'var(--fc-muted)' }}>
                          {ph.has ? ph.label : `Add ${ph.label.toLowerCase()}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--fc-ink)', lineHeight: 1.5, marginTop: 9 }}>{a.note}</div>
              </div>
            ))}
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%',
              background: 'var(--fc-indigo)', color: '#fff', border: 'none', borderRadius: 12, padding: 12, fontSize: 13, fontWeight: 600 }}>
              <Icon name="camera-plus" size={16} color="#fff" /> Add this month’s photos
            </button>
          </>
        )}

        {tab === 'meallog' && (() => {
          const st = mealLogStats()
          return (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[{ v: st.days, l: 'days logged' }, { v: `${st.avg}`, l: 'avg kcal' }, { v: st.notes, l: 'coach notes' }].map((x) => (
                <div key={x.l} style={{ flex: 1, background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
                  <div className="fc-display fc-tabnum" style={{ fontSize: 17, fontWeight: 700, color: 'var(--fc-indigo)' }}>{x.v}</div>
                  <div style={{ fontSize: 9.5, color: 'var(--fc-muted)' }}>{x.l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 11, lineHeight: 1.5 }}>
              Every meal logged through this program, day by day. Your coach reviews each day and leaves a note.
            </div>
            {mealLog.map((d) => (
              <div key={d.id} style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span className="fc-display" style={{ fontSize: 12.5, fontWeight: 700 }}>Day {d.dayNum} · {d.date}</span>
                  <span className="fc-tabnum" style={{ fontSize: 11, color: d.total > d.target ? '#E24B4A' : 'var(--fc-muted)' }}>{d.total} / {d.target} kcal</span>
                </div>
                {d.sessionTitle && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9.5, fontWeight: 600, color: 'var(--fc-indigo)',
                    background: 'var(--fc-indigo-tint)', borderRadius: 999, padding: '2px 8px', marginBottom: 8 }}>
                    <Icon name="barbell" size={11} color="var(--fc-indigo)" /> {d.sessionTitle} session
                  </div>
                )}
                <div style={{ marginTop: d.sessionTitle ? 0 : 6 }}>
                  {d.meals.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, paddingTop: 7,
                      borderTop: i === 0 ? 'none' : '0.5px solid rgba(20,20,43,0.07)', marginTop: i === 0 ? 0 : 7 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12 }}>
                          <span style={{ color: 'var(--fc-muted)' }}>{m.type} · </span><span style={{ fontWeight: 600 }}>{m.name}</span>
                        </div>
                        {m.comment && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--fc-indigo)', marginTop: 2 }}>
                            <Icon name="message-circle" size={11} color="var(--fc-indigo)" /> {m.comment}
                          </div>
                        )}
                      </div>
                      <span className="fc-tabnum" style={{ fontSize: 11.5, fontWeight: 600 }}>{m.cal}</span>
                    </div>
                  ))}
                </div>
                {d.trainerComment ? (
                  <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', background: 'var(--fc-indigo-tint)', borderRadius: 10, padding: '8px 10px', marginTop: 9 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--fc-indigo)', color: '#fff', flex: '0 0 auto',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 700 }}>AR</div>
                    <div style={{ fontSize: 11, color: 'var(--fc-ink)', lineHeight: 1.45 }}>
                      <b style={{ color: 'var(--fc-indigo)', fontWeight: 700 }}>Coach Aanand</b> · {d.trainerComment}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--fc-muted)', marginTop: 9 }}>
                    <Icon name="clock" size={12} color="var(--fc-muted)" /> Awaiting coach’s note
                  </div>
                )}
              </div>
            ))}
          </>
          )
        })()}
      </div>

      <div style={{ padding: '10px 13px', background: '#fff', borderTop: '0.5px solid rgba(20,20,43,0.10)' }}>
        {cancelled ? (
          <button onClick={() => nav.pop()}
            style={{ width: '100%', background: 'var(--fc-surface)', color: 'var(--fc-muted)', border: 'none',
              borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>Back to Booked</button>
        ) : (
          <button onClick={onCancel}
            style={{ width: '100%', background: 'transparent', color: '#A32D2D', border: 'none',
              fontSize: 12, fontWeight: 600 }}>Cancel booking · free before cutoff</button>
        )}
      </div>

      {reschedSession && (
        <RescheduleModal session={reschedSession} onClose={() => setReschedule(null)}
          onPick={(date, time) => { rescheduleSession(b.id, reschedSession.id, date, time); setReschedule(null); force((n) => n + 1) }} />
      )}
    </div>
  )
}
