import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminDataTable, type AdminColumn } from '@/components/admin/AdminDataTable'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Database } from '@/lib/supabase/database.types'

type EquipmentCategory = Database['public']['Tables']['equipment_categories']['Row']

const schema = z.object({
  name: z.string().min(1, 'Name is required.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only.'),
  description: z.string().min(1, 'Description is required.'),
})
type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = { name: '', slug: '', description: '' }

export default function AdminEquipmentCategoriesPage() {
  const [rows, setRows] = useState<EquipmentCategory[] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<EquipmentCategory | null>(null)
  const [deleting, setDeleting] = useState<EquipmentCategory | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingBusy, setDeletingBusy] = useState(false)
  const [autoSlug, setAutoSlug] = useState(true)

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase.from('equipment_categories').select('*').order('name')
    if (error) {
      toast.error('Failed to load equipment categories.')
      return
    }
    setRows(data)
  }

  function openCreate() {
    setEditing(null)
    setAutoSlug(true)
    form.reset(DEFAULT_VALUES)
    setDialogOpen(true)
  }

  function openEdit(row: EquipmentCategory) {
    setEditing(row)
    setAutoSlug(false)
    form.reset({ name: row.name, slug: row.slug, description: row.description })
    setDialogOpen(true)
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const { error } = editing
      ? await supabase.from('equipment_categories').update(values).eq('id', editing.id)
      : await supabase.from('equipment_categories').insert(values)
    setSubmitting(false)

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(editing ? 'Category updated.' : 'Category created.')
    setDialogOpen(false)
    load()
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletingBusy(true)
    const { error } = await supabase.from('equipment_categories').delete().eq('id', deleting.id)
    setDeletingBusy(false)
    if (error) {
      toast.error('Could not delete category — it may still have equipment items assigned to it.')
      return
    }
    toast.success('Category deleted.')
    setDeleting(null)
    load()
  }

  const columns: AdminColumn<EquipmentCategory>[] = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium text-navy">{r.name}</span> },
    {
      key: 'description',
      header: 'Description',
      render: (r) => <span className="line-clamp-1 max-w-md">{r.description}</span>,
    },
    { key: 'slug', header: 'Slug', render: (r) => <code className="text-xs text-muted-foreground">{r.slug}</code> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(r)} aria-label="Edit">
            <Pencil className="size-4" />
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
      <Seo
        title="Equipment Categories"
        description="Manage equipment categories."
        path="/admin/equipment-categories"
        noindex
      />

      <Reveal>
        <AdminPageHeader
          title="Equipment Categories"
          description="Groupings shown on /equipment."
          action={
            <Button onClick={openCreate} className="bg-navy text-white hover:bg-navy-deep">
              <Plus className="size-4" /> New Category
            </Button>
          }
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <AdminDataTable
          columns={columns}
          rows={rows}
          getRowId={(r) => r.id}
          searchText={(r) => `${r.name} ${r.description}`}
          searchPlaceholder="Search categories…"
          emptyMessage="No equipment categories yet."
        />
      </Reveal>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : 'New Category'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-navy text-white hover:bg-navy-deep">
                  {submitting ? 'Saving…' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        description={`Delete "${deleting?.name}"? This can't be undone.`}
        onConfirm={confirmDelete}
        loading={deletingBusy}
      />
    </>
  )
}
