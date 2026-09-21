import { useTranslation } from 'react-i18next'
import { Section } from '@/components/cinematic/Section'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'

interface Reason {
  title: string
  description: string
}

/** Six operational commitments as a numbered hairline grid — no icons, no
 * cards; the numerals and rules carry the structure. */
export function WhyChooseUs() {
  const { t } = useTranslation('home')
  const reasons = t('whyChooseUs.reasons', { returnObjects: true }) as Reason[]

  return (
    <Section tone="paper" space="lg">
      <SectionHeading
        eyebrow={t('whyChooseUs.eyebrow')}
        title={t('whyChooseUs.title')}
        description={t('whyChooseUs.description')}
      />

      <div className="mt-16 grid border-t border-ink sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
        {reasons.map((reason, i) => (
          <Reveal
            key={reason.title}
            delay={(i % 3) * 0.07}
            className="border-b border-line py-10 sm:pr-10 lg:min-h-[15rem] lg:pr-12"
          >
            <p className="eyebrow tnum mb-8 text-blue">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="text-xl font-medium leading-snug tracking-[-0.02em] lg:text-2xl">{reason.title}</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
