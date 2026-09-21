import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CineButton } from '@/components/cinematic/CineButton'
import { Display } from '@/components/cinematic/Display'
import { Eyebrow } from '@/components/cinematic/Eyebrow'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { getFeaturedProject, pickImage, projectViewPath } from '@/lib/featured-project'
import { trackEvent } from '@/lib/analytics'

// Used only if the live project has no photos (e.g. the content backend is
// unreachable and the static fallback is serving): an atmospheric stage
// image already shipped with the site.
const FALLBACK_IMAGE = '/images/services/stage-production.webp'

export function Hero() {
  const { t } = useTranslation(['home', 'common'])
  const project = getFeaturedProject()
  const image = pickImage(project, 'stage')?.url ?? project?.imageUrl ?? FALLBACK_IMAGE
  const reduce = useReducedMotion()

  // Subtle parallax: the photograph drifts down ~12% as the hero scrolls
  // away. Transform-only, and skipped entirely under reduced motion.
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%'])

  return (
    <section
      ref={ref}
      className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white"
    >
      <motion.div className="absolute inset-0 -z-20" style={{ y }}>
        <motion.img
          src={image}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="h-[112%] w-full object-cover"
          initial={reduce ? false : { scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-ink/50" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />

      <div className="container-page mt-auto pb-16 pt-40 lg:pb-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Eyebrow tone="dark" className="mb-6 !text-white/80">
            {t('hero.eyebrow')}
          </Eyebrow>
        </motion.div>

        <Display
          as="h1"
          size="hero"
          tone="dark"
          accent={t('hero.titleAccent')}
          delay={0.15}
          className="max-w-[14ch] uppercase sm:max-w-3xl lg:max-w-4xl"
        >
          {t('hero.title')}
        </Display>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-white/75 lg:text-lg"
        >
          {t('hero.description')}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <CineButton
            to="/quote"
            onClick={() => trackEvent('request_quote_click', { location: 'hero' })}
          >
            {t('buttons.getQuote', { ns: 'common' })}
          </CineButton>
          <CineButton to="/services" variant="outline" tone="dark">
            {t('hero.viewServices')}
          </CineButton>
        </motion.div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page flex items-center justify-between gap-6 py-5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-white/70">
          <span className="flex items-center gap-4">
            <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-white/25">
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-white"
                animate={reduce ? undefined : { y: ['-100%', '260%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
            {t('hero.scroll')}
          </span>
          {project && (
            <LocalizedLink
              to={projectViewPath(project)}
              className="hidden items-center gap-3 text-right transition-colors hover:text-white sm:flex"
            >
              <span className="hidden text-white/45 sm:inline">{t('hero.latestWork')}</span>
              <span className="text-white">{project.title}</span>
              <span aria-hidden="true">↗</span>
            </LocalizedLink>
          )}
        </div>
      </div>
    </section>
  )
}
