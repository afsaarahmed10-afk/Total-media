import { useState } from 'react'
import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { trackEvent } from '@/lib/analytics'
import type { ProjectVideo } from '@/content/types'

/** Poster-first video: shows the still with a play button and only fetches
 * the mp4 when the visitor asks for it (zero video bytes on page load —
 * stricter than `preload="none"`, which some browsers still probe). */
export function PosterVideo({ video, projectSlug }: { video: ProjectVideo; projectSlug?: string }) {
  const { t } = useTranslation('portfolio')
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <video
        controls
        autoPlay
        playsInline
        poster={video.posterUrl || undefined}
        src={video.url}
        className="aspect-video w-full bg-black"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        setPlaying(true)
        trackEvent('project_video_play', { project_slug: projectSlug ?? '', video_title: video.title })
      }}
      aria-label={`${t('detail.playVideo')}: ${video.title}`}
      className="group relative block aspect-video w-full overflow-hidden bg-ink"
    >
      {video.posterUrl && (
        <img
          src={video.posterUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
        />
      )}
      <span aria-hidden="true" className="absolute inset-0 bg-ink/35 transition-colors group-hover:bg-ink/20" />
      <span className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-blue text-white transition-transform duration-300 group-hover:scale-110 lg:size-24">
        <Play className="ml-1 size-8" fill="currentColor" />
      </span>
    </button>
  )
}
