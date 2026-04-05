import type React from "react"
import type { Metadata } from "next"
import { locales } from "@/lib/i18n"
import "../globals.css"

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const metadata: Metadata = {
  title: "JohnnyFR26",
  description: "Portfolio created with next",
  generator: "Johnny Fontes Rabelo",
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  return (
    <html lang={resolvedParams.lang}>
      <body>{children}</body>
    </html>
  )
}
