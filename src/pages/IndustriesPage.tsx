import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { getIndustries } from '@/lib/data'

export default function IndustriesPage() {
  const industries = getIndustries()

  return (
    <>
      <Seo
        title="Industries We Serve"
        description="TOTAL MEDIA works with international companies, Japanese corporations, government bodies, universities, hotels, MICE clients, and luxury brands across Japan."
        path="/industries"
      />
      <PageHero
        eyebrow="Industries"
        title="Sector-Specific Experience, Not a Generic Template"
        description="Different sectors bring different procurement cycles, protocol, and brand standards. We scope every engagement to the client in front of us."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Industries' }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page space-y-16">
          {industries.map((industry, i) => (
            <Reveal key={industry.slug} delay={i * 0.04}>
              <div id={industry.slug} className="scroll-mt-24 border-b border-border pb-14 last:border-0">
                <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                      {industry.name}
                    </h2>
                    <Link
                      to="/quote"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-signal hover:underline"
                    >
                      Request a quote <ArrowRight className="size-4" />
                    </Link>
                  </div>
                  <div>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {industry.description}
                    </p>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Common Engagements
                    </p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {industry.useCases.map((useCase) => (
                        <li
                          key={useCase}
                          className="rounded-md bg-mist px-3 py-2 text-sm text-navy"
                        >
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        title="Don't See Your Sector Listed?"
        description="We work across far more contexts than any list can capture. Tell us what you're planning."
      />
    </>
  )
}
