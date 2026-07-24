import { cn } from '@/lib/utils'

function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

const PALETTE = ['#0B1F3A', '#2F6FEA', '#1C1F24', '#134E9E']

function initialsFor(name: string, email: string): string {
  const source = name.trim() || email
  const parts = source.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

interface UserAvatarProps {
  name: string
  email: string
  avatarUrl?: string | null
  className?: string
}

/** Deterministic initials avatar placeholder — same generated-visual
 * convention as AbstractVisual, used until a real photo is uploaded. */
export function UserAvatar({ name, email, avatarUrl, className }: UserAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || email}
        className={cn('size-10 shrink-0 rounded-full object-cover', className)}
      />
    )
  }

  const seed = name || email
  const bg = PALETTE[hash(seed) % PALETTE.length]

  return (
    <div
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white',
        className,
      )}
      style={{ backgroundColor: bg }}
      aria-hidden="true"
    >
      {initialsFor(name, email)}
    </div>
  )
}
