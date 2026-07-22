// Fetches every content table once, in parallel, and stitches the results
// into the exact shapes `src/content/types.ts` already defines — so
// `src/lib/data.ts` and every page that calls it need no changes at all.
//
// Join tables are self-referential in a couple of cases (e.g.
// service_related_services references `services` twice), which makes
// PostgREST's nested-embed syntax require foreign-key disambiguation and
// gets fragile fast. Simpler and more robust: fetch every table flat, then
// stitch in plain TypeScript using id -> slug lookup maps.
import { supabase } from '@/lib/supabase/client'
import type {
  BlogCategory,
  BlogPost,
  Client,
  EquipmentCategory,
  EquipmentItem,
  Faq,
  Industry,
  Project,
  Service,
  Solution,
  Testimonial,
} from '@/content/types'

export interface ContentBundle {
  services: Service[]
  solutions: Solution[]
  equipmentCategories: EquipmentCategory[]
  equipmentItems: EquipmentItem[]
  projects: Project[]
  blogCategories: BlogCategory[]
  blogPosts: BlogPost[]
  testimonials: Testimonial[]
  clients: Client[]
  faqs: Faq[]
  industries: Industry[]
}

let cache: ContentBundle | null = null
let inflight: Promise<ContentBundle> | null = null

/** Fetches (once) and returns the full content bundle. Safe to call from
 * multiple places concurrently — subsequent calls reuse the same promise. */
export function loadContent(): Promise<ContentBundle> {
  if (cache) return Promise.resolve(cache)
  if (inflight) return inflight

  inflight = fetchAndStitch()
    .then((bundle) => {
      cache = bundle
      inflight = null
      return bundle
    })
    .catch((err) => {
      inflight = null
      throw err
    })

  return inflight
}

/** Returns the cached bundle, or throws if `loadContent()` hasn't resolved
 * yet. `data.ts` uses this — `ContentGate` guarantees it's populated before
 * any page renders. */
export function getContentBundle(): ContentBundle {
  if (!cache) {
    throw new Error('Content not loaded yet — data.ts was called before ContentGate resolved.')
  }
  return cache
}

export function clearContentCache() {
  cache = null
  inflight = null
}

