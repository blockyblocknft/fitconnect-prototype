import { useState } from 'react'
import type { SessionType } from '../lib/types'
import { trainers } from '../data/trainers'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { TrainerCard } from '../components/cards/TrainerCard'
import { CapacityBar } from '../components/CapacityBar'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'

export function SessionsScreen() {
  const [mode, setMode] = useState<SessionType>('1to1')
  const list = trainers.filter((t) => t.type.includes(mode))
  return (
    <div style={{ padding: '12px 14px', background: 'var(--fc-surface)', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff',
        border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 11, padding: '9px 11px', marginBottom: 12 }}>
        <Icon name="search" size={16} color="var(--fc-muted)" />
        <span style={{ fontSize: 12, color: '#A0A0A8' }}>Search trainers, programs</span>
      </div>
      <SegmentedToggle options={[{ value: '1to1', label: '1-to-1' }, { value: 'group', label: 'Group' }]}
        value={mode} onChange={setMode} />
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', margin: '12px 0 13px' }}>
        {['Filter', 'Near me', 'Online', 'International'].map((c) => (
          <span key={c} style={{ flex: '0 0 auto', fontSize: 11, fontWeight: 500, color: '#55555f',
            border: '0.5px solid rgba(20,20,43,0.18)', borderRadius: 999, padding: '5px 11px', background: '#fff' }}>{c}</span>
        ))}
      </div>
      {mode === '1to1'
        ? list.map((t) => <TrainerCard key={t.id} trainer={t} />)
        : list.map((t) => (
          <div key={t.id} style={{ marginBottom: 14 }}>
            <TrainerCard trainer={t} />
            {t.groupSessions.map((g) => (
              <div key={g.id} style={{ border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 14,
                padding: '11px 12px', background: '#fff', marginTop: -4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="fc-display" style={{ fontSize: 13, fontWeight: 600 }}>{g.title}</div>
                  <div className="fc-display fc-tabnum" style={{ fontSize: 13, fontWeight: 700 }}>{g.priceLabel}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fc-muted)', margin: '4px 0 9px' }}>{g.scheduleLabel} · {g.placeLabel}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ flex: 1 }}><CapacityBar taken={g.spotsTaken} max={g.spotsMax} /></div>
                  <Button style={{ padding: '8px 16px', fontSize: 12 }}>Book</Button>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  )
}
