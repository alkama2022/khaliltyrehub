import { ArrowLeft, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="not-found page-section">
      <div className="container not-found__inner">
        <span><SearchX size={38} /></span>
        <strong className="not-found__code">404</strong>
        <h1>This road ends here</h1>
        <p>The page you’re looking for doesn’t exist or may have moved.</p>
        <div><Link to="/" className="button button--dark"><ArrowLeft size={18} /> Back home</Link><Link to="/shop" className="button button--outline">Shop tyres</Link></div>
      </div>
    </section>
  )
}
