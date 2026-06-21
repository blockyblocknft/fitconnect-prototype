import { useState } from 'react'
import { getFeature, type FbMessage } from '../data/fittii'
import { Icon } from '../components/Icon'

export function FittiiFeatureScreen({ moduleId, featureId }: { moduleId: string; featureId: string }) {
  const data = getFeature(moduleId, featureId)
  const [messages, setMessages] = useState<FbMessage[]>(() => data?.feature?.messages ?? [])
  const [draft, setDraft] = useState('')
  const [consolidated, setConsolidated] = useState(false)
  const [sent, setSent] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [transcript, setTranscript] = useState(false)

  if (!data || !data.feature) return <div style={{ padding: 16, flex: 1 }}>Thread not found</div>
  const { feature, mod } = data

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((m) => [...m, { id: `me-${Date.now()}`, author: 'You', initial: 'Y', color: 'var(--fc-coral)', time: 'now', text }])
    setDraft('')
  }

  const promptText = feature.aiPrompt + (transcript
    ? '\n\nFrom the Zoom review call (transcribed): the team agreed this is P1 for next sprint; align copy with the in-call wording and ship behind a flag.'
    : '')

  return (
    <div style={{ background: 'var(--fc-surface)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* channel header */}
      <div style={{ padding: '9px 13px', borderBottom: '0.5px solid rgba(20,20,43,0.10)', background: '#fff',
        display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14, color: 'var(--fc-muted)', fontWeight: 700 }}>#</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fc-ink)' }}>{feature.name}</span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fc-green)', marginLeft: 4 }} />
        <span style={{ fontSize: 10, color: 'var(--fc-muted)' }}>5 online</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 600,
          color: 'var(--fc-indigo)', background: 'var(--fc-indigo-tint)', padding: '3px 8px', borderRadius: 999 }}>
          <Icon name="pin" size={11} color="var(--fc-indigo)" /> {mod.label}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 13 }}>
        {/* screenshot + highlight tool */}
        <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 9.5, color: 'var(--fc-muted)', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="camera" size={12} color="var(--fc-muted)" /> Captured: {feature.capture}
          </div>
          <div style={{ position: 'relative', height: 110, borderRadius: 8, overflow: 'hidden', background: 'var(--fc-surface)',
            border: '0.5px solid rgba(20,20,43,0.10)' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#B5B5BE', fontSize: 10 }}>screen capture</div>
            {/* highlighted region */}
            <div style={{ position: 'absolute', top: 22, left: 26, right: 38, height: 42, borderRadius: 6,
              border: '2px dashed var(--fc-indigo)', background: 'rgba(90,74,227,0.10)' }} />
            <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 8.5, fontWeight: 600, color: 'var(--fc-indigo)',
              background: '#fff', padding: '2px 6px', borderRadius: 5, border: '0.5px solid rgba(90,74,227,0.3)' }}>highlighted</div>
          </div>
          <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
            <button style={{ flex: 1, background: 'var(--fc-surface)', color: 'var(--fc-ink)', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 7, padding: '6px 0', fontSize: 10.5, fontWeight: 600 }}>Highlight a region</button>
            <button style={{ flex: 1, background: 'var(--fc-surface)', color: 'var(--fc-ink)', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 7, padding: '6px 0', fontSize: 10.5, fontWeight: 600 }}>Re-capture</button>
          </div>
        </div>

        {/* messages */}
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.color, color: '#fff', flex: '0 0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{msg.initial}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fc-ink)' }}>{msg.author}</span>
                <span style={{ fontSize: 9, color: 'var(--fc-muted)' }}>{msg.time}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--fc-ink)', lineHeight: 1.45, marginTop: 1 }}>{msg.text}</div>
              {msg.reaction && (
                <span style={{ display: 'inline-block', marginTop: 4, fontSize: 10, background: 'var(--fc-surface)',
                  border: '0.5px solid rgba(20,20,43,0.12)', color: 'var(--fc-ink)', padding: '1px 7px', borderRadius: 999 }}>{msg.reaction}</span>
              )}
            </div>
          </div>
        ))}

        {/* Fittii AI consolidation */}
        <div style={{ background: 'var(--fc-indigo-tint)', border: '0.5px solid rgba(90,74,227,0.35)', borderRadius: 12,
          padding: 11, marginTop: 4, marginBottom: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Icon name="sparkles" size={14} color="var(--fc-indigo)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fc-ink)' }}>Fittii AI</span>
            <span style={{ fontSize: 9.5, color: 'var(--fc-muted)' }}>· consolidates this thread into a Claude prompt</span>
          </div>
          {!consolidated ? (
            <button onClick={() => setConsolidated(true)}
              style={{ width: '100%', background: 'var(--fc-indigo)', color: '#fff', border: 'none', borderRadius: 9,
                padding: 9, fontSize: 11, fontWeight: 600 }}>
              Consolidate {messages.length} notes → improvement prompt
            </button>
          ) : (
            <>
              <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 8, padding: 9,
                fontSize: 10, color: 'var(--fc-ink)', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                fontFamily: 'ui-monospace, Menlo, monospace' }}>{promptText}</div>
              <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
                <button style={{ flex: 1, background: '#fff', color: 'var(--fc-ink)', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 8, padding: '7px 0', fontSize: 10.5, fontWeight: 600 }}>Copy</button>
                <button onClick={() => setSent(true)}
                  style={{ flex: 2, background: sent ? '#E4F3EA' : 'var(--fc-green)', color: sent ? 'var(--fc-rating-green)' : '#fff', border: 'none',
                    borderRadius: 8, padding: '7px 0', fontSize: 10.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  {sent ? <><Icon name="circle-check" size={13} color="var(--fc-rating-green)" /> Sent to Claude · queued</> : 'Send to Claude →'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Zoom integration */}
        <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 12, padding: 11, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Icon name="video" size={14} color="#2D6CDF" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fc-ink)' }}>Zoom review call</span>
          </div>
          {!zoom ? (
            <button onClick={() => setZoom(true)}
              style={{ width: '100%', background: '#2D6CDF', color: '#fff', border: 'none', borderRadius: 9, padding: 9, fontSize: 11, fontWeight: 600 }}>
              Connect Zoom (OAuth)
            </button>
          ) : (
            <>
              <div style={{ fontSize: 10, color: 'var(--fc-rating-green)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="circle-check" size={12} color="var(--fc-rating-green)" /> Connected — live calls auto-transcribe.
              </div>
              <button onClick={() => { setTranscript(true); setConsolidated(true) }} disabled={transcript}
                style={{ width: '100%', background: 'var(--fc-surface)', color: transcript ? 'var(--fc-muted)' : 'var(--fc-ink)',
                  border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 9, padding: 9, fontSize: 11, fontWeight: 600 }}>
                {transcript ? 'Transcript added to the prompt ✓' : 'Add meeting transcript → prompt'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* composer */}
      <div style={{ padding: '9px 11px', borderTop: '0.5px solid rgba(20,20,43,0.10)', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--fc-surface)', borderRadius: 10, padding: '8px 11px' }}>
          <Icon name="plus" size={15} color="var(--fc-muted)" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send() }}
            placeholder={`Message #${feature.name}`}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--fc-ink)', fontSize: 11.5,
              fontFamily: 'var(--fc-font-body)' }} />
          <button onClick={send} aria-label="Send" style={{ background: 'transparent', border: 'none', display: 'flex' }}>
            <Icon name="send" size={15} color="var(--fc-indigo)" />
          </button>
        </div>
      </div>
    </div>
  )
}
