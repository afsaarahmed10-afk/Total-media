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
import { LangTabs } from '@/components/admin/LangTabs'
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
  nameEn: z.string().min(1, 'Name is required.'),
  nameJa: z.string(),
  shortDescriptionEn: z.string().min(1, 'Short description is required.'),
  shortDescriptionJa: z.string(),
  heroStatementEn: z.string().min(1, 'Hero statement is required.'),
  heroStatementJa: z.string(),
  overviewTextEn: z.string(),
  overviewTextJa: z.string(),
  capabilitiesTextEn: z.string(),
  capabilitiesTextJa: z.string(),
  processEn: z.array(z.object({ title: z.string().min(1, 'Required'), description: z.string().min(1, 'Required') })),
  processJa: z.array(z.object({ title: z.string(), description: z.string() })),
  idealForTextEn: z.string(),
  idealForTextJa: z.string(),
  seoTitleEn: z.string().min(1, 'SEO title is required.'),
  seoTitleJa: z.string(),
  seoDescriptionEn: z.string().min(1, 'SEO description is required.'),
  seoDescriptionJa: z.string(),
  relatedServiceIds: z.array(z.string()),
  relatedEquipmentCategoryIds: z.array(z.string()),
  faqIds: z.array(z.string()),
})
type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = {
  slug: '',
  category: 'event-type',
  nameEn: '',
  nameJa: '',
  shortDescriptionEn: '',
  shortDescriptionJa: '',
  heroStatementEn: '',
  heroStatementJa: '',
  overviewTextEn: '',
  overviewTextJa: '',
  capabilitiesTextEn: '',
  capabilitiesTextJa: '',
  processEn: [],
  processJa: [],
  idealForTextEn: '',
  idealForTextJa: '',
  seoTitleEn: '',
  seoTitleJa: '',
  seoDescriptionEn: '',
  seoDescriptionJa: '',
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
  const [activeLang, setActiveLang] = useState<'en' | 'ja'>('en')
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
      supabase.from('services').select('id, name_en').order('name_en'),
      supabase.from('equipment_categories').select('id, name_en').order('name_en'),
      supabase.from('faqs').select('id, question_en').order('question_en'),
    ])

    setServiceOptions(
      (servicesRes.data ?? []).filter((s) => s.id !== id).map((s) => ({ id: s.id, label: s.name_en })),
    )
    setEquipmentCategoryOptions((equipmentCategoriesRes.data ?? []).map((c) => ({ id: c.id, label: c.name_en })))
    setFaqOptions((faqsRes.data ?? []).map((f) => ({ id: f.id, label: f.question_en })))

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
      nameEn: s.name_en,
      nameJa: s.name_ja ?? '',
      shortDescriptionEn: s.short_description_en,
      shortDescriptionJa: s.short_description_ja ?? '',
      heroStatementEn: s.hero_statement_en,
      heroStatementJa: s.hero_statement_ja ?? '',
      overviewTextEn: s.overview_en.join('\n'),
      overviewTextJa: s.overview_ja.join('\n'),
      capabilitiesTextEn: s.capabilities_en.join('\n'),
      capabilitiesTextJa: s.capabilities_ja.join('\n'),
      processEn: (s.process_en as unknown as { title: string; description: string }[]) ?? [],
      processJa: (s.process_ja as unknown as { title: string; description: string }[]) ?? [],
      idealForTextEn: s.ideal_for_en.join('\n'),
      idealForTextJa: s.ideal_for_ja.join('\n'),
      seoTitleEn: s.seo_title_en,
      seoTitleJa: s.seo_title_ja ?? '',
      seoDescriptionEn: s.seo_description_en,
      seoDescriptionJa: s.seo_description_ja ?? '',
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
      name_en: values.nameEn,
      name_ja: values.nameJa || null,
      short_description_en: values.shortDescriptionEn,
      short_description_ja: values.shortDescriptionJa || null,
      hero_statement_en: values.heroStatementEn,
      hero_statement_ja: values.heroStatementJa || null,
      overview_en: linesToArray(values.overviewTextEn),
      overview_ja: linesToArray(values.overviewTextJa),
      capabilities_en: linesToArray(values.capabilitiesTextEn),
      capabilities_ja: linesToArray(values.capabilitiesTextJa),
      process_en: values.processEn,
      process_ja: values.processJa,
      ideal_for_en: linesToArray(values.idealForTextEn),
      ideal_for_ja: linesToArray(values.idealForTextJa),
      seo_title_en: values.seoTitleEn,
      seo_title_ja: values.seoTitleJa || null,
      seo_description_en: values.seoDescriptionEn,
      seo_description_ja: values.seoDescriptionJa || null,
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

  const jaComplete = Boolean(form.watch('nameJa'))

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
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <AdminPageHeader
            title={isEditing ? 'Edit Service' : 'New Service'}
            description="Shown on /services and linked from solutions and portfolio projects."
          />
          <LangTabs active={activeLang} onChange={setActiveLang} jaComplete={jaComplete} />
        </div>
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
                  name={activeLang === 'en' ? 'nameEn' : 'nameJa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name {activeLang === 'ja' && '(Japanese)'}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            if (autoSlug && activeLang === 'en') form.setValue('slug', slugify(e.target.value))
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
                  name={activeLang === 'en' ? 'shortDescriptionEn' : 'shortDescriptionJa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description {activeLang === 'ja' && '(Japanese)'}</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={activeLang === 'en' ? 'heroStatementEn' : 'heroStatementJa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Statement {activeLang === 'ja' && '(Japanese)'}</FormLabel>
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
                  name={activeLang === 'en' ? 'overviewTextEn' : 'overviewTextJa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overview {activeLang === 'ja' && '(Japanese)'}</FormLabel>
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
                  name={activeLang === 'en' ? 'capabilitiesTextEn' : 'capabilitiesTextJa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capabilities {activeLang === 'ja' && '(Japanese)'}</FormLabel>
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
                  name={activeLang === 'en' ? 'idealForTextEn' : 'idealForTextJa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ideal For {activeLang === 'ja' && '(Japanese)'}</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormDescription>One line per audience/use case.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              <Section title={`Process Steps ${activeLang === 'ja' ? '(Japanese)' : ''}`}>
                {activeLang === 'en' ? (
                  <ObjectListField
                    form={form}
                    name="processEn"
                    fields={[
                      { name: 'title', label: 'Title' },
                      { name: 'description', label: 'Description', multiline: true },
                    ]}
                    emptyItem={{ title: '', description: '' }}
                    addLabel="Add Process Step"
                  />
                ) : (
                  <ObjectListField
                    form={form}
                    name="processJa"
                    fields={[
                      { name: 'title', label: 'Title (Japanese)' },
                      { name: 'description', label: 'Description (Japanese)', multiline: true },
                    ]}
                    emptyItem={{ title: '', description: '' }}
                    addLabel="Add Process Step"
                  />
                )}
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
                  name={activeLang === 'en' ? 'seoTitleEn' : 'seoTitleJa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title {activeLang === 'ja' && '(Japanese)'}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={activeLang === 'en' ? 'seoDescriptionEn' : 'seoDescriptionJa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description {activeLang === 'ja' && '(Japanese)'}</FormLabel>
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
