import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

export type MediaRow = Database['public']['Tables']['media']['Row']

/** Public URL for an object in the `media` Storage bucket (public, admin-write). */
export function publicMediaUrl(storagePath: string): string {
  return supabase.storage.from('media').getPublicUrl(storagePath).data.publicUrl
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file.'))
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      reject(new Error('Failed to read image dimensions.'))
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}

/** Uploads a file to the `media` bucket and inserts the matching `media`
 * row. Width/height are captured best-effort — a failure there doesn't
 * fail the whole upload, it just leaves those columns null. */
export async function uploadMediaFile(
  file: File,
  uploadedBy: string | null,
): Promise<{ data: MediaRow | null; error: string | null }> {
  const path = `${crypto.randomUUID()}-${file.name}`
  const { error: uploadError } = await supabase.storage.from('media').upload(path, file)
  if (uploadError) return { data: null, error: uploadError.message }

  const dims = await getImageDimensions(file).catch(() => null)

  const { data, error } = await supabase
    .from('media')
    .insert({
      storage_path: path,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      width: dims?.width ?? null,
      height: dims?.height ?? null,
      uploaded_by: uploadedBy,
    })
    .select('*')
    .single()

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

/** Removes the Storage object then the `media` row. Safe to call even if
 * the row is referenced elsewhere — join tables cascade and
 * `blog_posts.cover_media_id` is nullable (`on delete set null`). */
export async function deleteMediaFile(row: MediaRow): Promise<string | null> {
  const { error: storageError } = await supabase.storage.from('media').remove([row.storage_path])
  if (storageError) return storageError.message

  const { error } = await supabase.from('media').delete().eq('id', row.id)
  if (error) return error.message
  return null
}
