import {
  Building2,
  Presentation,
  LayoutGrid,
  Radio,
  Sparkles,
  Video,
  Cast,
  Settings2,
  ArrowRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getServices } from '@/lib/data'

const FEATURED_SLUGS = [
  'corporate-events',
  'conferences',
  'exhibitions',
  'hybrid-events',
  'live-streaming',
  'led-solutions',
  'lighting-solutions',
  'technical-production',
]

const ICONS: Record<string, typeof Building2> = {
  'corporate-events': Building2,
  conferences: Presentation,
  exhibitions: LayoutGrid,
  'hybrid-events': Radio,
  'live-streaming': Cast,
  'led-solutions': Sparkles,
  'lighting-solutions': Video,
  'technical-production': Settings2,
}

export function CoreServicesGrid() {
  const { t } = useTranslation('home')
  const { locale } = useLocale()
  const services = getServices(locale)
  const featured = FEATURED_SLUGS.map((slug) => services.find((s) => s.slug === slug)).filter(
    (s): s is (typeof services)[number] => Boolean(s),
  )

  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={t('coreServices.eyebrow')}
            title={t('coreServices.title')}
            description={t('coreServices.description')}
          />
          <LocalizedLink
            to="/services"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-signal hover:underline sm:flex"
          >
            {t('coreServices.viewAll')} <ArrowRight className="size-4" />
          </LocalizedLink>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((service, i) => {
            const Icon = ICONS[service.slug] ?? Sparkles
            return (
              <Reveal key={service.slug} delay={(i % 4) * 0.06}>
                <LocalizedLink
                  to={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-signal/30 hover:shadow-lg hover:shadow-navy/5"
                >
                  <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-signal-soft text-signal">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold text-navy">{service.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.shortDescription}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-signal opacity-0 transition-opacity group-hover:opacity-100">
                    {t('coreServices.learnMore')} <ArrowRight className="size-3.5" />
                  </span>
                </LocalizedLink>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-8 sm:hidden">
          <LocalizedLink to="/services" className="flex items-center gap-1.5 text-sm font-semibold text-signal">
            {t('coreServices.viewAll')} <ArrowRight className="size-4" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}
