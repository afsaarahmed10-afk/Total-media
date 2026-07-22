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

export type FaqCategory =
  | 'general'
  | 'quotes-pricing'
  | 'equipment'
  | 'planning'
  | 'technical'

export type ServiceCategory = 'event-type' | 'technical'

export interface ServiceProcessStep {
  title: string
  description: string
}

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

export interface EquipmentCategory {
  id: string
  slug: string
  name: string
  description: string
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
