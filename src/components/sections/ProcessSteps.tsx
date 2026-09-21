import { useTranslation } from 'react-i18next'
import { Section } from '@/components/cinematic/Section'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'

interface Step {
  number: string
  title: string
  description: string
}

export function ProcessSteps() {
  const { t } = useTranslation('home')
  const steps = t('processSteps.steps', { returnObjects: true }) as Step[]

  return (
    <Section tone="ink" space="lg">
      <SectionHeading
        tone="dark"
        eyebrow={t('processSteps.eyebrow')}
        title={t('processSteps.title')}
        description={t('processSteps.description')}
      />

      <ol className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-5">
        {steps.map((step, i) => (
          <li key={step.number} className="border-t border-white/25 pt-6">
            <Reveal delay={i * 0.08}>
              <p className="eyebrow tnum text-blue-tint">{step.number}</p>
              <h3 className="mt-8 text-xl font-medium tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{step.description}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
