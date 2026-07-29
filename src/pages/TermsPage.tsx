import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { LegalSection } from '@/components/shared/LegalSection'

interface Section {
  title: string
  body?: string
  bodyPrefix?: string
  email?: string
}

// Placeholder legal content — have counsel review before publishing,
// particularly the liability and governing law provisions. Same
// AI-translation caveat as PrivacyPolicyPage.tsx applies here.
export default function TermsPage() {
  const { t } = useTranslation(['legal', 'common'])
  const sections = t('terms.sections', { returnObjects: true }) as Section[]

  return (
    <>
      <Seo title={t('terms.seoTitle')} description={t('terms.seoDescription')} path="/terms-conditions" />
      <PageHero
        eyebrow="Legal"
        title={t('terms.title')}
        description={t('lastUpdated')}
        breadcrumbs={[{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('terms.title') }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page mx-auto max-w-3xl space-y-10">
          {sections.map((s) => (
            <LegalSection key={s.title} title={s.title}>
              {s.body && <p>{s.body}</p>}
              {s.bodyPrefix && (
                <p>
                  {s.bodyPrefix}{' '}
                  <a href={`mailto:${s.email}`} className="font-semibold text-signal hover:underline">
                    {s.email}
                  </a>
                  .
                </p>
              )}
            </LegalSection>
          ))}
        </div>
      </section>
    </>
  )
}
