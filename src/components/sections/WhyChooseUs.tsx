import { ShieldCheck, MapPinned, Warehouse, Languages, Radio, Receipt } from 'lucide-react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'One Accountable Team',
    description:
      'Planning, technical design, and on-site execution from a single team — not a coordination exercise across separate vendors.',
  },
  {
    icon: MapPinned,
    title: 'Nationwide Coverage',
    description:
      'Equipment and crew logistics built for events across Japan, from major convention centers to regional venues.',
  },
  {
    icon: Warehouse,
    title: 'In-House Equipment',
    description:
      'LED, audio, lighting, and rigging maintained and calibrated on our own schedule — not subcontracted piecemeal.',
  },
  {
    icon: Languages,
    title: 'Bilingual by Default',
    description:
      'Japanese/English project management and on-site coordination as standard for international stakeholders.',
  },
  {
    icon: Radio,
    title: 'Redundant Technical Systems',
    description:
      'Dual circuits and backup paths for anything broadcast-critical, monitored by a dedicated technical director.',
  },
  {
    icon: Receipt,
    title: 'Transparent Pricing',
    description:
      'Every proposal itemizes equipment, labor, and production management separately — no bundled black-box pricing.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-navy py-20 text-white lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why TOTAL MEDIA"
          title="What Sets Us Apart"
          description="These aren't marketing lines — they're the operational commitments every proposal is built on."
          tone="dark"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={(i % 3) * 0.08}>
              <div className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-signal/15 text-signal">
                  <reason.icon className="size-5" />
                </div>
                <h3 className="text-base font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{reason.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
