import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Button } from '@/components/ui/button'
import { getTestimonials } from '@/lib/data'

export function TestimonialsCarousel() {
  const testimonials = getTestimonials()
  const [index, setIndex] = useState(0)
  const testimonial = testimonials[index]

  const next = () => setIndex((i) => (i + 1) % testimonials.length)
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="Client Testimonials" title="What Clients Say" align="center" />

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="relative rounded-2xl border border-border bg-white p-8 sm:p-12">
            <Quote className="size-9 text-signal/25" />
            <div className="min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="mt-4 text-xl leading-relaxed text-navy sm:text-2xl">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-6">
                    <p className="font-semibold text-navy">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-1.5">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? 'w-6 bg-signal' : 'w-1.5 bg-border'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prev} aria-label="Previous testimonial">
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={next} aria-label="Next testimonial">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
