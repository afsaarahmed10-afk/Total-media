import { useTranslation } from 'react-i18next'
import { CineButton } from '@/components/cinematic/CineButton'
import { Display } from '@/components/cinematic/Display'
import { Eyebrow } from '@/components/cinematic/Eyebrow'
import { trackEvent } from '@/lib/analytics'

interface CtaBandProps {
  eyebrow?: string
  title: string
  description?: string
  primaryLabel?: string
  primaryTo?: string
  secondaryLabel?: string
  secondaryTo?: string
  /** Trailing substring of `title` set in the accent face. */
  accent?: string
}

/** Closing block — the template's solid-blue "LET'S MAKE AN IMPACT." band.
 * Copy, destinations and click tracking are unchanged from the legacy
 * band; only the presentation is new. */
export function CtaBand({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryTo = '/quote',
  secondaryLabel,
  secondaryTo = '/contact',
  accent,
}: CtaBandProps) {
  const { t } = useTranslation('common')

  function handleCtaClick(to: string) {
    if (to === '/quote') trackEvent('request_quote_click', { location: 'cta_band' })
    else if (to === '/contact') trackEvent('contact_click', { location: 'cta_band' })
  }

  return (
    <section className="on-dark relative overflow-hidden bg-blue py-24 text-white lg:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 6) 100%',
        }}
      />
      <div className="container-page relative grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-20">
        <div>
          <Eyebrow tone="dark" className="mb-6 !text-white/75">
            {eyebrow ?? t('ctaBand.letsTalk')}
          </Eyebrow>
          <Display as="h2" size="lg" tone="dark" accent={accent} className="max-w-4xl [&_.accent]:text-white">
            {title}
          </Display>
        </div>
        <div>
          {description && <p className="max-w-md text-base leading-relaxed text-white/80 lg:text-lg">{description}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CineButton
              to={primaryTo}
              variant="white"
              onClick={() => handleCtaClick(primaryTo)}
            >
              {primaryLabel ?? t('buttons.getQuote')}
            </CineButton>
            <CineButton
              to={secondaryTo}
              variant="outline"
              tone="dark"
              onClick={() => handleCtaClick(secondaryTo)}
            >
              {secondaryLabel ?? t('buttons.contactUs')}
            </CineButton>
          </div>
        </div>
      </div>
    </section>
  )
}
