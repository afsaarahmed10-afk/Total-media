// Fetches every content table once, in parallel, and stitches the results
// into the exact shapes `src/content/types.ts` already defines — so
// `src/lib/data.ts` and every page that calls it need no changes at all.
//
// Join tables are self-referential in a couple of cases (e.g.
// service_related_services references `services` twice), which makes
// PostgREST's nested-embed syntax require foreign-key disambiguation and
// gets fragile fast. Simpler and more robust: fetch every table flat, then
// stitch in plain TypeScript using id -> slug lookup maps.
import type {
  BilingualBlogCategory,
  BilingualEquipmentCategory,
  BilingualEquipmentItem,
  BilingualFaq,
  BilingualIndustry,
  BilingualService,
  BilingualSolution,
  BlogCategory,
  BlogPost,
  Client,
  EquipmentCategory,
  EquipmentItem,
  Faq,
  Industry,
  Locale,
  Project,
  Service,
  Solution,
  Testimonial,
} from '@/content/types'
import { services as staticServices } from '@/content/services'
import { solutions as staticSolutions } from '@/content/solutions'
import { equipmentCategories as staticEquipmentCategories } from '@/content/equipment-categories'
import { equipmentItems as staticEquipmentItems } from '@/content/equipment'
import { projects as staticProjects } from '@/content/projects'
import { blogCategories as staticBlogCategories } from '@/content/blog-categories'
import { blogPosts as staticBlogPosts } from '@/content/blog-posts'
import { testimonials as staticTestimonials } from '@/content/testimonials'
import { clients as staticClients } from '@/content/clients'
import { faqs as staticFaqs } from '@/content/faqs'
import { industries as staticIndustries } from '@/content/industries'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

/** Raw bundle as fetched/loaded — bilingual for every table migrated so
 * far (services, solutions, equipment_categories, equipment_items,
 * blog_categories, faqs, industries); the rest (projects, blog_posts,
 * testimonials) aren't migrated to bilingual columns yet, so still
 * single-language English. */
export interface RawContentBundle {
  services: BilingualService[]
  solutions: BilingualSolution[]
  equipmentCategories: BilingualEquipmentCategory[]
  equipmentItems: BilingualEquipmentItem[]
  projects: Project[]
  blogCategories: BilingualBlogCategory[]
  blogPosts: BlogPost[]
  testimonials: Testimonial[]
  clients: Client[]
  faqs: BilingualFaq[]
  industries: BilingualIndustry[]
}

/** Resolved, single-language bundle — what `data.ts` hands to pages.
 * Unchanged shape from before bilingual support landed. */
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

let rawCache: RawContentBundle | null = null
let inflight: Promise<RawContentBundle> | null = null
// Resolved bundles are derived from rawCache and memoized per locale, so
// switching languages mid-session (client-side nav from /about to
// /en/about) never triggers a refetch and never shows stale-language
// content — only the cheap resolve step below reruns.
const resolvedCache: Partial<Record<Locale, ContentBundle>> = {}

/** Fetches (once) and caches the raw bilingual bundle. Safe to call from
 * multiple places concurrently — subsequent calls reuse the same promise.
 * Falls back to the static `content/*.ts` modules when no Supabase project
 * is configured, so local dev works without setup. */
export function loadContent(): Promise<RawContentBundle> {
  if (rawCache) return Promise.resolve(rawCache)
  if (inflight) return inflight

  inflight = (isSupabaseConfigured ? fetchAndStitch() : loadStaticBundle())
    .then((bundle) => {
      rawCache = bundle
      inflight = null
      return bundle
    })
    .catch((err) => {
      inflight = null
      throw err
    })

  return inflight
}

function resolveService(s: BilingualService, lang: Locale): Service {
  const ja = lang === 'ja'
  return {
    id: s.id,
    slug: s.slug,
    category: s.category,
    name: (ja && s.nameJa) || s.nameEn,
    shortDescription: (ja && s.shortDescriptionJa) || s.shortDescriptionEn,
    heroStatement: (ja && s.heroStatementJa) || s.heroStatementEn,
    overview: ja && s.overviewJa.length ? s.overviewJa : s.overviewEn,
    capabilities: ja && s.capabilitiesJa.length ? s.capabilitiesJa : s.capabilitiesEn,
    process: ja && s.processJa.length ? s.processJa : s.processEn,
    idealFor: ja && s.idealForJa.length ? s.idealForJa : s.idealForEn,
    relatedServiceSlugs: s.relatedServiceSlugs,
    relatedEquipmentCategorySlugs: s.relatedEquipmentCategorySlugs,
    faqIds: s.faqIds,
    seoTitle: (ja && s.seoTitleJa) || s.seoTitleEn,
    seoDescription: (ja && s.seoDescriptionJa) || s.seoDescriptionEn,
    imageUrl: s.imageUrl,
  }
}

