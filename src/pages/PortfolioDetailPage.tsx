import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { Eyebrow } from '@/components/cinematic/Eyebrow'
import { MediaFrame } from '@/components/cinematic/MediaFrame'
import { Section } from '@/components/cinematic/Section'
import { PosterVideo } from '@/components/sections/PosterVideo'
import { ProjectGallery } from '@/components/sections/ProjectGallery'
import { getProjectBySlug, getServicesBySlugs, getProjects, getEquipmentItems } from '@/lib/data'
import { pickImage } from '@/lib/featured-project'
import { useLocale } from '@/lib/locale/LocaleContext'
import { trackEvent } from '@/lib/analytics'
import NotFoundPage from '@/pages/NotFoundPage'

/** Unfinished admin template text such as "[Describe Total Media's role…]" or
 * "[ADD ANY SPECIFIC RESULT…]" must never render on the public site. The
 * admin form still shows it, so nothing is lost — it just isn't published
 * until someone replaces it with real copy. */
const isPlaceholder = (paragraph: string) => /\[\s*(describe|add|insert|todo|tbd)\b[^\]]*\]/i.test(paragraph)

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

  const heroImage = pickImage(project, 'stage')?.url ?? project.imageUrl
  const description = project.description.filter((p) => !isPlaceholder(p))
  const facts = [
    { label: t('detail.client'), value: project.client },
    { label: t('detail.venue'), value: project.venue || project.location },
    { label: t('detail.date'), value: project.dateLabel || String(project.year) },
    { label: t('detail.format'), value: t(`categories.${project.category}`) },
  ]

  const storyBlocks = project.story
    ? (
        [
          ['theEvent', project.story.theEvent],
          ['ourRole', project.story.ourRole],
          ['theExperience', project.story.theExperience],
          ['theResult', project.story.theResult],
        ] as const
      )
        .map(([key, paragraphs]) => [key, paragraphs.filter((p) => !isPlaceholder(p))] as const)
        .filter(([, paragraphs]) => paragraphs.length > 0)
    : []

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
        image={heroImage}
        imageScrim="soft"
        breadcrumbs={breadcrumbs}
        className="lg:min-h-[78vh]"
      >
        <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-white/20 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="eyebrow mb-2 text-white/60">{fact.label}</dt>
              <dd className="text-sm leading-snug text-white">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <Section tone="paper" space="lg">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {description.length > 0 && (
            <Reveal className="lg:col-span-7">
              <Eyebrow className="mb-6">{t('detail.aboutProject')}</Eyebrow>
              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground lg:text-xl lg:leading-relaxed">
                {description.map((paragraph, i) => (
                  <p key={i} className={i === 0 ? 'text-ink' : undefined}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          )}

          {/* With no long-form description the lists span the full width as
              a tidy row instead of leaving an empty left column. */}
          <aside
            className={
              description.length > 0
                ? 'space-y-12 lg:col-span-4 lg:col-start-9'
                : 'grid gap-12 lg:col-span-12 lg:grid-cols-3 lg:gap-16'
            }
          >
            {project.stats.length > 0 && (
              <div>
                <Eyebrow className="mb-5 border-b border-ink pb-5 !text-ink">{t('detail.results')}</Eyebrow>
                <dl>
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="border-b border-line py-4">
                      <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                      <dd className="mt-1 text-lg font-medium tracking-[-0.01em]">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div>
              <Eyebrow className="mb-5 border-b border-ink pb-5 !text-ink">{t('detail.servicesUsed')}</Eyebrow>
              <ul>
                {services.map((service) => (
                  <li key={service.slug} className="border-b border-line">
                    <LocalizedLink
                      to={`/services/${service.slug}`}
                      className="group flex items-center justify-between py-3 text-sm transition-colors hover:text-blue"
                    >
                      {service.name}
                      <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        ↗
                      </span>
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>

            {equipmentUsed.length > 0 && (
              <div>
                <Eyebrow className="mb-5 border-b border-ink pb-5 !text-ink">{t('detail.equipmentUsed')}</Eyebrow>
                <ul>
                  {equipmentUsed.map((eq) => (
                    <li key={eq.slug} className="border-b border-line">
                      <LocalizedLink
                        to={`/equipment/${eq.categorySlug}/${eq.slug}`}
                        className="group flex items-center justify-between py-3 text-sm transition-colors hover:text-blue"
                      >
                        {eq.name}
                        <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          ↗
                        </span>
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Section>

      {storyBlocks.length > 0 && (
        <Section tone="mist" space="lg">
          <div className="grid border-t border-ink sm:grid-cols-2">
            {storyBlocks.map(([key, paragraphs], i) => (
              <Reveal
                key={key}
                delay={(i % 2) * 0.08}
                className="border-b border-line py-10 sm:pr-12 lg:py-14"
              >
                <p className="eyebrow tnum mb-6 text-blue">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="display-md">{t(`detail.${key}`)}</h3>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  {paragraphs.map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {project.images && project.images.length > 0 && (
        <ProjectGallery images={project.images} title={project.title} />
      )}

      {project.videos && project.videos.length > 0 && (
        <Section tone="paper" space="lg">
          <SectionHeading eyebrow={t('detail.videos')} title={project.title} />
          <div className="mt-14 grid gap-x-8 gap-y-14 lg:mt-20 lg:grid-cols-2">
            {project.videos.map((video, i) => (
              <Reveal
                key={video.id}
                className={project.videos!.length === 1 ? 'lg:col-span-2' : i === 0 ? 'lg:col-span-2' : undefined}
              >
                <PosterVideo video={video} projectSlug={project.slug} />
                <h3 className="mt-5 text-lg font-medium tracking-[-0.015em]">{video.title}</h3>
                {video.description && (
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{video.description}</p>
                )}
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {otherProjects.length > 0 && (
        <Section tone="mist" space="lg">
          <SectionHeading
            eyebrow={t('detail.moreWork')}
            title={t('detail.moreProjects', { category: t(`categories.${project.category}`) })}
          />
          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-3 lg:mt-20">
            {otherProjects.map((p) => (
              <LocalizedLink key={p.slug} to={`/portfolio/${p.slug}`} className="group block">
                <MediaFrame src={p.imageUrl} alt={p.title} seed={p.visualSeed} ratio="4 / 3" hoverZoom />
                <h3 className="mt-5 text-lg font-medium tracking-[-0.015em] transition-colors group-hover:text-blue">
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground">{p.client}</p>
              </LocalizedLink>
            ))}
          </div>
        </Section>
      )}

      <CtaBand title={t('detail.ctaTitle')} description={t('detail.ctaDescription')} />
    </>
  )
}
