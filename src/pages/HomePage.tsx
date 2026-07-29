import { useTranslation } from 'react-i18next'
import { Seo, SITE_URL } from '@/components/layout/Seo'
import { Hero } from '@/components/sections/Hero'
import { CompanyIntro } from '@/components/sections/CompanyIntro'
import { CoreServicesGrid } from '@/components/sections/CoreServicesGrid'
import { IndustriesServed } from '@/components/sections/IndustriesServed'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { EquipmentShowcase } from '@/components/sections/EquipmentShowcase'
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel'
import { LatestArticles } from '@/components/sections/LatestArticles'
import { HomeFaqSection } from '@/components/sections/HomeFaqSection'
import { CtaBand } from '@/components/shared/CtaBand'

export default function HomePage() {
  const { t } = useTranslation('home')

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TOTAL MEDIA',
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    description: t('seo.orgDescription'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Shibuya-ku, Tokyo',
      addressCountry: 'JP',
    },
    areaServed: 'JP',
  }

  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} path="/" jsonLd={organizationSchema} />
      <Hero />
      <CompanyIntro />
      <CoreServicesGrid />
      <IndustriesServed />
      <WhyChooseUs />
      <ProcessSteps />
      <EquipmentShowcase />
      <TestimonialsCarousel />
      <LatestArticles />
      <HomeFaqSection />
      <CtaBand title={t('cta.title')} description={t('cta.description')} />
    </>
  )
}
