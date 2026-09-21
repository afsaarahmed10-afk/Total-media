import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MediaFrame } from '@/components/cinematic/MediaFrame'
import { Section } from '@/components/cinematic/Section'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getEquipmentCategories } from '@/lib/data'

export function EquipmentShowcase() {
  const { t } = useTranslation('home')
  const { locale } = useLocale()
  const equipmentCategories = getEquipmentCategories(locale)

  return (
    <Section tone="mist" space="lg">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHeading
          eyebrow={t('equipmentShowcase.eyebrow')}
          title={t('equipmentShowcase.title')}
          description={t('equipmentShowcase.description')}
        />
        <LocalizedLink
          to="/equipment"
          className="group hidden items-center gap-2 border-b border-ink/30 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-ink sm:inline-flex"
        >
          {t('equipmentShowcase.browseCatalogue')}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </LocalizedLink>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:mt-20 lg:grid-cols-5 lg:gap-x-6">
        {equipmentCategories.map((category, i) => (
          <Reveal key={category.slug} delay={(i % 5) * 0.05}>
            <LocalizedLink to={`/equipment/${category.slug}`} className="group block">
              <MediaFrame
                src={category.imageUrl}
                alt={category.name}
                seed={category.slug}
                ratio="4 / 5"
                hoverZoom
              />
              <p className="mt-4 flex items-center justify-between gap-2 border-b border-line pb-3 text-sm font-medium">
                {category.name}
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue" />
              </p>
            </LocalizedLink>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 sm:hidden">
        <LocalizedLink
          to="/equipment"
          className="inline-flex items-center gap-2 border-b border-ink/30 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em]"
        >
          {t('equipmentShowcase.browseCatalogue')} <ArrowUpRight className="size-4" />
        </LocalizedLink>
      </div>
    </Section>
  )
}
