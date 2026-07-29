import { ArrowRight, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { ContentVisual } from '@/components/shared/ContentVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { getFeaturedProjects } from '@/lib/data'

export function FeaturedProjects() {
  const { t } = useTranslation('home')
  const projects = getFeaturedProjects(3)

  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={t('featuredProjects.eyebrow')}
            title={t('featuredProjects.title')}
            description={t('featuredProjects.description')}
          />
          <LocalizedLink
            to="/portfolio"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-signal hover:underline sm:flex"
          >
            {t('featuredProjects.viewPortfolio')} <ArrowRight className="size-4" />
          </LocalizedLink>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.08}>
              <LocalizedLink to={`/portfolio/${project.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    <ContentVisual imageUrl={project.imageUrl} seed={project.visualSeed} alt={project.title} />
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy">
                    {project.category}
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

        <div className="mt-8 sm:hidden">
          <LocalizedLink to="/portfolio" className="flex items-center gap-1.5 text-sm font-semibold text-signal">
            {t('featuredProjects.viewPortfolio')} <ArrowRight className="size-4" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}
