import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/shared/Reveal'

interface Stat {
  value: string
  label: string
}

export function CompanyIntro() {
  const { t } = useTranslation('home')
  const stats = t('companyIntro.stats', { returnObjects: true }) as Stat[]

  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-signal">
              {t('companyIntro.eyebrow')}
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
              {t('companyIntro.title')}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>{t('companyIntro.paragraph1')}</p>
              <p>{t('companyIntro.paragraph2')}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
