import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Compass, HeartHandshake, TrendingUp, Plane } from 'lucide-react'

const benefits = [
  { icon: Compass, title: 'Real Technical Ownership', description: 'You own your discipline on-site — no second-guessing from a generalist manager who has never run a show.' },
  { icon: TrendingUp, title: 'Growth Across Disciplines', description: 'Cross-train across LED, audio, lighting, and broadcast as your career develops, not siloed into one lane permanently.' },
  { icon: Plane, title: 'Nationwide Project Variety', description: 'Work spans venues and cities across Japan — no two months look the same.' },
  { icon: HeartHandshake, title: 'Bilingual, International Teams', description: 'Collaborate daily with international clients and colleagues in a genuinely bilingual working environment.' },
]

const openRoles = [
  { title: 'Live Sound Engineer', location: 'Tokyo', type: 'Full-time' },
  { title: 'LED & Video Technician', location: 'Osaka', type: 'Full-time' },
  { title: 'Event Project Manager (Bilingual JP/EN)', location: 'Tokyo', type: 'Full-time' },
  { title: 'Lighting Programmer', location: 'Nationwide (Travel Required)', type: 'Full-time' },
  { title: 'Broadcast Camera Operator', location: 'Tokyo', type: 'Contract' },
]

export default function CareersPage() {
  return (
    <>
      <Seo
        title="Careers"
        description="Join TOTAL MEDIA's event production and technical team. Explore open roles across LED, audio, lighting, and project management, based in Tokyo and nationwide."
        path="/careers"
      />
      <PageHero
        eyebrow="Careers"
        title="Build the Events Behind the Scenes"
        description="We hire people who'd rather own a technical discipline than manage around one. If that's you, we'd like to talk."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Careers' }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Why TOTAL MEDIA" title="What It's Like to Work Here" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-border p-6">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-signal-soft text-signal">
                    <b.icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold text-navy">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Open Roles" title="Current Openings" />
          <div className="mt-10 divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
            {openRoles.map((role) => (
              <div
                key={role.title}
                className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-navy">{role.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{role.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{role.type}</Badge>
                  <Button asChild size="sm" className="bg-navy text-white hover:bg-navy-deep">
                    <a href={`mailto:careers@totalmedia.co.jp?subject=${encodeURIComponent(`Application: ${role.title}`)}`}>
                      Apply
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Don't see the right role listed? Send your background to{' '}
            <a href="mailto:careers@totalmedia.co.jp" className="font-semibold text-signal hover:underline">
              careers@totalmedia.co.jp
            </a>{' '}
            — we keep strong applications on file for future openings.
          </p>
        </div>
      </section>
    </>
  )
}
