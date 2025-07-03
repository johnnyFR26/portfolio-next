import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"
import { locales, defaultLocale } from "./lib/i18n"

function getLocale(request: NextRequest): string {
  // Get locale from URL if present
  const pathname = request.nextUrl.pathname
  const pathnameLocale = locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameLocale) return pathnameLocale

  // Get locale from Accept-Language header
  const acceptLanguage = request.headers.get("accept-language")
  if (!acceptLanguage) return defaultLocale

  const headers = { "accept-language": acceptLanguage }
  const languages = new Negotiator({ headers }).languages()

  try {
    return match(languages, locales as unknown as string[], defaultLocale)
  } catch {
    return defaultLocale
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) return NextResponse.next()

  // Redirect if there is no locale
  const locale = getLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)

  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|favicon.ico).*)",
  ],
}
