import { Link, useParams } from 'react-router-dom'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { CtaBand } from '@/components/shared/CtaBand'
import { getBlogPostBySlug, getBlogCategories, getBlogPosts } from '@/lib/data'
import NotFoundPage from '@/pages/NotFoundPage'

export default function BlogDetailPage() {
  const { slug = '' } = useParams()
  const post = getBlogPostBySlug(slug)

  if (!post) return <NotFoundPage />

  const category = getBlogCategories().find((c) => c.slug === post.categorySlug)
  const morePosts = getBlogPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'TOTAL MEDIA', url: SITE_URL },
  }

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        jsonLd={articleSchema}
      />
      <PageHero
        eyebrow={category?.name ?? 'Article'}
        title={post.title}
        description={post.excerpt}
        visualSeed={post.visualSeed}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Blog', to: '/blog' },
          { label: post.title },
        ]}
      >
        <div className="mt-8 flex items-center gap-3 text-sm text-white/80">
          <span className="font-medium text-white">{post.author}</span>
          <span aria-hidden="true">·</span>
          <span>{post.authorRole}</span>
          <span aria-hidden="true">·</span>
          <span>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span aria-hidden="true">·</span>
          <span>{post.readMinutes} min read</span>
        </div>
      </PageHero>

      <article className="py-20 lg:py-24">
        <div className="container-page mx-auto max-w-3xl">
          <div className="aspect-[16/9] overflow-hidden rounded-xl">
            <AbstractVisual seed={`${post.visualSeed}-hero`} />
          </div>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-charcoal">
            {post.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      <section className="bg-mist py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Keep Reading" title="More Articles" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {morePosts.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden rounded-xl">
                  <div className="transition-transform duration-500 group-hover:scale-105">
                    <AbstractVisual seed={p.visualSeed} />
                  </div>
                </div>
                <h3 className="mt-3 font-semibold leading-snug text-navy group-hover:text-signal">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Have a Project in Mind?"
        description="Tell us what you're planning and we'll respond within 1–2 business days."
      />
    </>
  )
}
