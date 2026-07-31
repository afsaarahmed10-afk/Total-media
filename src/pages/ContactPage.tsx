import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, MapPin, Phone, Clock, CheckCircle2, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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

interface ContactOffice {
  name: string
  address: string
}

export default function ContactPage() {
  const { t } = useTranslation(['contact', 'common'])
  const offices = t('offices', { returnObjects: true }) as ContactOffice[]
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('validation.name')),
        email: z.string().email(t('validation.email')),
        company: z.string().optional(),
        subject: z.string().min(2, t('validation.subject')),
        message: z.string().min(10, t('validation.message')),
        // Honeypot field — left empty by real users, filled by most simple bots.
        website: z.string().max(0).optional(),
      }),
    [t],
  )
  type ContactFormValues = z.infer<typeof contactSchema>

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
      setSubmitError(t('submitError'))
      return
    }

    // Best-effort admin alert — the message is already saved and visible in
    // /admin regardless, so a notification failure shouldn't affect the
    // visitor's experience.
    supabase.functions
      .invoke('notify-form-submission', {
        body: {
          type: 'contact',
          record: {
            name: values.name,
            email: values.email,
            company: values.company || null,
            subject: values.subject,
            message: values.message,
          },
        },
      })
      .catch((err) => console.error('Failed to send contact notification email:', err))

    setSubmitted(true)
  }

  return (
    <>
      <Seo title={t('seoTitle')} description={t('seoDescription')} path="/contact" />
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        breadcrumbs={[{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('eyebrow') }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="space-y-8">
            <div className="flex gap-4">
              <MapPin className="size-5 shrink-0 text-signal" />
              <div className="space-y-3">
                {offices.map((office) => (
                  <div key={office.name}>
                    <p className="font-semibold text-navy">{office.name}</p>
                    <p className="text-sm text-muted-foreground">{office.address}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="size-5 shrink-0 text-signal" />
              <div>
                <p className="font-semibold text-navy">{t('phone')}</p>
                <a href="tel:+81345678901" className="text-sm text-muted-foreground hover:text-signal">
                  +81 3-4567-8901
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="size-5 shrink-0 text-signal" />
              <div>
                <p className="font-semibold text-navy">{t('email')}</p>
                <a
                  href="mailto:uno@nippon-group.com"
                  className="text-sm text-muted-foreground hover:text-signal"
                >
                  uno@nippon-group.com
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <MessageCircle className="size-5 shrink-0 text-signal" />
              <div>
                <p className="font-semibold text-navy">{t('whatsapp')}</p>
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
                <p className="font-semibold text-navy">{t('businessHours')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('businessHoursValue')}
                  <br />
                  {t('businessHoursNote')}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 sm:p-10">
            {submitted ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 className="size-12 text-signal" />
                <h2 className="mt-4 text-xl font-bold text-navy">{t('successTitle')}</h2>
                <p className="mt-2 max-w-sm text-muted-foreground">{t('successDescription')}</p>
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
                          <FormLabel>{t('form.name')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('form.namePlaceholder')} {...field} />
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
                          <FormLabel>{t('form.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t('form.emailPlaceholder')} {...field} />
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
                        <FormLabel>{t('form.company')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('form.companyPlaceholder')} {...field} />
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
                        <FormLabel>{t('form.subject')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('form.subjectPlaceholder')} {...field} />
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
                        <FormLabel>{t('form.message')}</FormLabel>
                        <FormControl>
                          <Textarea rows={5} placeholder={t('form.messagePlaceholder')} {...field} />
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
                    {isSubmitting ? t('form.sending') : t('form.send')}
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
