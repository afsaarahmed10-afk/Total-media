import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2, Upload, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MediaPickerField, type MediaPickerItem } from '@/components/admin/MediaPickerField'
import { uploadProjectVideoFile } from '@/lib/admin/media'

export interface ProjectVideoItem {
  storagePath: string
  fileName: string
  poster: MediaPickerItem | null
  title: string
  description: string
  category: string
}

interface ProjectVideosFieldProps {
  value: ProjectVideoItem[]
  onChange: (items: ProjectVideoItem[]) => void
}

const EMPTY_VIDEO: ProjectVideoItem = {
  storagePath: '',
  fileName: '',
  poster: null,
  title: '',
  description: '',
  category: '',
}

/** Repeatable video rows for a project's event showcase — each uploads a
 * file straight to the `media` Storage bucket (no `media` table row, same
 * convention as every video already in `project_videos.storage_path`) and
 * picks a poster image from the existing media library. */
export function ProjectVideosField({ value, onChange }: ProjectVideosFieldProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeIndexRef = useRef<number | null>(null)

  function update(index: number, patch: Partial<ProjectVideoItem>) {
    onChange(value.map((v, i) => (i === index ? { ...v, ...patch } : v)))
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function triggerUpload(index: number) {
    activeIndexRef.current = index
    fileInputRef.current?.click()
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    const index = activeIndexRef.current
    if (!file || index === null) return

    setUploadingIndex(index)
    const { storagePath, error } = await uploadProjectVideoFile(file)
    setUploadingIndex(null)
    if (error || !storagePath) {
      toast.error(error ?? 'Upload failed.')
      return
    }
    update(index, { storagePath, fileName: file.name })
  }

  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={onFileSelected} />

      {value.map((video, index) => (
        <div key={index} className="space-y-3 rounded-lg border border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs text-muted-foreground">Video File</Label>
              {video.storagePath ? (
                <div className="flex items-center gap-2 text-sm">
                  <Film className="size-4 text-signal" />
                  <span className="truncate">{video.fileName || video.storagePath}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No file uploaded yet.</p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingIndex === index}
                onClick={() => triggerUpload(index)}
              >
                <Upload className="size-3.5" />
                {uploadingIndex === index ? 'Uploading…' : video.storagePath ? 'Replace' : 'Upload'}
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(index)}
              aria-label="Remove video"
            >
              <Trash2 className="size-4 text-red-600" />
            </Button>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Poster Image</Label>
            <div className="mt-1">
              <MediaPickerField
                value={video.poster ? [video.poster] : []}
                onChange={(items) => update(index, { poster: items[0] ?? null })}
                multiple={false}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input className="mt-1" value={video.title} onChange={(e) => update(index, { title: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              className="mt-1"
              rows={2}
              value={video.description}
              onChange={(e) => update(index, { description: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Category</Label>
            <Input
              className="mt-1"
              value={video.category}
              onChange={(e) => update(index, { category: e.target.value })}
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, EMPTY_VIDEO])}>
        <Plus className="size-4" /> Add Video
      </Button>
    </div>
  )
}
