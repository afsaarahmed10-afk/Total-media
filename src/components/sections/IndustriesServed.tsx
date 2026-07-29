import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getIndustries } from '@/lib/data'

export function IndustriesServed() {
  const { t } = useTranslation('home')
  const { locale } = useLocale()
  const industries = getIndustries(locale)

  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={t('industriesServed.eyebrow')}
          title={t('industriesServed.title')}
          description={t('industriesServed.description')}
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <Reveal key={industry.slug} delay={(i % 6) * 0.04}>
              <LocalizedLink
                to={`/industries#${industry.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border px-5 py-4 transition-colors hover:border-signal/30 hover:bg-signal-soft/40"
              >
                <span className="font-medium text-navy">{industry.name}</span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-signal" />
              </LocalizedLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
