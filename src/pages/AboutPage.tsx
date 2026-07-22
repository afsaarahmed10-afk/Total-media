import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { CtaBand } from '@/components/shared/CtaBand'
import { Target, Users, Globe2, ShieldCheck } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Precision Over Improvisation',
    description:
      'Every technical plan is rehearsed before it\'s live. We treat contingency planning as part of the design, not a reaction to something going wrong.',
  },
  {
    icon: ShieldCheck,
    title: 'One Accountable Team',
    description:
      'We\'d rather say no to a job than hand you a coordination burden across five vendors. If we take it on, we own it end to end.',
  },
  {
    icon: Globe2,
    title: 'Built for International Clients',
    description:
      'Bilingual project management isn\'t a premium add-on — it\'s how every international engagement is staffed from day one.',
  },
  {
    icon: Users,
    title: 'Quiet, Disciplined Crews',
    description:
      'The best technical production is the kind your audience never notices. Our crews are trained to be invisible until they\'re needed.',
  },
]

const team = [
  {
    name: 'Aiko Tanaka',
    role: 'Head of Event Planning',
    bio: 'Leads planning and client strategy across our corporate and conference engagements, with a focus on translating business objectives into event design.',
  },
  {
    name: 'Kenji Watanabe',
    role: 'Technical Director, LED & Visual Systems',
    bio: 'Oversees LED, lighting, and visual systems design — the specification work that determines whether a stage looks right from every seat in the room.',
  },
  {
    name: 'Daichi Suzuki',
    role: 'Senior Production Manager',
    bio: 'Runs build and strike operations for exhibitions and large-scale productions, where the schedule leaves no margin for improvisation.',
  },
  {
    name: 'Sarah Whitfield',
    role: 'Director of International Accounts',
    bio: 'The primary point of contact for international clients planning their first event in Japan, from venue sourcing through final handover.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About TOTAL MEDIA"
        description="TOTAL MEDIA is a full-service event production and technical solutions company operating across Japan. Learn about our approach, values, and team."
        path="/about"
      />
      <PageHero
        eyebrow="About Us"
        title="A Technical Standard Built Over Years, Not Assumed on Day One"
        description="TOTAL MEDIA was built around a simple observation: most event failures happen at the coordination seams between vendors, not within any single discipline."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-signal">
              Our Story
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
              From equipment rental to full production, because clients kept asking for both.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                TOTAL MEDIA started as a technical equipment provider and grew into a full-service
                production company because our clients kept asking for the same thing: someone to
                own the whole event, not just the gear. Today, equipment rental is one part of a
                broader practice that includes event planning, technical direction, and on-site
                management.
              </p>
              <p>
                We operate nationwide across Japan, serving international companies, Japanese
                enterprises, government bodies, universities, and luxury brands — organizations
                that need production values matching the seriousness of what they're announcing,
                launching, or presenting.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-mist py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="What We Believe" title="Our Values" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-border bg-white p-6">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-signal-soft text-signal">
                    <value.icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold text-navy">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Leadership"
            title="The Team Behind the Production"
            description="A small group of specialists, each owning a discipline that has to be right."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <div>
                  <div className="aspect-square overflow-hidden rounded-xl">
                    <AbstractVisual seed={member.name} variant="facet" />
                  </div>
                  <h3 className="mt-4 font-semibold text-navy">{member.name}</h3>
                  <p className="text-sm font-medium text-signal">{member.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Want to Talk Through Your Event?"
        description="Tell us what you're planning — we'll respond with next steps within 1–2 business days."
      />
    </>
  )
}
