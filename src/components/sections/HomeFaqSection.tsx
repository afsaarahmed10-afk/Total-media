import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Section } from '@/components/cinematic/Section'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getFaqs } from '@/lib/data'

const HOME_FAQ_SLUGS = [
  'faq-who-we-work-with',
  'faq-nationwide-coverage',
  'faq-quote-turnaround',
  'faq-what-makes-different',
  'faq-lead-time',
  'faq-hybrid-virtual-reliability',
]

export function HomeFaqSection() {
  const { t } = useTranslation('home')
  const { locale } = useLocale()
  const faqs = getFaqs(locale)
  const homeFaqs = HOME_FAQ_SLUGS.map((slug) => faqs.find((f) => f.slug === slug)).filter(
    (f): f is (typeof faqs)[number] => Boolean(f),
  )

  return (
    <Section tone="mist" space="lg">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow={t('homeFaq.eyebrow')}
            title={t('homeFaq.title')}
            description={t('homeFaq.description')}
          />
          <LocalizedLink
            to="/faq"
            className="group mt-8 inline-flex items-center gap-2 border-b border-ink/30 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-ink"
          >
            {t('homeFaq.viewAll')}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </LocalizedLink>
        </div>
        <div className="lg:col-span-7">
          <FaqAccordion faqs={homeFaqs} />
        </div>
      </div>
    </Section>
  )
}
