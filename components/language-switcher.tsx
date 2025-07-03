"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { locales, type Locale } from "@/lib/i18n"

const languageNames = {
  en: "English",
  "pt-br": "Português",
  fr: "Français",
}

const languageFlags = {
  en: "🇺🇸",
  "pt-br": "🇧🇷",
  fr: "🇫🇷",
}

interface LanguageSwitcherProps {
  currentLocale: Locale
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const switchLanguage = (newLocale: Locale) => {
    // Remove current locale from pathname
    const segments = pathname.split("/")
    const pathWithoutLocale = segments.slice(2).join("/")

    // Navigate to new locale
    const newPath = `/${newLocale}/${pathWithoutLocale}`
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0 text-gray-400 hover:text-white">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLanguage(locale)}
            className={`cursor-pointer hover:bg-gray-700 ${currentLocale === locale ? "bg-gray-700" : ""}`}
          >
            <span className="mr-2">{languageFlags[locale]}</span>
            {languageNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