function resolveSolution(s: BilingualSolution, lang: Locale): Solution {
  const ja = lang === 'ja'
  return {
    id: s.id,
    slug: s.slug,
    name: (ja && s.nameJa) || s.nameEn,
    shortDescription: (ja && s.shortDescriptionJa) || s.shortDescriptionEn,
    heroStatement: (ja && s.heroStatementJa) || s.heroStatementEn,
    overview: ja && s.overviewJa.length ? s.overviewJa : s.overviewEn,
    highlights: ja && s.highlightsJa.length ? s.highlightsJa : s.highlightsEn,
    includedServiceSlugs: s.includedServiceSlugs,
    seoTitle: (ja && s.seoTitleJa) || s.seoTitleEn,
    seoDescription: (ja && s.seoDescriptionJa) || s.seoDescriptionEn,
    imageUrl: s.imageUrl,
  }
}

function resolveEquipmentCategory(c: BilingualEquipmentCategory, lang: Locale): EquipmentCategory {
  const ja = lang === 'ja'
  return {
    id: c.id,
    slug: c.slug,
    name: (ja && c.nameJa) || c.nameEn,
    description: (ja && c.descriptionJa) || c.descriptionEn,
    imageUrl: c.imageUrl,
  }
}

function resolveEquipmentItem(item: BilingualEquipmentItem, lang: Locale): EquipmentItem {
  const ja = lang === 'ja'
  return {
    id: item.id,
    slug: item.slug,
    categorySlug: item.categorySlug,
    name: (ja && item.nameJa) || item.nameEn,
    summary: (ja && item.summaryJa) || item.summaryEn,
    description: (ja && item.descriptionJa) || item.descriptionEn,
    specs: ja && item.specsJa.length ? item.specsJa : item.specsEn,
    applications: ja && item.applicationsJa.length ? item.applicationsJa : item.applicationsEn,
    availability: item.availability,
    relatedItemSlugs: item.relatedItemSlugs,
    visualSeed: item.visualSeed,
    galleryUrls: item.galleryUrls,
  }
}

function resolveBlogCategory(c: BilingualBlogCategory, lang: Locale): BlogCategory {
  const ja = lang === 'ja'
  return {
    id: c.id,
    slug: c.slug,
    name: (ja && c.nameJa) || c.nameEn,
  }
}

function resolveFaq(f: BilingualFaq, lang: Locale): Faq {
  const ja = lang === 'ja'
  return {
    id: f.id,
    slug: f.slug,
    question: (ja && f.questionJa) || f.questionEn,
    answer: (ja && f.answerJa) || f.answerEn,
    category: f.category,
  }
}

function resolveIndustry(i: BilingualIndustry, lang: Locale): Industry {
  const ja = lang === 'ja'
  return {
    id: i.id,
    slug: i.slug,
    name: (ja && i.nameJa) || i.nameEn,
    description: (ja && i.descriptionJa) || i.descriptionEn,
    useCases: ja && i.useCasesJa.length ? i.useCasesJa : i.useCasesEn,
  }
}

function resolveBundle(raw: RawContentBundle, lang: Locale): ContentBundle {
  return {
    ...raw,
    services: raw.services.map((s) => resolveService(s, lang)),
    solutions: raw.solutions.map((s) => resolveSolution(s, lang)),
    equipmentCategories: raw.equipmentCategories.map((c) => resolveEquipmentCategory(c, lang)),
    equipmentItems: raw.equipmentItems.map((i) => resolveEquipmentItem(i, lang)),
    blogCategories: raw.blogCategories.map((c) => resolveBlogCategory(c, lang)),
    faqs: raw.faqs.map((f) => resolveFaq(f, lang)),
    industries: raw.industries.map((i) => resolveIndustry(i, lang)),
  }
}

/** Returns the resolved, single-language bundle for `lang`, or throws if
 * `loadContent()` hasn't resolved yet. `data.ts` uses this — `ContentGate`
 * guarantees the raw bundle is populated before any page renders. */
