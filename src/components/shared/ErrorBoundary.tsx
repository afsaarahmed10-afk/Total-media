import { Component, type ReactNode } from 'react'
import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/button'
import { AbstractVisual } from '@/components/shared/AbstractVisual'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/** Closest equivalent to a server-rendered 500 page a static, client-only
 * SPA can offer: without this, an uncaught render error anywhere in the
 * route tree unmounts everything and leaves a blank white page — for both
 * visitors and crawlers. Deliberately outside <Suspense>/<Routes> scope
 * (mounted around them in App.tsx) so a crash in one route doesn't take
 * out this boundary itself. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Unhandled render error:', error)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <>
        <Seo
          title="Something went wrong"
          description="An unexpected error occurred while loading this page."
          path="/error"
          noindex
        />
        <section className="relative flex min-h-screen items-center overflow-hidden bg-navy text-white">
          <div className="absolute inset-0 opacity-30">
            <AbstractVisual seed="error-boundary" variant="grid" />
          </div>
          <div className="container-page relative text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-signal">Error</p>
            <h1 className="mt-3 text-5xl font-extrabold tracking-tight sm:text-6xl">
              Something went wrong
            </h1>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="bg-signal text-white hover:bg-signal/90"
                onClick={() => window.location.assign('/')}
              >
                Back to Home
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </section>
      </>
    )
  }
}
