import { buttonVariants } from "@/components/ui/button"
import { Translations } from "@/utils/dictionary-utils"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface HeroSectionProps {
  lang: string
  t: Translations
}

export function HeroSection({ lang, t }: HeroSectionProps) {
  return (
    <section className="container max-w-7xl px-6 md:px-0 py-16 md:py-24">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight max-w-3xl mx-auto">
          {t.metadata?.pages?.home}
        </h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.metadata?.descriptions?.home}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            className={cn("glass-button rounded-full px-4 py-2 text-sm font-medium flex items-center justify-center gap-2")}
            href={`/${lang}/solutions`}
          >
            Explore Solutions
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            className={cn("glass-button rounded-full px-4 py-2 text-sm font-medium")}
            href={`/${lang}/news`}
          >
            {t.news?.readMore || "Read Articles"}
          </Link>
        </div>
      </div>
    </section>
  )
}

