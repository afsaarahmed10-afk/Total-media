import { Reveal } from '@/components/shared/Reveal'

const stats = [
  { value: '15+', label: 'Years producing events across Japan' },
  { value: '40+', label: 'Cities served nationwide' },
  { value: '10', label: 'Equipment categories in-house' },
  { value: '99.9%', label: 'Live streaming uptime record' },
]

export function CompanyIntro() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-signal">
              Who We Are
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
              Equipment rental is one part of what we do. It was never the whole business.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                TOTAL MEDIA is a complete event production and technical
                solutions company operating nationwide across Japan. We plan
                events, design technical production, manage exhibitions and
                conferences on-site, and operate the LED, audio, lighting,
                and camera systems ourselves — as one accountable team, not a
                coordination exercise across separate vendors.
              </p>
              <p>
                International companies, Japanese corporations, event
                agencies, government bodies, universities, and luxury brands
                come to us when the technical execution has to be right the
                first time, with no second take.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
