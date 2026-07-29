import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { useLocale } from '@/lib/locale/LocaleContext'
import { cn } from '@/lib/utils'
import { getBlogPosts, getBlogCategories } from '@/lib/data'

export default function BlogIndexPage() {
  const { t } = useTranslation(['blog', 'common'])
  const { locale } = useLocale()
  const posts = getBlogPosts()
  const categories = getBlogCategories(locale)
  const [active, setActive] = useState<string>('all')
  const dateLocale = locale === 'ja' ? 'ja-JP' : 'en-US'

  const filtered = useMemo(
    () => (active === 'all' ? posts : posts.filter((p) => p.categorySlug === active)),
    [active, posts],
  )

  return (
    <>
      <Seo title={t('index.seoTitle')} description={t('index.seoDescription')} path="/blog" />
      <PageHero
        eyebrow={t('index.eyebrow')}
        title={t('index.title')}
        description={t('index.description')}
        breadcrumbs={[{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('index.eyebrow') }]}
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
              {t('index.allArticles')}
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
                <LocalizedLink to={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                      <AbstractVisual seed={post.visualSeed} />
                    </div>
                  </div>
                  <p className="mt-4 text-xs font-medium text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    · {post.readMinutes} {t('index.minRead')}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold leading-snug text-navy group-hover:text-signal">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </LocalizedLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
