import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
    <section className="bg-mist py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={t('homeFaq.eyebrow')}
              title={t('homeFaq.title')}
              description={t('homeFaq.description')}
            />
            <LocalizedLink
              to="/faq"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-signal hover:underline"
            >
              {t('homeFaq.viewAll')} <ArrowRight className="size-4" />
            </LocalizedLink>
          </div>
          <FaqAccordion faqs={homeFaqs} />
        </div>
      </div>
    </section>
  )
}
