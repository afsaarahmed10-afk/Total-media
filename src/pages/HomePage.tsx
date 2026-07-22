import { Seo, SITE_URL } from '@/components/layout/Seo'
import { Hero } from '@/components/sections/Hero'
import { CompanyIntro } from '@/components/sections/CompanyIntro'
import { CoreServicesGrid } from '@/components/sections/CoreServicesGrid'
import { IndustriesServed } from '@/components/sections/IndustriesServed'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { EquipmentShowcase } from '@/components/sections/EquipmentShowcase'
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel'
import { TrustedByLogos } from '@/components/sections/TrustedByLogos'
import { LatestArticles } from '@/components/sections/LatestArticles'
import { HomeFaqSection } from '@/components/sections/HomeFaqSection'
import { CtaBand } from '@/components/shared/CtaBand'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TOTAL MEDIA',
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  description:
    'Full-service event production and technical solutions company operating across Japan — event planning, technical production, and equipment rental.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Shibuya-ku, Tokyo',
    addressCountry: 'JP',
  },
  areaServed: 'JP',
}

export default function HomePage() {
  return (
    <>
      <Seo
        title="Event Production & Technical Solutions Across Japan"
        description="TOTAL MEDIA plans, produces, and delivers corporate events, conferences, exhibitions, and hybrid broadcasts across Japan — LED, audio, lighting, staging, and streaming, end to end."
        path="/"
        jsonLd={organizationSchema}
      />
      <Hero />
      <CompanyIntro />
      <CoreServicesGrid />
      <IndustriesServed />
      <WhyChooseUs />
      <ProcessSteps />
      <FeaturedProjects />
      <EquipmentShowcase />
      <TestimonialsCarousel />
      <TrustedByLogos />
      <LatestArticles />
      <HomeFaqSection />
      <CtaBand
        title="Ready to Plan Your Next Event?"
        description="Tell us what you're planning and we'll respond with a detailed proposal within 1–2 business days."
      />
    </>
  )
}
