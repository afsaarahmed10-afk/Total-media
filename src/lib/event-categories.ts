// Display taxonomy for event-production media. Live rows store the category
// as free text (project_images.category, e.g. "Stalls & Exhibitions"), so
// this maps whatever label the admin typed onto a stable key + a proper
// Japanese/English label. Unknown labels pass through untouched — nothing
// is ever hidden because it isn't in this list.
import type { Locale } from '@/content/types'

export interface EventCategoryDef {
  /** Stable key used for filtering and `?view=` deep links. */
  key: string
  en: string
  ja: string
}

const KNOWN: (EventCategoryDef & { match: string[] })[] = [
  {
    key: 'stall',
    en: 'Stalls & Exhibitions',
    ja: 'ブース・展示会',
    match: ['stalls & exhibitions', 'stalls-exhibitions', 'stalls', 'stall', 'exhibition', 'exhibitions'],
  },
  { key: 'stage', en: 'Stage', ja: 'ステージ', match: ['stage'] },
  { key: 'hall', en: 'Hall & Venue', ja: '会場', match: ['hall & venue', 'hall-venue', 'hall', 'venue'] },
  { key: 'led', en: 'LED & AV', ja: 'LED・映像・音響', match: ['led & av', 'led-av', 'led', 'av'] },
  { key: 'setup', en: 'Event Setup', ja: 'イベント設営', match: ['event setup', 'event-setup', 'setup'] },
  { key: 'other', en: 'Other Moments', ja: 'その他', match: ['other', 'other moments'] },
]

const ORDER = KNOWN.map((k) => k.key)

function slugify(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'other'
}

export function resolveEventCategory(label: string): EventCategoryDef {
  const needle = label.trim().toLowerCase()
  const hit = KNOWN.find((k) => k.match.includes(needle))
  if (hit) return { key: hit.key, en: hit.en, ja: hit.ja }
  return { key: slugify(label), en: label, ja: label }
}

export function categoryLabel(def: EventCategoryDef, locale: Locale): string {
  return locale === 'ja' ? def.ja : def.en
}

/** Sort known categories in their fixed display order, unknown ones after. */
export function categoryOrder(key: string): number {
  const i = ORDER.indexOf(key)
  return i === -1 ? ORDER.length : i
}
