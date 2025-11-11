
import { articlesService } from "@/services/articles.service"
import { SimpleArticleCard } from "./simple-article-card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Translations } from "@/utils/dictionary-utils"
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
  })

  const articles = articlesResponse.data || []

  if (articles.length === 0) {
    return null
  }

  return (
    <section className="relative w-full py-16 overflow-hidden">
   

      {/* Content */}
      <div className="container max-w-7xl relative z-10">
        <div className="space-y-4">
          <h2 className="max-w-2xl text-3xl font-medium">
            {t.articles?.title || "Latest Articles"}
          </h2>
          <p className="max-w-2xl text-muted-foreground pb-6">
            {t.articles?.contentArticlesDescription || "Stay updated with our latest news and insights"}
          </p>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {articles.slice(0, 4).map((article, index) => (
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
              className={cn("glass-button rounded-full px-8 py-4 cursor-pointer text-base font-medium")}
              href={`/${lang}/news`}
            >
              {t.common?.actions?.view || "View All"}
              <ArrowRight className="ml-2 h-4 w-4 inline" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

