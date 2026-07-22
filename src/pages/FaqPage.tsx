import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { CtaBand } from '@/components/shared/CtaBand'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { getFaqs } from '@/lib/data'
import type { FaqCategory } from '@/content/types'

const CATEGORY_LABELS: Record<FaqCategory, string> = {
  general: 'General',
  'quotes-pricing': 'Quotes & Pricing',
  equipment: 'Equipment',
  planning: 'Planning & Timeline',
  technical: 'Technical & Safety',
}

const CATEGORY_ORDER: FaqCategory[] = [
  'general',
  'quotes-pricing',
  'planning',
  'equipment',
  'technical',
]

export default function FaqPage() {
  const faqs = getFaqs()
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
      <Seo
        title="Frequently Asked Questions"
        description="Answers to common questions about quotes, pricing, equipment, planning timelines, and technical safety at TOTAL MEDIA."
        path="/faq"
        jsonLd={faqSchema}
      />
      <PageHero
        eyebrow="Support"
        title="Frequently Asked Questions"
        description="If you don't find what you're looking for here, reach out directly — we respond within one business day."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page mx-auto max-w-3xl space-y-14">
          {CATEGORY_ORDER.map((category) => {
            const items = faqs.filter((f) => f.category === category)
            if (items.length === 0) return null
            return (
              <div key={category}>
                <h2 className="mb-4 text-xl font-bold text-navy">{CATEGORY_LABELS[category]}</h2>
                <FaqAccordion faqs={items} />
              </div>
            )
          })}
        </div>
      </section>

      <CtaBand
        title="Still Have Questions?"
        description="Send us the details of what you're planning and we'll get back to you directly."
        primaryLabel="Contact Us"
        primaryTo="/contact"
        secondaryLabel="Request a Quote"
        secondaryTo="/quote"
      />
    </>
  )
}
