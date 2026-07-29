import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLocale } from '@/lib/locale/LocaleContext'
import {
  getEquipmentItemBySlug,
  getEquipmentCategoryBySlug,
  getRelatedEquipment,
} from '@/lib/data'
import type { EquipmentAvailability } from '@/content/types'
import NotFoundPage from '@/pages/NotFoundPage'

const AVAILABILITY_TONE: Record<EquipmentAvailability, string> = {
  'in-stock': 'bg-emerald-50 text-emerald-700',
  limited: 'bg-amber-50 text-amber-700',
  'made-to-order': 'bg-signal-soft text-signal',
}

export default function EquipmentDetailPage() {
  const { t } = useTranslation(['equipment', 'common'])
  const { locale } = useLocale()
  const { category = '', slug = '' } = useParams()
  const item = getEquipmentItemBySlug(slug)
  const categoryData = getEquipmentCategoryBySlug(category, locale)
  const [activeImage, setActiveImage] = useState(0)

  if (!item || !categoryData || item.categorySlug !== category) return <NotFoundPage />

  const related = getRelatedEquipment(item)
  const galleryCount = 4

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.description,
    category: categoryData.name,
    brand: { '@type': 'Organization', name: 'TOTAL MEDIA' },
    offers: {
      '@type': 'Offer',
      availability:
        item.availability === 'in-stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/LimitedAvailability',
      url: `${SITE_URL}/equipment/${category}/${slug}`,
    },
  }

  return (
    <>
      <Seo
        title={`${item.name} Rental`}
        description={item.summary}
        path={`/equipment/${category}/${slug}`}
        jsonLd={productSchema}
      />
      <PageHero
        eyebrow={categoryData.name}
        title={item.name}
        description={item.summary}
        visualSeed={item.visualSeed}
        breadcrumbs={[
          { label: t('home', { ns: 'common' }), to: '/' },
          { label: t('index.eyebrow'), to: '/equipment' },
          { label: categoryData.name, to: `/equipment/${categoryData.slug}` },
          { label: item.name },
        ]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-page grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <AbstractVisual seed={`${item.visualSeed}-${activeImage}`} />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {Array.from({ length: galleryCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'aspect-square overflow-hidden rounded-lg ring-2 transition-all',
                      activeImage === i ? 'ring-signal' : 'ring-transparent hover:ring-border',
                    )}
                    aria-label={t('detail.viewImage', { n: i + 1 })}
                  >
                    <AbstractVisual seed={`${item.visualSeed}-${i}`} />
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10">
                <h2 className="text-xl font-bold text-navy">{t('detail.overview')}</h2>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10">
                <h2 className="text-xl font-bold text-navy">{t('detail.applications')}</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {item.applications.map((app) => (
                    <li key={app} className="rounded-md bg-mist px-3 py-2 text-sm text-navy">
                      {app}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('detail.availability')}
                </h3>
                <Badge className={cn('hover:bg-inherit', AVAILABILITY_TONE[item.availability])}>
                  {t(`availability.${item.availability}`)}
                </Badge>
              </div>
              <Button asChild size="lg" className="mt-5 w-full bg-navy text-white hover:bg-navy-deep">
                <LocalizedLink to="/quote">
                  {t('buttons.getQuote', { ns: 'common' })}
                  <ArrowRight className="ml-1 size-4" />
                </LocalizedLink>
              </Button>
            </div>

            <div className="rounded-xl border border-border p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t('detail.specifications')}
              </h3>
              <dl className="mt-4 divide-y divide-border">
                {item.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4 py-2.5 text-sm">
                    <dt className="text-muted-foreground">{spec.label}</dt>
                    <dd className="text-right font-medium text-navy">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-mist py-20 lg:py-24">
          <div className="container-page">
            <SectionHeading eyebrow={t('detail.related')} title={t('detail.relatedEquipment')} />
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {related.map((relatedItem) => (
                <LocalizedLink
                  key={relatedItem.slug}
                  to={`/equipment/${relatedItem.categorySlug}/${relatedItem.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-white"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <div className="transition-transform duration-500 group-hover:scale-105">
                      <AbstractVisual seed={relatedItem.visualSeed} />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-navy group-hover:text-signal">
                      {relatedItem.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{relatedItem.summary}</p>
                  </div>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title={t('detail.readyToBook', { name: item.name })}
        description={t('detail.ctaDescription')}
      />
    </>
  )
}
