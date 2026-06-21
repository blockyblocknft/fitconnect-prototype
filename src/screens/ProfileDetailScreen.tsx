import { useState } from 'react'
import { customRequests, type RequestStatus } from '../data/sessionRequests'
import { profile, updateProfile } from '../data/profile'
import { useNav } from '../nav/NavContext'
import { Icon } from '../components/Icon'

const inputStyle: React.CSSProperties = {
  width: '100%', border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 9, padding: '9px 10px',
  fontSize: 13, fontFamily: 'var(--fc-font-body)', outline: 'none', background: '#fff',
}

function EditField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginBottom: 4 }}>{label}</div>
      <input value={value} type={type} inputMode={type === 'number' ? 'numeric' : undefined}
        onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  )
}

const REQ_STATUS: Record<RequestStatus, { label: string; bg: string; fg: string }> = {
  awaiting: { label: 'Awaiting', bg: '#FAEEDA', fg: '#854F0B' },
  confirmed: { label: 'Accepted', bg: '#E4F3EA', fg: 'var(--fc-rating-green)' },
  declined: { label: 'Declined', bg: '#FCEBEB', fg: '#A32D2D' },
}

const card: React.CSSProperties = { background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14, padding: 13, marginBottom: 11 }

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '9px 0', borderTop: '0.5px solid rgba(20,20,43,0.08)' }}>
      <div style={{ fontSize: 10, color: 'var(--fc-muted)' }}>{label}</div>
      <div style={{ fontSize: 13, marginTop: 2 }}>{value}</div>
    </div>
  )
}

function Toggle({ label, on: initial }: { label: string; on?: boolean }) {
  const [on, setOn] = useState(!!initial)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0',
      borderTop: '0.5px solid rgba(20,20,43,0.08)' }}>
      <span style={{ fontSize: 13 }}>{label}</span>
      <button role="switch" aria-checked={on} aria-label={label} onClick={() => setOn((v) => !v)}
        style={{ width: 42, height: 24, borderRadius: 999, border: 'none', position: 'relative', cursor: 'pointer',
          background: on ? 'var(--fc-green)' : 'rgba(20,20,43,0.18)' }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s ease' }} />
      </button>
    </div>
  )
}

function AccountEditor({ kind }: { kind: 'account' | 'goals' }) {
  const nav = useNav()
  const [draft, setDraft] = useState({ ...profile })
  const [saved, setSaved] = useState(false)
  const set = (patch: Partial<typeof draft>) => { setDraft((d) => ({ ...d, ...patch })); setSaved(false) }
  const save = () => {
    updateProfile(kind === 'account'
      ? { name: draft.name, email: draft.email, phone: draft.phone, city: draft.city }
      : { goal: draft.goal, calories: Number(draft.calories) || 0, weeklySessions: Number(draft.weeklySessions) || 0 })
    setSaved(true)
    setTimeout(() => nav.pop(), 500)
  }
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      <div style={card}>
        {kind === 'account' ? (
          <>
            <EditField label="Name" value={draft.name} onChange={(v) => set({ name: v })} />
            <EditField label="Email" value={draft.email} onChange={(v) => set({ email: v })} />
            <EditField label="Phone" value={draft.phone} onChange={(v) => set({ phone: v })} />
            <EditField label="City" value={draft.city} onChange={(v) => set({ city: v })} />
          </>
        ) : (
          <>
            <EditField label="Primary goal" value={draft.goal} onChange={(v) => set({ goal: v })} />
            <EditField label="Daily calories" type="number" value={String(draft.calories)} onChange={(v) => set({ calories: Number(v) as never })} />
            <EditField label="Weekly sessions" type="number" value={String(draft.weeklySessions)} onChange={(v) => set({ weeklySessions: Number(v) as never })} />
          </>
        )}
      </div>
      <button onClick={save}
        style={{ width: '100%', background: saved ? '#E4F3EA' : 'var(--fc-indigo)', color: saved ? 'var(--fc-rating-green)' : '#fff',
          border: 'none', borderRadius: 13, padding: 13, fontSize: 14, fontWeight: 600 }}>
        {saved ? 'Saved ✓' : 'Save changes'}
      </button>
    </div>
  )
}

export function ProfileDetailScreen({ section }: { section: string }) {
  const history = customRequests.filter((r) => r.status !== 'awaiting')

  if (section === 'account' || section === 'goals') return <AccountEditor kind={section} />

  if (section === 'requests') {
    return (
      <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
        {history.length === 0 ? (
          <div style={{ ...card, textAlign: 'center', color: 'var(--fc-muted)', fontSize: 12, borderStyle: 'dashed' }}>
            Accepted or declined session requests appear here.
          </div>
        ) : history.map((r) => {
          const st = REQ_STATUS[r.status]
          return (
            <div key={r.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{r.focus}</div>
                <div style={{ fontSize: 10, color: 'var(--fc-muted)', marginTop: 1 }}>{r.client} · {r.trainerName} · {r.when}</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 600, color: st.fg, background: st.bg, padding: '2px 8px', borderRadius: 999 }}>{st.label}</span>
            </div>
          )
        })}
      </div>
    )
  }

  let body: React.ReactNode
  switch (section) {
    case 'notifications':
      body = (
        <div style={card}>
          <Toggle label="Session reminders" on />
          <Toggle label="Nutrition nudges" on />
          <Toggle label="Community posts" />
          <Toggle label="Promotions" />
        </div>
      ); break
    case 'payments':
      body = (
        <>
          <div style={card}><Field label="Saved card" value="•••• 6411 · Visa" /><Field label="Advances held" value="₹1,800" /></div>
          <div style={{ ...card, fontSize: 12, color: 'var(--fc-muted)' }}>Advances are released to your trainer once they confirm your session.</div>
        </>
      ); break
    case 'payouts':
      body = (
        <>
          <div style={card}><Field label="This month" value="₹42,500" /><Field label="Pending payout" value="₹8,200" /><Field label="Bank" value="HDFC •••• 2231" /></div>
          <div style={{ ...card, fontSize: 12, color: 'var(--fc-muted)' }}>Payouts settle every Monday for the previous week’s confirmed sessions.</div>
        </>
      ); break
    case 'verification':
      body = (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'var(--fc-indigo)' }}>
            <Icon name="rosette-discount-check" size={18} color="var(--fc-indigo)" /> FitConnect Verified
          </div>
          <Field label="ID proof" value="Verified" />
          <Field label="Certification" value="ACE-CPT · Verified" />
        </div>
      ); break
    default:
      body = (
        <div style={{ ...card, textAlign: 'center', color: 'var(--fc-muted)', fontSize: 12, padding: 22 }}>
          This section is coming soon.
        </div>
      )
  }

  return <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>{body}</div>
}
