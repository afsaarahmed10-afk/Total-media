// Thin wrapper around the GA4 `window.gtag` already bootstrapped in
// components/layout/Analytics.tsx — this file does NOT initialize a second
// GA4 instance, it only adds typed helpers for firing custom events through
// the same gtag() the app already loads. Safe to call before GA4 has
// bootstrapped (e.g. very early interactions) since it's a no-op until
// window.gtag exists.
//
// Privacy: event parameters must never carry personal data (name, email,
// phone, message/notes content). Only content identifiers (slugs, form
// names, locales) and non-identifying context belong here.
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>

export function trackEvent(name: string, params?: AnalyticsEventParams): void {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', name, params)
}
