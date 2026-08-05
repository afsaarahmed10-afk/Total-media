import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
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

const HOME_KEYWORDS = [
  'Event Management Japan',
  'Corporate Events Japan',
  'Conference Organizer Japan',
  'Exhibition Management Japan',
  'MICE Events Japan',
  'Premium Event Company Japan',
]

export default function HomePage() {
  const { t } = useTranslation('home')

  return (
    <>
      <Seo
        title={t('seo.title')}
        description={t('seo.description')}
        path="/"
        keywords={HOME_KEYWORDS}
      />
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
