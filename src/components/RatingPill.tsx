import { Icon } from './Icon'
export function RatingPill({ rating }: { rating: number }) {
  return <span className="fc-tabnum" style={{ display: 'inline-flex', alignItems: 'center', gap: 2,
    background: 'var(--fc-rating-green)', color: '#fff', fontSize: 11, fontWeight: 600,
    padding: '2px 6px', borderRadius: 6 }}>
    <Icon name="star" size={10} color="#fff" />{rating}
  </span>
}
