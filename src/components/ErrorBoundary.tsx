import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-state page-section">
          <div className="container error-state__inner">
            <span className="error-state__icon"><AlertTriangle size={30} /></span>
            <h1>Something went off-road</h1>
            <p>Please refresh the page. Your cart is still saved on this device.</p>
            <button className="button button--primary" onClick={() => window.location.reload()}>
              <RefreshCw size={18} /> Refresh page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
