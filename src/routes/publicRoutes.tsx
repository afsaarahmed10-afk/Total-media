import { lazy, type ReactNode } from 'react'
import { Route } from 'react-router-dom'

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

/** Returns the public marketing site's route children as a plain function
 * call (`{publicRouteElements()}`), NOT a component (`<PublicRoutes/>`) —
 * React Router's route-tree walker only recurses into `<Route>`/Fragment
 * elements, not custom components, so this is mounted twice in App.tsx
 * (once at root for Japanese, once under `/en` for English) by calling the
 * function directly at each mount point. */
export function publicRouteElements(): ReactNode {
  return (
    <>
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
    </>
  )
}
