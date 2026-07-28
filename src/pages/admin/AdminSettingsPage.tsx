import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'

const schema = z.object({
  addressLines: z.string().min(1, 'Address is required.'),
  phone: z.string().min(1, 'Phone is required.'),
  email: z.string().email('Enter a valid email.'),
  siteUrl: z.string().url('Enter a valid URL.'),
  standardDays: z.string().regex(/^\d+$/, 'Enter a whole number.'),
  complexDays: z.string().regex(/^\d+$/, 'Enter a whole number.'),
})
type FormValues = z.infer<typeof schema>

const FALLBACK: FormValues = {
  addressLines: 'TOTAL MEDIA Inc.\nShibuya-ku, Tokyo 150-0002, Japan',
  phone: '+81 3-4567-8901',
  email: 'hello@totalmedia.co.jp',
  siteUrl: 'https://www.totalmedia.co.jp',
  standardDays: '2',
  complexDays: '5',
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: FALLBACK })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase.from('site_settings').select('*')
    setLoading(false)
    if (error) {
      toast.error('Failed to load settings.')
      return
    }
    const byKey = new Map(data.map((row) => [row.key, row.value]))
    const address = byKey.get('contact_address') as { lines?: string[] } | undefined
    const sla = byKey.get('quote_response_sla') as { standard_days?: number; complex_days?: number } | undefined

    form.reset({
      addressLines: address?.lines?.join('\n') ?? FALLBACK.addressLines,
      phone: (byKey.get('contact_phone') as string | undefined) ?? FALLBACK.phone,
      email: (byKey.get('contact_email') as string | undefined) ?? FALLBACK.email,
      siteUrl: (byKey.get('site_url') as string | undefined) ?? FALLBACK.siteUrl,
      standardDays: sla?.standard_days !== undefined ? String(sla.standard_days) : FALLBACK.standardDays,
      complexDays: sla?.complex_days !== undefined ? String(sla.complex_days) : FALLBACK.complexDays,
    })
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const { error } = await supabase.from('site_settings').upsert([
      {
        key: 'contact_address',
        value: {
          lines: values.addressLines
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
        },
      },
      { key: 'contact_phone', value: values.phone },
      { key: 'contact_email', value: values.email },
      { key: 'site_url', value: values.siteUrl },
      {
        key: 'quote_response_sla',
        value: { standard_days: Number(values.standardDays), complex_days: Number(values.complexDays) },
      },
    ])
    setSubmitting(false)

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Settings saved.')
  }

  return (
    <>
      <Seo title="Site Settings" description="Manage TOTAL MEDIA site-wide settings." path="/admin/settings" noindex />

      <Reveal>
        <AdminPageHeader
          title="Site Settings"
          description="These aren't read by the live site yet — Footer.tsx and ContactPage.tsx still use hardcoded defaults until that wiring lands. Editing here updates the database only."
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-6 max-w-2xl">
        <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-9 animate-pulse rounded-md bg-mist" />
              ))}
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="addressLines"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Address</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormDescription>One line per address line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="siteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical Site URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="standardDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Standard Quote Response (days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="complexDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complex Quote Response (days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={submitting} className="bg-navy text-white hover:bg-navy-deep">
                  {submitting ? 'Saving…' : 'Save Settings'}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </Reveal>
    </>
  )
}
