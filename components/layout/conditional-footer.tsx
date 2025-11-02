"use client"

import { useParams, usePathname } from "next/navigation"
import { Footer } from "./footer"
import { useTranslation } from "@/providers/translations-provider"

export function ConditionalFooter() {
  const pathname = usePathname()
  const { lang } = useParams()
  const { t } = useTranslation()
  
  let pathWithoutLang = pathname

  for (const langOption of ["en", "ar"]) {
    if (
      pathname.startsWith(`/${langOption}/`) ||
      pathname === `/${langOption}`
    ) {
      pathWithoutLang = pathname.slice(langOption.length + 1) || "/"
      break
    }
  }

  const isPrivatePage = pathWithoutLang.startsWith("/dashboard")

  if (isPrivatePage) {
    return null
  }

  return <Footer lang={lang as string} t={t} />
}

