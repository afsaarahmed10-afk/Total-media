import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
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
  const faqs = getFaqs()
  const homeFaqs = HOME_FAQ_SLUGS.map((slug) => faqs.find((f) => f.slug === slug)).filter(
    (f): f is (typeof faqs)[number] => Boolean(f),
  )

  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Common Questions"
              title="Frequently Asked Questions"
              description="A few of the questions we hear most often from new clients."
            />
            <Link
              to="/faq"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-signal hover:underline"
            >
              View all FAQs <ArrowRight className="size-4" />
            </Link>
          </div>
          <FaqAccordion faqs={homeFaqs} />
        </div>
      </div>
    </section>
  )
}
