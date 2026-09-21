import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { SiteSchema } from './SiteSchema'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'

/** Public-site shell. The `cinematic` class scopes the Cinematic design
 * tokens (see styles/cinematic.css) to marketing pages only — admin, auth
 * and dashboard layouts don't mount this component. */
export function Layout() {
  return (
    <div className="cinematic flex min-h-screen flex-col">
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
