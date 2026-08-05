import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { Target, Users, Globe2, ShieldCheck } from 'lucide-react'

const ICONS = [Target, ShieldCheck, Globe2, Users]

interface Value {
  title: string
  description: string
}

export default function AboutPage() {
  const { t } = useTranslation(['about', 'common'])
  const values = t('values', { returnObjects: true }) as Value[]
  const breadcrumbs = [{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('eyebrow') }]

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: t('title'),
    description: t('seoDescription'),
    about: { '@type': 'Organization', name: 'TOTAL MEDIA' },
  }

  return (
    <>
      <Seo
        title={t('seoTitle')}
        description={t('seoDescription')}
        path="/about"
        jsonLd={aboutSchema}
        breadcrumbs={breadcrumbs}
        keywords={['Premium Event Company Japan', 'Event Management Japan']}
      />
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-signal">
              {t('storyEyebrow')}
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
              {t('storyTitle')}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>{t('storyParagraph1')}</p>
              <p>{t('storyParagraph2')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-mist py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow={t('valuesEyebrow')} title={t('valuesTitle')} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => {
              const Icon = ICONS[i] ?? Target
              return (
                <Reveal key={value.title} delay={i * 0.08}>
                  <div className="h-full rounded-xl border border-border bg-white p-6">
                    <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-signal-soft text-signal">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-base font-semibold text-navy">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBand title={t('ctaTitle')} description={t('ctaDescription')} />
    </>
  )
}
