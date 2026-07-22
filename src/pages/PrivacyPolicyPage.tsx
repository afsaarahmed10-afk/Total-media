import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { LegalSection } from '@/components/shared/LegalSection'

// Placeholder legal content — a starting structure for this site. Have
// counsel review before publishing, particularly the APPI-specific
// language and any data-transfer provisions once Supabase (Phase 2) is live.
export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How TOTAL MEDIA collects, uses, and protects personal information submitted through this website."
        path="/privacy-policy"
      />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: July 22, 2026"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page mx-auto max-w-3xl space-y-10">
          <LegalSection title="1. Introduction">
            <p>
              TOTAL MEDIA Inc. ("TOTAL MEDIA," "we," "us," or "our") respects your privacy and is
              committed to protecting personal information in accordance with Japan's Act on the
              Protection of Personal Information (APPI) and applicable international data
              protection standards. This policy explains what information we collect through this
              website, how we use it, and the choices available to you.
            </p>
          </LegalSection>

          <LegalSection title="2. Information We Collect">
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>Contact details submitted through our contact and quote request forms (name, company, email, phone number, country)</li>
              <li>Event details submitted as part of a quote request (event type, venue, date, attendee count, budget range, requested services, uploaded files, and notes)</li>
              <li>Career applications and related correspondence</li>
              <li>Any other information you choose to provide when communicating with us</li>
            </ul>
            <p>
              We also collect limited technical information automatically, such as browser type,
              device information, and pages visited, to help us maintain and improve this website.
            </p>
          </LegalSection>

          <LegalSection title="3. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to inquiries and prepare quotes and proposals</li>
              <li>Plan, coordinate, and deliver contracted event and technical production services</li>
              <li>Communicate with you about your event, request, or application</li>
              <li>Improve our website, services, and internal operations</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>We do not sell personal information to third parties.</p>
          </LegalSection>

          <LegalSection title="4. Data Storage and Third-Party Services">
            <p>
              Information submitted through this website is stored using reputable third-party
              infrastructure providers engaged to operate our systems securely. We take reasonable
              administrative, technical, and physical measures to protect personal information
              against unauthorized access, loss, or misuse, consistent with APPI requirements.
            </p>
          </LegalSection>

          <LegalSection title="5. Data Retention">
            <p>
              We retain personal information only as long as necessary to fulfill the purposes
              described in this policy, including any legal, accounting, or reporting requirements,
              after which it is securely deleted or anonymized.
            </p>
          </LegalSection>

          <LegalSection title="6. Your Rights">
            <p>
              Subject to applicable law, you may request access to, correction of, or deletion of
              your personal information, or object to certain uses of it. To make a request, contact
              us using the details below.
            </p>
          </LegalSection>

          <LegalSection title="7. Cookies">
            <p>
              This website may use cookies and similar technologies to support basic functionality
              and understand how the site is used. You can control cookie preferences through your
              browser settings.
            </p>
          </LegalSection>

          <LegalSection title="8. Changes to This Policy">
            <p>
              We may update this policy from time to time. Material changes will be reflected by an
              updated "Last updated" date at the top of this page.
            </p>
          </LegalSection>

          <LegalSection title="9. Contact Us">
            <p>
              Questions about this policy or how your information is handled can be directed to{' '}
              <a href="mailto:privacy@totalmedia.co.jp" className="font-semibold text-signal hover:underline">
                privacy@totalmedia.co.jp
              </a>
              .
            </p>
          </LegalSection>
        </div>
      </section>
    </>
  )
}
