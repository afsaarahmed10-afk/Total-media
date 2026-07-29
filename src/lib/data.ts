// Thin data-access layer, now backed by the live Supabase content bundle
// (see content-store.ts) instead of static arrays. Function names and
// signatures are unchanged from Phase 1 — every page calls these exactly
// as before; only the source of the data changed.
import { getContentBundle } from '@/lib/content-store'
import type {
  BlogPost,
  EquipmentItem,
  Locale,
  Project,
  ProjectCategory,
  Service,
} from '@/content/types'

// Tables not yet migrated to bilingual columns (Phase 3) only ever carry
// English content, so which `lang` resolveBundle() runs with doesn't change
// their output — these functions intentionally don't take a `lang` param
// yet. Once a table's migration lands, its functions gain one, matching the
// pattern below for services/solutions.
const UNTRANSLATED: Locale = 'en'

export function getServices(lang: Locale): Service[] {
  return getContentBundle(lang).services
}

export function getServiceBySlug(slug: string, lang: Locale): Service | undefined {
  return getContentBundle(lang).services.find((s) => s.slug === slug)
}

export function getServicesBySlugs(slugs: string[], lang: Locale): Service[] {
  const services = getContentBundle(lang).services
  return slugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s))
}

export function getSolutions(lang: Locale) {
  return getContentBundle(lang).solutions
}

export function getSolutionBySlug(slug: string, lang: Locale) {
  return getContentBundle(lang).solutions.find((s) => s.slug === slug)
}

export function getEquipmentCategories(lang: Locale) {
  return getContentBundle(lang).equipmentCategories
}

export function getEquipmentCategoryBySlug(slug: string, lang: Locale) {
  return getContentBundle(lang).equipmentCategories.find((c) => c.slug === slug)
}

export function getEquipmentItems(): EquipmentItem[] {
  return getContentBundle(UNTRANSLATED).equipmentItems
}

export function getEquipmentByCategory(categorySlug: string): EquipmentItem[] {
  return getContentBundle(UNTRANSLATED).equipmentItems.filter((item) => item.categorySlug === categorySlug)
}

export function getEquipmentItemBySlug(slug: string): EquipmentItem | undefined {
  return getContentBundle(UNTRANSLATED).equipmentItems.find((item) => item.slug === slug)
}

export function getRelatedEquipment(item: EquipmentItem): EquipmentItem[] {
  const equipmentItems = getContentBundle(UNTRANSLATED).equipmentItems
  return item.relatedItemSlugs
    .map((slug) => equipmentItems.find((e) => e.slug === slug))
    .filter((e): e is EquipmentItem => Boolean(e))
}

export function getProjects(): Project[] {
  return getContentBundle(UNTRANSLATED).projects
}

export function getProjectsByCategory(category: ProjectCategory | 'All'): Project[] {
  const projects = getContentBundle(UNTRANSLATED).projects
  if (category === 'All') return projects
  return projects.filter((p) => p.category === category)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getContentBundle(UNTRANSLATED).projects.find((p) => p.slug === slug)
}

export function getBlogCategories(lang: Locale) {
  return getContentBundle(lang).blogCategories
}

export function getBlogPosts(): BlogPost[] {
  // Already sorted newest-first by the Supabase query in content-store.ts.
  return getContentBundle(UNTRANSLATED).blogPosts
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getContentBundle(UNTRANSLATED).blogPosts.find((p) => p.slug === slug)
}

export function getLatestBlogPosts(count = 3): BlogPost[] {
  return getBlogPosts().slice(0, count)
}

export function getTestimonials() {
  return getContentBundle(UNTRANSLATED).testimonials
}

export function getClients() {
  return getContentBundle(UNTRANSLATED).clients
}

export function getFaqs(lang: Locale) {
  return getContentBundle(lang).faqs
}

export function getFaqsByIds(ids: string[], lang: Locale) {
  const faqs = getContentBundle(lang).faqs
  return ids
    .map((id) => faqs.find((f) => f.id === id))
    .filter((f): f is (typeof faqs)[number] => Boolean(f))
}

export function getIndustries(lang: Locale) {
  return getContentBundle(lang).industries
}

export function getIndustryBySlug(slug: string, lang: Locale) {
  return getContentBundle(lang).industries.find((i) => i.slug === slug)
}
