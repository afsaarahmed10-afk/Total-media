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
import { MediaPickerField } from '@/components/admin/MediaPickerField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'

const PROJECT_CATEGORIES = ['Conference', 'Corporate', 'Exhibition', 'Hybrid', 'Virtual', 'Outdoor'] as const

const schema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only.'),
  client: z.string().min(1, 'Client is required.'),
  location: z.string().min(1, 'Location is required.'),
  year: z.string().regex(/^\d{4}$/, 'Enter a 4-digit year.'),
  category: z.enum(PROJECT_CATEGORIES),
  summary: z.string().min(1, 'Summary is required.'),
  descriptionText: z.string(),
  stats: z.array(z.object({ label: z.string().min(1, 'Required'), value: z.string().min(1, 'Required') })),
  servicesUsedIds: z.array(z.string()),
  equipmentUsedIds: z.array(z.string()),
  images: z.array(z.object({ id: z.string(), storagePath: z.string(), fileName: z.string() })),
})
type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = {
  title: '',
  slug: '',
  client: '',
  location: '',
  year: String(new Date().getFullYear()),
  category: 'Corporate',
  summary: '',
  descriptionText: '',
  stats: [],
  servicesUsedIds: [],
  equipmentUsedIds: [],
  images: [],
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function AdminPortfolioFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!isEditing)
  const [serviceOptions, setServiceOptions] = useState<RelationOption[]>([])
  const [equipmentOptions, setEquipmentOptions] = useState<RelationOption[]>([])

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function load() {
    const [servicesRes, equipmentRes] = await Promise.all([
      supabase.from('services').select('id, name').order('name'),
      supabase.from('equipment_items').select('id, name').order('name'),
    ])
    setServiceOptions((servicesRes.data ?? []).map((s) => ({ id: s.id, label: s.name })))
    setEquipmentOptions((equipmentRes.data ?? []).map((e) => ({ id: e.id, label: e.name })))

    if (!id) {
      setLoading(false)
      return
    }

    const [projectRes, servicesUsedRes, equipmentUsedRes, imagesRes] = await Promise.all([
      supabase.from('projects').select('*').eq('id', id).single(),
      supabase.from('project_services').select('service_id').eq('project_id', id).order('sort_order'),
      supabase.from('project_equipment').select('equipment_item_id').eq('project_id', id).order('sort_order'),
      supabase
        .from('project_images')
        .select('media_id, media(id, storage_path, file_name)')
        .eq('project_id', id)
        .order('sort_order'),
    ])

    setLoading(false)

    if (projectRes.error || !projectRes.data) {
      toast.error('Failed to load project.')
      return
    }

    const p = projectRes.data
    form.reset({
      title: p.title,
      slug: p.slug,
      client: p.client,
      location: p.location,
      year: String(p.year),
      category: p.category,
      summary: p.summary,
      descriptionText: p.description.join('\n'),
      stats: (p.stats as unknown as { label: string; value: string }[]) ?? [],
      servicesUsedIds: (servicesUsedRes.data ?? []).map((r) => r.service_id),
      equipmentUsedIds: (equipmentUsedRes.data ?? []).map((r) => r.equipment_item_id),
      images: (imagesRes.data ?? [])
        .map((row) => {
          const media = row.media as unknown as { id: string; storage_path: string; file_name: string } | null
          if (!media) return null
          return { id: media.id, storagePath: media.storage_path, fileName: media.file_name }
        })
        .filter((v): v is FormValues['images'][number] => v !== null),
    })
  }

  async function saveServicesUsed(projectId: string, ids: string[]) {
    await supabase.from('project_services').delete().eq('project_id', projectId)
    if (ids.length === 0) return
    const rows = ids.map((serviceId, index) => ({ project_id: projectId, service_id: serviceId, sort_order: index }))
    const { error } = await supabase.from('project_services').insert(rows)
    if (error) throw error
  }

  async function saveEquipmentUsed(projectId: string, ids: string[]) {
    await supabase.from('project_equipment').delete().eq('project_id', projectId)
    if (ids.length === 0) return
    const rows = ids.map((equipmentItemId, index) => ({
      project_id: projectId,
      equipment_item_id: equipmentItemId,
      sort_order: index,
    }))
    const { error } = await supabase.from('project_equipment').insert(rows)
    if (error) throw error
  }

  async function saveImages(projectId: string, images: FormValues['images']) {
    await supabase.from('project_images').delete().eq('project_id', projectId)
    if (images.length === 0) return
    const rows = images.map((image, index) => ({ project_id: projectId, media_id: image.id, sort_order: index }))
    const { error } = await supabase.from('project_images').insert(rows)
    if (error) throw error
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      title: values.title,
      slug: values.slug,
      client: values.client,
      location: values.location,
      year: Number(values.year),
      category: values.category,
      summary: values.summary,
      description: linesToArray(values.descriptionText),
      stats: values.stats,
      visual_seed: values.slug,
    }

    try {
      let projectId = id
      if (isEditing && id) {
        const { error } = await supabase.from('projects').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('projects').insert(payload).select('id').single()
        if (error) throw error
        projectId = data.id
      }
      if (!projectId) throw new Error('Missing project id after save.')

      await Promise.all([
        saveServicesUsed(projectId, values.servicesUsedIds),
        saveEquipmentUsed(projectId, values.equipmentUsedIds),
        saveImages(projectId, values.images),
      ])

      toast.success(isEditing ? 'Project updated.' : 'Project created.')
      navigate('/admin/portfolio')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save project.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo
        title={isEditing ? 'Edit Project' : 'New Project'}
        description="Manage a portfolio project."
        path="/admin/portfolio"
        noindex
      />

      <Reveal>
        <Link
          to="/admin/portfolio"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-navy"
        >
          <ArrowLeft className="size-4" /> Back to Portfolio
        </Link>
        <AdminPageHeader
          title={isEditing ? 'Edit Project' : 'New Project'}
          description="Shown on /portfolio as a case study."
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
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
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
                            {PROJECT_CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descriptionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormDescription>One paragraph per line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              <Section title="Stats">
                <ObjectListField
                  form={form}
                  name="stats"
                  fields={[
                    { name: 'label', label: 'Label' },
                    { name: 'value', label: 'Value' },
                  ]}
                  emptyItem={{ label: '', value: '' }}
                  addLabel="Add Stat"
                />
              </Section>

              <Section title="Images">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => <MediaPickerField value={field.value} onChange={field.onChange} />}
                />
              </Section>

              <Section title="Services Used">
                <FormField
                  control={form.control}
                  name="servicesUsedIds"
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

              <Section title="Equipment Used">
                <FormField
                  control={form.control}
                  name="equipmentUsedIds"
                  render={({ field }) => (
                    <RelationPicker
                      options={equipmentOptions}
                      selectedIds={field.value}
                      onChange={field.onChange}
                      searchPlaceholder="Search equipment…"
                      emptyMessage="No equipment items yet."
                    />
                  )}
                />
              </Section>

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="bg-navy text-white hover:bg-navy-deep">
                  {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Project'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin/portfolio">Cancel</Link>
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
