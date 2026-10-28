import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { LinkButton } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Catches render errors below it so one broken section cannot blank the whole
 * site. The visitor gets a usable page with a route out, and the error is logged
 * to the console for diagnosis rather than swallowed.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error:', error, info.componentStack)
  }

  override render() {
    if (!this.state.error) return this.props.children

    return (
      <Container width="prose" className="py-[var(--section-y)]">
        <p className="label mb-5">Something went wrong</p>
        <h1 className="mb-5 text-[length:var(--text-h1)]">This page failed to load.</h1>
        <p className="mb-8 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
          The error has been logged. You can return to the homepage, or contact us
          directly and we will help.
        </p>
        <div className="flex flex-wrap gap-3">
          <LinkButton to="/">Back to homepage</LinkButton>
          <LinkButton to="/contact" variant="secondary">
            Contact us
          </LinkButton>
        </div>
      </Container>
    )
  }
}
