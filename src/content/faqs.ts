import type { Faq } from './types'

// `slug` mirrors `id` here — both were the same meaningful string in the
// original static content. The DB migration (0014_faqs_slug.sql) backfills
// `slug` with these exact values against the new generated-UUID `id`.
const rawFaqs: Omit<Faq, 'slug'>[] = [
  {
    id: 'faq-who-we-work-with',
    category: 'general',
    question: 'What kinds of clients does TOTAL MEDIA work with?',
    answer:
      'We work with international corporations, Japanese enterprises, event and PR agencies, exhibition organizers, government bodies, universities, hotels and MICE venues, and luxury brands operating in Japan. Roughly half of our engagements involve at least one non-Japanese stakeholder, so bilingual project management is standard on every account, not an add-on.',
  },
  {
    id: 'faq-nationwide-coverage',
    category: 'general',
    question: 'Do you operate outside Tokyo?',
    answer:
      'Yes. We deliver events across Japan — from major convention centers in Tokyo, Osaka, and Nagoya to regional venues, hotel ballrooms, and outdoor sites nationwide. Our equipment and crew logistics are built around national coverage, not a single-city footprint.',
  },
  {
    id: 'faq-quote-turnaround',
    category: 'quotes-pricing',
    question: 'How long does it take to receive a quote?',
    answer:
      'Standard requests through our Request a Quote form receive a detailed proposal within one to two business days. Complex, multi-day, or hybrid productions with custom technical designs typically take three to five business days, since we prepare an initial technical plan alongside the quote rather than a rough estimate.',
  },
  {
    id: 'faq-pricing-basis',
    category: 'quotes-pricing',
    question: 'How is pricing structured?',
    answer:
      'Pricing depends on event format, venue, duration, equipment specification, and staffing needs — there is no flat rate, because a boardroom AV setup and a two-day hybrid conference are fundamentally different jobs. Every proposal itemizes equipment, labor, and production management separately so you can see exactly what you are paying for and adjust scope if needed.',
  },
  {
    id: 'faq-deposit-payment',
    category: 'quotes-pricing',
    question: 'What are your payment terms?',
    answer:
      'Most engagements require a signed proposal and a deposit to confirm the date and reserve equipment and crew, with the balance due on a schedule agreed in the contract — typically before or shortly after the event, depending on client type and event size. Government and university clients can be accommodated under standard procurement and invoicing cycles.',
  },
  {
    id: 'faq-equipment-only',
    category: 'equipment',
    question: 'Can we rent equipment only, without your production team?',
    answer:
      'Yes. Equipment rental is available on its own for clients who have in-house technical staff or an existing production partner. That said, most first-time clients find that adding our technicians for setup, operation, and strike is a small cost relative to the risk of running unfamiliar equipment without support on the day.',
  },
  {
    id: 'faq-equipment-brands',
    category: 'equipment',
    question: 'What equipment brands and standards do you work with?',
    answer:
      'Our LED, audio, lighting, and rigging inventory is sourced to broadcast and touring-grade specification, maintained on a fixed inspection schedule, and rotated regularly rather than run to end of life. Full specifications for each category are listed on the equipment catalogue, and we\'re glad to confirm exact models for a given proposal.',
  },
  {
    id: 'faq-lead-time',
    category: 'planning',
    question: 'How far in advance should we book?',
    answer:
      'For standard corporate events and conferences, four to six weeks gives us comfortable room for planning, venue coordination, and equipment allocation. Large exhibitions, award ceremonies, or events requiring custom staging and international logistics benefit from eight to twelve weeks. We do take on shorter-notice requests when our schedule allows — reach out and we\'ll tell you honestly whether the timeline works.',
  },
  {
    id: 'faq-venue-site-visit',
    category: 'planning',
    question: 'Do you conduct site visits before an event?',
    answer:
      'For any event involving structural rigging, large-format LED, or a venue we haven\'t worked in before, yes — a technical site visit or a detailed floor plan and load-in review is standard practice, not optional. It\'s how we catch power, access, and rigging constraints before they become event-day problems.',
  },
  {
    id: 'faq-international-language',
    category: 'planning',
    question: 'Can you support events run partly or entirely in English?',
    answer:
      'Yes — bilingual (Japanese/English) project management and on-site coordination are standard for our international clients, and we regularly support simultaneous interpretation booths, multilingual signage, and run-of-show documentation in both languages.',
  },
  {
    id: 'faq-hybrid-virtual-reliability',
    category: 'technical',
    question: 'How do you ensure reliability for live streaming and hybrid events?',
    answer:
      'Every hybrid or virtual production runs on redundant internet circuits, backup encoding paths, and a dedicated technical director monitoring the stream separately from the in-room show — so a connectivity issue on one path doesn\'t take the broadcast down. We also run a full technical rehearsal against the live platform before any hybrid event, not just a sound check.',
  },
  {
    id: 'faq-power-rigging-safety',
    category: 'technical',
    question: 'How do you handle power and rigging safety?',
    answer:
      'All power distribution and structural rigging is designed and signed off by licensed technicians against the venue\'s documented load limits, with redundant circuits for anything broadcast-critical. This is treated as a compliance requirement, not a line item to shortcut on tighter budgets.',
  },
  {
    id: 'faq-what-makes-different',
    category: 'general',
    question: 'How is TOTAL MEDIA different from a pure equipment rental company?',
    answer:
      'Equipment rental is one part of what we do, not the business itself. Our team plans the event, designs the technical production, manages the exhibition or conference on-site, and operates the equipment — which means one accountable partner instead of you coordinating separate vendors for planning, staging, AV, and streaming.',
  },
  {
    id: 'faq-staffing-scale',
    category: 'planning',
    question: 'Can you staff large, multi-day events?',
    answer:
      'Yes. Our production and technical staffing scales from a single technician supporting a boardroom meeting to full crews covering multi-day, multi-hall exhibitions with parallel sessions, live streaming, and simultaneous interpretation running at once.',
  },
]

export const faqs: Faq[] = rawFaqs.map((f) => ({ ...f, slug: f.id }))
