import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Upload, Trash2 } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { publicMediaUrl, uploadMediaFile, deleteMediaFile, type MediaRow } from '@/lib/admin/media'

export default function AdminMediaPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<MediaRow[] | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<MediaRow | null>(null)
  const [deletingBusy, setDeletingBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false })
    if (error) {
      toast.error('Failed to load media.')
      return
    }
    setRows(data)
  }

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length === 0) return

    setUploading(true)
    let successCount = 0
    for (const file of files) {
      const { error } = await uploadMediaFile(file, user?.id ?? null)
      if (error) toast.error(`${file.name}: ${error}`)
      else successCount++
    }
    setUploading(false)

    if (successCount > 0) {
      toast.success(`Uploaded ${successCount} file${successCount === 1 ? '' : 's'}.`)
      load()
    }
  }

  async function saveAltText(row: MediaRow, altText: string) {
    const { error } = await supabase
      .from('media')
      .update({ alt_text: altText || null })
      .eq('id', row.id)
    if (error) {
      toast.error('Could not update alt text.')
      return
    }
    setRows((prev) => prev?.map((r) => (r.id === row.id ? { ...r, alt_text: altText || null } : r)) ?? prev)
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletingBusy(true)
    const error = await deleteMediaFile(deleting)
    setDeletingBusy(false)
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Media deleted.')
    setDeleting(null)
    load()
  }

  return (
    <>
      <Seo
        title="Media Library"
        description="Manage uploaded images."
        path="/admin/media"
        noindex
      />

      <Reveal>
        <AdminPageHeader
          title="Media Library"
          description="Images available for equipment, portfolio, and blog covers."
          action={
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onFilesSelected}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-navy text-white hover:bg-navy-deep"
              >
                <Upload className="size-4" /> {uploading ? 'Uploading…' : 'Upload Images'}
              </Button>
            </>
          }
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        {rows === null ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-mist" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-14 text-center text-muted-foreground">
            No media uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {rows.map((row) => (
              <MediaCard
                key={row.id}
                row={row}
                onDelete={() => setDeleting(row)}
                onAltTextSave={(alt) => saveAltText(row, alt)}
              />
            ))}
          </div>
        )}
      </Reveal>

      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        description={`Delete "${deleting?.file_name}"? This can't be undone.`}
        onConfirm={confirmDelete}
        loading={deletingBusy}
      />
    </>
  )
}

function MediaCard({
  row,
  onDelete,
  onAltTextSave,
}: {
  row: MediaRow
  onDelete: () => void
  onAltTextSave: (altText: string) => void
}) {
  const [alt, setAlt] = useState(row.alt_text ?? '')

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-white">
      <div className="aspect-square overflow-hidden bg-mist">
        <img
          src={publicMediaUrl(row.storage_path)}
          alt={row.alt_text ?? row.file_name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${row.file_name}`}
        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Trash2 className="size-3.5" />
      </button>
      <div className="p-2">
        <p className="truncate text-xs font-medium text-navy">{row.file_name}</p>
        <Input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={() => {
            if (alt !== (row.alt_text ?? '')) onAltTextSave(alt)
          }}
          placeholder="Alt text"
          className="mt-1 h-7 text-xs"
        />
      </div>
    </div>
  )
}
