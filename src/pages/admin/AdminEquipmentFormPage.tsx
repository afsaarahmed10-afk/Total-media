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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'

const AVAILABILITY_OPTIONS = ['in-stock', 'limited', 'made-to-order'] as const
const AVAILABILITY_LABELS: Record<(typeof AVAILABILITY_OPTIONS)[number], string> = {
  'in-stock': 'In Stock',
  limited: 'Limited',
  'made-to-order': 'Made to Order',
}

const schema = z.object({
  nameEn: z.string().min(1, 'Name is required.'),
  nameJa: z.string(),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only.'),
  categoryId: z.string().min(1, 'Category is required.'),
  summaryEn: z.string().min(1, 'Summary is required.'),
  summaryJa: z.string(),
  descriptionEn: z.string().min(1, 'Description is required.'),
  descriptionJa: z.string(),
  specsEn: z.array(z.object({ label: z.string().min(1, 'Required'), value: z.string().min(1, 'Required') })),
  specsJa: z.array(z.object({ label: z.string(), value: z.string() })),
  applicationsTextEn: z.string(),
  applicationsTextJa: z.string(),
  availability: z.enum(AVAILABILITY_OPTIONS),
  relatedItemIds: z.array(z.string()),
  images: z.array(z.object({ id: z.string(), storagePath: z.string(), fileName: z.string() })),
})
type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = {
  nameEn: '',
  nameJa: '',
  slug: '',
  categoryId: '',
  summaryEn: '',
  summaryJa: '',
  descriptionEn: '',
  descriptionJa: '',
  specsEn: [],
  specsJa: [],
  applicationsTextEn: '',
  applicationsTextJa: '',
  availability: 'in-stock',
  relatedItemIds: [],
  images: [],
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function AdminEquipmentFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!isEditing)
  const [activeLang, setActiveLang] = useState<'en' | 'ja'>('en')
  const [categoryOptions, setCategoryOptions] = useState<RelationOption[]>([])
  const [itemOptions, setItemOptions] = useState<RelationOption[]>([])

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function load() {
    const [categoriesRes, itemsRes] = await Promise.all([
      supabase.from('equipment_categories').select('id, name_en').order('name_en'),
      supabase.from('equipment_items').select('id, name_en').order('name_en'),
    ])
    setCategoryOptions((categoriesRes.data ?? []).map((c) => ({ id: c.id, label: c.name_en })))
    setItemOptions((itemsRes.data ?? []).filter((i) => i.id !== id).map((i) => ({ id: i.id, label: i.name_en })))

    if (!id) {
      setLoading(false)
      return
    }

    const [itemRes, relatedRes, imagesRes] = await Promise.all([
      supabase.from('equipment_items').select('*').eq('id', id).single(),
      supabase.from('equipment_related_items').select('related_item_id').eq('equipment_item_id', id).order('sort_order'),
      supabase
        .from('equipment_images')
        .select('media_id, media(id, storage_path, file_name)')
        .eq('equipment_item_id', id)
        .order('sort_order'),
    ])

    setLoading(false)

    if (itemRes.error || !itemRes.data) {
      toast.error('Failed to load equipment item.')
      return
    }

    const item = itemRes.data
    form.reset({
      nameEn: item.name_en,
      nameJa: item.name_ja ?? '',
      slug: item.slug,
      categoryId: item.category_id,
      summaryEn: item.summary_en,
      summaryJa: item.summary_ja ?? '',
      descriptionEn: item.description_en,
      descriptionJa: item.description_ja ?? '',
      specsEn: (item.specs_en as unknown as { label: string; value: string }[]) ?? [],
      specsJa: (item.specs_ja as unknown as { label: string; value: string }[]) ?? [],
      applicationsTextEn: item.applications_en.join('\n'),
      applicationsTextJa: item.applications_ja.join('\n'),
      availability: item.availability,
      relatedItemIds: (relatedRes.data ?? []).map((r) => r.related_item_id),
      images: (imagesRes.data ?? [])
        .map((row) => {
          const media = row.media as unknown as { id: string; storage_path: string; file_name: string } | null
          if (!media) return null
          return { id: media.id, storagePath: media.storage_path, fileName: media.file_name }
        })
        .filter((v): v is FormValues['images'][number] => v !== null),
    })
  }

  async function saveRelatedItems(itemId: string, ids: string[]) {
    await supabase.from('equipment_related_items').delete().eq('equipment_item_id', itemId)
    if (ids.length === 0) return
    const rows = ids.map((relatedId, index) => ({
      equipment_item_id: itemId,
      related_item_id: relatedId,
      sort_order: index,
    }))
    const { error } = await supabase.from('equipment_related_items').insert(rows)
    if (error) throw error
  }

  async function saveImages(itemId: string, images: FormValues['images']) {
    await supabase.from('equipment_images').delete().eq('equipment_item_id', itemId)
    if (images.length === 0) return
    const rows = images.map((image, index) => ({
      equipment_item_id: itemId,
      media_id: image.id,
      sort_order: index,
    }))
    const { error } = await supabase.from('equipment_images').insert(rows)
    if (error) throw error
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      name_en: values.nameEn,
      name_ja: values.nameJa || null,
      slug: values.slug,
      category_id: values.categoryId,
      summary_en: values.summaryEn,
      summary_ja: values.summaryJa || null,
      description_en: values.descriptionEn,
      description_ja: values.descriptionJa || null,
      specs_en: values.specsEn,
      specs_ja: values.specsJa,
      applications_en: linesToArray(values.applicationsTextEn),
      applications_ja: linesToArray(values.applicationsTextJa),
      availability: values.availability,
      visual_seed: values.slug,
    }

    try {
      let itemId = id
      if (isEditing && id) {
        const { error } = await supabase.from('equipment_items').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('equipment_items').insert(payload).select('id').single()
        if (error) throw error
        itemId = data.id
      }
      if (!itemId) throw new Error('Missing equipment item id after save.')

      await Promise.all([
        saveRelatedItems(itemId, values.relatedItemIds),
        saveImages(itemId, values.images),
      ])

      toast.success(isEditing ? 'Equipment item updated.' : 'Equipment item created.')
      navigate('/admin/equipment')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save equipment item.')
    } finally {
      setSubmitting(false)
    }
  }

  const jaComplete = Boolean(form.watch('nameJa'))

  return (
    <>
      <Seo
        title={isEditing ? 'Edit Equipment Item' : 'New Equipment Item'}
        description="Manage an equipment item."
        path="/admin/equipment"
        noindex
      />

      <Reveal>
        <Link
          to="/admin/equipment"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-navy"
        >
          <ArrowLeft className="size-4" /> Back to Equipment
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <AdminPageHeader
            title={isEditing ? 'Edit Equipment Item' : 'New Equipment Item'}
            description="Shown on /equipment and linked from related services."
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
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full sm:w-56">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AVAILABILITY_OPTIONS.map((a) => (
                            <SelectItem key={a} value={a}>
                              {AVAILABILITY_LABELS[a]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={activeLang === 'en' ? 'summaryEn' : 'summaryJa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary {activeLang === 'ja' && '(Japanese)'}</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={activeLang === 'en' ? 'descriptionEn' : 'descriptionJa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description {activeLang === 'ja' && '(Japanese)'}</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={activeLang === 'en' ? 'applicationsTextEn' : 'applicationsTextJa'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applications {activeLang === 'ja' && '(Japanese)'}</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormDescription>One application per line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              <Section title={`Specs ${activeLang === 'ja' ? '(Japanese)' : ''}`}>
                {activeLang === 'en' ? (
                  <ObjectListField
                    form={form}
                    name="specsEn"
                    fields={[
                      { name: 'label', label: 'Label' },
                      { name: 'value', label: 'Value' },
                    ]}
                    emptyItem={{ label: '', value: '' }}
                    addLabel="Add Spec"
                  />
                ) : (
                  <ObjectListField
                    form={form}
                    name="specsJa"
                    fields={[
                      { name: 'label', label: 'Label (Japanese)' },
                      { name: 'value', label: 'Value (Japanese)' },
                    ]}
                    emptyItem={{ label: '', value: '' }}
                    addLabel="Add Spec"
                  />
                )}
              </Section>

              <Section title="Images">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => <MediaPickerField value={field.value} onChange={field.onChange} />}
                />
              </Section>

              <Section title="Related Equipment">
                <FormField
                  control={form.control}
                  name="relatedItemIds"
                  render={({ field }) => (
                    <RelationPicker
                      options={itemOptions}
                      selectedIds={field.value}
                      onChange={field.onChange}
                      searchPlaceholder="Search equipment…"
                      emptyMessage="No other equipment items yet."
                    />
                  )}
                />
              </Section>

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="bg-navy text-white hover:bg-navy-deep">
                  {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Equipment Item'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin/equipment">Cancel</Link>
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
