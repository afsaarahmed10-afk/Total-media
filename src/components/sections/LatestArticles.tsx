import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MediaFrame } from '@/components/cinematic/MediaFrame'
import { Section } from '@/components/cinematic/Section'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getLatestBlogPosts } from '@/lib/data'

export function LatestArticles() {
  const { t } = useTranslation('home')
  const { locale } = useLocale()
  const posts = getLatestBlogPosts(3)
  const dateLocale = locale === 'ja' ? 'ja-JP' : 'en-US'

  return (
    <Section tone="paper" space="lg">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHeading
          eyebrow={t('latestArticles.eyebrow')}
          title={t('latestArticles.title')}
          description={t('latestArticles.description')}
        />
        <LocalizedLink
          to="/blog"
          className="group hidden items-center gap-2 border-b border-ink/30 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-ink sm:inline-flex"
        >
          {t('latestArticles.visitBlog')}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </LocalizedLink>
      </div>

      <div className="mt-14 grid gap-x-8 gap-y-12 lg:mt-20 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.08}>
            <LocalizedLink to={`/blog/${post.slug}`} className="group block">
              <MediaFrame src={post.imageUrl} alt={post.title} seed={post.visualSeed} ratio="16 / 10" hoverZoom />
              <p className="eyebrow mt-6 text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                · {post.readMinutes} {t('latestArticles.minRead')}
              </p>
              <h3 className="mt-3 text-xl font-medium leading-snug tracking-[-0.02em] transition-colors group-hover:text-blue">
                {post.title}
              </h3>
            </LocalizedLink>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 sm:hidden">
        <LocalizedLink
          to="/blog"
          className="inline-flex items-center gap-2 border-b border-ink/30 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em]"
        >
          {t('latestArticles.visitBlog')} <ArrowUpRight className="size-4" />
        </LocalizedLink>
      </div>
    </Section>
  )
}
