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

type Solution = Database['public']['Tables']['solutions']['Row']

export default function AdminSolutionsPage() {
  const [rows, setRows] = useState<Solution[] | null>(null)
  const [deleting, setDeleting] = useState<Solution | null>(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase.from('solutions').select('*').order('name_en')
    if (error) {
      toast.error('Failed to load solutions.')
      return
    }
    setRows(data)
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletingBusy(true)
    const { error } = await supabase.from('solutions').delete().eq('id', deleting.id)
    setDeletingBusy(false)
    if (error) {
      toast.error('Could not delete solution.')
      return
    }
    toast.success('Solution deleted.')
    setDeleting(null)
    load()
  }

  const columns: AdminColumn<Solution>[] = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium text-navy">{r.name_en}</span> },
    {
      key: 'short_description',
      header: 'Short Description',
      render: (r) => <span className="line-clamp-1 max-w-md">{r.short_description_en}</span>,
    },
    { key: 'slug', header: 'Slug', render: (r) => <code className="text-xs text-muted-foreground">{r.slug}</code> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild aria-label="Edit">
            <Link to={`/admin/solutions/${r.id}/edit`}>
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
      <Seo title="Solutions" description="Manage the solutions catalogue." path="/admin/solutions" noindex />

      <Reveal>
        <AdminPageHeader
          title="Solutions"
          description="Bundled service packages shown on /solutions."
          action={
            <Button asChild className="bg-navy text-white hover:bg-navy-deep">
              <Link to="/admin/solutions/new">
                <Plus className="size-4" /> New Solution
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
          searchText={(r) => `${r.name_en} ${r.short_description_en}`}
          searchPlaceholder="Search solutions…"
          emptyMessage="No solutions yet."
        />
      </Reveal>

      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        description={`Delete "${deleting?.name_en}"? This can't be undone.`}
        onConfirm={confirmDelete}
        loading={deletingBusy}
      />
    </>
  )
}
