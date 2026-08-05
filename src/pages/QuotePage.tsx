import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, ChevronLeft, ChevronRight, UploadCloud, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { getServices } from '@/lib/data'
import { useLocale } from '@/lib/locale/LocaleContext'
import { supabase } from '@/lib/supabase/client'

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB per file

type QuoteFormValues = {
  name: string
  company: string
  country: string
  email: string
  phone: string
  eventType: string
  venue?: string
  city: string
  eventDate?: string
  attendees?: string
  budget?: string
  services: string[]
  notes?: string
  website?: string
}

export default function QuotePage() {
  const { t } = useTranslation(['quote', 'common'])
  const { locale } = useLocale()
  const services = getServices(locale)
  const EVENT_TYPES = t('eventTypes', { returnObjects: true }) as string[]
  const BUDGET_RANGES = t('budgetRanges', { returnObjects: true }) as string[]
  const STEPS = t('steps', { returnObjects: true }) as string[]
  const STEP_FIELDS: (keyof QuoteFormValues)[][] = [
    ['name', 'company', 'country', 'email', 'phone'],
    ['eventType', 'venue', 'city', 'eventDate', 'attendees', 'budget'],
    ['services', 'notes'],
    [],
  ]

  const breadcrumbs = [{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('eyebrow') }]

  const quotePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('title'),
    description: t('seoDescription'),
    about: { '@type': 'Organization', name: 'TOTAL MEDIA' },
  }

  const [step, setStep] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const quoteSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('validation.name')),
        company: z.string().min(1, t('validation.company')),
        country: z.string().min(1, t('validation.country')),
        email: z.string().email(t('validation.email')),
        phone: z.string().min(5, t('validation.phone')),
        eventType: z.string().min(1, t('validation.eventType')),
        venue: z.string().optional(),
        city: z.string().min(1, t('validation.city')),
        eventDate: z.string().optional(),
        attendees: z.string().optional(),
        budget: z.string().optional(),
        services: z.array(z.string()).min(1, t('validation.services')),
        notes: z.string().optional(),
        website: z.string().max(0).optional(),
      }),
    [t],
  )

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: '',
      company: '',
      country: '',
      email: '',
      phone: '',
      eventType: '',
      venue: '',
      city: '',
      eventDate: '',
      attendees: '',
      budget: '',
      services: [],
      notes: '',
      website: '',
    },
  })

  async function goNext() {
    const valid = await form.trigger(STEP_FIELDS[step])
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []).filter((f) => f.size <= MAX_FILE_SIZE)
    setFiles((prev) => [...prev, ...selected])
    e.target.value = ''
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name))
  }

  async function onSubmit(values: QuoteFormValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    // The id is generated client-side (rather than read back via
    // `.select()` after insert) because RLS intentionally does not let an
    // anonymous submitter SELECT their own un-owned row back — only the
    // eventual admin/owner can read it. Generating it upfront sidesteps
    // that entirely: no read-back needed, and the same id is used for the
    // storage upload path below.
    const requestId = crypto.randomUUID()

    const { error: insertError } = await supabase.from('quote_requests').insert({
      id: requestId,
      name: values.name,
      company: values.company,
      country: values.country,
      email: values.email,
      phone: values.phone,
      event_type: values.eventType,
      venue: values.venue || null,
      city: values.city,
      event_date: values.eventDate || null,
      attendees: values.attendees ? Number(values.attendees) : null,
      budget: values.budget || null,
      requested_services: values.services,
      notes: values.notes || null,
    })

    if (insertError) {
      setSubmitError(t('submitError'))
      setIsSubmitting(false)
      return
    }

    // Attachments are uploaded after the request row exists (the storage
    // path is keyed by quote_requests.id). A failed individual file upload
    // doesn't block the overall submission — the request itself is already
    // saved and will be followed up on either way.
    for (const file of files) {
      const storagePath = `${requestId}/${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('quote-attachments')
        .upload(storagePath, file)

      if (!uploadError) {
        await supabase.from('quote_request_attachments').insert({
          quote_request_id: requestId,
          storage_path: storagePath,
          file_name: file.name,
          mime_type: file.type || null,
          size_bytes: file.size,
        })
      }
    }

    // Best-effort admin alert — the request is already saved and visible in
    // /admin regardless, so a notification failure shouldn't affect the
    // visitor's experience.
    supabase.functions
      .invoke('notify-form-submission', {
        body: {
          type: 'quote',
          record: {
            name: values.name,
            company: values.company,
            country: values.country,
            email: values.email,
            phone: values.phone,
            eventType: values.eventType,
            venue: values.venue || null,
            city: values.city,
            eventDate: values.eventDate || null,
            attendees: values.attendees ? Number(values.attendees) : null,
            budget: values.budget || null,
            services: values.services,
            notes: values.notes || null,
          },
        },
      })
      .catch((err) => console.error('Failed to send quote notification email:', err))

    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <Seo
          title={t('seoTitle')}
          description={t('seoDescription')}
          path="/quote"
          breadcrumbs={breadcrumbs}
        />
        <section className="flex min-h-[70vh] items-center justify-center bg-mist">
          <div className="container-page flex max-w-lg flex-col items-center text-center">
            <CheckCircle2 className="size-14 text-signal" />
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-navy">
              {t('successTitle')}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">{t('successDescription')}</p>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Seo
        title={t('seoTitle')}
        description={t('seoDescription')}
        path="/quote"
        jsonLd={quotePageSchema}
        breadcrumbs={breadcrumbs}
      />
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 lg:py-20">
        <div className="container-page mx-auto max-w-2xl">
          <ol className="mb-10 flex items-center justify-between">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                      i <= step ? 'bg-navy text-white' : 'bg-mist text-muted-foreground',
                    )}
                  >
                    {i < step ? <CheckCircle2 className="size-4" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      'hidden text-xs font-medium sm:block',
                      i <= step ? 'text-navy' : 'text-muted-foreground',
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-px flex-1 transition-colors',
                      i < step ? 'bg-navy' : 'bg-border',
                    )}
                  />
                )}
              </li>
            ))}
          </ol>

          <div className="rounded-2xl border border-border bg-white p-6 sm:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.fullName')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('form.fullNamePlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
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
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.phone')}</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder={t('form.phonePlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('form.country')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('form.countryPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('form.eventType')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('form.eventTypePlaceholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EVENT_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="venue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.venue')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('form.venuePlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.city')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('form.cityPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.eventDate')}</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="attendees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.attendees')}</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} placeholder={t('form.attendeesPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('form.budget')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('form.budgetPlaceholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BUDGET_RANGES.map((range) => (
                                <SelectItem key={range} value={range}>
                                  {range}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="services"
                      render={() => (
                        <FormItem>
                          <FormLabel>{t('form.requiredServices')}</FormLabel>
                          <div className="grid gap-2.5 sm:grid-cols-2">
                            {services.map((service) => (
                              <FormField
                                key={service.slug}
                                control={form.control}
                                name="services"
                                render={({ field }) => {
                                  const checked = field.value?.includes(service.name)
                                  return (
                                    <label
                                      className={cn(
                                        'flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm transition-colors',
                                        checked
                                          ? 'border-signal bg-signal-soft text-navy'
                                          : 'border-border text-charcoal hover:border-navy/30',
                                      )}
                                    >
                                      <Checkbox
                                        checked={checked}
                                        onCheckedChange={(isChecked) => {
                                          const current = field.value ?? []
                                          field.onChange(
                                            isChecked
                                              ? [...current, service.name]
                                              : current.filter((v) => v !== service.name),
                                          )
                                        }}
                                      />
                                      {service.name}
                                    </label>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel>{t('form.attachments')}</FormLabel>
                      <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border px-6 py-8 text-center hover:border-signal/40">
                        <UploadCloud className="size-6 text-muted-foreground" />
                        <span className="mt-2 text-sm font-medium text-navy">{t('form.uploadPrompt')}</span>
                        <span className="mt-1 text-xs text-muted-foreground">{t('form.uploadHint')}</span>
                        <input type="file" multiple className="hidden" onChange={onFileChange} />
                      </label>
                      {files.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {files.map((file) => (
                            <li
                              key={file.name}
                              className="flex items-center justify-between rounded-md bg-mist px-3 py-2 text-sm text-navy"
                            >
                              <span className="truncate">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(file.name)}
                                aria-label={t('form.removeFile', { name: file.name })}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="size-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('form.additionalNotes')}</FormLabel>
                          <FormControl>
                            <Textarea rows={5} placeholder={t('form.notesPlaceholder')} {...field} />
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
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-navy">{t('review.title')}</h2>
                    <ReviewRow label={t('review.name')} value={form.getValues('name')} />
                    <ReviewRow label={t('review.company')} value={form.getValues('company')} />
                    <ReviewRow label={t('review.email')} value={form.getValues('email')} />
                    <ReviewRow label={t('review.phone')} value={form.getValues('phone')} />
                    <ReviewRow label={t('review.country')} value={form.getValues('country')} />
                    <ReviewRow label={t('review.eventType')} value={form.getValues('eventType')} />
                    <ReviewRow
                      label={t('review.venueCity')}
                      value={[form.getValues('venue'), form.getValues('city')].filter(Boolean).join(', ')}
                    />
                    <ReviewRow label={t('review.eventDate')} value={form.getValues('eventDate') || t('review.notYetSet')} />
                    <ReviewRow label={t('review.attendees')} value={form.getValues('attendees') || '—'} />
                    <ReviewRow label={t('review.budget')} value={form.getValues('budget') || t('review.notSpecified')} />
                    <ReviewRow label={t('review.services')} value={form.getValues('services').join(', ')} />
                    <ReviewRow
                      label={t('review.attachments')}
                      value={files.length ? t('review.fileCount', { count: files.length }) : t('review.none')}
                    />
                    {form.getValues('notes') && (
                      <ReviewRow label={t('review.notes')} value={form.getValues('notes') ?? ''} />
                    )}
                  </div>
                )}

                {submitError && step === STEPS.length - 1 && (
                  <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
                )}

                <div className="flex items-center justify-between pt-4">
                  {step > 0 ? (
                    <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting}>
                      <ChevronLeft className="mr-1 size-4" /> {t('back')}
                    </Button>
                  ) : (
                    <span />
                  )}
                  {step < STEPS.length - 1 ? (
                    <Button type="button" onClick={goNext} className="bg-navy text-white hover:bg-navy-deep">
                      {t('continue')} <ChevronRight className="ml-1 size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-signal text-white hover:bg-signal/90"
                    >
                      {isSubmitting ? t('submitting') : t('submit')}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-navy">{value || '—'}</span>
    </div>
  )
}
