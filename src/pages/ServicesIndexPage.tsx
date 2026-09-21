import { useTranslation } from 'react-i18next'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { MediaFrame } from '@/components/cinematic/MediaFrame'
import { Section } from '@/components/cinematic/Section'
import { ServiceIndexRow } from '@/components/sections/ServiceIndexRow'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getServices } from '@/lib/data'
import type { Service } from '@/content/types'

/** Image-led service tile: tall photo, index number, name, one-line summary. */
function ServiceTile({ service, index, delay }: { service: Service; index: number; delay: number }) {
  return (
    <Reveal delay={delay}>
      <LocalizedLink to={`/services/${service.slug}`} className="group block">
        <MediaFrame src={service.imageUrl} alt={service.name} seed={service.slug} ratio="4 / 5" hoverZoom />
        <p className="eyebrow tnum mt-6 text-blue">{String(index).padStart(2, '0')}</p>
        <h3 className="mt-3 text-xl font-medium leading-snug tracking-[-0.02em] transition-colors group-hover:text-blue lg:text-2xl">
          {service.name}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {service.shortDescription}
        </p>
      </LocalizedLink>
    </Reveal>
  )
}

export default function ServicesIndexPage() {
  const { t } = useTranslation(['services', 'common'])
  const { locale } = useLocale()
  const services = getServices(locale)
  const eventServices = services.filter((s) => s.category === 'event-type')
  const technicalServices = services.filter((s) => s.category === 'technical')
  const breadcrumbs = [{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('index.eyebrow') }]
  const [lead, ...restEvents] = eventServices
  // Continuous numbering across both groups (01–09 events, 10–15 technical).
  const numberOf = (s: Service) => services.findIndex((x) => x.slug === s.slug) + 1

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('index.title'),
    description: t('index.seoDescription'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: services.map((service, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: service.name,
        url: `${SITE_URL}/services/${service.slug}`,
      })),
    },
  }

  return (
    <>
      <Seo
        title={t('index.seoTitle')}
        description={t('index.seoDescription')}
        path="/services"
        jsonLd={servicesSchema}
        breadcrumbs={breadcrumbs}
        keywords={[
          'Corporate Events Japan',
          'Conference Organizer Japan',
          'Exhibition Management Japan',
          'Product Launch Events Japan',
        ]}
      />
      <PageHero
        eyebrow={t('index.eyebrow')}
        title={t('index.title')}
        description={t('index.description')}
        breadcrumbs={breadcrumbs}
      />

      <Section tone="paper" space="lg">
        <SectionHeading
          eyebrow={t('index.byEventType')}
          index="01"
          title={t('index.eventFormats')}
          description={t('index.eventFormatsDescription')}
        />

        {lead && (
          <Reveal className="mt-16 lg:mt-24">
            <LocalizedLink
              to={`/services/${lead.slug}`}
              className="group grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16"
            >
              <div className="lg:col-span-8">
                <MediaFrame src={lead.imageUrl} alt={lead.name} seed={lead.slug} ratio="16 / 10" hoverZoom />
              </div>
              <div className="lg:col-span-4">
                <p className="eyebrow tnum text-blue">{String(numberOf(lead)).padStart(2, '0')}</p>
                <h3 className="display-md mt-4 transition-colors group-hover:text-blue">{lead.name}</h3>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{lead.shortDescription}</p>
                <span className="mt-8 inline-flex items-center gap-2 border-b border-ink/30 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors group-hover:border-ink">
                  {t('index.learnMore')} ↗
                </span>
              </div>
            </LocalizedLink>
          </Reveal>
        )}

        <div className="mt-20 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {restEvents.map((service, i) => (
            <ServiceTile key={service.slug} service={service} index={numberOf(service)} delay={(i % 4) * 0.07} />
          ))}
        </div>
      </Section>

      <Section tone="mist" space="lg">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow={t('index.byTechnicalDiscipline')}
              index="02"
              title={t('index.technicalServices')}
              description={t('index.technicalServicesDescription')}
            />
          </div>
          <ol className="border-t border-ink lg:col-span-8">
            {technicalServices.map((service, i) => (
              <ServiceIndexRow key={service.slug} service={service} index={numberOf(service)} delay={(i % 6) * 0.04} />
            ))}
          </ol>
        </div>
      </Section>

      <CtaBand
        title={t('index.ctaTitle')}
        description={t('index.ctaDescription')}
        secondaryLabel={t('index.exploreSolutions')}
        secondaryTo="/solutions"
      />
    </>
  )
}
