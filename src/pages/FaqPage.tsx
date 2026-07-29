import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { CtaBand } from '@/components/shared/CtaBand'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getFaqs } from '@/lib/data'
import type { FaqCategory } from '@/content/types'

const CATEGORY_ORDER: FaqCategory[] = [
  'general',
  'quotes-pricing',
  'planning',
  'equipment',
  'technical',
]

export default function FaqPage() {
  const { t } = useTranslation(['faq', 'common'])
  const { locale } = useLocale()
  const faqs = getFaqs(locale)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <Seo title={t('seoTitle')} description={t('seoDescription')} path="/faq" jsonLd={faqSchema} />
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        breadcrumbs={[{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('eyebrow') }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page mx-auto max-w-3xl space-y-14">
          {CATEGORY_ORDER.map((category) => {
            const items = faqs.filter((f) => f.category === category)
            if (items.length === 0) return null
            return (
              <div key={category}>
                <h2 className="mb-4 text-xl font-bold text-navy">{t(`categories.${category}`)}</h2>
                <FaqAccordion faqs={items} />
              </div>
            )
          })}
        </div>
      </section>

      <CtaBand
        title={t('ctaTitle')}
        description={t('ctaDescription')}
        primaryLabel={t('buttons.contactUs', { ns: 'common' })}
        primaryTo="/contact"
        secondaryLabel={t('buttons.getQuote', { ns: 'common' })}
        secondaryTo="/quote"
      />
    </>
  )
}