export function getContentBundle(lang: Locale): ContentBundle {
  if (!rawCache) {
    throw new Error('Content not loaded yet — data.ts was called before ContentGate resolved.')
  }
  const cached = resolvedCache[lang]
  if (cached) return cached
  const resolved = resolveBundle(rawCache, lang)
  resolvedCache[lang] = resolved
  return resolved
}

export function clearContentCache() {
  rawCache = null
  inflight = null
  resolvedCache.ja = undefined
  resolvedCache.en = undefined
}

async function loadStaticBundle(): Promise<RawContentBundle> {
  return {
    services: staticServices,
    solutions: staticSolutions,
    equipmentCategories: staticEquipmentCategories,
    equipmentItems: staticEquipmentItems,
    projects: staticProjects,
    blogCategories: staticBlogCategories,
    blogPosts: staticBlogPosts,
    testimonials: staticTestimonials,
    clients: staticClients,
    faqs: staticFaqs,
    industries: staticIndustries,
  }
}

/** Public URL for a `media` row's storage object — same bucket/helper the
 * admin MediaPickerField uses, inlined here so public content loading
 * doesn't import from `lib/admin`. */
function mediaUrl(storagePath: string): string {
  return supabase.storage.from('media').getPublicUrl(storagePath).data.publicUrl
}

