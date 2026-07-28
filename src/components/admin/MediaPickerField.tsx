import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { ImagePlus, X, ChevronLeft, ChevronRight, Upload, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { publicMediaUrl, uploadMediaFile, type MediaRow } from '@/lib/admin/media'
import { cn } from '@/lib/utils'

export interface MediaPickerItem {
  id: string
  storagePath: string
  fileName: string
}

interface MediaPickerFieldProps {
  value: MediaPickerItem[]
  onChange: (items: MediaPickerItem[]) => void
  /** false = single-select: picking an image replaces the current one and
   * closes the dialog immediately, and the "Add" tile hides once one is
   * selected. Defaults to true (a reorderable multi-image gallery). */
  multiple?: boolean
}

/** Reusable image field: current selection as removable/reorderable
 * thumbnail chips, plus an "Add Images" dialog that lets the admin pick
 * from the existing media library or upload new files inline. Used for
 * every domain that attaches images via a join table (Equipment, Portfolio)
 * as a gallery, and single-select for a Blog post's cover image. */
export function MediaPickerField({ value, onChange, multiple = true }: MediaPickerFieldProps) {
  const { user } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [library, setLibrary] = useState<MediaRow[] | null>(null)
  const [query, setQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedIds = new Set(value.map((v) => v.id))

  async function openDialog() {
    setDialogOpen(true)
    if (library === null) {
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false })
      if (error) {
        toast.error('Failed to load media library.')
        setLibrary([])
        return
      }
      setLibrary(data)
    }
  }

  function toggle(row: MediaRow) {
    if (selectedIds.has(row.id)) {
      onChange(value.filter((v) => v.id !== row.id))
      return
    }
    const item = { id: row.id, storagePath: row.storage_path, fileName: row.file_name }
    if (multiple) {
      onChange([...value, item])
    } else {
      onChange([item])
      setDialogOpen(false)
    }
  }

  function remove(id: string) {
    onChange(value.filter((v) => v.id !== id))
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length === 0) return

    setUploading(true)
    const uploaded: MediaPickerItem[] = []
    for (const file of multiple ? files : files.slice(0, 1)) {
      const { data, error } = await uploadMediaFile(file, user?.id ?? null)
      if (error) {
        toast.error(`${file.name}: ${error}`)
        continue
      }
      if (data) {
        uploaded.push({ id: data.id, storagePath: data.storage_path, fileName: data.file_name })
        setLibrary((prev) => (prev ? [data, ...prev] : [data]))
      }
    }
    setUploading(false)
    if (uploaded.length > 0) {
      if (multiple) {
        onChange([...value, ...uploaded])
      } else {
        onChange(uploaded)
        setDialogOpen(false)
      }
    }
  }

  const filteredLibrary = library?.filter((row) => row.file_name.toLowerCase().includes(query.toLowerCase())) ?? []

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((item, index) => (
          <div key={item.id} className="group relative size-20 shrink-0 overflow-hidden rounded-lg border border-border">
            <img
              src={publicMediaUrl(item.storagePath)}
              alt={item.fileName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-0.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move earlier"
                className="flex size-6 items-center justify-center rounded-full text-white disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Remove ${item.fileName}`}
                className="flex size-6 items-center justify-center rounded-full text-white"
              >
                <X className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                aria-label="Move later"
                className="flex size-6 items-center justify-center rounded-full text-white disabled:opacity-30"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        ))}

        {(multiple || value.length === 0) && (
          <button
            type="button"
            onClick={openDialog}
            className="flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:border-signal/50 hover:text-signal"
          >
            <ImagePlus className="size-5" />
            <span className="text-xs">Add</span>
          </button>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Images</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search media…"
              className="flex-1"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={multiple}
              className="hidden"
              onChange={onFilesSelected}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="size-4" /> {uploading ? 'Uploading…' : 'Upload'}
            </Button>
          </div>

          {library === null ? (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-lg bg-mist" />
              ))}
            </div>
          ) : filteredLibrary.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No media found.</p>
          ) : (
            <div className="grid max-h-96 grid-cols-4 gap-3 overflow-y-auto sm:grid-cols-5">
              {filteredLibrary.map((row) => {
                const selected = selectedIds.has(row.id)
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => toggle(row)}
                    className={cn(
                      'relative aspect-square overflow-hidden rounded-lg border-2',
                      selected ? 'border-signal' : 'border-transparent hover:border-border',
                    )}
                  >
                    <img src={publicMediaUrl(row.storage_path)} alt={row.file_name} className="h-full w-full object-cover" />
                    {selected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-signal/40">
                        <Check className="size-6 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          <DialogFooter>
            <Button type="button" onClick={() => setDialogOpen(false)} className="bg-navy text-white hover:bg-navy-deep">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
