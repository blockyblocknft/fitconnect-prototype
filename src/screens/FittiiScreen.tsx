import { useEffect, useRef } from 'react'
import { useNav } from '../nav/NavContext'
import { fbModules, moduleForTab } from '../data/fittii'
import { Icon } from '../components/Icon'

export function FittiiScreen() {
  const nav = useNav()
  const here = moduleForTab(nav.lastTab)
  const modules = fbModules.filter((m) => (m.role ?? 'client') === nav.role)
  const open = (moduleId: string, featureId: string) => nav.push({ name: 'fittiiFeature', params: { moduleId, featureId } })

  // Pressing Fittii from any screen jumps straight into the chat thread for the
  // detected feature (with that screen tagged). Back returns to this browse list.
  const jumped = useRef(false)
  useEffect(() => {
    if (!jumped.current && here && here.features[0]) {
      jumped.current = true
      open(here.id, here.features[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ background: 'var(--fc-surface)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* auto-detected context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 13px',
        background: 'var(--fc-indigo-tint)', borderBottom: '0.5px solid rgba(20,20,43,0.10)' }}>
        <Icon name="current-location" size={13} color="var(--fc-indigo)" />
        <div style={{ fontSize: 10.5, color: 'var(--fc-muted)' }}>
          Auto-detected from your last screen: <b style={{ color: 'var(--fc-indigo)' }}>{here ? here.label : 'BOOK SESSIONS'}</b>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', borderRadius: 9,
          border: '0.5px solid rgba(20,20,43,0.12)', padding: '7px 10px', marginBottom: 14 }}>
          <Icon name="search" size={13} color="var(--fc-muted)" />
          <span style={{ fontSize: 11, color: 'var(--fc-muted)' }}>Search feedback threads</span>
        </div>

        {modules.map((mod) => {
          const active = here?.id === mod.id
          return (
            <div key={mod.id} style={{ marginBottom: 15 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, padding: '0 3px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: active ? 'var(--fc-indigo)' : 'var(--fc-muted)' }}>{mod.label}</span>
                {active && (
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#fff', background: 'var(--fc-indigo)', padding: '1px 6px', borderRadius: 999 }}>YOU’RE HERE</span>
                )}
              </div>
              {mod.features.map((f) => (
                <button key={f.id} onClick={() => open(mod.id, f.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', cursor: 'pointer',
                    background: '#fff', borderRadius: 10, padding: '8px 10px', marginBottom: 6,
                    border: active ? '0.5px solid rgba(90,74,227,0.45)' : '0.5px solid rgba(20,20,43,0.12)',
                    borderLeft: active ? '2.5px solid var(--fc-indigo)' : '0.5px solid rgba(20,20,43,0.12)' }}>
                  <span style={{ fontSize: 14, color: 'var(--fc-muted)', fontWeight: 600, lineHeight: 1 }}>#</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fc-ink)' }}>{f.name}</span>
                    <span style={{ display: 'block', fontSize: 10, color: 'var(--fc-muted)', marginTop: 1 }}>{f.blurb}</span>
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: '#E24B4A',
                    minWidth: 16, textAlign: 'center', padding: '1px 6px', borderRadius: 999 }}>{f.messages.length}</span>
                </button>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