async function fetchAndStitch(): Promise<RawContentBundle> {
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
    equipmentImagesRes,
    projectImagesRes,
    mediaRes,
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
    supabase.from('equipment_images').select('equipment_item_id, media_id, sort_order').order('sort_order'),
    supabase.from('project_images').select('project_id, media_id, sort_order').order('sort_order'),
    supabase.from('media').select('id, storage_path'),
  ])

  for (const res of [
    servicesRes, solutionsRes, equipmentCategoriesRes, equipmentItemsRes, projectsRes,
    blogCategoriesRes, blogPostsRes, testimonialsRes, clientsRes, faqsRes, industriesRes,
    serviceRelatedServicesRes, serviceRelatedEquipmentCategoriesRes, serviceFaqsRes,
    solutionServicesRes, equipmentRelatedItemsRes, projectServicesRes, projectEquipmentRes,
    equipmentImagesRes, projectImagesRes, mediaRes,
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
  const mediaUrlById = new Map(mediaRes.data!.map((m) => [m.id, mediaUrl(m.storage_path)]))

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
  const imagesByEquipmentItem = groupBy(equipmentImagesRes.data!, (r) => r.equipment_item_id)
  const imagesByProject = groupBy(projectImagesRes.data!, (r) => r.project_id)

  const stitchedServices: BilingualService[] = services.map((s) => ({
    id: s.id,
    slug: s.slug,
    category: s.category,
    nameEn: s.name_en,
    nameJa: s.name_ja,
    shortDescriptionEn: s.short_description_en,
    shortDescriptionJa: s.short_description_ja,
    heroStatementEn: s.hero_statement_en,
    heroStatementJa: s.hero_statement_ja,
    overviewEn: s.overview_en,
    overviewJa: s.overview_ja,
    capabilitiesEn: s.capabilities_en,
    capabilitiesJa: s.capabilities_ja,
    processEn: s.process_en as unknown as BilingualService['processEn'],
    processJa: s.process_ja as unknown as BilingualService['processJa'],
    idealForEn: s.ideal_for_en,
    idealForJa: s.ideal_for_ja,
    relatedServiceSlugs: (relatedServicesByService.get(s.id) ?? [])
      .map((r) => serviceSlugById.get(r.related_service_id))
      .filter((slug): slug is string => Boolean(slug)),
    relatedEquipmentCategorySlugs: (relatedEquipCatsByService.get(s.id) ?? [])
      .map((r) => equipmentCategorySlugById.get(r.equipment_category_id))
      .filter((slug): slug is string => Boolean(slug)),
    faqIds: (faqsByService.get(s.id) ?? []).map((r) => r.faq_id),
    seoTitleEn: s.seo_title_en,
    seoTitleJa: s.seo_title_ja,
    seoDescriptionEn: s.seo_description_en,
    seoDescriptionJa: s.seo_description_ja,
    imageUrl: s.cover_media_id ? (mediaUrlById.get(s.cover_media_id) ?? null) : null,
  }))

  const stitchedSolutions: BilingualSolution[] = solutionsRes.data!.map((s) => ({
    id: s.id,
    slug: s.slug,
    nameEn: s.name_en,
    nameJa: s.name_ja,
    shortDescriptionEn: s.short_description_en,
    shortDescriptionJa: s.short_description_ja,
    heroStatementEn: s.hero_statement_en,
    heroStatementJa: s.hero_statement_ja,
    overviewEn: s.overview_en,
    overviewJa: s.overview_ja,
    highlightsEn: s.highlights_en as unknown as BilingualSolution['highlightsEn'],
    highlightsJa: s.highlights_ja as unknown as BilingualSolution['highlightsJa'],
    includedServiceSlugs: (servicesBySolution.get(s.id) ?? [])
      .map((r) => serviceSlugById.get(r.service_id))
      .filter((slug): slug is string => Boolean(slug)),
    seoTitleEn: s.seo_title_en,
    seoTitleJa: s.seo_title_ja,
    seoDescriptionEn: s.seo_description_en,
    seoDescriptionJa: s.seo_description_ja,
    imageUrl: s.cover_media_id ? (mediaUrlById.get(s.cover_media_id) ?? null) : null,
  }))

  const stitchedEquipmentCategories: BilingualEquipmentCategory[] = equipmentCategories.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameEn: c.name_en,
    nameJa: c.name_ja,
    descriptionEn: c.description_en,
    descriptionJa: c.description_ja,
    imageUrl: c.cover_media_id ? (mediaUrlById.get(c.cover_media_id) ?? null) : null,
  }))

  const stitchedEquipmentItems: BilingualEquipmentItem[] = equipmentItems.map((item) => ({
    id: item.id,
    slug: item.slug,
    categorySlug: equipmentCategorySlugById.get(item.category_id) ?? '',
    nameEn: item.name_en,
    nameJa: item.name_ja,
    summaryEn: item.summary_en,
    summaryJa: item.summary_ja,
    descriptionEn: item.description_en,
    descriptionJa: item.description_ja,
    specsEn: item.specs_en as unknown as BilingualEquipmentItem['specsEn'],
    specsJa: item.specs_ja as unknown as BilingualEquipmentItem['specsJa'],
    applicationsEn: item.applications_en,
    applicationsJa: item.applications_ja,
    availability: item.availability,
    relatedItemSlugs: (relatedItemsByEquipment.get(item.id) ?? [])
      .map((r) => equipmentItemSlugById.get(r.related_item_id))
      .filter((slug): slug is string => Boolean(slug)),
    visualSeed: item.visual_seed,
    galleryUrls: (imagesByEquipmentItem.get(item.id) ?? [])
      .map((r) => mediaUrlById.get(r.media_id))
      .filter((url): url is string => Boolean(url)),
  }))

  const stitchedProjects: Project[] = projectsRes.data!.map((p) => {
    const images = (imagesByProject.get(p.id) ?? [])
      .map((r) => mediaUrlById.get(r.media_id))
      .filter((url): url is string => Boolean(url))
    return {
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
      imageUrl: images[0] ?? null,
    }
  })

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
    imageUrl: post.cover_media_id ? (mediaUrlById.get(post.cover_media_id) ?? null) : null,
  }))

  const stitchedTestimonials: Testimonial[] = testimonialsRes.data!.map((t) => ({
    id: t.id,
    quote: t.quote,
    author: t.author,
    role: t.role,
    company: t.company,
  }))

  const stitchedBlogCategories: BilingualBlogCategory[] = blogCategories.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameEn: c.name_en,
    nameJa: c.name_ja,
  }))

  const stitchedFaqs: BilingualFaq[] = faqsRes.data!.map((f) => ({
    id: f.id,
    slug: f.slug,
    questionEn: f.question_en,
    questionJa: f.question_ja,
    answerEn: f.answer_en,
    answerJa: f.answer_ja,
    category: f.category ?? undefined,
  }))

  const stitchedIndustries: BilingualIndustry[] = industriesRes.data!.map((i) => ({
    id: i.id,
    slug: i.slug,
    nameEn: i.name_en,
    nameJa: i.name_ja,
    descriptionEn: i.description_en,
    descriptionJa: i.description_ja,
    useCasesEn: i.use_cases_en,
    useCasesJa: i.use_cases_ja,
  }))

  return {
    services: stitchedServices,
    solutions: stitchedSolutions,
    equipmentCategories: stitchedEquipmentCategories,
    equipmentItems: stitchedEquipmentItems,
    projects: stitchedProjects,
    blogCategories: stitchedBlogCategories,
    blogPosts: stitchedBlogPosts,
    testimonials: stitchedTestimonials,
    clients: clientsRes.data!,
    faqs: stitchedFaqs,
    industries: stitchedIndustries,
  }
}
