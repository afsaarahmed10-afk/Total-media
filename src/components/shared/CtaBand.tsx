import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
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
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryTo = '/quote',
  secondaryLabel,
  secondaryTo = '/contact',
}: CtaBandProps) {
  const { t } = useTranslation('common')
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white lg:py-28">
      <div className="absolute inset-0 opacity-30">
        <AbstractVisual seed={title} variant="radial" />
      </div>
      <div className="container-page relative text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-signal">
          {eyebrow ?? t('ctaBand.letsTalk')}
        </p>
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{description}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-signal text-white hover:bg-signal/90">
            <LocalizedLink to={primaryTo}>
              {primaryLabel ?? t('buttons.getQuote')}
              <ArrowRight className="ml-1 size-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <LocalizedLink to={secondaryTo}>{secondaryLabel ?? t('buttons.contactUs')}</LocalizedLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
