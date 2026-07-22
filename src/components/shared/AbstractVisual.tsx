// Original, deterministic abstract compositions used in place of photography
// across the site (equipment "galleries," portfolio and blog cover art,
// hero fields). Never presents fabricated "photos" of events, people, or
// venues — every tile is generated geometry seeded from a stable string
// (a slug), so the same entity always renders the same visual.
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

type Composition = 'diagonal' | 'facet' | 'grid' | 'radial' | 'bars' | 'arcs'
const COMPOSITIONS: Composition[] = ['diagonal', 'facet', 'grid', 'radial', 'bars', 'arcs']

const NAVY = '#0B1F3A'
const NAVY_DEEP = '#071429'
const MIST = '#DCE4EF'
const SIGNAL = '#2F6FEA'

interface AbstractVisualProps {
  seed: string
  className?: string
  /** Force a composition instead of deriving it from the seed. */
  variant?: Composition
}

export function AbstractVisual({ seed, className, variant }: AbstractVisualProps) {
  const uid = useMemo(() => `av-${hash(seed).toString(36)}`, [seed])
  const h = hash(seed)
  const composition = variant ?? COMPOSITIONS[h % COMPOSITIONS.length]
  const angle = (h >> 3) % 360
  const flip = (h >> 7) % 2 === 0

  return (
    <svg
      viewBox="0 0 400 300"
      className={cn('h-full w-full', className)}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${uid}-bg`}
          gradientTransform={`rotate(${angle} 0.5 0.5)`}
        >
          <stop offset="0%" stopColor={NAVY} />
          <stop offset="100%" stopColor={NAVY_DEEP} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx={flip ? '25%' : '75%'} cy="30%" r="70%">
          <stop offset="0%" stopColor={SIGNAL} stopOpacity="0.55" />
          <stop offset="100%" stopColor={SIGNAL} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${uid}-bg)`} />

      {composition === 'diagonal' && (
        <>
          <polygon
            points={flip ? '0,300 400,0 400,300' : '0,0 400,0 0,300'}
            fill={NAVY_DEEP}
            opacity="0.55"
          />
          <line
            x1={flip ? 0 : 400}
            y1={0}
            x2={flip ? 400 : 0}
            y2={300}
            stroke={SIGNAL}
            strokeWidth="2"
            opacity="0.8"
          />
        </>
      )}

      {composition === 'facet' && (
        <g opacity="0.9">
          <polygon points="40,220 140,120 220,240" fill={NAVY_DEEP} opacity="0.7" />
          <polygon points="180,260 300,140 380,260" fill={MIST} opacity="0.08" />
          <polygon points="240,80 320,40 360,140" fill={SIGNAL} opacity="0.85" />
        </g>
      )}

      {composition === 'grid' && (
        <g stroke={MIST} strokeOpacity="0.14">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`hz${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} />
          ))}
          <rect
            x={50 * (h % 6)}
            y={50 * (h % 4)}
            width="50"
            height="50"
            fill={SIGNAL}
            opacity="0.35"
          />
        </g>
      )}

      {composition === 'radial' && <rect width="400" height="300" fill={`url(#${uid}-glow)`} />}

      {composition === 'bars' && (
        <g>
          {[0.3, 0.55, 0.4, 0.75, 0.5, 0.65, 0.35].map((f, i) => {
            const barW = 28
            const gap = 14
            const totalW = 7 * barW + 6 * gap
            const startX = (400 - totalW) / 2
            const barH = f * 180
            const isAccent = i === 3
            return (
              <rect
                key={i}
                x={startX + i * (barW + gap)}
                y={220 - barH}
                width={barW}
                height={barH}
                rx="6"
                fill={isAccent ? SIGNAL : MIST}
                opacity={isAccent ? 0.95 : 0.16}
              />
            )
          })}
        </g>
      )}

      {composition === 'arcs' && (
        <g fill="none" strokeWidth="2">
          {[60, 100, 140, 180].map((r, i) => (
            <circle
              key={r}
              cx={flip ? 380 : 20}
              cy="150"
              r={r}
              stroke={i === 2 ? SIGNAL : MIST}
              strokeOpacity={i === 2 ? 0.8 : 0.14}
            />
          ))}
        </g>
      )}
    </svg>
  )
}
