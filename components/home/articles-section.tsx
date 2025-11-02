import { articlesService } from "@/services/articles.service"
import { SimpleArticleCard } from "./simple-article-card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Translations } from "@/utils/dictionary-utils"
import { SortOrder } from "@/types/common.types"
import { ArrowRight } from "lucide-react"

interface ArticlesSectionProps {
  lang: string
  t: Translations
}

export async function ArticlesSection({ lang, t }: ArticlesSectionProps) {
  // Fetch articles directly from API
  const articlesResponse = await articlesService.getAll({
    lang,
    limit: 6,
    sortOrder: SortOrder.DESC,
  })

  const articles = articlesResponse.data || []

  if (articles.length === 0) {
    return null
  }

  return (
    <section className="container max-w-7xl overflow-hidden py-10">
      <div className="space-y-4">
        <h2 className="max-w-2xl text-3xl font-medium">
          {t.articles?.title || "Latest Articles"}
        </h2>
        <p className="max-w-2xl text-muted-foreground pb-6">
          {t.articles?.contentArticlesDescription || "Stay updated with our latest news and insights"}
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => (
            <SimpleArticleCard
              key={article.id}
              article={article}
              lang={lang}
              index={index}
            />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
            href={`/${lang}/news`}
          >
            {t.common?.actions?.view || "View All"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

