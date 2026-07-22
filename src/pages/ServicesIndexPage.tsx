import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { getServices } from '@/lib/data'
import type { Service } from '@/content/types'

function ServiceCard({ service, delay }: { service: Service; delay: number }) {
  return (
    <Reveal delay={delay}>
      <Link
        to={`/services/${service.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:-translate-y-1 hover:border-signal/30 hover:shadow-lg hover:shadow-navy/5"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
            <AbstractVisual seed={service.slug} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-semibold text-navy">{service.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {service.shortDescription}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-signal opacity-0 transition-opacity group-hover:opacity-100">
            Learn more <ArrowRight className="size-3.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  )
}

export default function ServicesIndexPage() {
  const services = getServices()
  const eventServices = services.filter((s) => s.category === 'event-type')
  const technicalServices = services.filter((s) => s.category === 'technical')

  return (
    <>
      <Seo
        title="Event Production Services"
        description="Explore TOTAL MEDIA's full range of event production and technical services across Japan — from corporate events and conferences to LED, audio, and lighting solutions."
        path="/services"
      />
      <PageHero
        eyebrow="Services"
        title="Every Discipline an Event Requires"
        description="Engaged individually or as a full production — planning, technical design, and on-site execution from one accountable team."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="By Event Type"
            title="Event Formats We Produce"
            description="From internal town halls to large public exhibitions, scoped to the format, not a fixed template."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventServices.map((service, i) => (
              <ServiceCard key={service.slug} service={service} delay={(i % 3) * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="By Technical Discipline"
            title="Technical Services We Provide"
            description="Individual disciplines available on their own, or bundled under one technical director."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {technicalServices.map((service, i) => (
              <ServiceCard key={service.slug} service={service} delay={(i % 3) * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Not Sure Which Service Fits?"
        description="Talk to us about what you're planning — we'll recommend the right scope, not the most expensive one."
        primaryLabel="Request a Quote"
        secondaryLabel="Explore Solutions"
        secondaryTo="/solutions"
      />
    </>
  )
}
