import { Link } from 'react-router-dom'
import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/button'
import { AbstractVisual } from '@/components/shared/AbstractVisual'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist." path="/404" noindex />
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-30">
          <AbstractVisual seed="404-not-found" variant="grid" />
        </div>
        <div className="container-page relative text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-signal">Error 404</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight sm:text-6xl">
            This Page Went Off-Script.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-signal text-white hover:bg-signal/90">
              <Link to="/">Back to Home</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
