import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { Section } from '@/components/cinematic/Section'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { categoryLabel, categoryOrder, resolveEventCategory } from '@/lib/event-categories'
import { useLocale } from '@/lib/locale/LocaleContext'
import { cn } from '@/lib/utils'
import type { ProjectImage } from '@/content/types'

interface ProjectGalleryProps {
  images: ProjectImage[]
  title: string
}

/** Photo gallery for a project: category filter (Stalls / Stage / Hall /
 * LED & AV / …, deep-linkable via `?view=`), natural-aspect masonry, and a
 * keyboard-navigable lightbox. Only categories that actually contain
 * photos get a tab, and no photo is ever hidden from "All". */
export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const { t } = useTranslation('portfolio')
  const { locale } = useLocale()
  const [params, setParams] = useSearchParams()
  const sectionRef = useRef<HTMLElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const items = useMemo(
    () => images.map((image) => ({ image, cat: resolveEventCategory(image.category) })),
    [images],
  )
  const categories = useMemo(() => {
    const seen = new Map<string, { key: string; label: string; count: number }>()
    for (const { cat } of items) {
      const hit = seen.get(cat.key)
      if (hit) hit.count += 1
      else seen.set(cat.key, { key: cat.key, label: categoryLabel(cat, locale), count: 1 })
    }
    return [...seen.values()].sort((a, b) => categoryOrder(a.key) - categoryOrder(b.key))
  }, [items, locale])

  const requested = params.get('view')
  const active = requested && categories.some((c) => c.key === requested) ? requested : 'all'
  const visible = active === 'all' ? items : items.filter((i) => i.cat.key === active)

  // Arriving via a `?view=` deep link (e.g. the homepage Stall | Stage
  // band): bring the gallery into view once, after layout settles.
  useEffect(() => {
    if (!requested) return
    const id = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 350)
    return () => window.clearTimeout(id)
    // Only on first arrival — not on every filter click.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function select(key: string) {
    const next = new URLSearchParams(params)
    if (key === 'all') next.delete('view')
    else next.set('view', key)
    setParams(next, { replace: true, preventScrollReset: true })
    setOpenIndex(null)
  }

  const current = openIndex !== null ? visible[openIndex] : null
  const step = (delta: number) =>
    setOpenIndex((i) => (i === null ? i : (i + delta + visible.length) % visible.length))

  return (
    <Section tone="ink" space="lg" id="gallery">
      <div ref={sectionRef as React.RefObject<HTMLDivElement>} className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading tone="dark" eyebrow={t('detail.gallery')} title={title} />
          <p className="eyebrow tnum text-white/60">{t('detail.photoCount', { count: images.length })}</p>
        </div>

        {categories.length > 1 && (
          <div role="group" aria-label={t('detail.filterLabel')} className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-b border-white/15">
            {[{ key: 'all', label: t('detail.allPhotos'), count: images.length }, ...categories].map((c) => (
              <button
                key={c.key}
                type="button"
                aria-pressed={active === c.key}
                onClick={() => select(c.key)}
                className={cn(
                  '-mb-px flex items-baseline gap-2 border-b-2 pb-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors',
                  active === c.key
                    ? 'border-white text-white'
                    : 'border-transparent text-white/60 hover:text-white',
                )}
              >
                {c.label}
                <span className="tnum text-[0.6875rem] text-white/60">{c.count}</span>
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.ul
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3"
          >
            {visible.map(({ image, cat }, i) => (
              <li key={image.id} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={t('detail.openPhoto', { n: i + 1, alt: image.alt })}
                  className="group relative block w-full overflow-hidden bg-ink-2"
                  style={{ aspectRatio: `${image.width} / ${image.height}` }}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 pt-10 text-left text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {categoryLabel(cat, locale)}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <Dialog.Root open={current !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-ink/95" />
          <Dialog.Content
            aria-describedby={undefined}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') step(1)
              if (e.key === 'ArrowLeft') step(-1)
            }}
            className="on-dark cinematic fixed inset-0 z-[71] flex flex-col bg-ink text-white outline-none"
          >
            <Dialog.Title className="sr-only">{t('detail.lightboxLabel')}</Dialog.Title>
            <div className="flex items-center justify-between px-5 py-4 lg:px-10">
              <p className="eyebrow tnum text-white/60">
                {String((openIndex ?? 0) + 1).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}
              </p>
              <Dialog.Close
                aria-label={t('detail.closeViewer')}
                className="flex size-11 items-center justify-center border border-white/30 transition-colors hover:bg-white hover:text-ink"
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 lg:px-24">
              {current && (
                <img
                  key={current.image.id}
                  src={current.image.url}
                  alt={current.image.alt}
                  className="max-h-full max-w-full object-contain"
                />
              )}
              {visible.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={t('detail.previousPhoto')}
                    className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-white/30 bg-ink/60 transition-colors hover:bg-white hover:text-ink lg:left-6"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={t('detail.nextPhoto')}
                    className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-white/30 bg-ink/60 transition-colors hover:bg-white hover:text-ink lg:right-6"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>

            {current && (
              <div className="px-5 py-5 text-center lg:px-10">
                <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/75">{current.image.alt}</p>
                <p className="eyebrow mt-3 text-blue-tint">{categoryLabel(current.cat, locale)}</p>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Section>
  )
}
