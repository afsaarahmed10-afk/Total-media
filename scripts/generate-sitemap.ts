// Generates public/sitemap.xml and public/robots.txt from the same route
// list App.tsx defines and the content modules' slugs. Run after any change
// to routes or content: node scripts/generate-sitemap.ts
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { services } from '../src/content/services.ts'
import { equipmentCategories } from '../src/content/equipment-categories.ts'
import { equipmentItems } from '../src/content/equipment.ts'
import { projects } from '../src/content/projects.ts'
import { blogPosts } from '../src/content/blog-posts.ts'

const SITE_URL = 'https://www.totalmedia.jp'
const root = path.resolve(import.meta.dirname, '..')

interface RouteDef {
  path: string
  priority: string
  changefreq: string
  lastmod?: string
}

const staticRoutes: RouteDef[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/solutions', priority: '0.8', changefreq: 'monthly' },
  { path: '/equipment', priority: '0.9', changefreq: 'monthly' },
  { path: '/portfolio', priority: '0.8', changefreq: 'weekly' },
  { path: '/industries', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/careers', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'yearly' },
  { path: '/quote', priority: '0.9', changefreq: 'yearly' },
  { path: '/privacy-policy', priority: '0.2', changefreq: 'yearly' },
  { path: '/terms-conditions', priority: '0.2', changefreq: 'yearly' },
]

const dynamicRoutes: RouteDef[] = [
  ...services.map((s) => ({ path: `/services/${s.slug}`, priority: '0.8', changefreq: 'monthly' })),
  ...equipmentCategories.map((c) => ({
    path: `/equipment/${c.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
  })),
  ...equipmentItems.map((item) => ({
    path: `/equipment/${item.categorySlug}/${item.slug}`,
    priority: '0.6',
    changefreq: 'monthly',
  })),
  ...projects.map((p) => ({ path: `/portfolio/${p.slug}`, priority: '0.6', changefreq: 'yearly' })),
  ...blogPosts.map((p) => ({
    path: `/blog/${p.slug}`,
    priority: '0.6',
    changefreq: 'yearly',
    lastmod: p.publishedAt,
  })),
]

const allRoutes = [...staticRoutes, ...dynamicRoutes]
const today = new Date().toISOString().split('T')[0]

// Every public route exists in both languages: the canonical (unprefixed)
// path is Japanese, `/en` + path is English — mirrors buildLocalizedPath()
// in src/lib/locale/LocaleContext.tsx. Each <url> entry gets hreflang
// alternates pointing at its sibling, so Search Console can tell the two
// are translations of one page rather than duplicate content.
function localizedPath(routePath: string, locale: 'ja' | 'en'): string {
  if (locale !== 'en') return routePath
  return routePath === '/' ? '/en' : `/en${routePath}`
}

function urlEntry(route: RouteDef, locale: 'ja' | 'en'): string {
  const loc = `${SITE_URL}${localizedPath(route.path, locale)}`
  const jaHref = `${SITE_URL}${localizedPath(route.path, 'ja')}`
  const enHref = `${SITE_URL}${localizedPath(route.path, 'en')}`
  return `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="ja" href="${jaHref}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enHref}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${jaHref}" />
    <lastmod>${route.lastmod ?? today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allRoutes.flatMap((route) => [urlEntry(route, 'ja'), urlEntry(route, 'en')]).join('\n')}
</urlset>
`

await writeFile(path.join(root, 'public', 'sitemap.xml'), xml)
console.log(`wrote public/sitemap.xml (${allRoutes.length * 2} URLs)`)

const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /auth/

Sitemap: ${SITE_URL}/sitemap.xml
`

await writeFile(path.join(root, 'public', 'robots.txt'), robots)
console.log('wrote public/robots.txt')
