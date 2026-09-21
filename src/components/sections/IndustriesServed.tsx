import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Section } from '@/components/cinematic/Section'
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
    <Section tone="paper" space="lg">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow={t('industriesServed.eyebrow')}
            title={t('industriesServed.title')}
            description={t('industriesServed.description')}
          />
        </div>
        <ul className="grid gap-x-10 border-t border-ink sm:grid-cols-2 lg:col-span-7">
          {industries.map((industry, i) => (
            <li key={industry.slug} className="border-b border-line">
              <Reveal delay={(i % 6) * 0.04}>
                <LocalizedLink
                  to={`/industries#${industry.slug}`}
                  className="group flex items-center justify-between gap-4 py-5"
                >
                  <span className="text-base font-medium tracking-[-0.01em] transition-transform duration-300 group-hover:translate-x-1.5 lg:text-lg">
                    {industry.name}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue" />
                </LocalizedLink>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
