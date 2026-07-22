import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
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
  const projects = getProjects()
  const [active, setActive] = useState<ProjectCategory | 'All'>('All')

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  )

  return (
    <>
      <Seo
        title="Portfolio"
        description="Explore TOTAL MEDIA's portfolio of corporate events, conferences, exhibitions, hybrid productions, and outdoor ceremonies delivered across Japan."
        path="/portfolio"
      />
      <PageHero
        eyebrow="Portfolio"
        title="Selected Work Across Japan"
        description="A sample of the events our planning, technical design, and on-site teams have delivered — filter by format below."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Portfolio' }]}
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
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <Reveal key={project.slug} delay={(i % 6) * 0.05}>
                <Link to={`/portfolio/${project.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                      <AbstractVisual seed={project.visualSeed} />
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
                </Link>
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-10 text-center text-muted-foreground">
              No projects in this category yet.
            </p>
          )}
        </div>
      </section>

      <CtaBand
        title="Want Results Like These?"
        description="Tell us about your event and we'll show you how we'd approach it."
      />
    </>
  )
}
