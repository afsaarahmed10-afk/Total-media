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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'

const schema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only.'),
  category: z.enum(['event-type', 'technical']),
  name: z.string().min(1, 'Name is required.'),
  shortDescription: z.string().min(1, 'Short description is required.'),
  heroStatement: z.string().min(1, 'Hero statement is required.'),
  overviewText: z.string(),
  capabilitiesText: z.string(),
  process: z.array(z.object({ title: z.string().min(1, 'Required'), description: z.string().min(1, 'Required') })),
  idealForText: z.string(),
  seoTitle: z.string().min(1, 'SEO title is required.'),
  seoDescription: z.string().min(1, 'SEO description is required.'),
  relatedServiceIds: z.array(z.string()),
  relatedEquipmentCategoryIds: z.array(z.string()),
  faqIds: z.array(z.string()),
})
type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = {
  slug: '',
  category: 'event-type',
  name: '',
  shortDescription: '',
  heroStatement: '',
  overviewText: '',
  capabilitiesText: '',
  process: [],
  idealForText: '',
  seoTitle: '',
  seoDescription: '',
  relatedServiceIds: [],
  relatedEquipmentCategoryIds: [],
  faqIds: [],
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function AdminServiceFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!isEditing)
  const [serviceOptions, setServiceOptions] = useState<RelationOption[]>([])
  const [equipmentCategoryOptions, setEquipmentCategoryOptions] = useState<RelationOption[]>([])
  const [faqOptions, setFaqOptions] = useState<RelationOption[]>([])

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function load() {
    const [servicesRes, equipmentCategoriesRes, faqsRes] = await Promise.all([
      supabase.from('services').select('id, name').order('name'),
      supabase.from('equipment_categories').select('id, name').order('name'),
      supabase.from('faqs').select('id, question').order('question'),
    ])

    setServiceOptions(
      (servicesRes.data ?? []).filter((s) => s.id !== id).map((s) => ({ id: s.id, label: s.name })),
    )
    setEquipmentCategoryOptions((equipmentCategoriesRes.data ?? []).map((c) => ({ id: c.id, label: c.name })))
    setFaqOptions((faqsRes.data ?? []).map((f) => ({ id: f.id, label: f.question })))

    if (!id) {
      setLoading(false)
      return
    }

    const [serviceRes, relatedServicesRes, relatedEquipRes, faqLinksRes] = await Promise.all([
      supabase.from('services').select('*').eq('id', id).single(),
      supabase
        .from('service_related_services')
        .select('related_service_id')
        .eq('service_id', id)
        .order('sort_order'),
      supabase
        .from('service_related_equipment_categories')
        .select('equipment_category_id')
        .eq('service_id', id)
        .order('sort_order'),
      supabase.from('service_faqs').select('faq_id').eq('service_id', id).order('sort_order'),
    ])

    setLoading(false)

    if (serviceRes.error || !serviceRes.data) {
      toast.error('Failed to load service.')
      return
    }

    const s = serviceRes.data
    form.reset({
      slug: s.slug,
      category: s.category,
      name: s.name,
      shortDescription: s.short_description,
      heroStatement: s.hero_statement,
      overviewText: s.overview.join('\n'),
      capabilitiesText: s.capabilities.join('\n'),
      process: (s.process as unknown as { title: string; description: string }[]) ?? [],
      idealForText: s.ideal_for.join('\n'),
      seoTitle: s.seo_title,
      seoDescription: s.seo_description,
      relatedServiceIds: (relatedServicesRes.data ?? []).map((r) => r.related_service_id),
      relatedEquipmentCategoryIds: (relatedEquipRes.data ?? []).map((r) => r.equipment_category_id),
      faqIds: (faqLinksRes.data ?? []).map((r) => r.faq_id),
    })
  }

  async function saveRelation(
    table: 'service_related_services' | 'service_related_equipment_categories' | 'service_faqs',
    fkColumn: string,
    serviceId: string,
    ids: string[],
  ) {
    await supabase.from(table).delete().eq('service_id', serviceId)
    if (ids.length === 0) return
    const rows = ids.map((relatedId, index) => ({
      service_id: serviceId,
      [fkColumn]: relatedId,
      sort_order: index,
    }))
    const { error } = await supabase.from(table).insert(rows as never)
    if (error) throw error
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      slug: values.slug,
      category: values.category,
      name: values.name,
      short_description: values.shortDescription,
      hero_statement: values.heroStatement,
      overview: linesToArray(values.overviewText),
      capabilities: linesToArray(values.capabilitiesText),
      process: values.process,
      ideal_for: linesToArray(values.idealForText),
      seo_title: values.seoTitle,
      seo_description: values.seoDescription,
    }

    try {
      let serviceId = id
      if (isEditing && id) {
        const { error } = await supabase.from('services').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('services').insert(payload).select('id').single()
        if (error) throw error
        serviceId = data.id
      }
      if (!serviceId) throw new Error('Missing service id after save.')

      await Promise.all([
        saveRelation('service_related_services', 'related_service_id', serviceId, values.relatedServiceIds),
        saveRelation(
          'service_related_equipment_categories',
          'equipment_category_id',
          serviceId,
          values.relatedEquipmentCategoryIds,
        ),
        saveRelation('service_faqs', 'faq_id', serviceId, values.faqIds),
      ])

      toast.success(isEditing ? 'Service updated.' : 'Service created.')
      navigate('/admin/services')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save service.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo
        title={isEditing ? 'Edit Service' : 'New Service'}
        description="Manage a service."
        path="/admin/services"
        noindex
      />

      <Reveal>
        <Link
          to="/admin/services"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-navy"
        >
          <ArrowLeft className="size-4" /> Back to Services
        </Link>
        <AdminPageHeader
          title={isEditing ? 'Edit Service' : 'New Service'}
          description="Shown on /services and linked from solutions and portfolio projects."
        />
      </Reveal>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[0, 1, 2, 3].map((i) => (
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
                <div className="grid gap-4 sm:grid-cols-2">
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="event-type">Event Type</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                <FormField
                  control={form.control}
                  name="capabilitiesText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capabilities</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormDescription>One capability per line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idealForText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ideal For</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormDescription>One line per audience/use case.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              <Section title="Process Steps">
                <ObjectListField
                  form={form}
                  name="process"
                  fields={[
                    { name: 'title', label: 'Title' },
                    { name: 'description', label: 'Description', multiline: true },
                  ]}
                  emptyItem={{ title: '', description: '' }}
                  addLabel="Add Process Step"
                />
              </Section>

              <Section title="Related Services">
                <FormField
                  control={form.control}
                  name="relatedServiceIds"
                  render={({ field }) => (
                    <RelationPicker
                      options={serviceOptions}
                      selectedIds={field.value}
                      onChange={field.onChange}
                      searchPlaceholder="Search services…"
                      emptyMessage="No other services yet."
                    />
                  )}
                />
              </Section>

              <Section title="Related Equipment Categories">
                <FormField
                  control={form.control}
                  name="relatedEquipmentCategoryIds"
                  render={({ field }) => (
                    <RelationPicker
                      options={equipmentCategoryOptions}
                      selectedIds={field.value}
                      onChange={field.onChange}
                      searchPlaceholder="Search equipment categories…"
                      emptyMessage="No equipment categories yet."
                    />
                  )}
                />
              </Section>

              <Section title="Related FAQs">
                <FormField
                  control={form.control}
                  name="faqIds"
                  render={({ field }) => (
                    <RelationPicker
                      options={faqOptions}
                      selectedIds={field.value}
                      onChange={field.onChange}
                      searchPlaceholder="Search FAQs…"
                      emptyMessage="No FAQs yet."
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
                  {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Service'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin/services">Cancel</Link>
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
