import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { ContentVisual } from '@/components/shared/ContentVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getEquipmentCategories } from '@/lib/data'

export function EquipmentShowcase() {
  const { t } = useTranslation('home')
  const { locale } = useLocale()
  const equipmentCategories = getEquipmentCategories(locale)

  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={t('equipmentShowcase.eyebrow')}
            title={t('equipmentShowcase.title')}
            description={t('equipmentShowcase.description')}
          />
          <LocalizedLink
            to="/equipment"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-signal hover:underline sm:flex"
          >
            {t('equipmentShowcase.browseCatalogue')} <ArrowRight className="size-4" />
          </LocalizedLink>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {equipmentCategories.map((category, i) => (
            <Reveal key={category.slug} delay={(i % 5) * 0.05}>
              <LocalizedLink
                to={`/equipment/${category.slug}`}
                className="group block overflow-hidden rounded-xl border border-border bg-white"
              >
                <div className="relative aspect-square overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    <ContentVisual imageUrl={category.imageUrl} seed={category.slug} alt={category.name} />
                  </div>
                </div>
                <p className="px-3 py-3 text-sm font-semibold text-navy group-hover:text-signal">
                  {category.name}
                </p>
              </LocalizedLink>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <LocalizedLink to="/equipment" className="flex items-center gap-1.5 text-sm font-semibold text-signal">
            {t('equipmentShowcase.browseCatalogue')} <ArrowRight className="size-4" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}
