import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Faq } from '@/content/types'

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion type="single" collapsible className="w-full border-t border-ink">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id} className="border-line">
          <AccordionTrigger className="py-6 text-left text-base font-medium leading-snug tracking-[-0.01em] hover:text-blue hover:no-underline lg:text-lg">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="max-w-2xl pb-6 text-base leading-relaxed text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
