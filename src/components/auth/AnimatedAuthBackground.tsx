import { motion } from 'framer-motion'
import { AbstractVisual } from '@/components/shared/AbstractVisual'

/** Premium animated backdrop for the auth branding panel — same visual
 * language as the marketing Hero (navy base, floating blurred signal-colored
 * glows, faint grid) plus a low-opacity AbstractVisual for a touch of
 * generated geometry, consistent with the site's no-photography rule. */
export function AnimatedAuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-navy">
      <div className="absolute inset-0 opacity-[0.12]">
        <AbstractVisual seed="auth-branding-panel" variant="facet" />
      </div>

      <motion.div
        className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-signal/25 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 24, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 top-1/2 h-[24rem] w-[24rem] rounded-full bg-signal/15 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-6rem] left-1/3 h-[20rem] w-[20rem] rounded-full bg-white/10 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -18, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-deep/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 via-transparent to-transparent" />
    </div>
  )
}
