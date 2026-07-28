import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminDataTable, type AdminColumn } from '@/components/admin/AdminDataTable'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Project = Database['public']['Tables']['projects']['Row']

export default function AdminPortfolioPage() {
  const [rows, setRows] = useState<Project[] | null>(null)
  const [deleting, setDeleting] = useState<Project | null>(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase.from('projects').select('*').order('year', { ascending: false })
    if (error) {
      toast.error('Failed to load portfolio projects.')
      return
    }
    setRows(data)
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletingBusy(true)
    const { error } = await supabase.from('projects').delete().eq('id', deleting.id)
    setDeletingBusy(false)
    if (error) {
      toast.error('Could not delete project.')
      return
    }
    toast.success('Project deleted.')
    setDeleting(null)
    load()
  }

  const columns: AdminColumn<Project>[] = [
    { key: 'title', header: 'Title', render: (r) => <span className="font-medium text-navy">{r.title}</span> },
    { key: 'client', header: 'Client', render: (r) => r.client },
    { key: 'category', header: 'Category', render: (r) => <Badge variant="outline">{r.category}</Badge> },
    { key: 'year', header: 'Year', render: (r) => r.year },
    { key: 'slug', header: 'Slug', render: (r) => <code className="text-xs text-muted-foreground">{r.slug}</code> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild aria-label="Edit">
            <Link to={`/admin/portfolio/${r.id}/edit`}>
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
      <Seo title="Portfolio" description="Manage portfolio projects." path="/admin/portfolio" noindex />

      <Reveal>
        <AdminPageHeader
          title="Portfolio"
          description="Case studies shown on /portfolio."
          action={
            <Button asChild className="bg-navy text-white hover:bg-navy-deep">
              <Link to="/admin/portfolio/new">
                <Plus className="size-4" /> New Project
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
          searchText={(r) => `${r.title} ${r.client} ${r.location}`}
          searchPlaceholder="Search portfolio…"
          emptyMessage="No portfolio projects yet."
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
