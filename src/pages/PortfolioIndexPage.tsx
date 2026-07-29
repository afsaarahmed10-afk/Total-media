import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { cn } from '@/lib/utils'
import { getProjects } from '@/lib/data'
import type { ProjectCategory } from '@/content/types'

const CATEGORIES: (ProjectCategory | 'All')[] = [
  'All',
  'Conference',
  'Corporate',
  'Exhibition',
  'Hybrid',
  'Virtual',
  'Outdoor',
]

export default function PortfolioIndexPage() {
  const { t } = useTranslation(['portfolio', 'common'])
  const projects = getProjects()
  const [active, setActive] = useState<ProjectCategory | 'All'>('All')

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  )

  return (
    <>
      <Seo title={t('index.seoTitle')} description={t('index.seoDescription')} path="/portfolio" />
      <PageHero
        eyebrow={t('index.eyebrow')}
        title={t('index.title')}
        description={t('index.description')}
        breadcrumbs={[{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('index.eyebrow') }]}
      />

      <section className="py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  active === cat
                    ? 'border-navy bg-navy text-white'
                    : 'border-border text-charcoal hover:border-navy/30',
                )}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <Reveal key={project.slug} delay={(i % 6) * 0.05}>
                <LocalizedLink to={`/portfolio/${project.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                      <AbstractVisual seed={project.visualSeed} />
                    </div>
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy">
                      {t(`categories.${project.category}`)}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <MapPin className="size-3.5" /> {project.location} · {project.year}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold text-navy group-hover:text-signal">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{project.client}</p>
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
