import { solutionsService } from "@/services/solutions.service"
import { SolutionCard } from "./solution-card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Translations } from "@/utils/dictionary-utils"

interface SolutionsSectionProps {
  lang: string
  t: Translations
}

export async function SolutionsSection({ lang, t }: SolutionsSectionProps) {
  let solutionsResponse
  try {
    solutionsResponse = await solutionsService.getAll({
      lang,
      limit: 6,
      isPublished: true,
      isFeatured: true,
    })
    
    // If no featured solutions, get regular published solutions
    if (!solutionsResponse.data || solutionsResponse.data.length === 0) {
      solutionsResponse = await solutionsService.getAll({
        lang,
        limit: 6,
        isPublished: true,
      })
    }
  } catch (error) {
    // If there's an error with featured, try regular published solutions
    try {
      solutionsResponse = await solutionsService.getAll({
        lang,
        limit: 6,
        isPublished: true,
      })
    } catch (fallbackError) {
      // If both fail, return empty array - section won't render
      solutionsResponse = { data: [] }
    }
  }

  const solutions = solutionsResponse?.data || []

  if (solutions.length === 0) {
    return null
  }

  return (
    <section className="container max-w-7xl px-6 md:px-0 overflow-hidden py-10">
      <div className="space-y-4">
        <h2 className="max-w-2xl text-3xl font-medium">
          {t.solutions?.title}
        </h2>
        <p className="max-w-2xl text-muted-foreground pb-6">
          {t.solutions?.description}
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <SolutionCard 
              key={solution.id} 
              solution={solution} 
              lang={lang}
            />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
            href={`/${lang}/solutions`}
          >
            View All Solutions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

