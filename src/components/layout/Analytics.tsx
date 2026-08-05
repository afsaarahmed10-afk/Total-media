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

let gaBootstrapped = false

/** Loads gtag.js and defines window.gtag once for the app's lifetime.
 * Deliberately NOT done via an injected <script> tag through Helmet:
 * react-helmet-async's tag reconciliation renders the element into the DOM
 * but doesn't reliably execute its inline JS (confirmed — the tag was
 * present with correct content, but window.gtag stayed undefined after
 * load). The bootstrap logic itself needs zero DOM injection at all since
 * this function IS already running JS in the browser; only the external
 * gtag.js file needs an actual <script> element, appended directly rather
 * than through Helmet. `gaBootstrapped` guards against React StrictMode's
 * double-invoke in dev re-running this and loading the script twice. */
function loadGoogleAnalytics() {
  if (gaBootstrapped || !GA_MEASUREMENT_ID) return
  gaBootstrapped = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  // send_page_view disabled here — useGaPageviews below sends the initial
  // and every subsequent page_view explicitly, since gtag's own history
  // listener never fires for React Router's client-side navigation.
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })
}

function useGaPageviews() {
  const location = useLocation()

  useEffect(() => {
    loadGoogleAnalytics()
  }, [])

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

  if (!GOOGLE_SITE_VERIFICATION) return null

  return (
    <Helmet>
      <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
    </Helmet>
  )
}
