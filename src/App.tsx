import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { PageLoader } from '@/components/shared/PageLoader'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { ContentGate } from '@/components/shared/ContentGate'

const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ServicesIndexPage = lazy(() => import('@/pages/ServicesIndexPage'))
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'))
const SolutionsPage = lazy(() => import('@/pages/SolutionsPage'))
const EquipmentIndexPage = lazy(() => import('@/pages/EquipmentIndexPage'))
const EquipmentCategoryPage = lazy(() => import('@/pages/EquipmentCategoryPage'))
const EquipmentDetailPage = lazy(() => import('@/pages/EquipmentDetailPage'))
const PortfolioIndexPage = lazy(() => import('@/pages/PortfolioIndexPage'))
const PortfolioDetailPage = lazy(() => import('@/pages/PortfolioDetailPage'))
const IndustriesPage = lazy(() => import('@/pages/IndustriesPage'))
const BlogIndexPage = lazy(() => import('@/pages/BlogIndexPage'))
const BlogDetailPage = lazy(() => import('@/pages/BlogDetailPage'))
const FaqPage = lazy(() => import('@/pages/FaqPage'))
const CareersPage = lazy(() => import('@/pages/CareersPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const QuotePage = lazy(() => import('@/pages/QuotePage'))
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('@/pages/TermsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  return (
    <>
      <ScrollToTop />
      <ContentGate>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="services" element={<ServicesIndexPage />} />
              <Route path="services/:slug" element={<ServiceDetailPage />} />
              <Route path="solutions" element={<SolutionsPage />} />
              <Route path="equipment" element={<EquipmentIndexPage />} />
              <Route path="equipment/:category" element={<EquipmentCategoryPage />} />
              <Route path="equipment/:category/:slug" element={<EquipmentDetailPage />} />
              <Route path="portfolio" element={<PortfolioIndexPage />} />
              <Route path="portfolio/:slug" element={<PortfolioDetailPage />} />
              <Route path="industries" element={<IndustriesPage />} />
              <Route path="blog" element={<BlogIndexPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="careers" element={<CareersPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="quote" element={<QuotePage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="terms-conditions" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ContentGate>
    </>
  )
}

export default App
