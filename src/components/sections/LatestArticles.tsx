import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { ContentVisual } from '@/components/shared/ContentVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getLatestBlogPosts } from '@/lib/data'

export function LatestArticles() {
  const { t } = useTranslation('home')
  const { locale } = useLocale()
  const posts = getLatestBlogPosts(3)
  const dateLocale = locale === 'ja' ? 'ja-JP' : 'en-US'

  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={t('latestArticles.eyebrow')}
            title={t('latestArticles.title')}
            description={t('latestArticles.description')}
          />
          <LocalizedLink
            to="/blog"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-signal hover:underline sm:flex"
          >
            {t('latestArticles.visitBlog')} <ArrowRight className="size-4" />
          </LocalizedLink>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <LocalizedLink to={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    <ContentVisual imageUrl={post.imageUrl} seed={post.visualSeed} alt={post.title} />
                  </div>
                </div>
                <p className="mt-4 text-xs font-medium text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  · {post.readMinutes} {t('latestArticles.minRead')}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold leading-snug text-navy group-hover:text-signal">
                  {post.title}
                </h3>
              </LocalizedLink>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <LocalizedLink to="/blog" className="flex items-center gap-1.5 text-sm font-semibold text-signal">
            {t('latestArticles.visitBlog')} <ArrowRight className="size-4" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}
