import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/button'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { LocalizedLink } from '@/components/shared/LocalizedLink'

export default function NotFoundPage() {
  const { t } = useTranslation('notFound')
  return (
    <>
      <Seo title={t('seoTitle')} description={t('seoDescription')} path="/404" noindex />
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-30">
          <AbstractVisual seed="404-not-found" variant="grid" />
        </div>
        <div className="container-page relative text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-signal">{t('errorLabel')}</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight sm:text-6xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/70">{t('description')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-signal text-white hover:bg-signal/90">
              <LocalizedLink to="/">{t('backHome')}</LocalizedLink>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <LocalizedLink to="/contact">{t('contactUs')}</LocalizedLink>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
