export const defaultLocale = "en"
export const locales = ["en", "pt-br", "fr"] as const

export type Locale = (typeof locales)[number]

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split("/")
  const locale = segments[1] as Locale
  return locales.includes(locale) ? locale : defaultLocale
}

export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/")
  if (locales.includes(segments[1] as Locale)) {
    return "/" + segments.slice(2).join("/")
  }
  return pathname
}
