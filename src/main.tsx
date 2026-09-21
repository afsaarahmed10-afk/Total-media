import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'framer-motion'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { LocaleProvider } from '@/lib/locale/LocaleContext'
import '@/lib/i18n/i18n'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LocaleProvider>
          <AuthProvider>
            {/* Honour the visitor's reduced-motion setting for every
                framer-motion transform on the site. */}
            <MotionConfig reducedMotion="user">
              <App />
            </MotionConfig>
          </AuthProvider>
        </LocaleProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
