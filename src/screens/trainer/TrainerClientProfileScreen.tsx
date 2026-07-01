import { useState } from 'react'
import { useNav } from '../../nav/NavContext'
import { getClient, clientDue, attendancePct, markFullyPaid, setClientNote } from '../../data/clients'
import { sendMessage } from '../../data/messages'
import { STATUS_LABEL } from '../../data/trainerView'

const nudgeText = (first: string) => `Hi ${first} — checking in! How's training going? Drop today's meals in the log and ping me if anything feels off 🙌`
import { assessments } from '../../data/progress'
import { Icon } from '../../components/Icon'

const rupees = (n: number) => '₹' + n.toLocaleString('en-IN')

export function TrainerClientProfileScreen({ clientId }: { clientId: string }) {
  const nav = useNav()
  const [, force] = useState(0)
  const [noteDraft, setNoteDraft] = useState<string | null>(null)
  const [noteSaved, setNoteSaved] = useState(false)
  const [toast, setToast] = useState('')
  const c = getClient(clientId)
  if (!c) return <div style={{ padding: 16 }}>Client not found</div>

  const due = clientDue(c)
  const st = STATUS_LABEL[c.nutrition]
  const note = noteDraft ?? c.note ?? ''
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  const card: React.CSSProperties = { background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 12, marginBottom: 11 }
  const cardTitle = (icon: string, label: string, right?: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
      <Icon name={icon} size={14} color="var(--fc-indigo)" />
      <span className="fc-display" style={{ fontSize: 12, fontWeight: 700 }}>{label}</span>
      {right && <span style={{ marginLeft: 'auto' }}>{right}</span>}
    </div>
  )

  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={card}>
        <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--fc-indigo)', color: '#fff', flex: '0 0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700 }}>{c.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="fc-display" style={{ fontSize: 16, fontWeight: 700 }}>{c.name}</span>
              {c.live && <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--fc-rating-green)', background: '#E4F3EA', padding: '1px 6px', borderRadius: 999 }}>● LIVE</span>}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginTop: 1 }}>{c.plan}</div>
            <div style={{ fontSize: 10.5, color: 'var(--fc-muted)', marginTop: 2 }}>{c.goal} · {c.kind === '1to1' ? '1:1' : 'Group'} · {c.mode === 'online' ? 'Online' : 'Outdoor'} · since {c.since}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
          <button onClick={() => nav.push({ name: 'trClientChat', params: { id: c.id } })}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'var(--fc-indigo)', color: '#fff',
              border: 'none', borderRadius: 10, padding: '9px 0', fontSize: 12, fontWeight: 600 }}>
            <Icon name="message-circle" size={14} color="#fff" /> Message
          </button>
          <button onClick={() => { sendMessage(c.id, nudgeText(c.name.split(' ')[0]), 'coach'); flash('Nudge sent to chat') }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)',
              border: 'none', borderRadius: 10, padding: '9px 0', fontSize: 12, fontWeight: 600 }}>
            <Icon name="bell" size={14} color="var(--fc-indigo)" /> Nudge
          </button>
          <a href={`tel:${c.phone.replace(/\s/g, '')}`}
            style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--fc-surface)',
              borderRadius: 10, padding: '9px 13px', textDecoration: 'none' }}>
            <Icon name="phone" size={15} color="var(--fc-ink)" />
          </a>
        </div>
      </div>

      {/* Payment */}
      <div style={card}>
        {cardTitle('cash', 'Payment', due > 0
          ? <span style={{ fontSize: 9, fontWeight: 700, color: '#A32D2D', background: '#FCEBEB', padding: '2px 8px', borderRadius: 999 }}>{rupees(due)} due</span>
          : <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--fc-rating-green)', background: '#E4F3EA', padding: '2px 8px', borderRadius: 999 }}>Paid up</span>)}
        <div style={{ display: 'flex', gap: 8 }}>
          {[['Plan fee', c.feeTotal, 'var(--fc-ink)'], ['Paid', c.paid, 'var(--fc-rating-green)'], ['Balance', due, due > 0 ? '#A32D2D' : 'var(--fc-muted)']].map(([l, v, col]) => (
            <div key={l as string} style={{ flex: 1, background: 'var(--fc-surface)', borderRadius: 10, padding: '8px 6px', textAlign: 'center' }}>
              <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700, color: col as string }}>{rupees(v as number)}</div>
              <div style={{ fontSize: 9.5, color: 'var(--fc-muted)' }}>{l as string}</div>
            </div>
          ))}
        </div>
        {due > 0 && (
          <button onClick={() => { markFullyPaid(c.id); force((n) => n + 1); flash('Payment recorded') }}
            style={{ width: '100%', marginTop: 10, background: 'var(--fc-green)', color: '#fff', border: 'none', borderRadius: 10,
              padding: 10, fontSize: 12.5, fontWeight: 600 }}>
            Record {rupees(due)} received
          </button>
        )}
      </div>

      {/* Attendance */}
      <div style={card}>
        {cardTitle('checkbox', 'Attendance', <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fc-indigo)' }}>{attendancePct(c)}%</span>)}
        {c.attendance.map((a, i) => {
          const tone = a.status === 'attended' ? { c: 'var(--fc-rating-green)', t: 'Attended' }
            : a.status === 'noshow' ? { c: '#E24B4A', t: 'No-show' } : { c: 'var(--fc-muted)', t: 'Upcoming' }
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 7,
              borderTop: i === 0 ? 'none' : '0.5px solid rgba(20,20,43,0.07)', marginTop: i === 0 ? 0 : 7 }}>
              <Icon name={a.status === 'attended' ? 'circle-check' : a.status === 'noshow' ? 'circle-x' : 'clock'} size={15} color={tone.c} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{a.session}</div>
                <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{a.date}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: tone.c }}>{tone.t}</span>
            </div>
          )
        })}
      </div>

      {/* Nutrition */}
      <div style={card}>
        {cardTitle('salad', 'Nutrition', <span style={{ fontSize: 9, fontWeight: 600, color: st.fg, background: st.bg, padding: '2px 8px', borderRadius: 999 }}>{st.label}</span>)}
        <div style={{ fontSize: 11.5, color: 'var(--fc-ink)', lineHeight: 1.5 }}>
          {c.live
            ? 'Logging daily — open Coach › Nutrition to review the 30-day log and leave per-day notes.'
            : c.nutrition === 'nolog' ? 'No meals logged recently. A nudge may help.'
            : 'Logging meals. Review and comment from Coach › Nutrition.'}
        </div>
        {c.live && (
          <button onClick={() => nav.setTab('trCoach')}
            style={{ marginTop: 9, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--fc-indigo-tint)', color: 'var(--fc-indigo)',
              border: 'none', borderRadius: 9, padding: '7px 11px', fontSize: 11.5, fontWeight: 600 }}>
            Open in Coach <Icon name="arrow-right" size={13} color="var(--fc-indigo)" />
          </button>
        )}
      </div>

      {/* Assessment */}
      <div style={card}>
        {cardTitle('camera', 'Posture assessment')}
        {c.live ? assessments.map((a) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 9, paddingTop: 8,
            borderTop: a.id === assessments[0].id ? 'none' : '0.5px solid rgba(20,20,43,0.07)', marginTop: a.id === assessments[0].id ? 0 : 8 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[a.hasBefore, a.hasAfter].map((has, i) => (
                <div key={i} style={{ width: 30, height: 38, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: has ? 'var(--fc-indigo-tint)' : 'var(--fc-surface)', border: has ? 'none' : '1px dashed rgba(20,20,43,0.22)' }}>
                  <Icon name={has ? 'user-scan' : 'camera-plus'} size={15} color={has ? 'var(--fc-indigo)' : 'var(--fc-muted)'} />
                </div>
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600 }}>{a.label} · {a.date}</div>
              <div style={{ fontSize: 10, color: 'var(--fc-muted)', lineHeight: 1.4 }}>{a.note}</div>
            </div>
          </div>
        )) : (
          <div style={{ fontSize: 11.5, color: 'var(--fc-muted)' }}>No posture check on file yet — capture a baseline this week.</div>
        )}
      </div>

      {/* Coach note */}
      <div style={card}>
        {cardTitle('notes', 'Private note')}
        <textarea value={note} onChange={(e) => { setNoteDraft(e.target.value); setNoteSaved(false) }}
          placeholder="Injuries, preferences, goals to remember…" rows={3}
          style={{ width: '100%', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '8px 10px', resize: 'vertical',
            fontSize: 12, fontFamily: 'var(--fc-font-body)', outline: 'none', background: 'var(--fc-surface)', boxSizing: 'border-box' }} />
        <button onClick={() => { setClientNote(c.id, note); setNoteSaved(true) }}
          style={{ marginTop: 8, background: 'var(--fc-indigo)', color: '#fff', border: 'none', borderRadius: 9, padding: '8px 14px', fontSize: 12, fontWeight: 600 }}>
          {noteSaved ? 'Saved ✓' : 'Save note'}
        </button>
      </div>

      {toast && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ background: 'var(--fc-ink)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '9px 16px', borderRadius: 999 }}>{toast}</div>
        </div>
      )}
    </div>
  )
}
