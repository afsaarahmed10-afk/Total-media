import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'

const steps = [
  {
    number: '01',
    title: 'Consultation',
    description: 'We start with your objectives, audience, and constraints — not a standard package.',
  },
  {
    number: '02',
    title: 'Proposal & Design',
    description: 'A detailed technical plan and transparent, itemized pricing within 1–2 business days.',
  },
  {
    number: '03',
    title: 'Pre-Production',
    description: 'Venue coordination, equipment allocation, and technical rehearsal before event day.',
  },
  {
    number: '04',
    title: 'Live Execution',
    description: 'On-site production management and technical operation by the team that designed it.',
  },
  {
    number: '05',
    title: 'Post-Event Review',
    description: 'A structured report and asset handover — what worked, and what to refine next time.',
  },
]

export function ProcessSteps() {
  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="How We Work"
          title="Our Process"
          description="The same five stages whether the event is a boardroom briefing or a two-day conference."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.08}>
              <div className="relative">
                <p className="text-4xl font-extrabold tracking-tight text-signal/25">
                  {step.number}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="mt-6 hidden h-px w-full bg-border lg:block" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
