import { useRef, type ElementType } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span'
type Size = 'hero' | 'xl' | 'lg' | 'sec' | 'md'

const SIZE_CLASS: Record<Size, string> = {
  hero: 'display-hero',
  xl: 'display-xl',
  lg: 'display-lg',
  sec: 'display-sec',
  md: 'display-md',
}

const EASE = [0.22, 1, 0.36, 1] as const

interface DisplayProps {
  as?: Tag
  size?: Size
  /** A trailing substring of `children` set in the serif-italic accent
   * (English) / lighter weight (Japanese). Optional — no accent if omitted
   * or not found. The full string is still rendered as one heading, so
   * SEO/AT see the unchanged text. */
  accent?: string
  /** Which background the heading sits on (drives the accent colour). */
  tone?: 'light' | 'dark'
  /** Word-by-word mask reveal on scroll-into-view. */
  animate?: boolean
  delay?: number
  className?: string
  children: string
}

/** Splits into reveal units: words for English, clauses for Japanese (which
 * has no spaces to break on). Each token carries whether it was followed by
 * whitespace so the join stays natural. */
function tokenize(text: string): { text: string; space: boolean }[] {
  return text
    .split(/(?<=[\s、。，．！？!?])/)
    .filter(Boolean)
    .map((raw) => {
      const trimmed = raw.replace(/\s+$/, '')
      return { text: trimmed, space: trimmed.length !== raw.length }
    })
    .filter((t) => t.text.length > 0)
}

export function Display({
  as: Tag = 'h2',
  size = 'lg',
  accent,
  tone = 'light',
  animate = true,
  delay = 0,
  className,
  children,
}: DisplayProps) {
  const reduce = useReducedMotion()
  // Observe the heading itself, not the clipped words: a word translated
  // fully out of its overflow-hidden mask never intersects the viewport, so
  // a per-word whileInView could never fire.
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })
  const Comp = Tag as ElementType
  const idx = accent ? children.lastIndexOf(accent) : -1
  const segments =
    idx >= 0
      ? [
          { text: children.slice(0, idx), accent: false },
          { text: children.slice(idx, idx + accent!.length), accent: true },
          { text: children.slice(idx + accent!.length), accent: false },
        ].filter((s) => s.text.length > 0)
      : [{ text: children, accent: false }]

  const accentColor = tone === 'dark' ? 'text-blue-tint' : 'text-blue'
  const shouldAnimate = animate && !reduce
  let n = 0

  return (
    <Comp ref={ref} className={cn(SIZE_CLASS[size], className)}>
      {segments.map((seg, si) => {
        const tokens = tokenize(seg.text)
        return (
          <span key={si} className={cn(seg.accent && ['accent', accentColor])}>
            {tokens.map((tok, ti) => {
              const i = n++
              const isLastOfSegment = ti === tokens.length - 1
              const gap = tok.space || (isLastOfSegment && si < segments.length - 1 && /\s$/.test(seg.text))
              if (!shouldAnimate) {
                return (
                  <span key={ti}>
                    {tok.text}
                    {gap ? ' ' : ''}
                  </span>
                )
              }
              return (
                <span key={ti}>
                  <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <motion.span
                      className="inline-block will-change-transform"
                      initial={{ y: '110%' }}
                      animate={{ y: inView ? '0%' : '110%' }}
                      transition={{ duration: 0.85, ease: EASE, delay: delay + i * 0.05 }}
                    >
                      {tok.text}
                    </motion.span>
                  </span>
                  {gap ? ' ' : ''}
                </span>
              )
            })}
          </span>
        )
      })}
    </Comp>
  )
}
