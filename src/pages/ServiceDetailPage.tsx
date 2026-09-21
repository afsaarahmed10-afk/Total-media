import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { ServiceIndexRow } from '@/components/sections/ServiceIndexRow'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { CineButton } from '@/components/cinematic/CineButton'
import { Eyebrow } from '@/components/cinematic/Eyebrow'
import { MediaFrame } from '@/components/cinematic/MediaFrame'
import { Section } from '@/components/cinematic/Section'
import { useLocale } from '@/lib/locale/LocaleContext'
import { trackEvent } from '@/lib/analytics'
import {
  getServiceBySlug,
  getServicesBySlugs,
  getFaqsByIds,
  getEquipmentCategoryBySlug,
  getProjects,
} from '@/lib/data'
import NotFoundPage from '@/pages/NotFoundPage'

export default function ServiceDetailPage() {
  const { t } = useTranslation(['services', 'common'])
  const { locale } = useLocale()
  const { slug = '' } = useParams()
  const service = getServiceBySlug(slug, locale)

  useEffect(() => {
    if (service) trackEvent('service_view', { service_slug: service.slug })
  }, [service])

  if (!service) return <NotFoundPage />

  const relatedServices = getServicesBySlugs(service.relatedServiceSlugs, locale)
  const relatedFaqs = getFaqsByIds(service.faqIds, locale)
  const relatedEquipment = service.relatedEquipmentCategorySlugs
    .map((s) => getEquipmentCategoryBySlug(s, locale))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
  const relatedProjects = getProjects()
    .filter((p) => p.servicesUsed.includes(service.slug))
    .slice(0, 2)

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
        image={service.imageUrl}
        breadcrumbs={breadcrumbs}
      />

      <Section tone="paper" space="lg">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <aside className="lg:col-span-4">
            <div className="space-y-12 lg:sticky lg:top-28">
              <div>
                <Eyebrow className="mb-5 border-b border-ink pb-5 !text-ink">{t('detail.idealFor')}</Eyebrow>
                <ul className="space-y-3">
                  {service.idealFor.map((item) => (
                    <li key={item} className="border-b border-line pb-3 text-sm leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {relatedEquipment.length > 0 && (
                <div>
                  <Eyebrow className="mb-5 border-b border-ink pb-5 !text-ink">{t('detail.relatedEquipment')}</Eyebrow>
                  <ul>
                    {relatedEquipment.map((cat) => (
                      <li key={cat.slug} className="border-b border-line">
                        <LocalizedLink
                          to={`/equipment/${cat.slug}`}
                          className="group flex items-center justify-between py-3 text-sm transition-colors hover:text-blue"
                        >
                          {cat.name}
                          <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                            ↗
                          </span>
                        </LocalizedLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <CineButton to="/quote" className="w-full justify-between">
                {t('detail.requestQuoteFor', { name: service.name })}
              </CineButton>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow className="mb-6">{t('detail.overview')}</Eyebrow>
              <div className="space-y-6 text-lg leading-relaxed lg:text-xl lg:leading-relaxed">
                {service.overview.map((paragraph, i) => (
                  <p key={i} className={i === 0 ? 'text-ink' : 'text-muted-foreground'}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-20">
              <h2 className="display-md mb-8">{t('detail.whatsIncluded')}</h2>
              <ul className="grid border-t border-ink sm:grid-cols-2 sm:gap-x-10">
                {service.capabilities.map((capability, i) => (
                  <li key={capability} className="flex gap-4 border-b border-line py-4 text-sm leading-snug">
                    <span className="eyebrow tnum pt-0.5 text-blue">{String(i + 1).padStart(2, '0')}</span>
                    {capability}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-20">
              <h2 className="display-md mb-8">{t('detail.howItWorks')}</h2>
              <ol className="border-t border-ink">
                {service.process.map((step, i) => (
                  <li
                    key={step.title}
                    className="grid gap-x-8 gap-y-2 border-b border-line py-7 sm:grid-cols-[6rem_1fr_1.2fr]"
                  >
                    <span className="eyebrow tnum pt-1.5 text-blue">{t('detail.step', { n: i + 1 })}</span>
                    <h3 className="text-lg font-medium tracking-[-0.015em]">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </Section>

      {relatedProjects.length > 0 && (
        <Section tone="ink" space="lg">
          <SectionHeading tone="dark" title={t('detail.relatedWork')} />
          <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-16">
            {relatedProjects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.08} className={i === 0 ? 'lg:col-span-8' : 'lg:col-span-4'}>
                <LocalizedLink to={`/portfolio/${project.slug}`} className="group block">
                  <MediaFrame
                    src={project.imageUrl}
                    alt={project.title}
                    seed={project.visualSeed}
                    ratio={i === 0 ? '16 / 10' : '4 / 5'}
                    hoverZoom
                  />
                  <p className="eyebrow mt-5 flex justify-between gap-4 text-white/60">
                    <span>{project.client}</span>
                    <span className="text-white">{t('detail.viewProject')} ↗</span>
                  </p>
                </LocalizedLink>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {relatedFaqs.length > 0 && (
        <Section tone="mist" space="lg">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow={t('detail.questions')} title={t('detail.frequentlyAsked')} />
            </div>
            <div className="lg:col-span-8">
              <FaqAccordion faqs={relatedFaqs} />
            </div>
          </div>
        </Section>
      )}

      {relatedServices.length > 0 && (
        <Section tone="paper" space="lg">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow={t('detail.related')} title={t('detail.youMightAlsoNeed')} />
            </div>
            <ol className="border-t border-ink lg:col-span-8">
              {relatedServices.map((related, i) => (
                <ServiceIndexRow key={related.slug} service={related} index={i + 1} delay={i * 0.05} />
              ))}
            </ol>
          </div>
        </Section>
      )}

      <CtaBand
        title={t('detail.readyToPlan', { name: service.name })}
        description={t('detail.ctaDescription')}
      />
    </>
  )
}
