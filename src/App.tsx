import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from '@/components/layout/Layout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { PageLoader } from '@/components/shared/PageLoader'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { ContentGate } from '@/components/shared/ContentGate'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { GuestOnlyRoute } from '@/components/auth/GuestOnlyRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const AuthCallbackPage = lazy(() => import('@/pages/auth/AuthCallbackPage'))
const DashboardPage = lazy(() => import('@/pages/account/DashboardPage'))
const ProfileSettingsPage = lazy(() => import('@/pages/account/ProfileSettingsPage'))

const AdminOverviewPage = lazy(() => import('@/pages/admin/AdminOverviewPage'))
const AdminQuoteRequestsPage = lazy(() => import('@/pages/admin/AdminQuoteRequestsPage'))
const AdminContactMessagesPage = lazy(() => import('@/pages/admin/AdminContactMessagesPage'))
const AdminMediaPage = lazy(() => import('@/pages/admin/AdminMediaPage'))
const AdminEquipmentCategoriesPage = lazy(() => import('@/pages/admin/AdminEquipmentCategoriesPage'))
const AdminEquipmentPage = lazy(() => import('@/pages/admin/AdminEquipmentPage'))
const AdminEquipmentFormPage = lazy(() => import('@/pages/admin/AdminEquipmentFormPage'))
const AdminPortfolioPage = lazy(() => import('@/pages/admin/AdminPortfolioPage'))
const AdminPortfolioFormPage = lazy(() => import('@/pages/admin/AdminPortfolioFormPage'))
const AdminBlogCategoriesPage = lazy(() => import('@/pages/admin/AdminBlogCategoriesPage'))
const AdminBlogPage = lazy(() => import('@/pages/admin/AdminBlogPage'))
const AdminBlogFormPage = lazy(() => import('@/pages/admin/AdminBlogFormPage'))
const AdminServicesPage = lazy(() => import('@/pages/admin/AdminServicesPage'))
const AdminServiceFormPage = lazy(() => import('@/pages/admin/AdminServiceFormPage'))
const AdminSolutionsPage = lazy(() => import('@/pages/admin/AdminSolutionsPage'))
const AdminSolutionFormPage = lazy(() => import('@/pages/admin/AdminSolutionFormPage'))
const AdminTestimonialsPage = lazy(() => import('@/pages/admin/AdminTestimonialsPage'))
const AdminFaqsPage = lazy(() => import('@/pages/admin/AdminFaqsPage'))
const AdminClientsPage = lazy(() => import('@/pages/admin/AdminClientsPage'))
const AdminIndustriesPage = lazy(() => import('@/pages/admin/AdminIndustriesPage'))
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'))

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
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: 'rounded-lg! border! border-border! bg-white! shadow-lg!',
            title: 'text-charcoal! font-semibold!',
            description: 'text-muted-foreground!',
          },
        }}
      />
      <ContentGate>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<GuestOnlyRoute />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
            </Route>
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="auth/callback" element={<AuthCallbackPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="dashboard/settings" element={<ProfileSettingsPage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="admin" element={<AdminOverviewPage />} />
                  <Route path="admin/quote-requests" element={<AdminQuoteRequestsPage />} />
                  <Route path="admin/contact-messages" element={<AdminContactMessagesPage />} />
                  <Route path="admin/media" element={<AdminMediaPage />} />
                  <Route path="admin/equipment-categories" element={<AdminEquipmentCategoriesPage />} />
                  <Route path="admin/equipment" element={<AdminEquipmentPage />} />
                  <Route path="admin/equipment/new" element={<AdminEquipmentFormPage />} />
                  <Route path="admin/equipment/:id/edit" element={<AdminEquipmentFormPage />} />
                  <Route path="admin/portfolio" element={<AdminPortfolioPage />} />
                  <Route path="admin/portfolio/new" element={<AdminPortfolioFormPage />} />
                  <Route path="admin/portfolio/:id/edit" element={<AdminPortfolioFormPage />} />
                  <Route path="admin/blog-categories" element={<AdminBlogCategoriesPage />} />
                  <Route path="admin/blog" element={<AdminBlogPage />} />
                  <Route path="admin/blog/new" element={<AdminBlogFormPage />} />
                  <Route path="admin/blog/:id/edit" element={<AdminBlogFormPage />} />
                  <Route path="admin/services" element={<AdminServicesPage />} />
                  <Route path="admin/services/new" element={<AdminServiceFormPage />} />
                  <Route path="admin/services/:id/edit" element={<AdminServiceFormPage />} />
                  <Route path="admin/solutions" element={<AdminSolutionsPage />} />
                  <Route path="admin/solutions/new" element={<AdminSolutionFormPage />} />
                  <Route path="admin/solutions/:id/edit" element={<AdminSolutionFormPage />} />
                  <Route path="admin/testimonials" element={<AdminTestimonialsPage />} />
                  <Route path="admin/faqs" element={<AdminFaqsPage />} />
                  <Route path="admin/clients" element={<AdminClientsPage />} />
                  <Route path="admin/industries" element={<AdminIndustriesPage />} />
                  <Route path="admin/settings" element={<AdminSettingsPage />} />
                  <Route path="admin/admin-users" element={<AdminUsersPage />} />
                </Route>
              </Route>
            </Route>

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
