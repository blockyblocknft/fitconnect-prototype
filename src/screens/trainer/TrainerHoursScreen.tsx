import { WorkingHoursEditor } from '../../components/trainer/WorkingHoursEditor'

export function TrainerHoursScreen() {
  return (
    <div style={{ padding: 13, background: 'var(--fc-surface)', flex: 1, overflowY: 'auto' }}>
      <div style={{ background: '#fff', border: '0.5px solid rgba(20,20,43,0.12)', borderRadius: 16, padding: 14 }}>
        <div className="fc-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Working hours</div>
        <WorkingHoursEditor />
      </div>
    </div>
  )
}
