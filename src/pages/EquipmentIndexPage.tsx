import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getEquipmentCategories, getEquipmentItems } from '@/lib/data'

export default function EquipmentIndexPage() {
  const { t } = useTranslation(['equipment', 'common'])
  const { locale } = useLocale()
  const categories = getEquipmentCategories(locale)
  const items = getEquipmentItems()
  const [active, setActive] = useState<string>('all')

  const filtered = useMemo(
    () => (active === 'all' ? items : items.filter((item) => item.categorySlug === active)),
    [active, items],
  )

  return (
    <>
      <Seo title={t('index.seoTitle')} description={t('index.seoDescription')} path="/equipment" />
      <PageHero
        eyebrow={t('index.eyebrow')}
        title={t('index.title')}
        description={t('index.description')}
        breadcrumbs={[{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('index.eyebrow') }]}
      />

      <section className="py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActive('all')}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                active === 'all'
                  ? 'border-navy bg-navy text-white'
                  : 'border-border text-charcoal hover:border-navy/30',
              )}
            >
              {t('index.allCategories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActive(cat.slug)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  active === cat.slug
                    ? 'border-navy bg-navy text-white'
                    : 'border-border text-charcoal hover:border-navy/30',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 6) * 0.05}>
                <LocalizedLink
                  to={`/equipment/${item.categorySlug}/${item.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:-translate-y-1 hover:border-signal/30 hover:shadow-lg hover:shadow-navy/5"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                      <AbstractVisual seed={item.visualSeed} />
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

          {filtered.length === 0 && (
            <p className="mt-10 text-center text-muted-foreground">{t('index.noneFound')}</p>
          )}
        </div>
      </section>

      <CtaBand title={t('index.ctaTitle')} description={t('index.ctaDescription')} />
    </>
  )
}
