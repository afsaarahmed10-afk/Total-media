import { useParams } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { ContentVisual } from '@/components/shared/ContentVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { useLocale } from '@/lib/locale/LocaleContext'
import {
  getServiceBySlug,
  getServicesBySlugs,
  getFaqsByIds,
  getEquipmentCategoryBySlug,
} from '@/lib/data'
import NotFoundPage from '@/pages/NotFoundPage'

export default function ServiceDetailPage() {
  const { t } = useTranslation(['services', 'common'])
  const { locale } = useLocale()
  const { slug = '' } = useParams()
  const service = getServiceBySlug(slug, locale)

  if (!service) return <NotFoundPage />

  const relatedServices = getServicesBySlugs(service.relatedServiceSlugs, locale)
  const relatedFaqs = getFaqsByIds(service.faqIds, locale)
  const relatedEquipment = service.relatedEquipmentCategorySlugs
    .map((s) => getEquipmentCategoryBySlug(s, locale))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  const breadcrumbs = [
    { label: t('home', { ns: 'common' }), to: '/' },
    { label: t('index.eyebrow'), to: '/services' },
    { label: service.name },
  ]

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: service.name,
    description: service.shortDescription,
    provider: { '@type': 'Organization', name: 'TOTAL MEDIA', url: SITE_URL },
    areaServed: 'JP',
  }

  return (
    <>
      <Seo
        title={service.seoTitle}
        description={service.seoDescription}
        path={`/services/${service.slug}`}
        jsonLd={serviceSchema}
        breadcrumbs={breadcrumbs}
      />
      <PageHero
        eyebrow={service.category === 'event-type' ? t('detail.eventType') : t('detail.technicalDiscipline')}
        title={service.heroStatement}
        description={service.shortDescription}
        visualSeed={service.slug}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-20 lg:py-24">
        <div className="container-page grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                {service.overview.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-12">
                <h2 className="text-xl font-bold text-navy">{t('detail.whatsIncluded')}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.capabilities.map((capability) => (
                    <li key={capability} className="flex items-start gap-2.5 text-sm text-charcoal">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-signal" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-12">
                <h2 className="text-xl font-bold text-navy">{t('detail.howItWorks')}</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {service.process.map((step, i) => (
                    <div key={step.title} className="rounded-lg bg-mist p-5">
                      <p className="text-xs font-semibold text-signal">{t('detail.step', { n: i + 1 })}</p>
                      <h3 className="mt-1 font-semibold text-navy">{step.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="space-y-8">
            <div className="overflow-hidden rounded-xl">
              <div className="aspect-[4/3]">
                <ContentVisual
                  imageUrl={service.imageUrl}
                  seed={`${service.slug}-detail`}
                  variant="facet"
                  alt={service.name}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t('detail.idealFor')}
              </h3>
              <ul className="mt-4 space-y-2">
                {service.idealFor.map((item) => (
                  <li key={item} className="text-sm text-charcoal">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {relatedEquipment.length > 0 && (
              <div className="rounded-xl border border-border p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('detail.relatedEquipment')}
                </h3>
                <ul className="mt-4 space-y-2">
                  {relatedEquipment.map((cat) => (
                    <li key={cat.slug}>
                      <LocalizedLink
                        to={`/equipment/${cat.slug}`}
                        className="flex items-center justify-between text-sm text-charcoal hover:text-signal"
                      >
                        {cat.name}
                        <ArrowRight className="size-3.5" />
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <LocalizedLink
              to="/quote"
              className="flex items-center justify-center gap-2 rounded-lg bg-navy px-6 py-4 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              {t('detail.requestQuoteFor', { name: service.name })}
              <ArrowRight className="size-4" />
            </LocalizedLink>
          </div>
        </div>
      </section>

      {relatedFaqs.length > 0 && (
        <section className="bg-mist py-20 lg:py-24">
          <div className="container-page mx-auto max-w-3xl">
            <SectionHeading eyebrow={t('detail.questions')} title={t('detail.frequentlyAsked')} />
            <div className="mt-8">
              <FaqAccordion faqs={relatedFaqs} />
            </div>
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="py-20 lg:py-24">
          <div className="container-page">
            <SectionHeading eyebrow={t('detail.related')} title={t('detail.youMightAlsoNeed')} />
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {relatedServices.map((related) => (
                <LocalizedLink
                  key={related.slug}
                  to={`/services/${related.slug}`}
                  className="group rounded-xl border border-border p-6 hover:border-signal/30"
                >
                  <h3 className="font-semibold text-navy group-hover:text-signal">{related.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{related.shortDescription}</p>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title={t('detail.readyToPlan', { name: service.name })}
        description={t('detail.ctaDescription')}
      />
    </>
  )
}
