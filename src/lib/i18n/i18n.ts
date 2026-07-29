import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Auto-loads every namespace file under src/locales/{lang}/*.json — adding a
// new namespace is just adding the JSON file, no import list to maintain.
const jaModules = import.meta.glob('/src/locales/ja/*.json', { eager: true }) as Record<
  string,
  { default: Record<string, unknown> }
>
const enModules = import.meta.glob('/src/locales/en/*.json', { eager: true }) as Record<
  string,
  { default: Record<string, unknown> }
>

function toResources(modules: Record<string, { default: Record<string, unknown> }>) {
  const resources: Record<string, Record<string, unknown>> = {}
  for (const path in modules) {
    const namespace = path.split('/').pop()!.replace('.json', '')
    resources[namespace] = modules[path].default
  }
  return resources
}

void i18n.use(initReactI18next).init({
  resources: {
    ja: toResources(jaModules),
    en: toResources(enModules),
  },
  lng: 'ja',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnObjects: true,
})

export default i18n
