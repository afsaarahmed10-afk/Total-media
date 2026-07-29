import { cn } from '@/lib/utils'

/** EN/JA toggle for admin content forms — switches which language's field
 * set is visible. Purely local UI state in the parent form; doesn't touch
 * form data itself. `jaComplete` drives a small dot indicator so admins can
 * see at a glance whether a Japanese translation is missing, without having
 * to switch tabs to check. */
export function LangTabs({
  active,
  onChange,
  jaComplete,
}: {
  active: 'en' | 'ja'
  onChange: (lang: 'en' | 'ja') => void
  jaComplete: boolean
}) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-mist p-1 text-sm">
      <button
        type="button"
        onClick={() => onChange('en')}
        className={cn(
          'rounded-md px-3 py-1.5 font-medium transition-colors',
          active === 'en' ? 'bg-white text-navy shadow-sm' : 'text-muted-foreground hover:text-navy',
        )}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => onChange('ja')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors',
          active === 'ja' ? 'bg-white text-navy shadow-sm' : 'text-muted-foreground hover:text-navy',
        )}
      >
        日本語
        <span
          className={cn('size-1.5 rounded-full', jaComplete ? 'bg-emerald-500' : 'bg-amber-400')}
          title={jaComplete ? 'Japanese translation present' : 'Japanese translation missing'}
        />
      </button>
    </div>
  )
}
