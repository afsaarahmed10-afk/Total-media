import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { ContentVisual } from '@/components/shared/ContentVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { getProjectBySlug, getServicesBySlugs, getProjects, getEquipmentItems } from '@/lib/data'
import { useLocale } from '@/lib/locale/LocaleContext'
import { trackEvent } from '@/lib/analytics'
import type { ProjectImage } from '@/content/types'
import NotFoundPage from '@/pages/NotFoundPage'

/** Groups a project's gallery by `category`, preserving first-appearance
 * order (images already arrive sorted by sortOrder) — uncategorized
 * images (empty string) render as a single unlabeled group. */
function groupImagesByCategory(images: ProjectImage[]): [string, ProjectImage[]][] {
  const groups = new Map<string, ProjectImage[]>()
  for (const image of images) {
    const key = image.category || ''
    const list = groups.get(key)
    if (list) list.push(image)
    else groups.set(key, [image])
  }
  return Array.from(groups.entries())
}

export default function PortfolioDetailPage() {
  const { t } = useTranslation(['portfolio', 'common'])
  const { locale } = useLocale()
  const { slug = '' } = useParams()
  const project = getProjectBySlug(slug)

  useEffect(() => {
    if (project) trackEvent('project_view', { project_slug: project.slug })
  }, [project])

  if (!project) return <NotFoundPage />

  const services = getServicesBySlugs(project.servicesUsed, locale)
  const equipmentItems = getEquipmentItems()
  const equipmentUsed = project.equipmentUsed
    .map((eqSlug) => equipmentItems.find((e) => e.slug === eqSlug))
    .filter((e): e is (typeof equipmentItems)[number] => Boolean(e))
  const otherProjects = getProjects()
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, 3)

  const breadcrumbs = [
    { label: t('home', { ns: 'common' }), to: '/' },
    { label: t('index.eyebrow'), to: '/portfolio' },
    { label: project.title },
  ]

  // Real, already-published facts only — no invented attendance, pricing,
  // or performer data. `description` falls back to the (also real,
  // already-rendered-on-page) story intro when `summary` isn't filled in,
  // rather than shipping an empty string into either schema.
  const schemaDescription =
    project.summary || project.story?.theEvent?.[0] || project.title

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: schemaDescription,
    about: t(`categories.${project.category}`),
    creator: { '@type': 'Organization', name: 'TOTAL MEDIA' },
    ...(project.imageUrl ? { image: project.imageUrl } : {}),
  }

  // Event schema only for projects that actually carry real event dates —
  // most projects won't, and CreativeWork above already covers those.
  const eventSchema = project.eventStartDate
    ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: project.title,
        description: schemaDescription,
        startDate: project.eventStartDate,
        ...(project.eventEndDate ? { endDate: project.eventEndDate } : {}),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: project.venue || project.location,
          address: project.location,
        },
        organizer: { '@type': 'Organization', name: 'TOTAL MEDIA', url: SITE_URL },
        ...(project.imageUrl ? { image: [project.imageUrl] } : {}),
      }
    : null

  return (
    <>
      <Seo
        title={`${project.title} — ${project.client}`}
        description={schemaDescription}
        path={`/portfolio/${project.slug}`}
        jsonLd={eventSchema ? [projectSchema, eventSchema] : projectSchema}
        breadcrumbs={breadcrumbs}
      />
      <PageHero
        eyebrow={t(`categories.${project.category}`)}
        title={project.title}
        description={project.summary}
        visualSeed={project.visualSeed}
        breadcrumbs={breadcrumbs}
      >
        <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/80">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4 text-signal" /> {project.venue || project.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4 text-signal" /> {project.dateLabel || project.year}
          </span>
          <span className="font-medium text-white">{project.client}</span>
        </div>
      </PageHero>

      <section className="py-20 lg:py-24">
        <div className="container-page grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <div className="aspect-[16/9] overflow-hidden rounded-xl">
                <ContentVisual
                  imageUrl={project.imageUrl}
                  seed={`${project.visualSeed}-hero`}
                  alt={project.title}
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 space-y-5 text-lg leading-relaxed text-muted-foreground">
                {project.description.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="space-y-8">
            {project.stats.length > 0 && (
              <div className="rounded-xl border border-border p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('detail.results')}
                </h3>
                <dl className="mt-4 space-y-4">
                  {project.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                      <dd className="text-xl font-bold text-navy">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="rounded-xl border border-border p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t('detail.servicesUsed')}
              </h3>
              <ul className="mt-4 space-y-2">
                {services.map((service) => (
                  <li key={service.slug}>
                    <LocalizedLink
                      to={`/services/${service.slug}`}
                      className="flex items-center justify-between text-sm text-charcoal hover:text-signal"
                    >
                      {service.name}
                      <ArrowRight className="size-3.5" />
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>

            {equipmentUsed.length > 0 && (
              <div className="rounded-xl border border-border p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('detail.equipmentUsed')}
                </h3>
                <ul className="mt-4 space-y-2">
                  {equipmentUsed.map((eq) => (
                    <li key={eq.slug}>
                      <LocalizedLink
                        to={`/equipment/${eq.categorySlug}/${eq.slug}`}
                        className="flex items-center justify-between text-sm text-charcoal hover:text-signal"
                      >
                        {eq.name}
                        <ArrowRight className="size-3.5" />
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {project.story && (
        <section className="bg-mist py-20 lg:py-24">
          <div className="container-page grid gap-10 sm:grid-cols-2">
            {(
              [
                ['theEvent', project.story.theEvent],
                ['ourRole', project.story.ourRole],
                ['theExperience', project.story.theExperience],
                ['theResult', project.story.theResult],
              ] as const
            )
              .filter(([, paragraphs]) => paragraphs.length > 0)
              .map(([key, paragraphs], i) => (
                <Reveal key={key} delay={i * 0.05}>
                  <h3 className="text-lg font-semibold text-navy">{t(`detail.${key}`)}</h3>
                  <div className="mt-3 space-y-3 text-muted-foreground">
                    {paragraphs.map((paragraph, j) => (
                      <p key={j}>{paragraph}</p>
                    ))}
                  </div>
                </Reveal>
              ))}
          </div>
        </section>
      )}

      {project.images && project.images.length > 0 && (
        <section className="py-20 lg:py-24">
          <div className="container-page">
            <SectionHeading eyebrow={t('detail.gallery')} title={project.title} />
            <div className="mt-10 space-y-12">
              {groupImagesByCategory(project.images).map(([category, images]) => (
                <div key={category || 'uncategorized'}>
                  {category && <h3 className="mb-4 text-lg font-semibold text-navy">{category}</h3>}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((image) => (
                      <Reveal key={image.id}>
                        <div className="aspect-[4/3] overflow-hidden rounded-xl">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.videos && project.videos.length > 0 && (
        <section className="bg-mist py-20 lg:py-24">
          <div className="container-page">
            <SectionHeading eyebrow={t('detail.videos')} title={project.title} />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {project.videos.map((video) => (
                <Reveal key={video.id}>
                  <div className="overflow-hidden rounded-xl bg-black">
                    <video
                      controls
                      preload="none"
                      poster={video.posterUrl || undefined}
                      src={video.url}
                      className="aspect-video w-full"
                    />
                  </div>
                  <h3 className="mt-3 font-semibold text-navy">{video.title}</h3>
                  {video.description && <p className="text-sm text-muted-foreground">{video.description}</p>}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section className="bg-mist py-20 lg:py-24">
          <div className="container-page">
            <SectionHeading
              eyebrow={t('detail.moreWork')}
              title={t('detail.moreProjects', { category: t(`categories.${project.category}`) })}
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {otherProjects.map((p) => (
                <LocalizedLink key={p.slug} to={`/portfolio/${p.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl">
                    <div className="transition-transform duration-500 group-hover:scale-105">
                      <ContentVisual imageUrl={p.imageUrl} seed={p.visualSeed} alt={p.title} />
                    </div>
                  </div>
                  <h3 className="mt-3 font-semibold text-navy group-hover:text-signal">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.client}</p>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand title={t('detail.ctaTitle')} description={t('detail.ctaDescription')} />
    </>
  )
}
