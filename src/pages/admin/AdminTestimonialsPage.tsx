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
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Testimonial = Database['public']['Tables']['testimonials']['Row']

const schema = z.object({
  quote: z.string().min(10, 'Quote must be at least 10 characters.'),
  author: z.string().min(1, 'Author is required.'),
  role: z.string().min(1, 'Role is required.'),
  company: z.string().min(1, 'Company is required.'),
  isPublished: z.boolean(),
  sortOrder: z.string().regex(/^\d+$/, 'Enter a whole number.'),
})
type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = {
  quote: '',
  author: '',
  role: '',
  company: '',
  isPublished: true,
  sortOrder: '0',
}

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [deleting, setDeleting] = useState<Testimonial | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingBusy, setDeletingBusy] = useState(false)

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase.from('testimonials').select('*').order('sort_order')
    if (error) {
      toast.error('Failed to load testimonials.')
      return
    }
    setRows(data)
  }

  function openCreate() {
    setEditing(null)
    form.reset(DEFAULT_VALUES)
    setDialogOpen(true)
  }

  function openEdit(row: Testimonial) {
    setEditing(row)
    form.reset({
      quote: row.quote,
      author: row.author,
      role: row.role,
      company: row.company,
      isPublished: row.is_published,
      sortOrder: String(row.sort_order),
    })
    setDialogOpen(true)
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      quote: values.quote,
      author: values.author,
      role: values.role,
      company: values.company,
      is_published: values.isPublished,
      sort_order: Number(values.sortOrder),
    }
    const { error } = editing
      ? await supabase.from('testimonials').update(payload).eq('id', editing.id)
      : await supabase.from('testimonials').insert(payload)
    setSubmitting(false)

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(editing ? 'Testimonial updated.' : 'Testimonial created.')
    setDialogOpen(false)
    load()
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletingBusy(true)
    const { error } = await supabase.from('testimonials').delete().eq('id', deleting.id)
    setDeletingBusy(false)
    if (error) {
      toast.error('Could not delete testimonial.')
      return
    }
    toast.success('Testimonial deleted.')
    setDeleting(null)
    load()
  }

  const columns: AdminColumn<Testimonial>[] = [
    {
      key: 'quote',
      header: 'Quote',
      render: (r) => <span className="line-clamp-2 max-w-md">{r.quote}</span>,
    },
    { key: 'author', header: 'Author', render: (r) => <span className="font-medium text-navy">{r.author}</span> },
    { key: 'company', header: 'Company', render: (r) => r.company },
    { key: 'sort_order', header: 'Order', render: (r) => r.sort_order },
    {
      key: 'is_published',
      header: 'Status',
      render: (r) =>
        r.is_published ? (
          <StatusBadge label="Published" className="bg-emerald-50 text-emerald-700" />
        ) : (
          <StatusBadge label="Hidden" />
        ),
    },
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
      <Seo title="Testimonials" description="Manage client testimonials." path="/admin/testimonials" noindex />

      <Reveal>
        <AdminPageHeader
          title="Testimonials"
          description="Quotes shown in the homepage testimonials carousel."
          action={
            <Button onClick={openCreate} className="bg-navy text-white hover:bg-navy-deep">
              <Plus className="size-4" /> New Testimonial
            </Button>
          }
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <AdminDataTable
          columns={columns}
          rows={rows}
          getRowId={(r) => r.id}
          searchText={(r) => `${r.author} ${r.company} ${r.quote}`}
          searchPlaceholder="Search testimonials…"
          emptyMessage="No testimonials yet."
        />
      </Reveal>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Testimonial' : 'New Testimonial'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="quote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quote</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
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
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} id="is-published" />
                    </FormControl>
                    <Label htmlFor="is-published" className="font-normal">
                      Published (visible on the public site)
                    </Label>
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
        description={`Delete the testimonial from "${deleting?.author}"? This can't be undone.`}
        onConfirm={confirmDelete}
        loading={deletingBusy}
      />
    </>
  )
}
