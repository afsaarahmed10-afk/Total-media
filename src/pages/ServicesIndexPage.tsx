import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { ContentVisual } from '@/components/shared/ContentVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getServices } from '@/lib/data'
import type { Service } from '@/content/types'

function ServiceCard({ service, delay, learnMore }: { service: Service; delay: number; learnMore: string }) {
  return (
    <Reveal delay={delay}>
      <LocalizedLink
        to={`/services/${service.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:-translate-y-1 hover:border-signal/30 hover:shadow-lg hover:shadow-navy/5"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
            <ContentVisual imageUrl={service.imageUrl} seed={service.slug} alt={service.name} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-semibold text-navy">{service.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {service.shortDescription}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-signal opacity-0 transition-opacity group-hover:opacity-100">
            {learnMore} <ArrowRight className="size-3.5" />
          </span>
        </div>
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

      <section className="py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow={t('index.byEventType')}
            title={t('index.eventFormats')}
            description={t('index.eventFormatsDescription')}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventServices.map((service, i) => (
              <ServiceCard key={service.slug} service={service} delay={(i % 3) * 0.08} learnMore={t('index.learnMore')} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow={t('index.byTechnicalDiscipline')}
            title={t('index.technicalServices')}
            description={t('index.technicalServicesDescription')}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {technicalServices.map((service, i) => (
              <ServiceCard key={service.slug} service={service} delay={(i % 3) * 0.08} learnMore={t('index.learnMore')} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={t('index.ctaTitle')}
        description={t('index.ctaDescription')}
        secondaryLabel={t('index.exploreSolutions')}
        secondaryTo="/solutions"
      />
    </>
  )
}
