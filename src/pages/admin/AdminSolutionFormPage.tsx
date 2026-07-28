import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ObjectListField } from '@/components/admin/ObjectListField'
import { RelationPicker, type RelationOption } from '@/components/admin/RelationPicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'

const schema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only.'),
  name: z.string().min(1, 'Name is required.'),
  shortDescription: z.string().min(1, 'Short description is required.'),
  heroStatement: z.string().min(1, 'Hero statement is required.'),
  overviewText: z.string(),
  highlights: z.array(z.object({ title: z.string().min(1, 'Required'), description: z.string().min(1, 'Required') })),
  seoTitle: z.string().min(1, 'SEO title is required.'),
  seoDescription: z.string().min(1, 'SEO description is required.'),
  includedServiceIds: z.array(z.string()),
})
type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = {
  slug: '',
  name: '',
  shortDescription: '',
  heroStatement: '',
  overviewText: '',
  highlights: [],
  seoTitle: '',
  seoDescription: '',
  includedServiceIds: [],
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function AdminSolutionFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!isEditing)
  const [serviceOptions, setServiceOptions] = useState<RelationOption[]>([])

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function load() {
    const servicesRes = await supabase.from('services').select('id, name').order('name')
    setServiceOptions((servicesRes.data ?? []).map((s) => ({ id: s.id, label: s.name })))

    if (!id) {
      setLoading(false)
      return
    }

    const [solutionRes, includedServicesRes] = await Promise.all([
      supabase.from('solutions').select('*').eq('id', id).single(),
      supabase.from('solution_services').select('service_id').eq('solution_id', id).order('sort_order'),
    ])

    setLoading(false)

    if (solutionRes.error || !solutionRes.data) {
      toast.error('Failed to load solution.')
      return
    }

    const s = solutionRes.data
    form.reset({
      slug: s.slug,
      name: s.name,
      shortDescription: s.short_description,
      heroStatement: s.hero_statement,
      overviewText: s.overview.join('\n'),
      highlights: (s.highlights as unknown as { title: string; description: string }[]) ?? [],
      seoTitle: s.seo_title,
      seoDescription: s.seo_description,
      includedServiceIds: (includedServicesRes.data ?? []).map((r) => r.service_id),
    })
  }

  async function saveIncludedServices(solutionId: string, ids: string[]) {
    await supabase.from('solution_services').delete().eq('solution_id', solutionId)
    if (ids.length === 0) return
    const rows = ids.map((serviceId, index) => ({ solution_id: solutionId, service_id: serviceId, sort_order: index }))
    const { error } = await supabase.from('solution_services').insert(rows)
    if (error) throw error
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      slug: values.slug,
      name: values.name,
      short_description: values.shortDescription,
      hero_statement: values.heroStatement,
      overview: linesToArray(values.overviewText),
      highlights: values.highlights,
      seo_title: values.seoTitle,
      seo_description: values.seoDescription,
    }

    try {
      let solutionId = id
      if (isEditing && id) {
        const { error } = await supabase.from('solutions').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('solutions').insert(payload).select('id').single()
        if (error) throw error
        solutionId = data.id
      }
      if (!solutionId) throw new Error('Missing solution id after save.')

      await saveIncludedServices(solutionId, values.includedServiceIds)

      toast.success(isEditing ? 'Solution updated.' : 'Solution created.')
      navigate('/admin/solutions')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save solution.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo
        title={isEditing ? 'Edit Solution' : 'New Solution'}
        description="Manage a solution."
        path="/admin/solutions"
        noindex
      />

      <Reveal>
        <Link
          to="/admin/solutions"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-navy"
        >
          <ArrowLeft className="size-4" /> Back to Solutions
        </Link>
        <AdminPageHeader
          title={isEditing ? 'Edit Solution' : 'New Solution'}
          description="Bundled service packages shown on /solutions."
        />
      </Reveal>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-mist" />
          ))}
        </div>
      ) : (
        <Reveal delay={0.05} className="mt-8 max-w-3xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Section title="Basics">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            if (autoSlug) form.setValue('slug', slugify(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            setAutoSlug(false)
                            field.onChange(e)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heroStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Statement</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              <Section title="Content">
                <FormField
                  control={form.control}
                  name="overviewText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overview</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormDescription>One paragraph per line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              <Section title="Highlights">
                <ObjectListField
                  form={form}
                  name="highlights"
                  fields={[
                    { name: 'title', label: 'Title' },
                    { name: 'description', label: 'Description', multiline: true },
                  ]}
                  emptyItem={{ title: '', description: '' }}
                  addLabel="Add Highlight"
                />
              </Section>

              <Section title="Included Services">
                <FormField
                  control={form.control}
                  name="includedServiceIds"
                  render={({ field }) => (
                    <RelationPicker
                      options={serviceOptions}
                      selectedIds={field.value}
                      onChange={field.onChange}
                      searchPlaceholder="Search services…"
                      emptyMessage="No services yet."
                    />
                  )}
                />
              </Section>

              <Section title="SEO">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="bg-navy text-white hover:bg-navy-deep">
                  {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Solution'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin/solutions">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </Reveal>
      )}
    </>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="font-semibold text-navy">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  )
}
