import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MediaFrame } from '@/components/cinematic/MediaFrame'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { getFeaturedProject, pickImage, projectViewPath } from '@/lib/featured-project'

/** The template's 50/50 "STALL | STAGE / HALL" photo band, built from the
 * featured project's real photography and deep-linking into the matching
 * gallery filter. Renders nothing if the project has too few photos. */
export function WorkBand() {
  const { t } = useTranslation('home')
  const project = getFeaturedProject()
  if (!project) return null

  const stall = pickImage(project, 'stall')
  const stage = pickImage(project, 'stage', 1) ?? pickImage(project, 'stage') ?? pickImage(project, 'hall')
  if (!stall || !stage) return null

  const tiles = [
    { image: stall, label: t('band.stalls'), to: projectViewPath(project, 'stall') },
    { image: stage, label: t('band.stageHall'), to: projectViewPath(project, 'stage') },
  ]

  return (
    <section aria-labelledby="work-band-title" className="on-dark grid bg-ink text-white md:grid-cols-2">
      <h2 id="work-band-title" className="sr-only">
        {t('band.eyebrow')}
      </h2>
      {tiles.map((tile) => (
        <LocalizedLink key={tile.to} to={tile.to} className="group relative block">
          <MediaFrame src={tile.image.url} alt={tile.image.alt} ratio="4 / 3" hoverZoom reveal className="md:!aspect-[5/4] lg:!aspect-[4/3]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 lg:p-12">
            <span className="text-[clamp(1.75rem,1rem+3vw,4rem)] font-medium leading-none tracking-[-0.035em]">
              {tile.label}
            </span>
            <span className="flex shrink-0 items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/80 transition-colors group-hover:text-white">
              <span className="hidden sm:inline">{t('band.explore')}</span>
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </span>
          </div>
        </LocalizedLink>
      ))}
    </section>
  )
}