async function fetchAndStitch(): Promise<ContentBundle> {
  const [
    servicesRes,
    solutionsRes,
    equipmentCategoriesRes,
    equipmentItemsRes,
    projectsRes,
    blogCategoriesRes,
    blogPostsRes,
    testimonialsRes,
    clientsRes,
    faqsRes,
    industriesRes,
    serviceRelatedServicesRes,
    serviceRelatedEquipmentCategoriesRes,
    serviceFaqsRes,
    solutionServicesRes,
    equipmentRelatedItemsRes,
    projectServicesRes,
    projectEquipmentRes,
  ] = await Promise.all([
    supabase.from('services').select('*'),
    supabase.from('solutions').select('*'),
    supabase.from('equipment_categories').select('*'),
    supabase.from('equipment_items').select('*'),
    supabase.from('projects').select('*'),
    supabase.from('blog_categories').select('*'),
    supabase.from('blog_posts').select('*').order('published_at', { ascending: false }),
    supabase.from('testimonials').select('*').eq('is_published', true).order('sort_order'),
    supabase.from('clients').select('*'),
    supabase.from('faqs').select('*'),
    supabase.from('industries').select('*'),
    supabase.from('service_related_services').select('*').order('sort_order'),
    supabase.from('service_related_equipment_categories').select('*').order('sort_order'),
    supabase.from('service_faqs').select('*').order('sort_order'),
    supabase.from('solution_services').select('*').order('sort_order'),
    supabase.from('equipment_related_items').select('*').order('sort_order'),
    supabase.from('project_services').select('*').order('sort_order'),
    supabase.from('project_equipment').select('*').order('sort_order'),
  ])

  for (const res of [
    servicesRes, solutionsRes, equipmentCategoriesRes, equipmentItemsRes, projectsRes,
    blogCategoriesRes, blogPostsRes, testimonialsRes, clientsRes, faqsRes, industriesRes,
    serviceRelatedServicesRes, serviceRelatedEquipmentCategoriesRes, serviceFaqsRes,
    solutionServicesRes, equipmentRelatedItemsRes, projectServicesRes, projectEquipmentRes,
  ]) {
    if (res.error) throw res.error
  }

  const services = servicesRes.data!
  const equipmentCategories = equipmentCategoriesRes.data!
  const equipmentItems = equipmentItemsRes.data!
  const blogCategories = blogCategoriesRes.data!

  // id -> slug lookup maps, used to reconstruct the frontend's *Slug fields
  // from join-table rows.
  const serviceSlugById = new Map(services.map((s) => [s.id, s.slug]))
  const equipmentCategorySlugById = new Map(equipmentCategories.map((c) => [c.id, c.slug]))
  const equipmentItemSlugById = new Map(equipmentItems.map((e) => [e.id, e.slug]))
  const blogCategorySlugById = new Map(blogCategories.map((c) => [c.id, c.slug]))

  function groupBy<T, K>(rows: T[], key: (row: T) => K): Map<K, T[]> {
    const map = new Map<K, T[]>()
    for (const row of rows) {
      const k = key(row)
      const list = map.get(k)
      if (list) list.push(row)
      else map.set(k, [row])
    }
    return map
  }

  const relatedServicesByService = groupBy(serviceRelatedServicesRes.data!, (r) => r.service_id)
  const relatedEquipCatsByService = groupBy(
    serviceRelatedEquipmentCategoriesRes.data!,
    (r) => r.service_id,
  )
  const faqsByService = groupBy(serviceFaqsRes.data!, (r) => r.service_id)
  const servicesBySolution = groupBy(solutionServicesRes.data!, (r) => r.solution_id)
  const relatedItemsByEquipment = groupBy(equipmentRelatedItemsRes.data!, (r) => r.equipment_item_id)
  const servicesByProject = groupBy(projectServicesRes.data!, (r) => r.project_id)
  const equipmentByProject = groupBy(projectEquipmentRes.data!, (r) => r.project_id)

  const stitchedServices: Service[] = services.map((s) => ({
    id: s.id,
    slug: s.slug,
    category: s.category,
    name: s.name,
    shortDescription: s.short_description,
    heroStatement: s.hero_statement,
    overview: s.overview,
    capabilities: s.capabilities,
    process: s.process as unknown as Service['process'],
    idealFor: s.ideal_for,
    relatedServiceSlugs: (relatedServicesByService.get(s.id) ?? [])
      .map((r) => serviceSlugById.get(r.related_service_id))
      .filter((slug): slug is string => Boolean(slug)),
    relatedEquipmentCategorySlugs: (relatedEquipCatsByService.get(s.id) ?? [])
      .map((r) => equipmentCategorySlugById.get(r.equipment_category_id))
      .filter((slug): slug is string => Boolean(slug)),
    faqIds: (faqsByService.get(s.id) ?? []).map((r) => r.faq_id),
    seoTitle: s.seo_title,
    seoDescription: s.seo_description,
  }))

  const stitchedSolutions: Solution[] = solutionsRes.data!.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    shortDescription: s.short_description,
    heroStatement: s.hero_statement,
    overview: s.overview,
    highlights: s.highlights as unknown as Solution['highlights'],
    includedServiceSlugs: (servicesBySolution.get(s.id) ?? [])
      .map((r) => serviceSlugById.get(r.service_id))
      .filter((slug): slug is string => Boolean(slug)),
    seoTitle: s.seo_title,
    seoDescription: s.seo_description,
  }))

  const stitchedEquipmentCategories: EquipmentCategory[] = equipmentCategories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
  }))

  const stitchedEquipmentItems: EquipmentItem[] = equipmentItems.map((item) => ({
    id: item.id,
    slug: item.slug,
    categorySlug: equipmentCategorySlugById.get(item.category_id) ?? '',
    name: item.name,
    summary: item.summary,
    description: item.description,
    specs: item.specs as unknown as EquipmentItem['specs'],
    applications: item.applications,
    availability: item.availability,
    relatedItemSlugs: (relatedItemsByEquipment.get(item.id) ?? [])
      .map((r) => equipmentItemSlugById.get(r.related_item_id))
      .filter((slug): slug is string => Boolean(slug)),
    visualSeed: item.visual_seed,
  }))

  const stitchedProjects: Project[] = projectsRes.data!.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    client: p.client,
    location: p.location,
    year: p.year,
    category: p.category,
    summary: p.summary,
    description: p.description,
    servicesUsed: (servicesByProject.get(p.id) ?? [])
      .map((r) => serviceSlugById.get(r.service_id))
      .filter((slug): slug is string => Boolean(slug)),
    equipmentUsed: (equipmentByProject.get(p.id) ?? [])
      .map((r) => equipmentItemSlugById.get(r.equipment_item_id))
      .filter((slug): slug is string => Boolean(slug)),
    stats: p.stats as unknown as Project['stats'],
    visualSeed: p.visual_seed,
  }))

  const stitchedBlogPosts: BlogPost[] = blogPostsRes.data!.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    categorySlug: blogCategorySlugById.get(post.category_id) ?? '',
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    authorRole: post.author_role,
    publishedAt: post.published_at,
    readMinutes: post.read_minutes,
    visualSeed: post.visual_seed,
  }))

  const stitchedTestimonials: Testimonial[] = testimonialsRes.data!.map((t) => ({
    id: t.id,
    quote: t.quote,
    author: t.author,
    role: t.role,
    company: t.company,
  }))

  const stitchedFaqs: Faq[] = faqsRes.data!.map((f) => ({
    id: f.id,
    slug: f.slug,
    question: f.question,
    answer: f.answer,
    category: f.category ?? undefined,
  }))

  const stitchedIndustries: Industry[] = industriesRes.data!.map((i) => ({
    id: i.id,
    slug: i.slug,
    name: i.name,
    description: i.description,
    useCases: i.use_cases,
  }))

  return {
    services: stitchedServices,
    solutions: stitchedSolutions,
    equipmentCategories: stitchedEquipmentCategories,
    equipmentItems: stitchedEquipmentItems,
    projects: stitchedProjects,
    blogCategories,
    blogPosts: stitchedBlogPosts,
    testimonials: stitchedTestimonials,
    clients: clientsRes.data!,
    faqs: stitchedFaqs,
    industries: stitchedIndustries,
  }
}
