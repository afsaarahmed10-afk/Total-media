import { useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { ContentVisual } from '@/components/shared/ContentVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getEquipmentByCategory, getEquipmentCategoryBySlug } from '@/lib/data'
import NotFoundPage from '@/pages/NotFoundPage'

export default function EquipmentCategoryPage() {
  const { t } = useTranslation(['equipment', 'common'])
  const { locale } = useLocale()
  const { category = '' } = useParams()
  const categoryData = getEquipmentCategoryBySlug(category, locale)
  const items = getEquipmentByCategory(category)

  if (!categoryData) return <NotFoundPage />

  const breadcrumbs = [
    { label: t('home', { ns: 'common' }), to: '/' },
    { label: t('index.eyebrow'), to: '/equipment' },
    { label: categoryData.name },
  ]

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryData.name} Rental`,
    description: categoryData.description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: `${SITE_URL}/equipment/${categoryData.slug}/${item.slug}`,
      })),
    },
  }

  return (
    <>
      <Seo
        title={`${categoryData.name} Rental`}
        description={`${categoryData.description} Browse specifications and request a quote from TOTAL MEDIA.`}
        path={`/equipment/${categoryData.slug}`}
        jsonLd={categorySchema}
        breadcrumbs={breadcrumbs}
      />
      <PageHero
        eyebrow={t('category.eyebrow')}
        title={categoryData.name}
        description={categoryData.description}
        visualSeed={categoryData.slug}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-20 lg:py-24">
        <div className="container-page">
          {items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <Reveal key={item.slug} delay={(i % 6) * 0.05}>
                  <LocalizedLink
                    to={`/equipment/${item.categorySlug}/${item.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:-translate-y-1 hover:border-signal/30 hover:shadow-lg hover:shadow-navy/5"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                        <ContentVisual
                          imageUrl={item.galleryUrls?.[0]}
                          seed={item.visualSeed}
                          alt={item.name}
                        />
                      </div>
                      <Badge className="absolute left-3 top-3 bg-white/90 text-navy hover:bg-white/90">
                        {t(`availability.${item.availability}`)}
                      </Badge>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-semibold text-navy">{item.name}</h3>
                      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{item.summary}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-signal opacity-0 transition-opacity group-hover:opacity-100">
                        {t('index.viewSpecs')} <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </LocalizedLink>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">{t('category.noneInCategory')}</p>
          )}
        </div>
      </section>

      <CtaBand
        title={t('category.readyToBook', { name: categoryData.name })}
        description={t('category.ctaDescription')}
      />
    </>
  )
}
