import { useEffect, useState, type ReactNode } from 'react'
import { loadContent } from '@/lib/content-store'
import { PageLoader } from '@/components/shared/PageLoader'
import { AbstractVisual } from '@/components/shared/AbstractVisual'

type Status = 'loading' | 'ready' | 'error'

/** Fetches the full content bundle once before rendering `children` — every
 * page and layout component reads through `src/lib/data.ts`, which throws
 * if called before this resolves, so nothing downstream needs its own
 * loading state for read access. */
export function ContentGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    loadContent()
      .then(() => {
        if (!cancelled) setStatus('ready')
      })
      .catch((err) => {
        console.error('Failed to load site content:', err)
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [attempt])

  if (status === 'loading') {
    return <PageLoader />
  }

  if (status === 'error') {
    return (
      <section className="relative flex min-h-screen items-center overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-30">
          <AbstractVisual seed="content-load-error" variant="grid" />
        </div>
        <div className="container-page relative text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-signal">
            Connection Problem
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Couldn't Load the Site
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
            We couldn't reach the database. Check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => setAttempt((a) => a + 1)}
            className="mt-8 rounded-lg bg-signal px-6 py-3 text-sm font-semibold text-white hover:bg-signal/90"
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return <>{children}</>
}
