import { useTranslation } from 'react-i18next'
import { Display } from '@/components/cinematic/Display'
import { Eyebrow } from '@/components/cinematic/Eyebrow'
import { Section } from '@/components/cinematic/Section'
import { Reveal } from '@/components/shared/Reveal'

interface Stat {
  value: string
  label: string
}

export function CompanyIntro() {
  const { t } = useTranslation('home')
  const stats = t('companyIntro.stats', { returnObjects: true }) as Stat[]

  return (
    <Section tone="paper" space="lg">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow className="mb-6">{t('companyIntro.eyebrow')}</Eyebrow>
          <Display as="h2" size="sec">
            {t('companyIntro.title')}
          </Display>
        </div>
        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8 lg:pt-10">
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground lg:text-lg">
            <p>{t('companyIntro.paragraph1')}</p>
            <p>{t('companyIntro.paragraph2')}</p>
          </div>
        </Reveal>
      </div>

      <dl className="mt-20 grid grid-cols-2 border-t border-line lg:mt-28 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 0.07}
            className="border-b border-line py-8 pr-6 lg:border-b-0 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
          >
            <dd className="tnum text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] font-medium leading-none tracking-[-0.03em]">
              {stat.value}
            </dd>
            <dt className="mt-3 text-sm leading-snug text-muted-foreground">{stat.label}</dt>
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
