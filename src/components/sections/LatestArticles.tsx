import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { getLatestBlogPosts } from '@/lib/data'

export function LatestArticles() {
  const posts = getLatestBlogPosts(3)

  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="From the Blog"
            title="Latest Articles"
            description="Field notes on event planning, technical production, and what we've learned running events across Japan."
          />
          <Link
            to="/blog"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-signal hover:underline sm:flex"
          >
            Visit the blog <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
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
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link to="/blog" className="flex items-center gap-1.5 text-sm font-semibold text-signal">
            Visit the blog <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
