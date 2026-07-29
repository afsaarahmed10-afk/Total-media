import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { LegalSection } from '@/components/shared/LegalSection'

interface Section {
  title: string
  body?: string
  intro?: string
  items?: string[]
  outro?: string
  bodyPrefix?: string
  email?: string
}

// Placeholder legal content — a starting structure for this site, now in
// both languages. Have counsel review before publishing, particularly the
// APPI-specific language and any data-transfer provisions — Japanese legal/
// regulatory text carries the same "AI-translated, unreviewed" caveat as
// the rest of the site's Japanese copy, but the stakes are higher here.
export default function PrivacyPolicyPage() {
  const { t } = useTranslation(['legal', 'common'])
  const sections = t('privacy.sections', { returnObjects: true }) as Section[]

  return (
    <>
      <Seo title={t('privacy.seoTitle')} description={t('privacy.seoDescription')} path="/privacy-policy" />
      <PageHero
        eyebrow="Legal"
        title={t('privacy.title')}
        description={t('lastUpdated')}
        breadcrumbs={[{ label: t('home', { ns: 'common' }), to: '/' }, { label: t('privacy.title') }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page mx-auto max-w-3xl space-y-10">
          {sections.map((s) => (
            <LegalSection key={s.title} title={s.title}>
              {s.body && <p>{s.body}</p>}
              {s.intro && (
                <>
                  <p>{s.intro}</p>
                  <ul>{s.items?.map((item) => <li key={item}>{item}</li>)}</ul>
                  {s.outro && <p>{s.outro}</p>}
                </>
              )}
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
