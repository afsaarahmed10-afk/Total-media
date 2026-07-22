import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { cn } from '@/lib/utils'
import { getBlogPosts, getBlogCategories } from '@/lib/data'

export default function BlogIndexPage() {
  const posts = getBlogPosts()
  const categories = getBlogCategories()
  const [active, setActive] = useState<string>('all')

  const filtered = useMemo(
    () => (active === 'all' ? posts : posts.filter((p) => p.categorySlug === active)),
    [active, posts],
  )

  return (
    <>
      <Seo
        title="Blog"
        description="Field notes on event planning, technical production, and lessons learned running events across Japan, from the TOTAL MEDIA team."
        path="/blog"
      />
      <PageHero
        eyebrow="Blog"
        title="Field Notes on Event Production"
        description="Practical writing from our planning and technical teams — not marketing copy dressed up as advice."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Blog' }]}
      />

      <section className="py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActive('all')}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                active === 'all'
                  ? 'border-navy bg-navy text-white'
                  : 'border-border text-charcoal hover:border-navy/30',
              )}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActive(cat.slug)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  active === cat.slug
                    ? 'border-navy bg-navy text-white'
                    : 'border-border text-charcoal hover:border-navy/30',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 6) * 0.05}>
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                      <AbstractVisual seed={post.visualSeed} />
                    </div>
                  </div>
                  <p className="mt-4 text-xs font-medium text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    · {post.readMinutes} min read
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold leading-snug text-navy group-hover:text-signal">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
