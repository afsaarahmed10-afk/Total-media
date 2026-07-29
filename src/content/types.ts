// Shared content shapes. These are intentionally named and structured to
// mirror the Supabase/Postgres tables planned for Phase 2 — the goal is
// that swapping `src/lib/data.ts` from static arrays to Supabase queries
// requires no changes to components or pages.

export interface Faq {
  id: string
  slug: string
  question: string
  answer: string
  category?: FaqCategory
}

export interface BilingualFaq {
  id: string
  slug: string
  questionJa: string | null
  questionEn: string
  answerJa: string | null
  answerEn: string
  category?: FaqCategory
}

export type FaqCategory =
  | 'general'
  | 'quotes-pricing'
  | 'equipment'
  | 'planning'
  | 'technical'

export type ServiceCategory = 'event-type' | 'technical'
export type Locale = 'ja' | 'en'

export interface ServiceProcessStep {
  title: string
  description: string
}

/** Resolved, single-language shape — what pages/components consume. Same
 * shape regardless of locale; `data.ts` picks the right language before a
 * page ever sees it. */
export interface Service {
  id: string
  slug: string
  category: ServiceCategory
  name: string
  shortDescription: string
  heroStatement: string
  overview: string[]
  capabilities: string[]
  process: ServiceProcessStep[]
  idealFor: string[]
  relatedServiceSlugs: string[]
  relatedEquipmentCategorySlugs: string[]
  faqIds: string[]
  seoTitle: string
  seoDescription: string
}

/** Raw bilingual shape — matches the `_ja`/`_en` twin-column DB convention.
 * This is what `src/content/services.ts` (static fallback / seed source)
 * and the Supabase fetch carry; `resolveLocale()` in content-store.ts
 * collapses it to a `Service` for the requested language. */
export interface BilingualService {
  id: string
  slug: string
  category: ServiceCategory
  nameJa: string | null
  nameEn: string
  shortDescriptionJa: string | null
  shortDescriptionEn: string
  heroStatementJa: string | null
  heroStatementEn: string
  overviewJa: string[]
  overviewEn: string[]
  capabilitiesJa: string[]
  capabilitiesEn: string[]
  processJa: ServiceProcessStep[]
  processEn: ServiceProcessStep[]
  idealForJa: string[]
  idealForEn: string[]
  relatedServiceSlugs: string[]
  relatedEquipmentCategorySlugs: string[]
  faqIds: string[]
  seoTitleJa: string | null
  seoTitleEn: string
  seoDescriptionJa: string | null
  seoDescriptionEn: string
}

export interface SolutionHighlight {
  title: string
  description: string
}

export interface Solution {
  id: string
  slug: string
  name: string
  shortDescription: string
  heroStatement: string
  overview: string[]
  highlights: SolutionHighlight[]
  includedServiceSlugs: string[]
  seoTitle: string
  seoDescription: string
}

export interface BilingualSolution {
  id: string
  slug: string
  nameJa: string | null
  nameEn: string
  shortDescriptionJa: string | null
  shortDescriptionEn: string
  heroStatementJa: string | null
  heroStatementEn: string
  overviewJa: string[]
  overviewEn: string[]
  highlightsJa: SolutionHighlight[]
  highlightsEn: SolutionHighlight[]
  includedServiceSlugs: string[]
  seoTitleJa: string | null
  seoTitleEn: string
  seoDescriptionJa: string | null
  seoDescriptionEn: string
}

export interface EquipmentCategory {
  id: string
  slug: string
  name: string
  description: string
}

export interface BilingualEquipmentCategory {
  id: string
  slug: string
  nameJa: string | null
  nameEn: string
  descriptionJa: string | null
  descriptionEn: string
}

export type EquipmentAvailability = 'in-stock' | 'limited' | 'made-to-order'

export interface EquipmentSpec {
  label: string
  value: string
}

export interface EquipmentItem {
  id: string
  slug: string
  categorySlug: string
  name: string
  summary: string
  description: string
  specs: EquipmentSpec[]
  applications: string[]
  availability: EquipmentAvailability
  relatedItemSlugs: string[]
  visualSeed: string
}

export interface BilingualEquipmentItem {
  id: string
  slug: string
  categorySlug: string
  nameJa: string | null
  nameEn: string
  summaryJa: string | null
  summaryEn: string
  descriptionJa: string | null
  descriptionEn: string
  specsJa: EquipmentSpec[]
  specsEn: EquipmentSpec[]
  applicationsJa: string[]
  applicationsEn: string[]
  availability: EquipmentAvailability
  relatedItemSlugs: string[]
  visualSeed: string
}

export type ProjectCategory =
  | 'Conference'
  | 'Corporate'
  | 'Exhibition'
  | 'Hybrid'
  | 'Virtual'
  | 'Outdoor'

export interface ProjectStat {
  label: string
  value: string
}

export interface Project {
  id: string
  slug: string
  title: string
  client: string
  location: string
  year: number
  category: ProjectCategory
  summary: string
  description: string[]
  servicesUsed: string[]
  equipmentUsed: string[]
  stats: ProjectStat[]
  visualSeed: string
}

export interface BlogCategory {
  id: string
  slug: string
  name: string
}

export interface BilingualBlogCategory {
  id: string
  slug: string
  nameJa: string | null
  nameEn: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  categorySlug: string
  excerpt: string
  content: string[]
  author: string
  authorRole: string
  publishedAt: string
  readMinutes: number
  visualSeed: string
}

export interface BilingualBlogPost {
  id: string
  slug: string
  titleJa: string | null
  titleEn: string
  categorySlug: string
  excerptJa: string | null
  excerptEn: string
  contentJa: string[]
  contentEn: string[]
  author: string
  authorRoleJa: string | null
  authorRoleEn: string
  publishedAt: string
  readMinutes: number
  visualSeed: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
}

export interface Client {
  id: string
  name: string
}

export interface Industry {
  id: string
  slug: string
  name: string
  description: string
  useCases: string[]
}

export interface BilingualIndustry {
  id: string
  slug: string
  nameJa: string | null
  nameEn: string
  descriptionJa: string | null
  descriptionEn: string
  useCasesJa: string[]
  useCasesEn: string[]
}
