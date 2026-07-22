import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { getIndustries } from '@/lib/data'

export function IndustriesServed() {
  const industries = getIndustries()

  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Who We Serve"
          title="Industries We Work With"
          description="Different sectors bring different constraints — procurement cycles, protocol, brand standards. We scope to the client, not a template."
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <Reveal key={industry.slug} delay={(i % 6) * 0.04}>
              <Link
                to={`/industries#${industry.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border px-5 py-4 transition-colors hover:border-signal/30 hover:bg-signal-soft/40"
              >
                <span className="font-medium text-navy">{industry.name}</span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-signal" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
