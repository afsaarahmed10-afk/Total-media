import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/layout/Seo'
import { Hero } from '@/components/sections/Hero'
import { CompanyIntro } from '@/components/sections/CompanyIntro'
import { CoreServicesGrid } from '@/components/sections/CoreServicesGrid'
import { WorkBand } from '@/components/sections/WorkBand'
import { FeaturedProject } from '@/components/sections/FeaturedProject'
import { IndustriesServed } from '@/components/sections/IndustriesServed'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { EquipmentShowcase } from '@/components/sections/EquipmentShowcase'
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

// Cinematic homepage rhythm: dark photographic hero → paper positioning →
// numbered expertise index → real-photo Stall|Stage band → dark featured
// case study → capabilities → dark process → editorial → blue close.
// The testimonials carousel is intentionally not rendered until real
// client testimonials exist (the current records are placeholders); the
// component and admin tooling remain in place.
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
      <WorkBand />
      <FeaturedProject />
      <WhyChooseUs />
      <EquipmentShowcase />
      <IndustriesServed />
      <ProcessSteps />
      <LatestArticles />
      <HomeFaqSection />
      <CtaBand title={t('cta.title')} description={t('cta.description')} />
    </>
  )
}
