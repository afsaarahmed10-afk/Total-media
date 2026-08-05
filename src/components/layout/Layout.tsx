import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { SiteSchema } from './SiteSchema'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteSchema />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
