import { useEffect } from 'react'

interface HreflangAlternate {
  hreflang: string
  href: string
}

/** Manages `<link rel="alternate" hreflang="...">` tags directly on
 * document.head, bypassing react-helmet-async entirely for this one tag
 * type. Necessary because Helmet's built-in <link> deduplication keys on
 * `href` (see react-helmet-async's getTagsFromPropsList), and a correct
 * x-default alternate legitimately shares its href with the default-
 * language (ja) alternate — Helmet silently drops every rel="alternate"
 * tag in that case rather than just the collision. Declaring them via
 * useEffect sidesteps Helmet's reconciliation for just these tags without
 * touching how it manages title/description/canonical/OG elsewhere. */
export function useHreflangLinks(alternates: HreflangAlternate[]) {
  const key = alternates.map((a) => `${a.hreflang}|${a.href}`).join(',')

  useEffect(() => {
    const nodes = alternates.map(({ hreflang, href }) => {
      const link = document.createElement('link')
      link.setAttribute('rel', 'alternate')
      link.setAttribute('hreflang', hreflang)
      link.setAttribute('href', href)
      document.head.appendChild(link)
      return link
    })

    return () => {
      nodes.forEach((node) => node.remove())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}
