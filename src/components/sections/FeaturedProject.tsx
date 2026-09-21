import { useTranslation } from 'react-i18next'
import { CineButton } from '@/components/cinematic/CineButton'
import { Display } from '@/components/cinematic/Display'
import { Eyebrow } from '@/components/cinematic/Eyebrow'
import { MediaFrame } from '@/components/cinematic/MediaFrame'
import { Section } from '@/components/cinematic/Section'
import { Reveal } from '@/components/shared/Reveal'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { getFeaturedProject, pickImage, projectViewPath } from '@/lib/featured-project'

/** Homepage case-study feature: big title + facts on the left, one large
 * real photograph on the right (the template's "Ideas become experiences"
 * split). Everything shown is real project data — nothing invented. */
export function FeaturedProject() {
  const { t } = useTranslation('home')
  const project = getFeaturedProject()
  if (!project) return null

  const image =
    pickImage(project, 'led') ?? pickImage(project, 'stage', 1) ?? pickImage(project, 'stage') ?? project.images?.[0]
  const facts = [
    { label: t('featured.client'), value: project.client },
    { label: t('featured.venue'), value: project.venue || project.location },
    { label: t('featured.date'), value: project.dateLabel || String(project.year) },
  ]

  return (
    <Section tone="ink" space="lg">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow tone="dark" className="mb-6">
            {t('featured.eyebrow')}
          </Eyebrow>
          <Display as="h2" size="lg" tone="dark">
            {project.title}
          </Display>
          {project.summary && (
            <p className="mt-8 max-w-md text-base leading-relaxed text-white/65">{project.summary}</p>
          )}
          <dl className="mt-10 max-w-md border-t border-white/15">
            {facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[6rem_1fr] gap-4 border-b border-white/15 py-4 text-sm">
                <dt className="eyebrow pt-1 text-white/45">{fact.label}</dt>
                <dd className="text-white/90">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <CineButton to={projectViewPath(project)}>{t('featured.viewProject')}</CineButton>
            <CineButton to="/portfolio" variant="link" tone="dark" arrow={false}>
              {t('featured.viewAllWork')}
            </CineButton>
          </div>
        </div>

        <div className="lg:col-span-7">
          <LocalizedLink to={projectViewPath(project)} className="group block" aria-label={project.title}>
            <MediaFrame
              src={image?.url ?? project.imageUrl}
              alt={image?.alt ?? project.title}
              ratio="4 / 3"
              hoverZoom
              reveal
              seed={project.visualSeed}
            />
          </LocalizedLink>
          <Reveal delay={0.1}>
            <p className="mt-4 flex items-baseline justify-between gap-6 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-white/60">
              <span>01 / {project.category}</span>
              <span className="text-right text-white">
                {project.location} · {project.year}
              </span>
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
