import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Compass, HeartHandshake, TrendingUp, Plane } from 'lucide-react'

const ICONS = [Compass, TrendingUp, Plane, HeartHandshake]

interface Benefit {
  title: string
  description: string
}
interface Role {
  title: string
  location: string
  type: string
}

export default function CareersPage() {
  const { t } = useTranslation(['careers', 'common'])
  const benefits = t('benefits', { returnObjects: true }) as Benefit[]
  const openRoles = t('roles', { returnObjects: true }) as Role[]

  const breadcrumbs = [{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('eyebrow') }]

  const careersSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('title'),
    description: t('seoDescription'),
    about: { '@type': 'Organization', name: 'TOTAL MEDIA' },
  }

  return (
    <>
      <Seo
        title={t('seoTitle')}
        description={t('seoDescription')}
        path="/careers"
        jsonLd={careersSchema}
        breadcrumbs={breadcrumbs}
      />
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow={t('whyEyebrow')} title={t('whyTitle')} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => {
              const Icon = ICONS[i] ?? Compass
              return (
                <Reveal key={b.title} delay={i * 0.08}>
                  <div className="h-full rounded-xl border border-border p-6">
                    <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-signal-soft text-signal">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-base font-semibold text-navy">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow={t('openRolesEyebrow')} title={t('openRolesTitle')} />
          <div className="mt-10 divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
            {openRoles.map((role) => (
              <div
                key={role.title}
                className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-navy">{role.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{role.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{role.type}</Badge>
                  <Button asChild size="sm" className="bg-navy text-white hover:bg-navy-deep">
                    <a href={`mailto:uno@nippon-group.com?subject=${encodeURIComponent(`Application: ${role.title}`)}`}>
                      {t('apply')}
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            {t('noRoleText')}{' '}
            <a href="mailto:uno@nippon-group.com" className="font-semibold text-signal hover:underline">
              uno@nippon-group.com
            </a>{' '}
            {t('noRoleSuffix')}
          </p>
        </div>
      </section>
    </>
  )
}
