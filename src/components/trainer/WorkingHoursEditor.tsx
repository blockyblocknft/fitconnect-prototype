import { useState } from 'react'
import { workingHours, setWorkingDay } from '../../data/workingHours'
import { fmtTime } from '../../data/calendar'

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TIMES: number[] = []
for (let t = 300; t <= 1320; t += 30) TIMES.push(t) // 5:00 AM – 10:00 PM

const selStyle: React.CSSProperties = {
  border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 8, padding: '5px 7px',
  fontSize: 11, fontFamily: 'var(--fc-font-body)', background: '#fff', outline: 'none',
}

export function WorkingHoursEditor() {
  const [, force] = useState(0)
  const r = () => force((n) => n + 1)

  return (
    <>
      <div style={{ fontSize: 11, color: 'var(--fc-muted)', marginBottom: 12 }}>
        Clients can only book inside these windows. Days marked off are never bookable.
      </div>
      {workingHours.map((wh, dow) => (
        <div key={dow} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 0',
          borderTop: dow === 0 ? 'none' : '0.5px solid rgba(20,20,43,0.08)' }}>
          <span className="fc-display" style={{ width: 34, fontSize: 12, fontWeight: 600 }}>{DOW[dow]}</span>
          <button onClick={() => { setWorkingDay(dow, { off: !wh.off }); r() }}
            style={{ border: 'none', borderRadius: 7, padding: '4px 9px', fontSize: 10, fontWeight: 600,
              background: wh.off ? 'var(--fc-surface)' : 'var(--fc-green)', color: wh.off ? 'var(--fc-muted)' : '#fff' }}>
            {wh.off ? 'Off' : 'On'}
          </button>
          {wh.off ? (
            <span style={{ flex: 1, fontSize: 11, color: 'var(--fc-muted)' }}>Day off</span>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
              <select value={wh.start} onChange={(e) => { setWorkingDay(dow, { start: +e.target.value }); r() }} style={selStyle}>
                {TIMES.filter((t) => t < wh.end).map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}
              </select>
              <span style={{ fontSize: 11, color: 'var(--fc-muted)' }}>–</span>
              <select value={wh.end} onChange={(e) => { setWorkingDay(dow, { end: +e.target.value }); r() }} style={selStyle}>
                {TIMES.filter((t) => t > wh.start).map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}
              </select>
            </div>
          )}
        </div>
      ))}
    </>
  )
}
