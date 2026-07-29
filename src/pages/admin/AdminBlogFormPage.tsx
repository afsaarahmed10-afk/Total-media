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
import { MediaPickerField } from '@/components/admin/MediaPickerField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only.'),
  categoryId: z.string().min(1, 'Category is required.'),
  excerpt: z.string().min(1, 'Excerpt is required.'),
  contentText: z.string().min(1, 'Content is required.'),
  author: z.string().min(1, 'Author is required.'),
  authorRole: z.string().min(1, 'Author role is required.'),
  publishedAt: z.string().min(1, 'Publish date is required.'),
  readMinutes: z.string().regex(/^\d+$/, 'Enter a whole number.'),
  cover: z.array(z.object({ id: z.string(), storagePath: z.string(), fileName: z.string() })),
})
type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = {
  title: '',
  slug: '',
  categoryId: '',
  excerpt: '',
  contentText: '',
  author: '',
  authorRole: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  readMinutes: '5',
  cover: [],
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function AdminBlogFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!isEditing)
  const [categoryOptions, setCategoryOptions] = useState<{ id: string; label: string }[]>([])

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function load() {
    const categoriesRes = await supabase.from('blog_categories').select('id, name_en').order('name_en')
    setCategoryOptions((categoriesRes.data ?? []).map((c) => ({ id: c.id, label: c.name_en })))

    if (!id) {
      setLoading(false)
      return
    }

    const postRes = await supabase.from('blog_posts').select('*').eq('id', id).single()
    setLoading(false)

    if (postRes.error || !postRes.data) {
      toast.error('Failed to load blog post.')
      return
    }

    const post = postRes.data
    let cover: FormValues['cover'] = []
    if (post.cover_media_id) {
      const { data: media } = await supabase
        .from('media')
        .select('id, storage_path, file_name')
        .eq('id', post.cover_media_id)
        .single()
      if (media) cover = [{ id: media.id, storagePath: media.storage_path, fileName: media.file_name }]
    }

    form.reset({
      title: post.title,
      slug: post.slug,
      categoryId: post.category_id,
      excerpt: post.excerpt,
      contentText: post.content.join('\n'),
      author: post.author,
      authorRole: post.author_role,
      publishedAt: post.published_at.slice(0, 10),
      readMinutes: String(post.read_minutes),
      cover,
    })
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      title: values.title,
      slug: values.slug,
      category_id: values.categoryId,
      excerpt: values.excerpt,
      content: linesToArray(values.contentText),
      author: values.author,
      author_role: values.authorRole,
      published_at: new Date(values.publishedAt).toISOString(),
      read_minutes: Number(values.readMinutes),
      cover_media_id: values.cover[0]?.id ?? null,
      visual_seed: values.slug,
    }

    const { error } = isEditing && id
      ? await supabase.from('blog_posts').update(payload).eq('id', id)
      : await supabase.from('blog_posts').insert(payload)
    setSubmitting(false)

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(isEditing ? 'Blog post updated.' : 'Blog post created.')
    navigate('/admin/blog')
  }

  return (
    <>
      <Seo
        title={isEditing ? 'Edit Blog Post' : 'New Blog Post'}
        description="Manage a blog post."
        path="/admin/blog"
        noindex
      />

      <Reveal>
        <Link
          to="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-navy"
        >
          <ArrowLeft className="size-4" /> Back to Blog Posts
        </Link>
        <AdminPageHeader
          title={isEditing ? 'Edit Blog Post' : 'New Blog Post'}
          description="Shown on /blog."
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
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contentText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea rows={8} {...field} />
                      </FormControl>
                      <FormDescription>One paragraph per line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="authorRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Role</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="publishedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Published Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="readMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Read Time (minutes)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="bg-navy text-white hover:bg-navy-deep">
                  {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Post'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin/blog">Cancel</Link>
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
