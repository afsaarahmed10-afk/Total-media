import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { Display } from '@/components/cinematic/Display'
import { Eyebrow } from '@/components/cinematic/Eyebrow'
import { MediaFrame } from '@/components/cinematic/MediaFrame'
import { Section } from '@/components/cinematic/Section'
import { cn } from '@/lib/utils'
import { getProjects } from '@/lib/data'
import { categoryLabel, categoryOrder, resolveEventCategory } from '@/lib/event-categories'
import { getFeaturedProject, projectViewPath } from '@/lib/featured-project'
import { useLocale } from '@/lib/locale/LocaleContext'
import type { Project, ProjectCategory } from '@/content/types'

const CATEGORY_ORDER: ProjectCategory[] = ['Conference', 'Corporate', 'Exhibition', 'Hybrid', 'Virtual', 'Outdoor']

function ProjectFigure({ project, featured, delay = 0 }: { project: Project; featured?: boolean; delay?: number }) {
  const { t } = useTranslation('portfolio')
  const photoCount = project.images?.length ?? 0
  return (
    <Reveal delay={delay} className={featured ? 'lg:col-span-2' : undefined}>
      <LocalizedLink to={`/portfolio/${project.slug}`} className="group block">
        <MediaFrame
          src={project.imageUrl}
          alt={project.title}
          seed={project.visualSeed}
          ratio={featured ? '21 / 9' : '4 / 3'}
          hoverZoom
          className={featured ? '!aspect-[4/3] sm:!aspect-[16/9] lg:!aspect-[21/9]' : undefined}
        />
        <div className="mt-6 grid gap-x-8 gap-y-3 lg:grid-cols-12">
          <p className="eyebrow tnum text-blue lg:col-span-12">
            {t(`categories.${project.category}`)}
            <span className="ml-3 text-ink/60">
              {project.location} · {project.year}
            </span>
          </p>
          <h3
            className={cn(
              'font-medium leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-blue lg:col-span-8',
              featured ? 'text-[clamp(1.75rem,1rem+2.6vw,3.5rem)]' : 'text-2xl lg:text-3xl',
            )}
          >
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground lg:col-span-4 lg:text-right">
            {project.client}
            {photoCount > 0 && <span className="mt-1 block text-xs">{t('detail.photoCount', { count: photoCount })}</span>}
          </p>
        </div>
      </LocalizedLink>
    </Reveal>
  )
}

export default function PortfolioIndexPage() {
  const { t } = useTranslation(['portfolio', 'common'])
  const { locale } = useLocale()
  const projects = getProjects()
  const [active, setActive] = useState<ProjectCategory | 'All'>('All')

  // Only offer categories that have at least one project — a filter row
  // full of empty tabs (or any filter at all with one category) is noise.
  const presentCategories = useMemo(
    () => CATEGORY_ORDER.filter((c) => projects.some((p) => p.category === c)),
    [projects],
  )
  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  )
  const [lead, ...rest] = filtered

  // "Browse by category" strip for the flagship project's real photography.
  const featured = getFeaturedProject()
  const categoryTiles = useMemo(() => {
    const groups = new Map<string, { key: string; label: string; count: number; url: string; alt: string }>()
    for (const image of featured?.images ?? []) {
      const cat = resolveEventCategory(image.category)
      const hit = groups.get(cat.key)
      if (hit) hit.count += 1
      else groups.set(cat.key, { key: cat.key, label: categoryLabel(cat, locale), count: 1, url: image.url, alt: image.alt })
    }
    return [...groups.values()].sort((a, b) => categoryOrder(a.key) - categoryOrder(b.key))
  }, [featured, locale])

  const breadcrumbs = [{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('index.eyebrow') }]

  const portfolioSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('index.title'),
    description: t('index.seoDescription'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: project.title,
        url: `${SITE_URL}/portfolio/${project.slug}`,
      })),
    },
  }

  return (
    <>
      <Seo
        title={t('index.seoTitle')}
        description={t('index.seoDescription')}
        path="/portfolio"
        jsonLd={portfolioSchema}
        breadcrumbs={breadcrumbs}
      />
      <PageHero
        eyebrow={t('index.eyebrow')}
        title={t('index.title')}
        description={t('index.description')}
        breadcrumbs={breadcrumbs}
      />

      <Section tone="paper" space="lg">
        {presentCategories.length > 1 && (
          <div role="group" aria-label={t('index.eyebrow')} className="mb-14 flex flex-wrap gap-x-8 gap-y-3 border-b border-line">
            {(['All', ...presentCategories] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={active === cat}
                onClick={() => setActive(cat)}
                className={cn(
                  '-mb-px border-b-2 pb-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors',
                  active === cat ? 'border-ink text-ink' : 'border-transparent text-muted-foreground hover:text-ink',
                )}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        )}

        {lead && (
          <div className="grid gap-x-8 gap-y-16 lg:grid-cols-2">
            <ProjectFigure project={lead} featured />
            {rest.map((project, i) => (
              <ProjectFigure key={project.slug} project={project} delay={(i % 2) * 0.08} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">{t('index.noneFound')}</p>
        )}
      </Section>

      {featured && categoryTiles.length > 1 && (
        <Section tone="ink" space="lg">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <Eyebrow tone="dark" className="mb-6">
                {featured.client}
              </Eyebrow>
              <Display as="h2" size="sec" tone="dark">
                {featured.title}
              </Display>
            </div>
          </div>
          <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:mt-20 lg:grid-cols-5 lg:gap-x-6">
            {categoryTiles.map((tile, i) => (
              <li key={tile.key}>
                <Reveal delay={(i % 5) * 0.06}>
                  <LocalizedLink to={projectViewPath(featured, tile.key)} className="group block">
                    <MediaFrame src={tile.url} alt={tile.alt} ratio="4 / 5" hoverZoom />
                    <p className="mt-4 flex items-baseline justify-between gap-3 border-b border-white/15 pb-3 text-sm font-medium">
                      <span>{tile.label}</span>
                      <span className="tnum text-xs text-white/60">{String(tile.count).padStart(2, '0')}</span>
                    </p>
                  </LocalizedLink>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand title={t('index.ctaTitle')} description={t('index.ctaDescription')} />
    </>
  )
}
