import { Link } from 'react-router-dom'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className={`logo ${light ? 'logo--light' : ''}`}
      aria-label="Treadly home"
    >
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 42 42" role="img">
          <circle cx="21" cy="21" r="17" fill="none" stroke="currentColor" strokeWidth="5" />
          <circle cx="21" cy="21" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M21 4v10M21 28v10M4 21h10M28 21h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>
      <span className="logo__word">TREADLY</span>
    </Link>
  )
}
