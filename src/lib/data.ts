// Thin data-access layer, now backed by the live Supabase content bundle
// (see content-store.ts) instead of static arrays. Function names and
// signatures are unchanged from Phase 1 — every page calls these exactly
// as before; only the source of the data changed.
import { getContentBundle } from '@/lib/content-store'
import type {
  BlogPost,
  EquipmentItem,
  Project,
  ProjectCategory,
  Service,
} from '@/content/types'

export function getServices(): Service[] {
  return getContentBundle().services
}

export function getServiceBySlug(slug: string): Service | undefined {
  return getContentBundle().services.find((s) => s.slug === slug)
}

export function getServicesBySlugs(slugs: string[]): Service[] {
  const services = getContentBundle().services
  return slugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s))
}

export function getSolutions() {
  return getContentBundle().solutions
}

export function getSolutionBySlug(slug: string) {
  return getContentBundle().solutions.find((s) => s.slug === slug)
}

export function getEquipmentCategories() {
  return getContentBundle().equipmentCategories
}

export function getEquipmentCategoryBySlug(slug: string) {
  return getContentBundle().equipmentCategories.find((c) => c.slug === slug)
}

export function getEquipmentItems(): EquipmentItem[] {
  return getContentBundle().equipmentItems
}

export function getEquipmentByCategory(categorySlug: string): EquipmentItem[] {
  return getContentBundle().equipmentItems.filter((item) => item.categorySlug === categorySlug)
}

export function getEquipmentItemBySlug(slug: string): EquipmentItem | undefined {
  return getContentBundle().equipmentItems.find((item) => item.slug === slug)
}

export function getRelatedEquipment(item: EquipmentItem): EquipmentItem[] {
  const equipmentItems = getContentBundle().equipmentItems
  return item.relatedItemSlugs
    .map((slug) => equipmentItems.find((e) => e.slug === slug))
    .filter((e): e is EquipmentItem => Boolean(e))
}

export function getProjects(): Project[] {
  return getContentBundle().projects
}

export function getProjectsByCategory(category: ProjectCategory | 'All'): Project[] {
  const projects = getContentBundle().projects
  if (category === 'All') return projects
  return projects.filter((p) => p.category === category)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getContentBundle().projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(count = 3): Project[] {
  return getContentBundle().projects.slice(0, count)
}

export function getBlogCategories() {
  return getContentBundle().blogCategories
}

export function getBlogPosts(): BlogPost[] {
  // Already sorted newest-first by the Supabase query in content-store.ts.
  return getContentBundle().blogPosts
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getContentBundle().blogPosts.find((p) => p.slug === slug)
}

export function getLatestBlogPosts(count = 3): BlogPost[] {
  return getBlogPosts().slice(0, count)
}

export function getTestimonials() {
  return getContentBundle().testimonials
}

export function getClients() {
  return getContentBundle().clients
}

export function getFaqs() {
  return getContentBundle().faqs
}

export function getFaqsByIds(ids: string[]) {
  const faqs = getContentBundle().faqs
  return ids
    .map((id) => faqs.find((f) => f.id === id))
    .filter((f): f is (typeof faqs)[number] => Boolean(f))
}

export function getIndustries() {
  return getContentBundle().industries
}

export function getIndustryBySlug(slug: string) {
  return getContentBundle().industries.find((i) => i.slug === slug)
}
