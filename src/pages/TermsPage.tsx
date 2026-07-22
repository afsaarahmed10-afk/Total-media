import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { LegalSection } from '@/components/shared/LegalSection'

// Placeholder legal content — have counsel review before publishing,
// particularly the liability and governing law provisions.
export default function TermsPage() {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        description="The terms and conditions governing use of the TOTAL MEDIA website and quote request process."
        path="/terms-conditions"
      />
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Last updated: July 22, 2026"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Terms & Conditions' }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page mx-auto max-w-3xl space-y-10">
          <LegalSection title="1. Acceptance of Terms">
            <p>
              By accessing or using this website, you agree to be bound by these Terms &
              Conditions. If you do not agree, please do not use this website.
            </p>
          </LegalSection>

          <LegalSection title="2. Use of This Website">
            <p>
              This website is provided to share information about TOTAL MEDIA's services and to
              allow prospective clients to request quotes and contact us. You agree to use this
              website only for lawful purposes and not to submit false, misleading, or malicious
              information through any form on this site.
            </p>
          </LegalSection>

          <LegalSection title="3. Quote Requests Are Not Binding Contracts">
            <p>
              Submitting a quote request or contact form does not create a contractual obligation
              between you and TOTAL MEDIA. A binding engagement is formed only upon mutual
              execution of a written services agreement or signed proposal.
            </p>
          </LegalSection>

          <LegalSection title="4. Intellectual Property">
            <p>
              All content on this website — including text, graphics, the TOTAL MEDIA name and
              logo, and site design — is the property of TOTAL MEDIA Inc. or its licensors and is
              protected by applicable intellectual property laws. You may not reproduce,
              distribute, or create derivative works from this content without prior written
              permission.
            </p>
          </LegalSection>

          <LegalSection title="5. Third-Party Links">
            <p>
              This website may contain links to third-party websites. TOTAL MEDIA is not
              responsible for the content, accuracy, or practices of any linked third-party site.
            </p>
          </LegalSection>

          <LegalSection title="6. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, TOTAL MEDIA shall not be liable for any
              indirect, incidental, or consequential damages arising from your use of this website.
              Nothing in these terms limits liability that cannot be limited under applicable law.
            </p>
          </LegalSection>

          <LegalSection title="7. Governing Law">
            <p>
              These Terms & Conditions are governed by the laws of Japan. Any disputes arising from
              your use of this website shall be subject to the exclusive jurisdiction of the courts
              having jurisdiction over Tokyo, Japan.
            </p>
          </LegalSection>

          <LegalSection title="8. Changes to These Terms">
            <p>
              We may revise these Terms & Conditions from time to time. Continued use of this
              website after changes are posted constitutes acceptance of the revised terms.
            </p>
          </LegalSection>

          <LegalSection title="9. Contact Us">
            <p>
              Questions about these terms can be directed to{' '}
              <a href="mailto:legal@totalmedia.co.jp" className="font-semibold text-signal hover:underline">
                legal@totalmedia.co.jp
              </a>
              .
            </p>
          </LegalSection>
        </div>
      </section>
    </>
  )
}
