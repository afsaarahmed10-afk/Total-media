import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { ArrowRight } from 'lucide-react'

interface CtaBandProps {
  eyebrow?: string
  title: string
  description?: string
  primaryLabel?: string
  primaryTo?: string
  secondaryLabel?: string
  secondaryTo?: string
}

export function CtaBand({
  eyebrow = 'Let\'s Talk',
  title,
  description,
  primaryLabel = 'Request a Quote',
  primaryTo = '/quote',
  secondaryLabel = 'Contact Us',
  secondaryTo = '/contact',
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white lg:py-28">
      <div className="absolute inset-0 opacity-30">
        <AbstractVisual seed={title} variant="radial" />
      </div>
      <div className="container-page relative text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-signal">{eyebrow}</p>
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{description}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-signal text-white hover:bg-signal/90">
            <Link to={primaryTo}>
              {primaryLabel}
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link to={secondaryTo}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
