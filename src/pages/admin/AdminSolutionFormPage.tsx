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
import { MediaPickerField } from '@/components/admin/MediaPickerField'
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
  nameEn: z.string().min(1, 'Name is required.'),
  nameJa: z.string(),
  shortDescriptionEn: z.string().min(1, 'Short description is required.'),
  shortDescriptionJa: z.string(),
  heroStatementEn: z.string().min(1, 'Hero statement is required.'),
  heroStatementJa: z.string(),
  overviewTextEn: z.string(),
  overviewTextJa: z.string(),
  highlightsEn: z.array(z.object({ title: z.string().min(1, 'Required'), description: z.string().min(1, 'Required') })),
  highlightsJa: z.array(z.object({ title: z.string(), description: z.string() })),
  seoTitleEn: z.string().min(1, 'SEO title is required.'),
  seoTitleJa: z.string(),
  seoDescriptionEn: z.string().min(1, 'SEO description is required.'),
  seoDescriptionJa: z.string(),
  includedServiceIds: z.array(z.string()),
  cover: z.array(z.object({ id: z.string(), storagePath: z.string(), fileName: z.string() })),
})
type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = {
  slug: '',
  nameEn: '',
  nameJa: '',
  shortDescriptionEn: '',
  shortDescriptionJa: '',
  heroStatementEn: '',
  heroStatementJa: '',
  overviewTextEn: '',
  overviewTextJa: '',
  highlightsEn: [],
  highlightsJa: [],
  seoTitleEn: '',
  seoTitleJa: '',
  seoDescriptionEn: '',
  seoDescriptionJa: '',
  includedServiceIds: [],
  cover: [],
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
  const [activeLang, setActiveLang] = useState<'en' | 'ja'>('en')
  const [serviceOptions, setServiceOptions] = useState<RelationOption[]>([])

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function load() {
    const servicesRes = await supabase.from('services').select('id, name_en').order('name_en')
    setServiceOptions((servicesRes.data ?? []).map((s) => ({ id: s.id, label: s.name_en })))

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
    let cover: FormValues['cover'] = []
    if (s.cover_media_id) {
      const { data: media } = await supabase
        .from('media')
        .select('id, storage_path, file_name')
        .eq('id', s.cover_media_id)
        .single()
      if (media) cover = [{ id: media.id, storagePath: media.storage_path, fileName: media.file_name }]
    }

    form.reset({
      slug: s.slug,
      nameEn: s.name_en,
      nameJa: s.name_ja ?? '',
      shortDescriptionEn: s.short_description_en,
      shortDescriptionJa: s.short_description_ja ?? '',
      heroStatementEn: s.hero_statement_en,
      heroStatementJa: s.hero_statement_ja ?? '',
      overviewTextEn: s.overview_en.join('\n'),
      overviewTextJa: s.overview_ja.join('\n'),
      highlightsEn: (s.highlights_en as unknown as { title: string; description: string }[]) ?? [],
      highlightsJa: (s.highlights_ja as unknown as { title: string; description: string }[]) ?? [],
      seoTitleEn: s.seo_title_en,
      seoTitleJa: s.seo_title_ja ?? '',
      seoDescriptionEn: s.seo_description_en,
      seoDescriptionJa: s.seo_description_ja ?? '',
      includedServiceIds: (includedServicesRes.data ?? []).map((r) => r.service_id),
      cover,
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
      name_en: values.nameEn,
      name_ja: values.nameJa || null,
      short_description_en: values.shortDescriptionEn,
      short_description_ja: values.shortDescriptionJa || null,
      hero_statement_en: values.heroStatementEn,
      hero_statement_ja: values.heroStatementJa || null,
      overview_en: linesToArray(values.overviewTextEn),
      overview_ja: linesToArray(values.overviewTextJa),
      highlights_en: values.highlightsEn,
      highlights_ja: values.highlightsJa,
      seo_title_en: values.seoTitleEn,
      seo_title_ja: values.seoTitleJa || null,
      seo_description_en: values.seoDescriptionEn,
      seo_description_ja: values.seoDescriptionJa || null,
      cover_media_id: values.cover[0]?.id ?? null,
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

  const jaComplete = Boolean(form.watch('nameJa'))

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
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <AdminPageHeader
            title={isEditing ? 'Edit Solution' : 'New Solution'}
            description="Bundled service packages shown on /solutions."
          />
          <LangTabs active={activeLang} onChange={setActiveLang} jaComplete={jaComplete} />
        </div>
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

              <Section title="Cover Image">
                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <MediaPickerField value={field.value} onChange={field.onChange} multiple={false} />
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
              </Section>

              <Section title={`Highlights ${activeLang === 'ja' ? '(Japanese)' : ''}`}>
                {activeLang === 'en' ? (
                  <ObjectListField
                    form={form}
                    name="highlightsEn"
                    fields={[
                      { name: 'title', label: 'Title' },
                      { name: 'description', label: 'Description', multiline: true },
                    ]}
                    emptyItem={{ title: '', description: '' }}
                    addLabel="Add Highlight"
                  />
                ) : (
                  <ObjectListField
                    form={form}
                    name="highlightsJa"
                    fields={[
                      { name: 'title', label: 'Title (Japanese)' },
                      { name: 'description', label: 'Description (Japanese)', multiline: true },
                    ]}
                    emptyItem={{ title: '', description: '' }}
                    addLabel="Add Highlight"
                  />
                )}
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
