import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, MapPin, Phone, Clock, CheckCircle2, MessageCircle } from 'lucide-react'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { getWhatsAppUrl, WHATSAPP_DISPLAY_NUMBER } from '@/lib/whatsapp'

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  company: z.string().optional(),
  subject: z.string().min(2, 'Please enter a subject.'),
  message: z.string().min(10, 'Please include a few details so we can help.'),
  // Honeypot field — left empty by real users, filled by most simple bots.
  website: z.string().max(0).optional(),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', company: '', subject: '', message: '', website: '' },
  })

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    const { error } = await supabase.from('contact_messages').insert({
      name: values.name,
      email: values.email,
      company: values.company || null,
      subject: values.subject,
      message: values.message,
    })

    setIsSubmitting(false)

    if (error) {
      setSubmitError(
        'Something went wrong sending your message. Please try again, or email us directly at hello@totalmedia.co.jp.',
      )
      return
    }

    setSubmitted(true)
  }

  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with TOTAL MEDIA to discuss your next event. Based in Tokyo, serving clients nationwide across Japan."
        path="/contact"
      />
      <PageHero
        eyebrow="Contact"
        title="Let's Talk About Your Event"
        description="For a detailed proposal, use Request a Quote. For anything else — general questions, partnership inquiries, press — reach out here."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="space-y-8">
            <div className="flex gap-4">
              <MapPin className="size-5 shrink-0 text-signal" />
              <div>
                <p className="font-semibold text-navy">Office</p>
                <p className="text-sm text-muted-foreground">Shibuya-ku, Tokyo 150-0002, Japan</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="size-5 shrink-0 text-signal" />
              <div>
                <p className="font-semibold text-navy">Phone</p>
                <a href="tel:+81345678901" className="text-sm text-muted-foreground hover:text-signal">
                  +81 3-4567-8901
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="size-5 shrink-0 text-signal" />
              <div>
                <p className="font-semibold text-navy">Email</p>
                <a
                  href="mailto:hello@totalmedia.co.jp"
                  className="text-sm text-muted-foreground hover:text-signal"
                >
                  hello@totalmedia.co.jp
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <MessageCircle className="size-5 shrink-0 text-signal" />
              <div>
                <p className="font-semibold text-navy">WhatsApp</p>
                <a
                  href={getWhatsAppUrl("Hi TOTAL MEDIA, I'd like to know more about your services.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-signal"
                >
                  {WHATSAPP_DISPLAY_NUMBER}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="size-5 shrink-0 text-signal" />
              <div>
                <p className="font-semibold text-navy">Business Hours</p>
                <p className="text-sm text-muted-foreground">
                  Monday – Friday, 9:00 – 18:00 JST
                  <br />
                  On-site event support available outside these hours.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 sm:p-10">
            {submitted ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 className="size-12 text-signal" />
                <h2 className="mt-4 text-xl font-bold text-navy">Message Sent</h2>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  Thanks for reaching out — we'll get back to you within one business day.
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="What's this about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea rows={5} placeholder="Tell us a bit more..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="hidden" aria-hidden="true">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input tabIndex={-1} autoComplete="off" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  {submitError && (
                    <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
                  )}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-navy text-white hover:bg-navy-deep"
                  >
                    {isSubmitting ? 'Sending…' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
