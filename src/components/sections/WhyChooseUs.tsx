import { ShieldCheck, MapPinned, Warehouse, Languages, Radio, Receipt } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'

const ICONS = [ShieldCheck, MapPinned, Warehouse, Languages, Radio, Receipt]

interface Reason {
  title: string
  description: string
}

export function WhyChooseUs() {
  const { t } = useTranslation('home')
  const reasons = t('whyChooseUs.reasons', { returnObjects: true }) as Reason[]

  return (
    <section className="bg-navy py-20 text-white lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={t('whyChooseUs.eyebrow')}
          title={t('whyChooseUs.title')}
          description={t('whyChooseUs.description')}
          tone="dark"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => {
            const Icon = ICONS[i] ?? ShieldCheck
            return (
              <Reveal key={reason.title} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-signal/15 text-signal">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{reason.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
