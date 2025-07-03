import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JohnnyFR26',
  description: 'Portfolio created with next',
  generator: 'Johnny Fontes Rabelo',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
