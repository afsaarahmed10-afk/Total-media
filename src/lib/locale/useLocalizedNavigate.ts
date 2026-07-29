import { useNavigate, type NavigateOptions, type To } from 'react-router-dom'
import { useLocale } from './LocaleContext'

/** Drop-in replacement for react-router's `useNavigate()`. Callers keep
 * passing canonical, unprefixed paths (e.g. `navigate('/dashboard')` is the
 * one exception — reserved routes pass through `localizePath` unchanged) —
 * the `/en` prefix is added automatically based on the current locale. */
export function useLocalizedNavigate() {
  const navigate = useNavigate()
  const { localizePath } = useLocale()

  return (to: To | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      navigate(to)
      return
    }
    if (typeof to === 'string') {
      navigate(localizePath(to), options)
      return
    }
    navigate({ ...to, pathname: to.pathname ? localizePath(to.pathname) : to.pathname }, options)
  }
}
