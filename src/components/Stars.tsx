import { Star } from 'lucide-react'

interface StarsProps {
  rating: number
  size?: number
  showValue?: boolean
}

export function Stars({ rating, size = 15, showValue = false }: StarsProps) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      <span className="stars__icons" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            strokeWidth={2}
            className={star <= Math.round(rating) ? 'is-filled' : ''}
          />
        ))}
      </span>
      {showValue && <strong>{rating.toFixed(1)}</strong>}
    </span>
  )
}
