import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { getSolutions, getServicesBySlugs } from '@/lib/data'

export default function SolutionsPage() {
  const solutions = getSolutions()

  return (
    <>
      <Seo
        title="Solutions"
        description="TOTAL MEDIA's packaged solutions bundle multiple services together for hybrid events, large-format visuals, broadcast production, and full technical delivery."
        path="/solutions"
      />
      <PageHero
        eyebrow="Solutions"
        title="Multiple Disciplines, Packaged Around Your Use Case"
        description="Where Services covers individual disciplines, Solutions bundles the ones that consistently work together — designed as one coordinated plan, not separate line items."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Solutions' }]}
      />

      <div className="divide-y divide-border">
        {solutions.map((solution, index) => {
          const includedServices = getServicesBySlugs(solution.includedServiceSlugs)
          const isEven = index % 2 === 0

          return (
            <section key={solution.slug} id={solution.slug} className="scroll-mt-24 py-20 lg:py-24">
              <div className="container-page">
                <div
                  className={`grid gap-12 lg:grid-cols-2 lg:gap-16 ${
                    isEven ? '' : 'lg:[&>*:first-child]:order-2'
                  }`}
                >
                  <Reveal>
                    <div className="overflow-hidden rounded-2xl">
                      <div className="aspect-[4/3]">
                        <AbstractVisual seed={solution.slug} />
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <p className="text-sm font-semibold uppercase tracking-wider text-signal">
                      Solution
                    </p>
                    <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
                      {solution.name}
                    </h2>
                    <p className="mt-3 text-lg font-medium text-charcoal">{solution.heroStatement}</p>

                    <div className="mt-6 space-y-4 text-muted-foreground">
                      {solution.overview.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      {solution.highlights.map((highlight) => (
                        <div key={highlight.title} className="rounded-lg bg-mist p-4">
                          <p className="font-semibold text-navy">{highlight.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {highlight.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {includedServices.map((service) => (
                        <Link
                          key={service.slug}
                          to={`/services/${service.slug}`}
                          className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-charcoal hover:border-signal/40 hover:text-signal"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>

                    <Link
                      to="/quote"
                      className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-signal hover:underline"
                    >
                      Request a quote for this solution <ArrowRight className="size-4" />
                    </Link>
                  </Reveal>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <CtaBand
        title="Need a Custom Combination?"
        description="If your event doesn't map cleanly onto one solution, we'll scope a custom plan around it."
      />
    </>
  )
}
