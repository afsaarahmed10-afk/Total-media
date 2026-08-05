import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { ContentVisual } from '@/components/shared/ContentVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getSolutions, getServicesBySlugs } from '@/lib/data'

export default function SolutionsPage() {
  const { t } = useTranslation(['solutions', 'common'])
  const { locale } = useLocale()
  const solutions = getSolutions(locale)
  const breadcrumbs = [{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('eyebrow') }]

  const solutionsSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('title'),
    description: t('seoDescription'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: solutions.map((solution, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: solution.name,
        url: `${SITE_URL}/solutions#${solution.slug}`,
      })),
    },
  }

  return (
    <>
      <Seo
        title={t('seoTitle')}
        description={t('seoDescription')}
        path="/solutions"
        jsonLd={solutionsSchema}
        breadcrumbs={breadcrumbs}
        keywords={['MICE Events Japan', 'Event Production Japan']}
      />
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        breadcrumbs={breadcrumbs}
      />

      <div className="divide-y divide-border">
        {solutions.map((solution, index) => {
          const includedServices = getServicesBySlugs(solution.includedServiceSlugs, locale)
          const isEven = index % 2 === 0

          return (
            <section key={solution.slug} id={solution.slug} className="scroll-mt-24 py-20 lg:py-24">
              <div className="container-page">
                <div
                  className={`grid gap-12 lg:grid-cols-2 lg:gap-16 ${
                    isEven ? '' : 'lg:[&>*:first-child]:order-2'
                  }`}
                >
                  <Reveal>
                    <div className="overflow-hidden rounded-2xl">
                      <div className="aspect-[4/3]">
                        <ContentVisual
                          imageUrl={solution.imageUrl}
                          seed={solution.slug}
                          alt={solution.name}
                        />
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <p className="text-sm font-semibold uppercase tracking-wider text-signal">
                      {t('solutionLabel')}
                    </p>
                    <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
                      {solution.name}
                    </h2>
                    <p className="mt-3 text-lg font-medium text-charcoal">{solution.heroStatement}</p>

                    <div className="mt-6 space-y-4 text-muted-foreground">
                      {solution.overview.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      {solution.highlights.map((highlight) => (
                        <div key={highlight.title} className="rounded-lg bg-mist p-4">
                          <p className="font-semibold text-navy">{highlight.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {highlight.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {includedServices.map((service) => (
                        <LocalizedLink
                          key={service.slug}
                          to={`/services/${service.slug}`}
                          className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-charcoal hover:border-signal/40 hover:text-signal"
                        >
                          {service.name}
                        </LocalizedLink>
                      ))}
                    </div>

                    <LocalizedLink
                      to="/quote"
                      className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-signal hover:underline"
                    >
                      {t('requestQuoteFor')} <ArrowRight className="size-4" />
                    </LocalizedLink>
                  </Reveal>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <CtaBand title={t('ctaTitle')} description={t('ctaDescription')} />
    </>
  )
}
