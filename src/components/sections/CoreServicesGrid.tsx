import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Display } from '@/components/cinematic/Display'
import { Eyebrow } from '@/components/cinematic/Eyebrow'
import { Section } from '@/components/cinematic/Section'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { ServiceIndexRow } from '@/components/sections/ServiceIndexRow'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getServices } from '@/lib/data'

// Six pillars, each pointing at the closest existing service page. Names,
// descriptions and images all come from the live service records, so both
// languages stay in sync with the admin CMS.
const PILLAR_SLUGS = [
  'corporate-events',
  'conferences',
  'exhibitions',
  'stage-production',
  'led-solutions',
  'hybrid-events',
]

/** "Our expertise" — numbered hairline rows with a hover image preview. */
export function CoreServicesGrid() {
  const { t } = useTranslation('home')
  const { locale } = useLocale()
  const services = getServices(locale)
  const pillars = PILLAR_SLUGS.map((slug) => services.find((s) => s.slug === slug)).filter(
    (s): s is (typeof services)[number] => Boolean(s),
  )

  return (
    <Section tone="paper" space="md" className="border-t border-line">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Eyebrow className="mb-6">{t('coreServices.eyebrow')}</Eyebrow>
          <Display as="h2" size="sec">
            {t('coreServices.title')}
          </Display>
        </div>
        <p className="text-base leading-relaxed text-muted-foreground lg:col-span-4 lg:col-start-9 lg:text-lg">
          {t('coreServices.description')}
        </p>
      </div>

      <ol className="mt-14 border-t border-ink lg:mt-20">
        {pillars.map((service, i) => (
          <ServiceIndexRow key={service.slug} service={service} index={i + 1} delay={(i % 6) * 0.04} />
        ))}
      </ol>

      <div className="mt-10">
        <LocalizedLink
          to="/services"
          className="group inline-flex items-center gap-2 border-b border-ink/30 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-ink"
        >
          {t('coreServices.viewAll')}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </LocalizedLink>
      </div>
    </Section>
  )
}
