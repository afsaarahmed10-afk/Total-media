import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getIndustries } from '@/lib/data'
import { SITE_URL } from '@/components/layout/Seo'

export default function IndustriesPage() {
  const { t } = useTranslation(['industries', 'common'])
  const { locale } = useLocale()
  const industries = getIndustries(locale)
  const breadcrumbs = [{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('eyebrow') }]

  const industriesSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('title'),
    description: t('seoDescription'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: industries.map((industry, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: industry.name,
        url: `${SITE_URL}/industries#${industry.slug}`,
      })),
    },
  }

  return (
    <>
      <Seo
        title={t('seoTitle')}
        description={t('seoDescription')}
        path="/industries"
        jsonLd={industriesSchema}
        breadcrumbs={breadcrumbs}
        keywords={['International Event Management', 'Business Event Planning Japan']}
      />
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page space-y-16">
          {industries.map((industry, i) => (
            <Reveal key={industry.slug} delay={i * 0.04}>
              <div id={industry.slug} className="scroll-mt-24 border-b border-border pb-14 last:border-0">
                <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                      {industry.name}
                    </h2>
                    <LocalizedLink
                      to="/quote"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-signal hover:underline"
                    >
                      {t('requestQuote')} <ArrowRight className="size-4" />
                    </LocalizedLink>
                  </div>
                  <div>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {industry.description}
                    </p>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('commonEngagements')}
                    </p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {industry.useCases.map((useCase) => (
                        <li
                          key={useCase}
                          className="rounded-md bg-mist px-3 py-2 text-sm text-navy"
                        >
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand title={t('ctaTitle')} description={t('ctaDescription')} />
    </>
  )
}
