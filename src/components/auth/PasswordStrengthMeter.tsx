import { motion } from 'framer-motion'
import { scorePassword } from '@/lib/auth/password-strength'
import { cn } from '@/lib/utils'

const LABELS: Record<string, string> = {
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
}

const COLORS: Record<string, string> = {
  weak: 'bg-red-500',
  fair: 'bg-amber-500',
  good: 'bg-signal',
  strong: 'bg-emerald-500',
}

const TEXT_COLORS: Record<string, string> = {
  weak: 'text-red-600',
  fair: 'text-amber-600',
  good: 'text-signal',
  strong: 'text-emerald-600',
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null

  const { score, label } = scorePassword(password)
  const segments = 4
  const filled = Math.max(1, Math.ceil((score / 5) * segments))

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist-dark">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < filled ? 1 : 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn('h-full origin-left rounded-full', COLORS[label])}
            />
          </div>
        ))}
      </div>
      <p className={cn('text-xs font-medium', TEXT_COLORS[label])}>{LABELS[label]} password</p>
    </div>
  )
}
