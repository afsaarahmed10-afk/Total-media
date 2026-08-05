import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const GOOGLE_SITE_VERIFICATION = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** GA4 pageview on every client-side route change — gtag's own history
 * listener doesn't fire for React Router navigation since the document
 * never reloads. No-ops entirely when VITE_GA_MEASUREMENT_ID is unset, so
 * local/dev/preview builds never send traffic to a real property. */
function useGaPageviews() {
  const location = useLocation()
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return
    window.gtag('event', 'page_view', {
      page_path: `${location.pathname}${location.search}`,
      page_location: window.location.href,
    })
  }, [location])
}

export function Analytics() {
  useGaPageviews()

  return (
    <Helmet>
      {GOOGLE_SITE_VERIFICATION && (
        <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
      )}
      {GA_MEASUREMENT_ID && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      )}
      {GA_MEASUREMENT_ID && (
        <script>{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
          window.gtag = gtag;
        `}</script>
      )}
    </Helmet>
  )
}
