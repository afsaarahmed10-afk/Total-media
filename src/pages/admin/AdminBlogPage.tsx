import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminDataTable, type AdminColumn } from '@/components/admin/AdminDataTable'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']
type BlogCategory = Database['public']['Tables']['blog_categories']['Row']

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminBlogPage() {
  const [rows, setRows] = useState<BlogPost[] | null>(null)
  const [categories, setCategories] = useState<Map<string, string>>(new Map())
  const [deleting, setDeleting] = useState<BlogPost | null>(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const [postsRes, categoriesRes] = await Promise.all([
      supabase.from('blog_posts').select('*').order('published_at', { ascending: false }),
      supabase.from('blog_categories').select('id, name'),
    ])
    if (postsRes.error) {
      toast.error('Failed to load blog posts.')
      return
    }
    setRows(postsRes.data)
    setCategories(new Map((categoriesRes.data ?? []).map((c: Pick<BlogCategory, 'id' | 'name'>) => [c.id, c.name])))
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletingBusy(true)
    const { error } = await supabase.from('blog_posts').delete().eq('id', deleting.id)
    setDeletingBusy(false)
    if (error) {
      toast.error('Could not delete blog post.')
      return
    }
    toast.success('Blog post deleted.')
    setDeleting(null)
    load()
  }

  const columns: AdminColumn<BlogPost>[] = [
    { key: 'title', header: 'Title', render: (r) => <span className="line-clamp-1 max-w-md font-medium text-navy">{r.title}</span> },
    { key: 'category', header: 'Category', render: (r) => categories.get(r.category_id) ?? '—' },
    { key: 'published_at', header: 'Published', render: (r) => formatDate(r.published_at) },
    { key: 'read_minutes', header: 'Read Time', render: (r) => `${r.read_minutes} min` },
    { key: 'slug', header: 'Slug', render: (r) => <code className="text-xs text-muted-foreground">{r.slug}</code> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild aria-label="Edit">
            <Link to={`/admin/blog/${r.id}/edit`}>
              <Pencil className="size-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(r)} aria-label="Delete">
            <Trash2 className="size-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Seo title="Blog Posts" description="Manage blog posts." path="/admin/blog" noindex />

      <Reveal>
        <AdminPageHeader
          title="Blog Posts"
          description="Articles shown on /blog."
          action={
            <Button asChild className="bg-navy text-white hover:bg-navy-deep">
              <Link to="/admin/blog/new">
                <Plus className="size-4" /> New Post
              </Link>
            </Button>
          }
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <AdminDataTable
          columns={columns}
          rows={rows}
          getRowId={(r) => r.id}
          searchText={(r) => `${r.title} ${r.excerpt} ${r.author}`}
          searchPlaceholder="Search blog posts…"
          emptyMessage="No blog posts yet."
        />
      </Reveal>

      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        description={`Delete "${deleting?.title}"? This can't be undone.`}
        onConfirm={confirmDelete}
        loading={deletingBusy}
      />
    </>
  )
}
