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
import { ProjectVideosField } from '@/components/admin/ProjectVideosField'
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
  images: z.array(
    z.object({ id: z.string(), storagePath: z.string(), fileName: z.string(), category: z.string().optional() }),
  ),
  // Event showcase — every field below is optional; a project with none of
  // them keeps the standard case-study layout (see PortfolioDetailPage).
  dateLabel: z.string(),
  venue: z.string(),
  eventStartDate: z.string(),
  eventEndDate: z.string(),
  storyTheEventText: z.string(),
  storyOurRoleText: z.string(),
  storyTheExperienceText: z.string(),
  storyTheResultText: z.string(),
  videos: z.array(
    z.object({
      storagePath: z.string().min(1, 'Upload a video file.'),
      fileName: z.string(),
      poster: z.object({ id: z.string(), storagePath: z.string(), fileName: z.string() }).nullable(),
      title: z.string().min(1, 'Required'),
      description: z.string(),
      category: z.string(),
    }),
  ),
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
  dateLabel: '',
  venue: '',
  eventStartDate: '',
  eventEndDate: '',
  storyTheEventText: '',
  storyOurRoleText: '',
  storyTheExperienceText: '',
  storyTheResultText: '',
  videos: [],
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
      supabase.from('services').select('id, name_en').order('name_en'),
      supabase.from('equipment_items').select('id, name_en').order('name_en'),
    ])
    setServiceOptions((servicesRes.data ?? []).map((s) => ({ id: s.id, label: s.name_en })))
    setEquipmentOptions((equipmentRes.data ?? []).map((e) => ({ id: e.id, label: e.name_en })))

    if (!id) {
      setLoading(false)
      return
    }

    const [projectRes, servicesUsedRes, equipmentUsedRes, imagesRes, videosRes] = await Promise.all([
      supabase.from('projects').select('*').eq('id', id).single(),
      supabase.from('project_services').select('service_id').eq('project_id', id).order('sort_order'),
      supabase.from('project_equipment').select('equipment_item_id').eq('project_id', id).order('sort_order'),
      supabase
        .from('project_images')
        .select('media_id, category, media(id, storage_path, file_name)')
        .eq('project_id', id)
        .order('sort_order'),
      supabase
        .from('project_videos')
        .select('storage_path, title, description, category, poster:media(id, storage_path, file_name)')
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
        .map((row): FormValues['images'][number] | null => {
          const media = row.media as unknown as { id: string; storage_path: string; file_name: string } | null
          if (!media) return null
          return {
            id: media.id,
            storagePath: media.storage_path,
            fileName: media.file_name,
            category: row.category ?? undefined,
          }
        })
        .filter((v) => v !== null),
      dateLabel: p.date_label ?? '',
      venue: p.venue ?? '',
      eventStartDate: p.event_start ?? '',
      eventEndDate: p.event_end ?? '',
      storyTheEventText: ((p.story as { theEvent?: string[] } | null)?.theEvent ?? []).join('\n'),
      storyOurRoleText: ((p.story as { ourRole?: string[] } | null)?.ourRole ?? []).join('\n'),
      storyTheExperienceText: ((p.story as { theExperience?: string[] } | null)?.theExperience ?? []).join('\n'),
      storyTheResultText: ((p.story as { theResult?: string[] } | null)?.theResult ?? []).join('\n'),
      videos: (videosRes.data ?? []).map((v) => {
        const poster = v.poster as unknown as { id: string; storage_path: string; file_name: string } | null
        return {
          storagePath: v.storage_path,
          fileName: v.storage_path.split('/').pop() ?? v.storage_path,
          poster: poster ? { id: poster.id, storagePath: poster.storage_path, fileName: poster.file_name } : null,
          title: v.title,
          description: v.description ?? '',
          category: v.category ?? '',
        }
      }),
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
    const rows = images.map((image, index) => ({
      project_id: projectId,
      media_id: image.id,
      sort_order: index,
      category: image.category || null,
    }))
    const { error } = await supabase.from('project_images').insert(rows)
    if (error) throw error
  }

  async function saveVideos(projectId: string, videos: FormValues['videos']) {
    await supabase.from('project_videos').delete().eq('project_id', projectId)
    if (videos.length === 0) return
    const rows = videos.map((video, index) => ({
      project_id: projectId,
      storage_path: video.storagePath,
      poster_media_id: video.poster?.id ?? null,
      title: video.title,
      description: video.description || null,
      category: video.category || null,
      sort_order: index,
    }))
    const { error } = await supabase.from('project_videos').insert(rows)
    if (error) throw error
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const hasStory = [
      values.storyTheEventText,
      values.storyOurRoleText,
      values.storyTheExperienceText,
      values.storyTheResultText,
    ].some((text) => text.trim().length > 0)
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
      date_label: values.dateLabel || null,
      venue: values.venue || null,
      event_start: values.eventStartDate || null,
      event_end: values.eventEndDate || null,
      story: hasStory
        ? {
            theEvent: linesToArray(values.storyTheEventText),
            ourRole: linesToArray(values.storyOurRoleText),
            theExperience: linesToArray(values.storyTheExperienceText),
            theResult: linesToArray(values.storyTheResultText),
          }
        : null,
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
        saveVideos(projectId, values.videos),
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
                  render={({ field }) => (
                    <MediaPickerField value={field.value} onChange={field.onChange} showCategory />
                  )}
                />
              </Section>

              <Section title="Event Showcase (optional)">
                <p className="text-sm text-muted-foreground">
                  Fill these in for a project with a full real-media event write-up. Leave blank to keep the
                  standard case-study layout.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="dateLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Label</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. March 14–16, 2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="storyTheEventText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>The Event</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormDescription>One paragraph per line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storyOurRoleText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Our Role</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormDescription>One paragraph per line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storyTheExperienceText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>The Experience</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormDescription>One paragraph per line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storyTheResultText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>The Result</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormDescription>One paragraph per line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              <Section title="Videos (optional)">
                <FormField
                  control={form.control}
                  name="videos"
                  render={({ field }) => <ProjectVideosField value={field.value} onChange={field.onChange} />}
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
