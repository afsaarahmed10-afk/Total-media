import { useTranslation } from 'react-i18next'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'

interface Step {
  number: string
  title: string
  description: string
}

export function ProcessSteps() {
  const { t } = useTranslation('home')
  const steps = t('processSteps.steps', { returnObjects: true }) as Step[]

  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={t('processSteps.eyebrow')}
          title={t('processSteps.title')}
          description={t('processSteps.description')}
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
